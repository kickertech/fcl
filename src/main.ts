import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { auth, store as fbstore } from "./lib/Firebase";
import Game from "./lib/Game";

import VueMaterial from "vue-material";
import "vue-material/dist/vue-material.min.css";
import "vue-material/dist/theme/default.css";

Vue.use(VueMaterial);
Vue.config.productionTip = false;

let unsubscribe: any;
auth.onAuthStateChanged(async function(u) {
  let data;
  if (unsubscribe) {
    unsubscribe();

    // clear state
    store.commit("initialize", {});
  }
  if (u) {
    const doc = await fbstore
      .collection("users")
      .doc(`${u.email}`)
      .get();
    data = doc.get("state");

    unsubscribe = store.subscribe(mutation => {
      fbstore
        .collection("users")
        .doc(`${u.email}`)
        .set({
          state: JSON.stringify(mutation.payload)
        });
    });
  } else {
    data = localStorage.getItem("store");
    unsubscribe = store.subscribe((mutation, state) => {
      localStorage.setItem("store", JSON.stringify(state));
    });
  }

  if (!data) {
    return;
  }
  const stateData = JSON.parse(data);
  stateData.games = stateData.games.map((obj: any) => Game.fromJSON(obj));
  store.commit("initialize", stateData);
});

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
