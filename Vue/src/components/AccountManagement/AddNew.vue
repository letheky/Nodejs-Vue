<template>
  <div id="create-account">
    <v-row>
      <v-col md="12">
        <div class="pa-10 pt-5">
          <h2 class="d-flex mb-10">
            <v-icon @click="back()">arrow_back_ios</v-icon>
            <div class="d-flex align-center">Tạo tài khoản mới</div>
          </h2>
          <div class="success" v-if="message == 'Ok'">
            <v-alert
              :value="checkSuccess"
              transition="scale-transition"
              type="success"
              style="font-size: 14px; padding: 12px"
            >
              Tạo tài khoản thành công
            </v-alert>
          </div>
          <div>
            <v-row class="pt-2">
              <v-col class="col-md-3">
                <div>
                  <v-avatar size="125" class="mr-3">
                    <img v-if="!image" src="@/assets/images/ImageProfile.jpg" />
                    <img v-else :src="image" />
                  </v-avatar>
                  <input
                    type="file"
                    @change="
                      fileInput = $event
                      onFileChange($event)
                    "
                    accept="image/*"
                    id="file-input"
                  />
                </div>
              </v-col>
              <v-col class="col-md-3">
                <v-text-field
                  label="Tên đăng nhập"
                  outlined
                  v-model="username"
                  :rules="[rules.required]"
                ></v-text-field>
                <b style="font-size: 17px">Giới tính</b>
                <v-radio-group v-model="gender" required row class="mt-0">
                  <v-radio label="Nam" :value="true"> </v-radio>
                  <v-radio label="Nữ" :value="false"> </v-radio>
                </v-radio-group>
              </v-col>
              <v-col class="col-md-3">
                <v-text-field
                  label="Mật khẩu mới"
                  :append-icon="passTypeNewPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="passTypeNewPass ? 'text' : 'password'"
                  @click:append="passTypeNewPass = !passTypeNewPass"
                  @keydown="loginErrorMessage = false"
                  v-model="newPassword"
                  required
                  outlined
                ></v-text-field>
              </v-col>
              <v-col class="col-md-3">
                <v-text-field
                  label="Nhập lại mật khẩu mới"
                  :append-icon="passTypeReNewPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="passTypeReNewPass ? 'text' : 'password'"
                  @click:append="passTypeReNewPass = !passTypeReNewPass"
                  @keydown="loginErrorMessage = false"
                  v-model="confirmNewPassword"
                  required
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </div>
          <div>
            <div>
              <h2 style="color: #393a5c !important" class="mb-5">Select account type</h2>
              <v-row>
                <v-col class="col-md-3">
                  <v-select
                    label="Chọn kiểu tài khoản"
                    v-model="accountType"
                    :items="accountTypes"
                    item-text="accountTypeName"
                    item-value="accountTypeID"
                    outlined
                    dense
                  ></v-select>
                </v-col>
              </v-row>
            </div>
            <div v-if="accountType === 1">
              <v-row>
                <v-col class="col-md-3 pb-0">
                  <v-text-field label="Họ và tên" v-model="adminName" outlined dense></v-text-field>
                </v-col>
                <v-col class="col-md-3 pb-0">
                  <date-picker class="pb-4" :model="dob" title="Ngày sinh"></date-picker>
                </v-col>
                <v-col class="col-md-3 pb-0">
                  <v-text-field label="Địa chỉ" v-model="address" outlined dense></v-text-field>
                </v-col>
                <v-col class="col-md-3 pb-0">
                  <v-text-field
                    label="Số điện thoại"
                    v-model="phoneNum"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>
          </div>
          <div v-if="accountType === 2">
            <v-row>
              <v-col class="col-md-3 pb-0">
                <v-text-field
                  label="Họ và tên"
                  v-model="instructorName"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <date-picker class="pb-4" :model="dob" title="Ngày sinh"></date-picker>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-text-field label="Địa chỉ" v-model="address" outlined dense></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-text-field
                  label="Số điện thoại"
                  v-model="phoneNum"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-md-3 pb-0">
                <v-text-field label="Học vị" v-model="academicDegree" outlined dense></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-text-field
                  label="Học hàm"
                  v-model="moralEducation"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-text-field label="major" v-model="major" outlined dense></v-text-field>
              </v-col>
            </v-row>
          </div>
          <div v-if="accountType === 3">
            <v-row>
              <v-col class="col-md-3 pb-0">
                <v-text-field label="Họ và tên" v-model="studentName" outlined dense></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <date-picker
                  class="pb-4"
                  :model="dob"
                  title="Ngày sinh"
                  @update:model="updateDob"
                ></date-picker>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-text-field label="Địa chỉ" v-model="address" outlined dense></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-text-field
                  label="Số điện thoại"
                  v-model="phoneNum"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="col-md-3 pb-0">
                <v-text-field label="Học vị" v-model="academicDegree" outlined dense></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-text-field label="Mã lớp" v-model="classCode" outlined dense></v-text-field>
              </v-col>
              <v-col class="col-md-3 pb-0">
                <v-text-field label="Chuyên ngành" v-model="major" outlined dense></v-text-field>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-footer height="60" color="#fff" class="pl-10 pr-10">
      <v-row>
        <v-col class="d-flex justify-end">
          <v-btn
            elevation="0"
            height="36"
            class="pl-4 pr-4"
            color="primary"
            @click="createAccount()"
          >
            Create account
          </v-btn>
        </v-col>
      </v-row>
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
            <b style="font-size: 1.5rem">Đang tạo tài khoản!</b><br />
            <span>Vui lòng chờ...</span>
          </div>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { upload } from '@/api/upload.js'
