import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function lazyLoad(view) {
  return () => import(`@/views/${view}.vue`);
}

export const routes = [
  {
    path: "*",
    component: lazyLoad("Home"),
  },
  {
    path: "/home",
    name: "Home",
    component: lazyLoad("Home"),
  },
  {
    path: "/explore",
    name: "Explore",
    component: lazyLoad("Explore"),
  },
  {
    path: "/collection",
    name: "MyCollection",
    component: lazyLoad("MyCollection"),
  },
  {
    path: "/detail/:metadata",
    name: "NFTDetail",
    component: lazyLoad("NFTDetail"),
    props: true,
  },
  {
    path: "/codex",
    name: "Codex",
    component: lazyLoad("Codex"),
  },
  {
    path: "/error",
    name: "Error",
    component: lazyLoad("Error"),
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
