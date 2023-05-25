<template>
  <div id="center-management">
    <v-row no-gutters>
      <v-col md="12">
        <div class="pa-6 pt-5 d-flex">
          <h2>
            <v-icon @click="back()">arrow_back_ios</v-icon>
          </h2>
          <h2 class="pt-1">Edit my information</h2>
          <div v-if="message == 'Update Successfull'" class="success">
            <v-alert
              :value="checkSuccess"
              transition="scale-transition"
              type="success"
              style="font-size: 14px; padding: 12px"
            >
              Update profile successfully!
            </v-alert>
          </div>
          <div v-else class="failed">
            <v-alert
              :value="checkFailed"
              transition="scale-transition"
              type="error"
              style="font-size: 14px; padding: 12px"
            >
              Update profile failed!
            </v-alert>
          </div>
        </div>
      </v-col>
    </v-row>
    <template v-if="isLoading">
      <div class="pa-6">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <template v-else>
      <v-col md="12">
        <div class="px-6">
          <v-form>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-if="roleID === 1"
                  label="Họ và tên"
                  outlined
                  dense
                  v-model="adminName"
                ></v-text-field>
                <v-text-field
                  v-else-if="roleID === 2"
                  label="Họ và tên"
                  outlined
                  dense
                  v-model="instructorName"
                ></v-text-field>
                <v-text-field
                  v-else
                  label="Họ và tên"
                  outlined
                  dense
                  v-model="studentName"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-if="roleID === 2"
                  label="Học hàm"
                  outlined
                  dense
                  v-model="moralEducation"
                ></v-text-field>
                <v-text-field
                  v-else-if="roleID === 3"
                  label="Lớp"
                  outlined
                  dense
                  v-model="classCode"
                ></v-text-field>
              </v-col>
            </v-row>
            <!-- </template> -->
            <v-row>
              <v-col cols="6">
                <label>Giới tính *</label>
                <v-radio-group v-model="gender" required row class="mt-0">
                  <v-radio label="Nam" :value="true"> </v-radio>
                  <v-radio label="Nữ" :value="false"> </v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-if="academicDegree"
                  label="Học vị"
                  outlined
                  dense
                  v-model="academicDegree"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <date-picker
                  class="pb-4"
                  :model="dob"
                  @update:model="updateDob"
                  title="Ngày sinh"
                ></date-picker>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-if="major"
                  label="Chuyên ngành"
                  outlined
                  dense
                  v-model="major"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col>
                <v-text-field
                  label="Living address"
                  maxlength="300"
                  outlined
                  dense
                  v-model="address"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  label="Số điện thoại"
                  type="number"
                  outlined
                  dense
                  v-model="phoneNum"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </div>
      </v-col>

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
            <v-btn
              class="mr-3"
              color="primary"
              @click="
                dialog = true
                save()
              "
              >Lưu dữ liệu</v-btn
            >
            <v-btn class="mr-3" @click="back()">Quay lại</v-btn>
          </div>
        </div>
      </v-footer>
    </template>
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
            <b style="font-size: 1.5rem">Updating profile!</b><br />
            <span>Please wait...</span>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { my_profile } from '@/api/my-profile.js'
import dayjs from 'dayjs'
import DatePicker from '@/components/Utils/DatePicker.vue'

