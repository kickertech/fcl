<!-- this is mostly taken from: https://codesandbox.io/s/github/vuematerial/examples/tree/master/examples/login?file=/App.vue:1502-13178 -->
<template>
  <div class="centered-container">
    <md-content class="md-elevation-3">
      <div v-if="user.user">
        <p>Wilkommen zurück!</p>
        <div class="actions md-layout md-alignment-center-space-between">
          <md-button class="md-raised md-secondary" @click="resetData"
            >Account löschen</md-button
          >
          <md-button class="md-raised md-primary" @click="logout"
            >Logout</md-button
          >
        </div>
      </div>
      <div v-if="user.user == null">
        <create-account v-if="show == 'register'" ref="create" />
        <sign-in v-if="show == 'login'" ref="signin" />
        <reset-password v-if="show == 'reset-password'" ref="reset" />
      </div>
      <md-snackbar
        md-position="center"
        :md-duration="10000"
        :md-active.sync="showSnackbar"
        md-persistent
      >
        <span>{{ this.snackbarMessage }}</span>
        <md-button class="md-primary" @click="showSnackbar = false"
          >Close</md-button
        >
      </md-snackbar>
    </md-content>
  </div>
</template>

<script>
import CreateAccount from "@/components/login/create-account.vue";
import SignIn from "@/components/login/signin.vue";
import ResetPassword from "@/components/login/reset-password.vue";
import { auth, user } from "@/lib/Firebase";

export default {
  name: "Account",
  components: {
    "create-account": CreateAccount,
    "sign-in": SignIn,
    "reset-password": ResetPassword
  },
  data() {
    return {
      show: this.$route.params.page || "register",
      snackbarMessage: "",
      showSnackbar: false,
      user: user.state
    };
  },
  beforeRouteUpdate(to, from, next) {
    this.show = to.params.page;
    next();
  },

  methods: {
    resetData: () => {
      const u = auth.currentUser;

      u.delete()
        .then(() => {
          user.state.user = null;
          this.snackbarMessage = "Du hast deine daten erfolgreich gelöscht";
          this.showSnackbar = true;
        })
        .catch(error => {
          user.state.user = null;
          this.snackbarMessage = error;
          this.showSnackbar = true;
        });
    },
    logout: () => {
      auth
        .signOut()
        .then(() => {
          user.state.user = null;
          this.snackbarMessage = "erfolgreich ausgeloggt";
          this.showSnackbar = true;
        })
        .catch(error => {
          user.state.user = null;
          this.snackbarMessage = error;
          this.showSnackbar = true;
        });
    }
  }
};
</script>

<style lang="scss">
.centered-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;
  .title {
    text-align: center;
    margin-bottom: 30px;
    img {
      margin-bottom: 16px;
      max-width: 80px;
    }
  }
  .actions {
    .md-button {
      margin: 0;
    }
  }
  .form {
    margin-bottom: 60px;
  }

  .md-content {
    z-index: 1;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    position: relative;
  }
  .md-card {
    max-width: 1100px;
    margin: 0 auto !important;
  }

  .loading-overlay {
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
