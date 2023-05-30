<template>
  <div class="absent" :style="{ maxHeight: '100vh' }">
    <div class="d-flex justify-space-between align-center mb-2">
      <h2>Bài báo</h2>
      <div v-if="roleid === 1">
        <v-btn @click="addCircular = true" color="#E3F2FD" :style="{ color: '#246AFF' }">
          <img src="../../assets/images/icon-add-library.svg" alt="" srcset="" class="mr-1" />Thêm
          bài báo</v-btn
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
        <template v-slot:[`item.paperContent`]="{ item }">
          <p class="hideContent" v-html="item.paperContent"></p>
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
              <span>Xem bài báo</span>
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
              <span>Chỉnh sửa</span>
            </v-tooltip>
            <v-tooltip v-if="roleid === 1" top>
              <template v-slot:activator="{ on, attrs }">
                <img
                  v-bind="attrs"
                  v-on="on"
                  @click="$refs.confirmDeleteCiruclar.open(), (deleteCircular = item.circularID)"
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
        <v-card class="pt-5 pl-5 pr-7 pb-4" width="800px" height="600px" :style="{overflowX:'hidden',overflowY:'scroll'}">
          <div>
            <h3 class="pb-3">Nội dung bài báo</h3>
            <p v-html="selectedCircular.paperContent"></p>
          </div>
        </v-card>
      </v-dialog>
    </div>
    <div v-if="editCircular" :class="'dig-video'">
      <v-dialog content-class="elevation-0" width="700px"  v-model="editCircular">
        <div :style="{ width: 'fit-content', marginLeft: 'auto' }">
          <img
            @click="editCircular = false"
            :style="{ width: '30px', height: '30px', cursor: 'pointer ' }"
            src="../../assets/images/icon-close2.svg"
            alt=""
          />
        </div>
        <v-card class="pt-5 pl-5 pr-7 pb-4" width="800px" height="700px" :style="{overflowX:'hidden',overflowY:'scroll'}">
          <v-col cols="12">
            <v-combobox
              v-model="selectedCircular.paperType"
              :items="circularTypeList"
              outlined
              clearable
              item-text="listItem"
              item-value="listItemValue"
              label="Chọn loại bài báo *"
            ></v-combobox>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="selectedCircular.paperTitle"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Tên bài báo"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <date-picker
              class="pb-4"
              :model="selectedCircular.publicDate"
              title="Ngày xuất bản"
            ></date-picker>
          </v-col>
          <v-col cols="12">
            <div class="editor">
              <span>Reference description</span>
              <vue-editor class="mt-4" id="editor" v-model="selectedCircular.paperContent">
              </vue-editor>
            </div>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="selectedCircular.authors"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Tên tác giả/nhóm tác giả"
            ></v-text-field>
          </v-col>
          <v-row>
            <v-col cols="8"></v-col>
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
      <v-dialog content-class="elevation-0" width="700px"  v-model="addCircular">
        <div :style="{ width: 'fit-content', marginLeft: 'auto' }">
          <img
            @click="addCircular = false"
            :style="{ width: '30px', height: '30px', cursor: 'pointer ' }"
            src="../../assets/images/icon-close2.svg"
            alt=""
          />
        </div>
        <v-card class="pt-5 pl-5 pr-7 pb-4" width="800px" height="700px" :style="{overflowX:'hidden',overflowY:'scroll'}">
          <v-col cols="12">
            <v-combobox
              v-model="paperType"
              :items="circularTypeList"
              outlined
              clearable
              item-text="listItem"
              item-value="listItemValue"
              label="Chọn loại bài báo *"
            ></v-combobox>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="paperTitle"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Tên bài báo"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <date-picker class="pb-4" :model="publicDate" title="Ngày xuất bản"></date-picker>
          </v-col>
          <v-col cols="12">
            <div class="editor">
              <span>Nội dung bài báo</span>
              <vue-editor class="mt-4" id="editor" v-model="paperContent">
              </vue-editor>
            </div>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="authors"
              outlined
              :loading="isLoading"
              :disabled="isLoading"
              label="Tên tác giả/nhóm tác giả"
            ></v-text-field>
          </v-col>

          <v-row>
            <v-col cols="8"></v-col>
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
          Bạn có muốn xóa bài báo này không? <br />
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
import DatePicker from '@/components/Utils/DatePicker.vue'
import dayjs from 'dayjs'
import { paper } from '@/api/paper'
import { VueEditor } from 'vue2-editor'

