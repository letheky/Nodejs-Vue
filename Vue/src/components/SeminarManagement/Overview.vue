<template>
  <div class="absent" :style="{ maxHeight: '100vh' }">
    <div class="d-flex justify-space-between align-center mb-2">
      <h2>Hội thảo</h2>
      <div v-if="roleid === 1">
        <v-btn @click="addCircular = true" color="#E3F2FD" :style="{ color: '#246AFF' }">
          <img src="../../assets/images/icon-add-library.svg" alt="" srcset="" class="mr-1" />Thêm
          hội thảo</v-btn
        >
      </div>
    </div>
    <template>
      <div class="pb-3" :style="{ opacity: loading ? '1' : '0' }">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
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
        <template v-slot:[`item.seminarPlan`]="{ item }">
          <p class="collapse-text">{{ item.seminarPlan }}</p>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <div class="d-flex align-center">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  class="ml-2 mr-2 btn-pointer"
                  @click=";(selectedCircular = item), (dialogCircular = true)"
                  src="../../assets/images/icon-eye.svg"
                  alt=""
                  srcset=""
                />
              </template>
              <span>Xem hội thảo</span>
            </v-tooltip>
            <v-tooltip v-if="roleid === 1 || roleid === 2" top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="editReference(item)"
                  src="../../assets/images/icon-edit-pen.svg"
                  alt=""
                  srcset=""
                  class="btn-pointer"
                />
              </template>
              <span>Sửa</span>
            </v-tooltip>
            <v-tooltip v-if="roleid === 1" top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="$refs.confirmDeleteCircular.open(), (deleteCircularID = item.seminarID)"
                  src="../../assets/images/icon-delete.svg"
                  alt=""
                  srcset=""
                  class="btn-pointer"
                />
              </template>
              <span>Xóa</span>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </template>
    <div v-if="dialogCircular" :class="'dig-video'">
      <v-dialog content-class="elevation-0" width="700px" v-model="dialogCircular">
        <div :style="{ width: 'fit-content', marginLeft: 'auto' }">
          <img
            @click="dialogCircular = false"
            :style="{ width: '30px', height: '30px', cursor: 'pointer ' }"
            src="../../assets/images/icon-close2.svg"
            alt=""
          />
        </div>
        <v-card class="pt-5 pl-5 pr-7 pb-4" width="800px">
          <div>
            <h3>Kế hoạch hội thảo</h3>
            <p>{{selectedCircular.seminarPlan}}</p>
          </div>
        </v-card>
      </v-dialog>
    </div>
    <div v-if="editCircular" :class="'dig-video'">
      <v-dialog content-class="elevation-0" width="700px" v-model="editCircular">
        <div :style="{ width: 'fit-content', marginLeft: 'auto' }">
          <img
            @click="editCircular = false"
            :style="{ width: '30px', height: '30px', cursor: 'pointer ' }"
            src="../../assets/images/icon-close2.svg"
            alt=""
          />
        </div>
        <v-card class="pt-5 pl-5 pr-7 pb-4" width="800px">
          <v-col cols="12">
            <v-text-field
              v-model="selectedCircular.seminarName"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Tên hội thảo"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="selectedCircular.seminarPlan"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Kế hoạch hội thảo"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="selectedCircular.peopleAssignNum"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Số người tham gia"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="selectedCircular.paperAssign"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Số bài báo tham gia"
            ></v-text-field>
          </v-col>
          <v-row>
            <v-col cols="5"></v-col>
            <v-col cols="2">
              <v-btn
                small
                elevation="0"
                color="secondary"
                height="36"
                class="pl-16 pr-16"
                @click="edit()"
                >Lưu chỉnh sửa</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </div>
    <div v-if="addCircular" :class="'dig-video'">
      <v-dialog content-class="elevation-0" width="700px" v-model="addCircular">
        <div :style="{ width: 'fit-content', marginLeft: 'auto' }">
          <img
            @click="addCircular = false"
            :style="{ width: '30px', height: '30px', cursor: 'pointer ' }"
            src="../../assets/images/icon-close2.svg"
            alt=""
          />
        </div>
        <v-card class="pt-5 pl-5 pr-7 pb-4" width="800px">
          <v-col cols="12">
            <v-text-field
              v-model="seminarName"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Tên hội thảo"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="seminarPlan"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Kế hoạch hội thảo"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="peopleAssignNum"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Số người tham gia"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="paperAssign"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Số bài báo tham gia"
            ></v-text-field>
          </v-col>

          <v-row>
            <v-col cols="9"></v-col>
            <v-col cols="2">
              <v-btn
                small
                elevation="0"
                color="secondary"
                height="36"
                class="pl-16 pr-16"
                @click="create()"
                >Tạo mới</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </v-dialog>
    </div>
    <popup-confirm
      @confirm="confirmDeleteCircular"
      :maxWidth="550"
      confirmText="Yes, delete it!"
      ref="confirmDeleteCircular"
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
          Bạn có muốn xóa hội thảo này không? <br />
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

import dayjs from 'dayjs'
import { seminar } from '@/api/seminar'

