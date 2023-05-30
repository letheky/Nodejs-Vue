<template>
  <div class="absent" :style="{ maxHeight: '100vh' }">
    <div class="d-flex justify-space-between align-center mb-2">
      <h2>Nghiên cứu khoa học sinh viên</h2>
      <div v-if="roleid === 1">
        <v-btn
          @click="
            $router.push({
              name: 'topic-add-new',
            })
          "
          color="#E3F2FD"
          :style="{ color: '#246AFF' }"
        >
          <img src="../../assets/images/icon-add-library.svg" alt="" srcset="" class="mr-1" />Thêm
          đề tài</v-btn
        >
      </div>
    </div>
    <template>
      <div class="pb-3" :style="{ opacity: loading ? '1' : '0' }">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <div class="d-flex pb-3">
      <h3>Total: {{ filtered.length }} nghiên cứu</h3>
      <v-btn class="primary ml-auto" @click="downloadExcel"> Xuất Excel </v-btn>
    </div>
    <template>
      <v-data-table
        :headers="headers"
        :items="filtered"
        :items-per-page="1000000000000000"
        hide-default-footer
        class="elevation-0 absent-table"
        :id="'absent-table'"
        fixed-header
        height="69vh"
      >
        <!-- <template -->
        <template v-slot:header="{ props }">
          <tr class="fixed-row-filter">
            <th
              v-for="header in props.headers"
              :key="header.text"
              :style="'width:' + header.width + '; min-width:' + header.width + ';'"
            >
              <div v-if="filters.hasOwnProperty(header.value)">
                <Autocomplete
                  v-if="filters.hasOwnProperty(header.value)"
                  @setFilter="setFilter"
                  :styleBorder="'border-bottom'"
                  :keyFilter="header.value"
                  :selectedInit="filters[header.value]"
                  :listItem="groupColumnValueList(header.value)"
                />
              </div>
            </th>
          </tr>
        </template>
        <template v-slot:[`item.no`]="{ index }">
          <a>{{ index + 1 }}</a>
        </template>
        <template v-slot:[`item.referenceName`]="{ item }">
          <a class="link" :href="item.referenceURL" target="_blank">{{ item.referenceName }}</a>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div class="d-flex align-center">
            <v-tooltip v-if="roleid === 1 || roleid === 2" top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="editReference(item.topicID)"
                  src="../../assets/images/icon-edit-pen.svg"
                  alt=""
                  srcset=""
                  class="btn-pointer"
                />
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip v-if="roleid === 1" top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="$refs.confirmDeleteTopic.open(), (deleteTopicID = item.topicID)"
                  src="../../assets/images/icon-delete.svg"
                  alt=""
                  srcset=""
                  class="btn-pointer"
                />
              </template>
              <span>Delete</span>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </template>
    <popup-confirm
      @confirm="confirmDeleteTopic"
      :maxWidth="550"
      confirmText="Yes, delete it!"
      ref="confirmDeleteTopic"
    >
      <v-card-title :class="'pt-0'" slot="icon">
        <div :style="{ margin: '0 auto' }">
          <img src="../../assets/images/icon-close-red.svg" alt="" srcset="" /></div
      ></v-card-title>
      <v-card-title :class="'pt-0 pb-0'" slot="title">
        <h2 :style="{ width: '100%' }" class="text-center">Confirm delete</h2>
      </v-card-title>
      <v-card-title :class="'pt-0'" slot="content">
        <p :style="{ width: '100%' }" class="text-center">
          Bạn có muốn xóa đề tài này không? <br />
          Dữ liệu không thể khôi phục.
        </p>
      </v-card-title>
    </popup-confirm>
  </div>
</template>

<script>
import Autocomplete from '@/components/Utils/Autocomplete.vue'
import PopupConfirm from '@/components/Utils/PopupConfirm.vue'
// import PopupReference from '@/components/Libraries/PopupReference.vue'

import XLSX from 'xlsx'
import dayjs from 'dayjs'
import { topic } from '@/api/topic'
import { student } from '@/api/student'
import { instructor } from '@/api/instructor'
import { circular } from '@/api/circular'