export default {
  components: {
    'date-picker': DatePicker,
  },
  data() {
    return {
      gender: false,
      dob: dayjs(new Date()).format('YYYY-MM-DD'),
      hasInfo:false,
      address: '',
      adminID: 0,
      studentID: 0,
      instructorID: 0,
      adminName: '',
      studentName: '',
      instructorName: '',
      moralEducation: '',
      academicDegree: '',
      phoneNum: '',
      classCode: '',
      major: '',
      userID: this.$route.params.userId,
      isLoading: false,
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      roleID: JSON.parse(localStorage.getItem('currentUser')).user.roleid,
      message: '',
      checkSuccess: false,
      checkFailed: false,
      dialog: false,
    }
  },
  watch: {},
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.isLoading = true

      if (this.currentUser.user.roleid === 1) {
        await my_profile
          .getDetailAdminInfo(this.userID)
          .then(res => {
            if (res.length>0) {
              this.hasInfo = true
              this.adminID = res[0].adminID ? res[0].adminID : 0
              this.instructorID = res[0].instructorID ? res[0].instructorID : 0
              this.studentID = res[0].studentID ? res[0].studentID : 0
              this.gender = res[0].gender
              if (this.dob) {
                this.dob = dayjs(res[0].dob).format('YYYY-MM-DD')
              }
              this.address = res[0].address
              this.adminName = res[0].adminName
              this.phoneNum = res[0].phoneNum
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
      if (this.currentUser.user.roleid === 2) {
        await my_profile
          .getDetailInstructorInfo(this.userID)
          .then(res => {
             if (res.length>0) {
              this.hasInfo = true
              this.gender = res[0].gender
              this.adminID = res[0].adminID ? res[0].adminID : 0
              this.instructorID = res[0].instructorID ? res[0].instructorID : 0
              this.studentID = res[0].studentID ? res[0].studentID : 0
              if (this.dob) {
                this.dob = this._dayjs(res[0].dob).format('YYYY-MM-DD')
              }
              this.address = res[0].address
              this.instructorName = res[0].instructorName
              this.phoneNum = res[0].phoneNum
              this.moralEducation = res[0].moralEducation
              this.academicDegree = res[0].academicDegree
              this.major = res[0].major
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      } 
      if(this.currentUser.user.roleid === 3) {
        await my_profile
          .getDetailStudentInfo(this.userID)
          .then(res => {
             if (res.length>0) {
              this.hasInfo = true
              this.gender = res[0].gender
              this.adminID = res[0].adminID ? res[0].adminID : 0
              this.instructorID = res[0].instructorID ? res[0].instructorID : 0
              this.studentID = res[0].studentID ? res[0].studentID : 0
              if (this.dob) {
                this.dob = this._dayjs(res[0].dob).format('YYYY-MM-DD')
              }
              this.address = res[0].address
              this.studentName = res[0].studentName
              this.phoneNum = res[0].phoneNum
              this.classCode = res[0].classCode
              this.academicDegree = res[0].academicDegree
              this.major = res[0].major
            }
          })
          .finally(() => {
            this.isLoading = false
          })
      }
      this.isLoading = false
    },
    back() {
      window.history.back()
    },
    save() {
      const bodyUpdate = {
        adminID: this.adminID,
        instructorID: this.instructorID,
        studentID: this.studentID,
        instructorName: this.instructorName,
        studentName: this.studentName,
        adminName: this.adminName,
        dob: this.dob,
        gender: this.gender,
        address: this.address,
        phoneNum: this.phoneNum,
        major: this.major,
        academicDegree: this.academicDegree,
        moralEducation: this.moralEducation,
        classCode: this.classCode,
      }
      const bodyCreate = {
        admin_userID: this.userID,
        instructor_userID: this.userID,
        stu_userID: this.userID,
        instructorName: this.instructorName,
        studentName: this.studentName,
        adminName: this.adminName,
        dob: this.dob,
        gender: this.gender,
        address: this.address,
        phoneNum: this.phoneNum,
        major: this.major,
        academicDegree: this.academicDegree,
        moralEducation: this.moralEducation,
        classCode: this.classCode,
      }
      if (!this.hasInfo) {
        if (this.roleID === 1) {
          my_profile.createDetailAdminInfo(bodyCreate).then(res => {
            this.message = res.message
            if (res.message == 'Admin created') {
              this.dialog = true
              this.checkSuccess = true
              setTimeout(() => {
                this.checkSuccess = false
                this.$router.push({ name: 'my-profile' })
              }, 2000)
              this.dialog = false
            } else {
              this.dialog = true
              this.checkFailed = true
              setTimeout(() => {
                this.checkFailed = false
              }, 2000)
              this.dialog = false
            }
          })
        } else if (this.roleID === 2) {
          my_profile.createDetailInstructorInfo(bodyCreate).then(res => {
            this.message = res.message
            if (res.message == 'Instructor created') {
              this.dialog = true
              this.checkSuccess = true
              setTimeout(() => {
                this.checkSuccess = false
                this.$router.push({ name: 'my-profile' })
              }, 2000)
              this.dialog = false
            } else {
              this.dialog = true
              this.checkFailed = true
              setTimeout(() => {
                this.checkFailed = false
              }, 2000)
              this.dialog = false
            }
          })
        } else {
          my_profile.createDetailStudentInfo(bodyCreate).then(res => {
            this.message = res.message
            if (res.message == 'Student created') {
              this.dialog = true
              this.checkSuccess = true
              setTimeout(() => {
                this.checkSuccess = false
                this.$router.push({ name: 'my-profile' })
              }, 2000)
              this.dialog = false
            } else {
              this.dialog = true
              this.checkFailed = true
              setTimeout(() => {
                this.checkFailed = false
              }, 2000)
              this.dialog = false
            }
          })
        }
      } else {
        if (this.roleID === 1) {
          my_profile.updateDetailAdminInfo(bodyUpdate).then(res => {
            this.message = res.message
            if (res.message == 'Admin edited successfully') {
              this.dialog = true
              this.checkSuccess = true
              setTimeout(() => {
                this.checkSuccess = false
                this.$router.push({ name: 'my-profile' })
              }, 2000)
              this.dialog = false
            } else {
              this.dialog = true
              this.checkFailed = true
              setTimeout(() => {
                this.checkFailed = false
              }, 2000)
              this.dialog = false
            }
          })
        } else if (this.roleID === 2) {
          my_profile.updateDetailInstructorInfo(bodyUpdate).then(res => {
            this.message = res.message
            if (res.message == 'Instructor edited successfully') {
              this.dialog = true
              this.checkSuccess = true
              setTimeout(() => {
                this.checkSuccess = false
                this.$router.push({ name: 'my-profile' })
              }, 2000)
              this.dialog = false
            } else {
              this.dialog = true
              this.checkFailed = true
              setTimeout(() => {
                this.checkFailed = false
              }, 2000)
              this.dialog = false
            }
          })
        } else {
          my_profile.updateDetailStudentInfo(bodyUpdate).then(res => {
            this.message = res.message
            if (res.message == 'Student edited successfully') {
              this.dialog = true
              this.checkSuccess = true
              setTimeout(() => {
                this.checkSuccess = false
                this.$router.push({ name: 'my-profile' })
              }, 2000)
              this.dialog = false
            } else {
              this.dialog = true
              this.checkFailed = true
              setTimeout(() => {
                this.checkFailed = false
              }, 2000)
              this.dialog = false
            }
          })
        }
      }
    },
    updateDob(event) {
      this.dob = event
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
#center-management {
  .success {
    width: 300px;
    position: absolute;
    right: 0;
    bottom: 5%;
    z-index: 999;
  }
  .failed {
    width: 300px;
    position: absolute;
    right: 0;
    bottom: 5%;
    z-index: 999;
  }
  .center-info {
    background: #faf9ff;
    border-radius: 6px;
    padding: 10px 24px;
    .item {
      border-bottom: 1px dashed #dadbe6;
      &:last-child {
        border: none;
      }
    }
  }
  footer {
    box-shadow: 0px -2px 9px rgba(184, 184, 184, 0.1);
  }
}
</style>
