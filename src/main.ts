import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

Vue.use(VueMaterial);
Vue.config.productionTip = false;

store.subscribe((mutation, state) => {
  localStorage.setItem("store", JSON.stringify(state));
});
store.commit("initialize");

router.beforeEach((to, from, next) => {
  if (to.name == "Stats" && !store.state.games.find(g => g.id == to.params.id))
    next({ name: "Home" });
  else next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
