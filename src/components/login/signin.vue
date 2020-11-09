<template>
  <div class="container">
    <div class="title">
      <img src="/assets/favicon/apple-touch-icon.png" />
      <div class="md-title">fcl clicker</div>
      <div class="md-body-1">
        Logge dich ein um auf deine Daten zuzugreifen.
        <router-link to="/account/register">Erstelle einen Account</router-link>
        wenn du noch keinen hast.
      </div>
    </div>
    <div class="form">
      <md-field>
        <label>E-mail</label>
        <md-input v-model="email" autofocus></md-input>
      </md-field>

      <md-field md-has-password>
        <label>Password</label>
        <md-input
          autocomplete="current-password"
          v-model="password"
          type="password"
        ></md-input>
      </md-field>
    </div>

    <div class="actions md-layout md-alignment-center-space-between">
      <router-link to="/account/reset-password">Reset password</router-link>

      <md-button class="md-raised md-primary" @click="signIn"
        >Sign In</md-button
      >
    </div>

    <div class="loading-overlay" v-if="loading">
      <md-progress-spinner
        md-mode="indeterminate"
        :md-stroke="2"
      ></md-progress-spinner>
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
  </div>
</template>

<script>
import { auth } from "@/lib/Firebase";

export default {
  name: "Account",
  data() {
    return {
      showSnackbar: false,
      snackbarMessage: "",
      loading: false,
      email: "",
      password: ""
    };
  },
  methods: {
    signIn() {
      this.loading = true;
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.loading = false;
          // TODO
        })
        .catch(error => {
          this.loading = false;
          this.snackbarMessage = `${error.code}: ${error.message}`;
          this.showSnackbar = true;
        });
    }
  }
};
</script>

<style lang="scss"></style>