export default {
  components: { 'popup-confirm': PopupConfirm, Autocomplete: Autocomplete },
  data() {
    return {
      listCircular: [],
      dayjs: dayjs,
      selectedCircular: null,
      roleid: JSON.parse(localStorage.getItem('currentUser')).user.roleid,
      circularID: 0,
      seminarName: '',
      seminarPlan: '',
      peopleAssignNum: '',
      paperAssign: '',
      circularName: '',
      circularImage: '',
      circularType: '',
      circularTypeList: [
        'Quyết định giao',
        'Quyết định kiểm duyệt',
        'Quyết định thành lập hội đồng',
      ],
      editCircular: false,
      dialogCircular: false,
      addCircular: false,
      headers: [
        {
          text: 'STT',
          value: 'no',
          sortable: false,
          width: '40px',
        },
        {
          text: 'Tên hội thảo',
          value: 'seminarName',
          sortable: false,
          width: '20%',
        },
        {
          text: 'Kế hoạch hội thảo',
          value: 'seminarPlan',
          sortable: false,
          width: '40%',
        },
        {
          text: 'Số người tham gia',
          value: 'peopleAssignNum',
          sortable: false,
          width: '120px',
        },
        {
          text: 'Số bài báo tham gia',
          value: 'paperAssign',
          sortable: false,
          width: '130px',
        },
        {
          text: 'Ngày tạo',
          value: 'createdAt',
          sortable: false,
          width: '100px',
        },
        {
          text: 'Ngày cập nhật',
          value: 'updatedAt',
          sortable: false,
          width: '100px',
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
          width: '5%',
        },
      ],
      deleteCircularID: 0,
      filters: {
        seminarName: [],
        seminarPlan: [],
        peopleAssignNum: [],
        paperAssign: [],
        createdAt: [],
        updatedAt: [],
      },
    }
  },

  computed: {
    filtered() {
      return this.listCircular.filter(d => {
        return Object.keys(this.filters).every(f => {
          return this.filters[f].length < 1 || this.filters[f].includes(d[f])
        })
      })
    },
  },
  created() {
    if (localStorage.getItem('seminar')) {
      this.filters = JSON.parse(localStorage.getItem('seminarFilter'))
    }
    this.init()
    console.log('Start fetching...')
  },

  watch: {},

  methods: {
    editReference(record) {
      ;(this.editCircular = true), (this.selectedCircular = record)
    },
    confirmDeleteCircular() {
      this.deleteCircular()
    },
    async deleteCircular() {
      await seminar.deleteSeminar(this.deleteCircularID).then(() => {
        this.callDataWithNoLoading()
      })
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('seminarFilter', JSON.stringify(this.filters))
    },
    groupColumnValueList(val) {
      //   if (val === 'referenceTagIDs') {
      //     return [
      //       ...new Set(
      //         this.listCircular
      //           .reduce((a, c) => [...a, c[val]], [])
      //           .map(c => (c.includes(',') ? c.split(',') : c))
      //           .flat()
      //           .map(c => c.trim())
      //       ),
      //     ]
      //   }
      return this.listCircular.map(d => d[val]).filter(y => y)
    },
    urlChange(url) {
      let url2 = url
      if (url2.indexOf('/drive.google.com/file') !== -1) {
        const listLinkArr = url2.split('/')
        listLinkArr.pop()
        url2 = listLinkArr.join('/') + '/preview'
      }
      return url2
    },
    async init() {
      this.loading = true
      this.callDataWithLoading()
    },

    async callDataWithLoading() {
      await seminar.getAllSeminar().then(res => {
        if (res)
          this.listCircular = res.map(seminar => {
            return {
              ...seminar,
              createdAt: seminar.createdAt ? dayjs(seminar.createdAt).format('DD/MM/YYYY') : '',
              updatedAt: seminar.updatedAt ? dayjs(seminar.updatedAt).format('DD/MM/YYYY') : '',
            }
          })
        this.loading = false
      })
    },

    async create() {
      const data = {
        seminarName: this.seminarName,
        seminarPlan: this.seminarPlan,
        peopleAssignNum: this.peopleAssignNum,
        paperAssign: this.paperAssign,
      }
      await seminar.createSeminar(data).then(() => {
        this.addCircular = false
        this.init()
      })
    },
    async edit() {
      const updateData = {
        seminarID: this.selectedCircular.seminarID,
        seminarName: this.selectedCircular.seminarName,
        seminarPlan: this.selectedCircular.seminarPlan,
        peopleAssignNum: this.selectedCircular.peopleAssignNum,
        paperAssign: this.selectedCircular.paperAssign,
      }
      await seminar.updateSeminar(updateData).then(() => {
        this.editCircular = false
        this.init()
      })
    },
    async callDataWithNoLoading() {
      await seminar.getAllSeminar().then(res => {
        if (res)
          this.listCircular = res.map(seminar => {
            return {
              ...seminar,
              //   topicTagIDs: topic.topicTagIDs
              //     ? this.tagList
              //         .filter(e => topic.topicTagIDs.includes(e.topicTagID))
              //         .map(e => e.topicTagName)
              //         .join(', ')
              //     : '',
              createdAt: seminar.createdAt ? dayjs(seminar.createdAt).format('DD/MM/YYYY') : '',
              updatedAt: seminar.updatedAt ? dayjs(seminar.updatedAt).format('DD/MM/YYYY') : '',
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

.colappse-text {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
