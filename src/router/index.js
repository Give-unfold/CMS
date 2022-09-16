import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../view/Login.vue"),
    },
    {
      path: "/home",
      name: "Home",
      component: () => import("../view/Home.vue"),
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          name: "Welcome",
          component: () => import("../view/Welcome.vue"),
        },
        {
          path: "/test",
          name: "Test",
          component: () => import("../view/Test.vue")
        }
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../view/NotFound.vue"),
    },
  ],
});

const routerList = {
  users: {
    path: "/users",
    name: "Users",
    component: () => import("../view/Users.vue"),
  },
  roles: {
    path: "/roles",
    name: "Roles",
    component: () => import("../view/Roles.vue"),
  },
  rights: {
    path: "/rights",
    name: "Rights",
    component: () => import("../view/Rights.vue"),
  },
  goods: {
    path: "/goods",
    name: "Goods",
    component: () => import("../view/Goods.vue"),
  },
  params: {
    path: "/params",
    name: "Params",
    component: () => import("../view/Params.vue"),
  },
  categories: {
    path: "/categories",
    name: "Categories",
    component: () => import("../view/Categories.vue"),
  },
  orders: {
    path: "/orders",
    name: "Orders",
    component: () => import("../view/Orders.vue"),
  },
  reports: {
    path: "/reports",
    name: "Reports",
    component: () => import("../view/Reports.vue"),
  },
};

export function getRouterList() {
  const menuList = JSON.parse(sessionStorage.getItem("menuList")) ?? [];
  menuList.forEach((item) => {
    item.children.forEach((citem) => {
      if (citem.path == "goods")
        router.addRoute("Home", {
          path: "/goods/goodsAdd",
          name: "GoodsAdd",
          component: () => import("../view/GoodsAdd.vue"),
        });
      router.addRoute("Home", routerList[citem.path]);
    });
  });
}
getRouterList();

router.beforeEach((to, from) => {
  if (to.path != "/login") {
    if (sessionStorage.getItem("token")) {
      return true;
    } else {
      return "/login";
    }
  } else {
    return true;
  }
});

export default router;
