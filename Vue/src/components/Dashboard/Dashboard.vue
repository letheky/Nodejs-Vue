<template>
  <div class="container-fluid">
    <v-row>
      <v-col cols="12">
        <h1 class="text-center pt-3 pb-5" color="primary">
          Khóa luận tốt nghiệp đề tài quản lý Nghiên cứu khoa học Trường Đại học Thái Bình
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="d-flex justify-end">
        <img
          src="@/assets/uploads/avatar.jpg"
          class="pa-4 pb-0"
          :style="{ width: '500px', height: '600px', borderRadius: '5%' }"
        />
      </v-col>
      <v-col cols="6">
        <v-card class="mt-4" width="500">
          <v-card-title class="text-center">
            <h3>KHÓA LUẬN TỐT NGHIỆP</h3>
          </v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-card-title>
            <h4>XÂY DỰNG WEBSITE QUẢN LÝ CÁC ĐỀ TÀI NGHIÊN</h4> 
            <br/> 
            <h4>CỨU KHOA HỌC</h4>
          </v-card-title>
          <v-divider class="mx-4"></v-divider>
          <v-card-text>
            <p class="my-3" :style="{fontSize:'16px'}">Sinh viên thực hiện: Nguyễn Quang Tú</p>
            <p class="my-3" :style="{fontSize:'16px'}">Mã sinh viên: 1901043</p>
            <p class="my-3" :style="{fontSize:'16px'}">Lớp: DH8-CNTT</p>
            <p class="my-3" :style="{fontSize:'16px'}">Khóa đào tạo: 2019-2023</p>
            <p class="my-3" :style="{fontSize:'16px'}">Giảng viên hướng dẫn: ThS.Trần Hữu Anh</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import dayjs from 'dayjs'

export default {
  components: {},
  data() {
    return {}
  },
  created() {},
  methods: {},
}
</script>
<style lang="scss" scoped>
.container-fluid {
  img {
    border-radius: 0.5rem;
  }
  h2 {
    color: #0c2e68;
  }
  .courses-action {
    border: 1px ridge;
    // border-radius: 0.25rem;
  }
}
</style>