import { loginadmin } from '@/api/login.js'
import { my_profile } from '@/api/my-profile.js'
// import { account_managerment } from '@/api/account-management.js'
import DatePicker from '@/components/Utils/DatePicker.vue'
import dayjs from 'dayjs'
export default {
  components: {
    'date-picker': DatePicker,
  },
  data() {
    return {
      username: '',
      gender: false,
      dob: dayjs(new Date()).format('YYYY-MM-DD'),
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
      userID: null,
      newPassword: null,
      confirmNewPassword: null,
      accountType: null,
      accountTypes: null,
      passTypeNewPass: false,
      passTypeReNewPass: false,
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      dialog: false,
      rules: {
        required: value => !!value || 'The field is required',
        email: value => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail'
        },
      },

      checkImage: false,
      MAX_SIZE_IMAGE: 500,
      fileInput: '',
      image: '',
      message: '',
    }
  },
  watch: {},
  created() {
    this.init()
  },
  methods: {
    init() {
      this.accountTypes = [
        {
          accountTypeID: 1,
          accountTypeName: 'Admin',
        },
        {
          accountTypeID: 2,
          accountTypeName: 'Teacher',
        },
        {
          accountTypeID: 3,
          accountTypeName: 'Student',
        },
      ]
    },
    createAccount() {
      this.createUser()
      // this.createTarget()
    },
    async createUser() {
      const imagefile = document.querySelector('#file-input')
      // console.log(imagefile.files[0])
      const formData = new FormData()
      formData.append('username', this.username)
      formData.append('password', this.newPassword)
      formData.append('roleid', this.accountType)
      formData.append('image', imagefile.files[0])
      // console.log(formData)\
      await loginadmin.register(formData).then(res => {
        this.createTarget(res.newUser.userID)
        console.log(res)
      })
    },
    createTarget(userID) {
      if (this.accountType === 1) this.createAdmin(userID)
      else if (this.accountType === 2) this.createInstructor(userID)
      else this.createStudent(userID)
    },
    async createStudent(userID) {
      const bodyCreate = {
        stu_userID: userID,
        studentName: this.studentName,
        dob: this.dob,
        gender: this.gender,
        address: this.address,
        phoneNum: this.phoneNum,
        major: this.major,
        academicDegree: this.academicDegree,
        classCode: this.classCode,
      }
      await my_profile.createDetailStudentInfo(bodyCreate).then(res => {
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
    },
    async createInstructor(userID) {
      const bodyCreate = {
        instructor_userID: userID,
        instructorName: this.instructorName,
        dob: this.dob,
        gender: this.gender,
        address: this.address,
        phoneNum: this.phoneNum,
        major: this.major,
        academicDegree: this.academicDegree,
        moralEducation: this.moralEducation,
      }
      await my_profile.createDetailInstructorInfo(bodyCreate).then(res => {
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
    },
    async createAdmin(userID) {
      const bodyCreate = {
        admin_userID: userID,
        adminName: this.adminName,
        dob: this.dob,
        gender: this.gender,
        address: this.address,
        phoneNum: this.phoneNum,
      }
      await my_profile.createDetailAdminInfo(bodyCreate).then(res => {
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
    },

    async onFileChange(e) {
      var size_image = e.target.files[0].size / 1024
      if (size_image > this.MAX_SIZE_IMAGE) {
        this.checkImage = true
      } else {
        this.checkImage = false
      }
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createImage(files[0])
      var imagefile = document.querySelector('#file-input')
      if (imagefile) {
        var formData = new FormData()
        formData.append('file', imagefile.files[0] ? imagefile.files[0] : null)
      }
      await upload.uploadFile(formData).then(res => {
        if (res) {
          console.log(res)
        }
      })
    },
    createImage(file) {
      var reader = new FileReader()
      var vm = this

      reader.onload = e => {
        vm.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    updateDob(event) {
      this.dob = event
    },
    back() {
      window.history.back()
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss" scoped>
#create-account {
  .v-stepper__header {
    box-shadow: none;
  }
  .success {
    width: 300px;
    position: absolute;
    right: 0;
    bottom: 5%;
    z-index: 999;
  }
  .user-info {
    background: linear-gradient(180deg, #ffffff 0%, #f9f8ff 100%);
    .list-info {
      position: relative;
      .item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px dashed #dadbe6;
        padding: 11px 0;
      }
      .border-vertical {
        position: absolute;
        bottom: 24px;
        right: 0;
        width: 1px;
        height: 100%;
        background: url(~@/assets/images/line-vertical.png) no-repeat bottom center;
      }
    }
  }
  footer {
    box-shadow: 0px -2px 9px rgba(184, 184, 184, 0.1);
  }
}
</style>