export default {
  components: {
    'popup-confirm': PopupConfirm,
    Autocomplete: Autocomplete,
    'date-picker': DatePicker,
    'vue-editor': VueEditor,
  },
  data() {
    return {
      listCircular: [],
      dayjs: dayjs,
      selectedCircular: null,
      roleid: JSON.parse(localStorage.getItem('currentUser')).user.roleid,
      paperID: null,
      paperTitle: null,
      paperContent: null,
      paperType: null,
      publicDate: dayjs(new Date()).format('YYYY-MM-DD'),
      authors: '',
      circularTypeList: [
        'Tập san TBU',
        'Bài báo khoa học trong nước',
        'Bài báo khoa học ngoài nước',
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
          text: 'Tên bài báo',
          value: 'paperTitle',
          sortable: false,
          width: '20%',
        },
        {
          text: 'Nội dung bài báo',
          value: 'paperContent',
          sortable: false,
          width: '30%',
        },
        {
          text: 'Loại bài báo',
          value: 'paperType',
          sortable: false,
          width: '200px',
        },
        {
          text: 'Tên tác giả',
          value: 'authors',
          sortable: false,
          width: '200px',
        },
        {
          text: 'Ngày xuất bản',
          value: 'publicDate',
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
        paperTitle: [],
        paperType: [],
        authors: [],
        publicDate: [],
      },
    }
  },

  computed: {
    filtered() {
      return this.listCircular.filter(d => {
        return Object.keys(this.filters).every(f => {
          return (
            this.filters[f].length < 1 ||
            (f === 'authors'
              ? this.filters[f].reduce((value, el) => {
                  if (d.authors.includes(el)) {
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
    if (localStorage.getItem('circular')) {
      this.filters = JSON.parse(localStorage.getItem('circularFilter'))
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
      await paper.deletePaper(this.deleteCircularID).then(() => {
        this.callDataWithNoLoading()
      })
    },
    setFilter(objectFilterChange) {
      this.filters = {
        ...this.filters,
        [objectFilterChange.name]: objectFilterChange.filter,
      }
      localStorage.setItem('paperFilter', JSON.stringify(this.filters))
    },
    groupColumnValueList(val) {
      if (val === 'authors') {
        return [
          ...new Set(
            this.listCircular
              .reduce((a, c) => [...a, c[val]], [])
              .map(c => (c.includes(',') ? c.split(',') : c))
              .flat()
              .map(c => c.trim())
          ),
        ]
      }
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
      await paper.getAllPaper().then(res => {
        if (res)
          this.listCircular = res.map(circular => {
            return {
              ...circular,
              publicDate: circular.publicDate
                ? dayjs(circular.publicDate).format('YYYY-MM-DD')
                : '',
            }
          })
        this.loading = false
      })
    },

    async create() {
      const data = {
        paperTitle: this.paperTitle,
        paperContent: this.paperContent,
        paperType: this.paperType,
        publicDate: this.publicDate,
        authors: this.authors,
      }
      await paper.createPaper(data).then(() => {
        this.addCircular = false
        this.callDataWithNoLoading()
      })
    },
    async edit() {
      const updateData = {
        paperID: this.selectedCircular.paperID,
        paperTitle: this.selectedCircular.paperTitle,
        paperContent: this.selectedCircular.paperContent,
        paperType: this.selectedCircular.paperType,
        publicDate: this.selectedCircular.publicDate,
        authors: this.selectedCircular.authors,
      }
      await paper.updatePaper(updateData).then(() => {
        this.editCircular = false
        this.callDataWithNoLoading()
      })
    },
    async callDataWithNoLoading() {
      await paper.getAllPaper().then(res => {
        if (res)
          this.listCircular = res.map(circular => {
            return {
              ...circular,
              //   topicTagIDs: topic.topicTagIDs
              //     ? this.tagList
              //         .filter(e => topic.topicTagIDs.includes(e.topicTagID))
              //         .map(e => e.topicTagName)
              //         .join(', ')
              //     : '',
              publicDate: circular.publicDate
                ? dayjs(circular.publicDate).format('YYYY-MM-DD')
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

.hideContent {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
.editor {
  position: relative;
  span {
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(10px, -50%);
    background-color: #ffff;
    color: '#5E6368';
  }
}
</style>
