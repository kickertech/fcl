<template>
  <div class="page-container">
    <md-app md-mode="fixed">
      <md-app-toolbar>
        <md-button class="md-icon-button" @click="showNavigation = true">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">fcl</span>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="showNavigation" md-swipeable>
        <md-toolbar class="md-transparent" md-elevation="0">
          Navigation
        </md-toolbar>

        <md-list>
          <!-- <md-list-item to="/" @click="showNavigation = false">
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Home</span>
          </md-list-item> -->

          <md-list-item to="/clicker" @click="showNavigation = false">
            <md-icon>track_changes</md-icon>
            <span class="md-list-item-text">Clicker</span>
          </md-list-item>

          <md-list-item md-expand>
            <md-icon>timeline</md-icon>
            <span class="md-list-item-text">Recent Games</span>

            <md-list slot="md-expand">
              <md-list-item
                v-for="item in games"
                v-bind:key="item.id"
                class="md-inset"
                @click="showNavigation = false"
                :to="'/stats/' + item.id"
                >{{ item.name() }} ({{
                  new Date(item.startTime()).toLocaleDateString()
                }})</md-list-item
              >
            </md-list>
          </md-list-item>
          <md-list-item to="/import">
            <md-icon>import_export</md-icon>
            <span class="md-list-item-text">Import</span>
          </md-list-item>
          <!-- <md-list-item to="/about">
            <md-icon>send</md-icon>
            <span class="md-list-item-text">About</span>
          </md-list-item> -->
          <md-list-item @click="deleteStorage()">
            <md-icon>delete_sweep</md-icon>
            <span class="md-list-item-text">Delete Local Storage</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view />
      </md-app-content>
      <md-snackbar
        md-position="center"
        :md-active.sync="showSnackbar"
        md-persistent
      >
        <span>{{ snackbarMessage }}</span>
        >
      </md-snackbar>
    </md-app>
  </div>
</template>

<style lang="scss">
.md-content {
  min-height: 400px;
  background: #fafafa !important;
}

.page-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.md-app-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
</style>

<script>
import { mapState } from "vuex";

export default {
  name: "App",
  data: () => {
    return {
      snackbarMessage: "",
      showSnackbar: false,
      showNavigation: false
    };
  },
  methods: {
    deleteStorage() {
      this.$store.commit("clear");
      this.snackbarMessage = "cleared local storage. refreshing page...";
      this.showSnackbar = true;
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  },
  computed: mapState({
    games: state => state.games
  })
};
</script>
