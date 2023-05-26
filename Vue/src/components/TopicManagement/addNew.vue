<template>
  <div id="create-activity" :style="{ position: 'relative' }">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-10 pt-5 d-flex justify-space-between">
          <h2 class="d-flex">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div v-if="!topicID" class="d-flex align-center">Thêm đề tài</div>
            <div v-if="topicID" class="d-flex align-center">Sửa đề tài</div>
          </h2>
        </div>
      </v-col>
    </v-row>
    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      class="my-10"
    ></v-progress-linear>
    <v-form ref="formReference" v-model="form">
      <v-row no-gutters class="pb-10" v-if="!isLoading">
        <v-col md="12">
          <div class="pa-6 pt-0 pl-10">
            <div class="">
              <div>
                <v-row class="align-center mt-3">
                  <v-col cols="6">
                    <v-text-field
                      v-model="topicName"
                      outlined
                      :isLoading="isLoading"
                      :rules="[v => !!v || 'This field is required']"
                      label="Tên đề tài *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="duration"
                      outlined
                      :loading="isLoading"
                      :disabled="isLoading"
                      :rules="[v => !!v || 'This field is required']"
                      label="Thời gian hoàn thành *"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      v-model="leaderID"
                      :items="studentList"
                      item-text="studentName"
                      item-value="studentID"
                      outlined
                      label="Tên chủ nhiệm đề tài"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      v-model="instructorID"
                      :items="instructorList"
                      item-text="instructorName"
                      item-value="instructorID"
                      outlined
                      label="Tên giảng viên hướng dẫn"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <h3>Tiến độ đề tài</h3>
                    <v-slider
                      v-model="progress"
                      class="align-center"
                      :max="100"
                      :min="0"
                      hide-details
                    >
                      <template v-slot:append>
                        <v-text-field
                          v-model="progress"
                          class="mt-0 pt-0"
                          hide-details
                          single-line
                          type="number"
                          style="width: 60px"
                        ></v-text-field>
                      </template>
                    </v-slider>
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      v-model="members"
                      :items="studentList"
                      outlined
                      clearable
                      multiple
                      item-text="studentName"
                      item-value="studentID"
                      label="Thành viên đề tài *"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      type="date"
                      label="Ngày đánh giá"
                      v-model="evaluationDate"
                      outlined
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="evaluationResult"
                      outlined
                      :loading="isLoading"
                      :disabled="isLoading"
                      label="Kết quả đánh giá"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" class="pt-2 pb-2">
                    <v-autocomplete
                      v-model="allocationCircularID"
                      :items="allocationList"
                      item-text="circularName"
                      item-value="circularID"
                      outlined
                      label="Quyết định giao"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6" class="pt-2 pb-2">
                    <v-autocomplete
                      v-model="councilCircularID"
                      :items="councilList"
                      item-text="circularName"
                      item-value="circularID"
                      outlined
                      label="Quyết định thành lập hội đồng"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="6" class="pt-2 pb-2">
                    <v-autocomplete
                      v-model="councilMembers"
                      :items="instructorList"
                      outlined
                      clearable
                      multiple
                      item-text="instructorName"
                      item-value="instructorID"
                      label="Thành viên hội đồng *"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-form>
    <v-footer
      :style="{ position: 'sticky !important' }"
      height="60"
      style="width: 100%"
      color="#fff"
      class="pl-10 pr-10"
      v-if="!isLoading"
    >
      <div class="d-flex justify-end" style="width: 100%">
        <div class="d-flex flex-row-reverse align-center" style="width: 100%">
          <v-btn class="mr-3" color="primary" @click="createNew()" :disabled="form ? false : true"
            >Save</v-btn
          >
          <v-btn class="mr-3" @click="back()">Cancel</v-btn>
        </div>
      </div>
    </v-footer>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent width="350">
        <v-card class="mx-auto pa-10">
          <div class="text-center">
            <v-btn
              elevation="0"
              height="36"
              class="pl-4 pr-4 mr-3 mb-5"
              :loading="dialog"
              style="background: white"
            >
            </v-btn>
          </div>
          <div class="text-center">
            <b style="font-size: 1.5rem">Creating!</b><br />
            <span>Please wait...</span>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