export default {
  components: { 'popup-confirm': PopupConfirm, Autocomplete: Autocomplete },
  data() {
    return {
      listTopic: [],
      studentList: [],
      instructorList: [],
      circularList: [],
      dayjs: dayjs,
      roleid: JSON.parse(localStorage.getItem('currentUser')).user.roleid,
      referenceID: 0,
      headers: [
        {
          text: 'STT',
          value: 'no',
          sortable: false,
          width: '40px',
        },
        {
          text: 'Tên đề tài',
          value: 'topicName',
          sortable: false,
          width: '150px',
        },
        {
          text: 'Thời gian thực hiện',
          value: 'duration',
          sortable: false,
          width: '100px',
        },
        {
          text: 'Tên chủ nhiệm',
          value: 'leaderID',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Tên giảng viên hướng dẫn',
          value: 'instructorID',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Tiến độ',
          value: 'progress',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Thành viên',
          value: 'members',
          sortable: false,
          width: '15%',
        },
        {
          text: 'Ngày đánh giá',
          value: 'evaluationDate',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Kết quả đánh giá',
          value: 'evaluationResult',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Quyết định giao',
          value: 'allocationCircularID',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Quyết định thành lập hội đồng',
          value: 'councilCircularID',
          sortable: false,
          width: '10%',
        },
        {
          text: 'Thành viên hội đồng',
          value: 'councilMembers',
          sortable: false,
          width: '15%',
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
          width: '5%',
        },
      ],
      deleteTopicID: 0,
      filters: {
        topicName: [],
        duration: [],
        leaderID: [],
        instructorID: [],
        progress: [],
        members: [],
        evaluationDate: [],
        evaluationResult: [],
        allocationCircularID: [],
        councilCircularID: [],
        councilMembers: [],
      },
    }
  },

  computed: {
    filtered() {
      return this.listTopic?.filter(d => {
        return Object.keys(this.filters).every(f => {
          return (
            this.filters[f].length < 1 ||
            (f === 'members'
              ? this.filters[f].reduce((value, el) => {
                  if (d.members.includes(el)) {
                    value = true
                  }
                  return value
                }, false)
              : f === 'councilMembers'
              ? this.filters[f].reduce((value, el) => {
                  if (d.councilMembers.includes(el)) {
                    value = true
                  }
                  return value
                }, false)
              : this.filters[f].includes(d[f]))
          )
        })
      })
    },
  },

  created() {
    if (localStorage.getItem('topic')) {
      this.filters = JSON.parse(localStorage.getItem('topicFilter'))
    }
    this.getStudent()
    this.getInstructor()
    this.getCircular()
    this.init()
    console.log('Start fetching...')
  },

  watch: {},

  methods: {
    downloadExcel() {
      if (this.listTopic.length > 0) {
        var table_elt = document.getElementById('absent-table')
        var workbook = XLSX.utils.table_to_book(table_elt)
        XLSX.writeFile(workbook, 'Nghiên cứu khoa học sinh viên' + '.xlsm')
      }
    },
    editReference(id) {
      this.$router.push({
        name: 'topic-add-new',
        query: {
          topicID: id,
        },
      })
    },
    async getStudent() {
      this.studentList = await student.getAllStudent()
    },
    async getCircular() {
      this.circularList = await circular.getAllCircular()
    },
    async getInstructor() {
      this.instructorList = await instructor.getAllInstructor()
    },
    confirmDeleteTopic() {
      this.deleteTopic()
    },
    async deleteTopic() {
      await topic.deleteTopic(this.deleteTopicID).then(() => {
        this.callDataWithNoLoading()
      })
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('topicFilter', JSON.stringify(this.filters))
    },
    groupColumnValueList(val) {
      if (val === 'members' || val === 'councilMembers') {
        return [
          ...new Set(
            this.listTopic
              .reduce((a, c) => [...a, c[val]], [])
              .map(c => (c.includes(',') ? c.split(',') : c))
              .flat()
              .map(c => c.trim())
          ),
        ]
      }
      return this.listTopic.map(d => d[val]).filter(y => y)
    },

    async init() {
      this.loading = true
      this.callDataWithLoading()
    },

    async callDataWithLoading() {
      await topic.getAllTopic().then(res => {
        if (res)
          this.listTopic = res.map(topic => {
            return {
              ...topic,
              members: topic.members
                ? this.studentList
                    .filter(e => topic.members.includes(e.studentID))
                    .map(e => e.studentName)
                    .join(', ')
                : '',
              councilMembers: topic.councilMembers
                ? this.instructorList
                    .filter(e => topic.councilMembers.includes(e.instructorID))
                    .map(e => e.instructorName)
                    .join(', ')
                : '',
              leaderID: topic.Leader.studentName,
              instructorID: topic.Instructor.instructorName,
              allocationCircularID: topic.allocationCircular.circularName,
              councilCircularID: topic.councilCircular.circularName,
              progress: topic.progress + ' %',
              evaluationDate: topic.evaluationDate
                ? dayjs(topic.evaluationDate).format('DD/MM/YYYY')
                : '',
            }
          })
        this.loading = false
      })
    },

    async callDataWithNoLoading() {
      await topic.getAllTopic().then(res => {
        if (res)
          this.listTopic = res.map(topic => {
            return {
              ...topic,
              members: topic.members
                ? this.studentList
                    .filter(e => topic.members.includes(e.studentID))
                    .map(e => e.studentName)
                    .join(', ')
                : '',
              councilMembers: topic.councilMembers
                ? this.instructorList
                    .filter(e => topic.councilMembers.includes(e.instructorID))
                    .map(e => e.instructorName)
                    .join(', ')
                : '',
              leaderID: topic.Leader.studentName,
              progress: topic.progress + ' %',
              evaluationDate: topic.evaluationDate
                ? dayjs(topic.evaluationDate).format('DD/MM/YYYY')
                : '',
            }
          })
      })
    },
  },
}
</script>

