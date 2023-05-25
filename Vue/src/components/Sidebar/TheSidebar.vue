<template>
  <v-navigation-drawer
    app
    width="258"
    color="primary"
    permanent
    :mini-variant.sync="$store.state.isActiveSidebar"
    mini-variant-width="100"
  >
    <router-link :to="{ name: 'home' }">
      <img
        src="@/assets/logo.png"
        class="pt-8 d-flex"
        :style="
          $store.state.isActiveSidebar
            ? 'width : 100px; margin:auto !important'
            : 'width : 150px; margin:auto !important'
        "
      />
    </router-link>
    <v-list>
      <div v-for="item in sidebar" :key="item.title">
        <v-list-item
          v-for="itemChild in item.items"
          :key="itemChild.title"
          class="menu-title dashboard pb-2 pt-2"
          :to="itemChild.path"
        >
          <img v-if="itemChild.active" :src="itemChild.iconImg" alt="" class="mr-4" />
          <i v-else :class="'isax fs-24 ' + itemChild.iconImg + ' mr-4'"></i>
          <v-list-item-title>{{ itemChild.title }} </v-list-item-title>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import dayjs from 'dayjs'
export default {
  components: {},
  data() {
    return {
      width: 400,
      maxWidth: 1000,
      maxHeight: 200,
      selected: [],
      isLoading: false,
      items: [
        {
          icon: require('../../assets/images/icon-feetime.svg'),
          typeIcon: '',
          items: [
            {
              iconImg: 'isax-profile-2user',
              title: 'Quản lý tài khoản',
              path: '/account-management/overview',
              active: false,
            },
            {
              iconImg: require('../../assets/images/icon-library.svg'),
              title: 'Quản lý NCKH giáo viên',
              path: '/research-management/overview',
              active: true,
            },
            {
              iconImg: require('../../assets/images/icon-dailyclass.svg'),
              title: 'Quản lý NCKH sinh viên',
              path: '/topic-management/overview',
              active: true,
            },
            {
              iconImg: 'isax-book',
              title: 'Quản lý quyết định',
              path: '/circular-management/overview',
              active: false,
            },
            {
              iconImg: require('../../assets/images/icon-cm.svg'),
              title: 'Quản lý hội thảo',
              path: '/seminar-management/overview',
              active: true,
            },
            {
              iconImg: 'isax-stickynote',
              title: 'Quản lý bài báo',
              path: '/paper-management/overview',
              active: false,
            },
          ],
          accountType: 'admin',
        },
        {
          icon: require('../../assets/images/icon-feetime.svg'),
          typeIcon: '',
          items: [
            {
              iconImg: require('../../assets/images/icon-feetime.svg'),
              title: 'Đề tài của tôi',
              path: '/my-calendar/overview',
              active: true,
            },
            {
              iconImg: 'isax-profile-2user',
              title: 'Danh sách đề tài các cấp',
              path: '/research-management/overview',
              active: false,
            },
            {
              iconImg: require('../../assets/images/icon-leave.svg'),
              title: 'Danh sách đề tài của sinh viên',
              path: '/topic-management/overview',
              active: true,
            },
            {
              iconImg: require('../../assets/images/icon-dailyclass.svg'),
              title: 'Đánh giá đề tài',
              path: '/class-management/daily-classes',
              active: true,
            },
          ],
          accountType: 'teacher',
        },
        {
          icon: require('../../assets/images/icon-feetime.svg'),
          typeIcon: '',
          items: [
            {
              iconImg: require('../../assets/images/icon-feetime.svg'),
              title: 'Trang chủ',
              path: '/my-calendar/overview',
              active: true,
            },
            {
              iconImg: 'isax-profile-2user',
              title: 'Đề tài của tôi',
              path: '/account-management/overview',
              active: false,
            },
            {
              iconImg: require('../../assets/images/icon-leave.svg'),
              title: 'Danh sách đề tài sinh viên',
              path: '/topic-management/overview',
              active: true,
            },
          ],
          accountType: 'student',
        },
      ],
      roleID: JSON.parse(localStorage.getItem('currentUser')).user.roleid,
      accountTypeName: JSON.parse(localStorage.getItem('currentUser')).user.accountTypeName,
      currentUser: JSON.parse(localStorage.getItem('currentUser')),
      sidebar: [],
      count: 0,
      accountTy: null,
      active: false,
      resizeImage: false,
    }
  },
  created() {
    this.sidebar = this.getSidebar()
  },
  computed: {},
  methods: {
    getSidebar() {
      if (this.roleID === 1) return this.items.filter(x => x.accountType === 'admin')
      if (this.roleID === 2) return this.items.filter(x => x.accountType === 'teacher')
      if (this.roleID === 3) return this.items.filter(x => x.accountType === 'student')
    },
    checkTime(i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    },
    _dayjs: dayjs,
  },
}
</script>
<style lang="scss">
.menu-title-active {
  color: #ffffff !important;
  font-weight: 600;
  cursor: pointer;
}

.menu-title {
  color: #ffffff !important;
  opacity: 0.75;
  cursor: pointer;
}

.dashboard {
  opacity: 1;
}

nav {
  &.v-navigation-drawer {
    .v-navigation-drawer__content {
      .v-icon,
      .v-list-item__icon,
      .v-list-item__title {
        color: #fff;
      }
    }

    .v-navigation-drawer__border {
      width: 2px;
      background-color: #ececf6 !important;
    }
  }
}

.v-application .v-list-group--no-action > .v-list-group__items > .v-list-item {
  padding-left: 55px !important;
}

.v-application--is-ltr .v-list-item__icon:last-of-type:not(:only-child) {
  margin-left: 0;
}
</style>