//import { center_managerment } from '@/api/center-management.js'
import { topic } from '@/api/topic'
import { student } from '@/api/student'
import { circular } from '@/api/circular'
import { instructor } from '@/api/instructor'
// import { VueEditor } from 'vue2-editor'
import dayjs from 'dayjs'
// const querystring = require("querystring");
// import DatePicker from '@/components/Utils/DatePicker.vue'
export default {
  components: {
    //   'vue-editor': VueEditor,
    // 'date-picker': DatePicker,
  },

  data() {
    return {
      form: false,
      dayjs: dayjs,
      isLoading: false,
      formCategory: false,
      topicID: this.$route.query.topicID,
      topicName: '',
      dialog: false,
      duration: '',
      leaderID: null,
      studentID: null,
      instructorID: null,
      allocationCircularID: null,
      councilCircularID: null,
      studentList: [],
      allocationList: [],
      councilList: [],
      circularList: [],
      instructorList: [],
      progress: null,
      members: [],
      evaluationResult: '',
      councilMembers: [],
      evaluationDate: dayjs(new Date()).format('YYYY-MM-DD'),
    }
  },
  created() {
    this.getStudent()
    this.getInstructor()
    this.getCircular()
    if (this.topicID) this.getTopic()
  },
  mounted() {
    this.$refs.formReference.validate()
  },
  methods: {
    async getStudent() {
      this.studentList = await student.getAllStudent()
    },
    async getInstructor() {
      this.instructorList = await instructor.getAllInstructor()
    },
    async getCircular() {
      await circular.getAllCircular().then(res => {
        this.circularList = res
        this.allocationList = res.filter(el => el.circularType === 'Quyết định giao')
        this.auditList = res.filter(el => el.circularType === 'Quyết định kiểm duyệt')
        this.councilList = res.filter(el => el.circularType === 'Quyết định thành lập hội đồng')
      })
    },
    async getTopic() {
      await topic.getTopicByID(this.topicID).then(res => {
        this.topicName = res[0].topicName
        this.duration = res[0].duration
        this.evaluationResult = res[0].evaluationResult
        this.leaderID = res[0].leaderID
        this.instructorID = res[0].instructorID
        this.leaderName = res[0].leaderName
        this.progress = res[0].progress
        this.members = JSON.parse(res[0].members)
          .split(',')
          .map(el => el * 1)
        this.councilMembers = JSON.parse(res[0].councilMembers)
          .split(',')
          .map(el => el * 1)
        this.evaluationDate = res[0].evaluationDate
          ? dayjs(res[0].evaluationDate).format('YYYY-MM-DD')
          : dayjs(new Date()).format('YYYY-MM-DD')
        this.allocationCircularID = res[0].allocationCircularID
        this.councilCircularID = res[0].councilCircularID
      })
    },
    async createNew() {
      this.$refs.formReference.validate()
      if (this.form) {
        const data = {
          topicName: this.topicName,
          duration: this.duration,
          evaluationResult: this.evaluationResult,
          councilMembers: this.councilMembers.length > 1 ? this.councilMembers.join(',') : '',
          leaderID: this.leaderID,
          instructorID: this.instructorID,
          leaderName: this.studentName,
          progress: this.progress,
          members: this.members.length > 1 ? this.members.join(',') : '',
          evaluationDate: this.evaluationDate
            ? this.evaluationDate
            : dayjs(new Date()).format('YYYY-MM-DD'),
          allocationCircularID: this.allocationCircularID,
          councilCircularID: this.councilCircularID,
        }
        const updateData = {
          topicID: this.topicID,
          topicName: this.topicName,
          duration: this.duration,
          evaluationResult: this.evaluationResult,
          councilMembers: this.councilMembers.length > 1 ? this.councilMembers.join(',') : '',
          leaderID: this.leaderID,
          instructorID: this.instructorID,
          leaderName: this.studentName,
          progress: this.progress,
          members: this.members.length > 1 ? this.members.join(',') : '',
          evaluationDate: this.evaluationDate
            ? dayjs(this.evaluationDate).format('YYYY-MM-DD')
            : dayjs(new Date()).format('YYYY-MM-DD'),
          allocationCircularID: this.allocationCircularID,
          councilCircularID: this.councilCircularID,
        }
        if (this.topicID) {
          await topic.updateTopic(updateData).then(() => {
            this.back()
          })
        } else {
          await topic.createTopic(data).then(() => {
            this.back()
          })
        }
      }
    },
    back() {
      window.history.back()
    },
  },
  watch: {},
}
</script>
<style lang="scss" scoped>
.message::before {
  content: '';
  position: absolute;
  margin-top: -6px;
  margin-left: -5px;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid #717ec8;
  transform: rotate(270deg);
  left: -13px;
  top: 45%;
}
.add-img {
  height: 90%;
  img {
    height: 100%;
  }
}

.edit-reference-category {
  width: 200px;
  height: auto;
}
.members {
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