<style lang="scss" rel="stylesheet/scss">
// .v-breadcrumbs__item {
//   color: ;
// }
.vtl {
  .vtl-tree-margin {
    margin-left: 8px;
  }
  .vtl-node-main {
    .vtl-node-content {
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .vtl-operation {
      margin-left: 0;
      letter-spacing: 0;
    }
  }
  .vtl-node-content {
    margin-right: auto;
  }

  .vtl-drag-disabled {
    background-color: #d0cfcf;
    &:hover {
      background-color: #d0cfcf;
    }
  }
  .vtl-disabled {
    background-color: #d0cfcf;
  }
}
</style>

<style lang="scss" scoped>
.active-node {
  color: #0b2585;
  font-weight: 700;
}

.active-path {
  fill: #0b2585;
}
.icon {
  margin-right: 4px;
  &:hover {
    cursor: pointer;
  }
}

.muted {
  color: gray;
  font-size: 80%;
}

.lesson-type {
  width: 80px;
  height: 30px;
  color: #ffff;
  line-height: 30px;
  border-radius: 4px;
  text-align: center;

  &.type-public {
    background: #27ae60;
  }
  &.type-makup {
    background: #f6b91a;
  }
}
.absent-btn-download {
  width: fit-content;
  margin-left: auto;
}
.select-input {
  max-width: 200px;
  margin-right: 20px !important;
}
h4 {
  margin-bottom: 14px;
}
h2 {
  margin-bottom: 20px;
}
.status {
  color: #fff;
  text-align: center;
  width: 80px;
  border-radius: 4px;
  padding: 3px 10px;
}
.absent {
  padding: 20px 36px;
}
.absent-table {
  border-radius: 5px;
  overflow: hidden;
}
.btn-download {
  width: fit-content;
  margin-left: auto;
}

.tree-btn {
  max-height: fit-content !important;
  padding: 0 4px !important;
  color: #246aff !important;
}
.link {
  cursor: pointer;

  color: #427df2 !important;
}

.link:hover {
  text-decoration: underline;
  font-weight: 700;
}
.btn-pointer:hover {
  cursor: pointer;
}
</style>
