const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/admin",
    name: "LoginAdmin",
    component: () => import("@/views/login/admin.vue"),
    meta: {
      title: "管理员登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  {
    path: "/user/profile",
    component: Layout,
    redirect: "/user/profile/settings",
    meta: {
      title: "个人中心",
      icon: "ep:profile",
      showLink: false,
      rank: 103
    },
    children: [
      {
        path: "/user/profile/settings",
        name: "UserProfileSettings",
        component: () => import("@/views/user-profile/settings.vue"),
        meta: {
          title: "个人设置",
          showLink: false,
          showParent: false
        }
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
