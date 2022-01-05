<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../../assets/shopManager.svg" alt="" />
        <span>ERP后台管理系统</span>
      </div>
      <el-button type="info" @click="quitLog">退出登录</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 左侧菜单栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="collapse" @click="toggleCollapse">| | |</div>
        <el-menu
          background-color="#373d41"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="(item, index) in menu"
            :key="index"
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="item.icon"></i>
              <!-- 文字 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.path"
              v-for="(subItem, index) in item.children"
              :key="index"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文字 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 中间内容区域 -->
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from "../../api/meun/menu.js";
export default {
  name: "home",
  data() {
    return {
      menu: [],
      isCollapse: false,
    };
  },
  components: {},
  methods: {
    quitLog() {
      //1.清除token
      window.sessionStorage.clear();
      //2.跳转到登录页
      this.$router.push("/login");
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
  created() {
    getMenuList().then((res) => {
      this.menu = res.data.data;
      // console.log(this.menu);
    });
  },
};
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: aliceblue;
}
.el-header img {
  width: 40px;
  height: 40px;
}
.el-header div {
  display: flex;
  align-items: center;
  font-size: 20px;
}
.el-aside {
  background-color: #333744;
}
/* 去掉右边框 要不然点击菜单会多出来一小块 */
.el-menu {
  border-right: none;
}
.el-main {
  background-color: #eaedf1;
}
.collapse {
  color: aliceblue;
  text-align: center;
  line-height: 24px;
  /* 鼠标放上去 是一个小手 */
  cursor: pointer;
}
</style>
