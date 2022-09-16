<template>
  <el-container>
    <el-header>
      <div class="logo">
        <img src="../assets/vue.svg" alt="" />
        <h3>电商后台管理系统</h3>
      </div>
      <el-button type="info" size="large" @click="loginOut">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="flag ? '200px' : '64px'">
        <div class="flag" @click="dvClick">{{ flag ? "| | |" : "三" }}</div>
        <el-menu
          :default-active="pathName"
          active-text-color="rgb(61, 158, 255)"
          background-color="#323744"
          text-color="#fff"
          :collapse="!flag"
          unique-opened
          router
          :collapse-transition="false"
          @select="selectMenu"
        >
          <el-sub-menu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <template #title>
              <i :class="icons[item.id]"></i>
              <!-- <el-icon>{{ icons[item.id] }}</el-icon> -->
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + citem.path"
              v-for="citem in item.children"
              :key="citem.id"
              ><el-icon><Menu /></el-icon>
              <span>{{ citem.authName }}</span></el-menu-item
            >
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import { reqMenuList } from "../axios/Api";
import { toRefs, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getRouterList } from "../router";
export default {
  name: "Home",
  setup() {
    const parmas = reactive({
      menuList: [],
      icons: {
        125: "icon-user",
        103: "icon-spinner10",
        101: "icon-cart",
        102: "icon-clipboard",
        145: "icon-calendar",
      },
      pathName: sessionStorage.getItem("pathName"),
    });

    // 获取侧边栏菜单
    async function getMenuList() {
      const { data, meta } = await reqMenuList();
      parmas.menuList = data;
      sessionStorage.setItem("menuList", JSON.stringify(parmas.menuList));
      getRouterList();
    }
    getMenuList();

    // 切换侧边栏菜单
    const flag = ref(true);
    function dvClick() {
      flag.value = !flag.value;
    }

    // 路由改变侧边菜单高亮
    const route = useRoute();
    watch(
      () => route.path,
      (newValue) => {
        parmas.pathName = newValue;
      },
      {
        immediate: true,
      }
    );

    function selectMenu(pathName) {
      sessionStorage.setItem("pathName", pathName);
    }

    // 退出登录
    const router = useRouter();
    function loginOut() {
      sessionStorage.clear();
      router.replace("/login");
    }

    return {
      ...toRefs(parmas),
      flag,
      dvClick,
      selectMenu,
      loginOut,
    };
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #353d41;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    align-items: center;
    .logo {
      display: flex;
      align-items: center;
      img {
        height: 55px;
        width: 55px;
      }
      h3 {
        color: white;
        margin-left: 20px;
        font-weight: normal;
      }
    }
  }
  .el-aside {
    background-color: #323744;
    .flag {
      color: white;
      text-align: center;
      height: 25px;
      line-height: 22px;
      background-color: #485064;
    }
    .el-menu {
      border: none;
      .el-sub-menu__title {
        i {
          margin-right: 10px;
          color: #909399;
        }
      }
    }
  }
}
</style>