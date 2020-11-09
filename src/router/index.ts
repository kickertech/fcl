import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Import from "../views/Import.vue";
import Account from "../views/Account.vue";
import About from "../views/About.vue";
import Stats from "../views/Stats.vue";
import Clicker from "../views/Clicker.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/clicker",
    name: "Clicker",
    component: Clicker
  },
  {
    path: "/stats/:id",
    name: "Stats",
    component: Stats
  },
  {
    path: "/import",
    name: "Import",
    component: Import
  },
  {
    path: "/account/:page",
    name: "Account",
    props: true,
    component: Account
  },
  {
    path: "/about",
    name: "About",
    component: About
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
