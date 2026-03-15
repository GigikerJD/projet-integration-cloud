import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "../stores/authStores";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../layout/Layout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("../pages/Home.vue"),
        meta: {
          requiresAuth: false,
          title: "Task Manager : accueil",
          withContent: true
        },
      },
      {
        path: "/forms",
        name: "forms",
        component: () => import("../pages/Forms.vue"),
        meta: {
          requiresAuth: false,
          title: "Task Manager : se connecter à notre espace",
          withContent: false
        },
      },
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../pages/Dashboard.vue"),
        meta: {
          requiresAuth: true,
          title: "Task Manager : mon espace",
          withContent: true
        },
      },
      {
        path: "/settings",
        name: "settings",
        component: () => import("../pages/Settings.vue"),
        meta: {
          requiresAuth: true,
          title: "Task Manager : paramètres",
          withContent: true
        },
      },
    ],
  },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, _) => {
  const store = useAuthStore();

  document.title = to.meta.title as string;

  if (to.meta.requiresAuth && !store.getLoggedIn) {
    return "/";
  }

  if (!to.meta.requiresAuth && store.getLoggedIn && to.name === "forms") {
    return "/dashboard";
  }
});

export default router