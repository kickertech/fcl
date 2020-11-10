<template>
  <div class="container">
    <div class="title">
      <img src="/assets/favicon/apple-touch-icon.png" />
      <div class="md-title">fcl clicker</div>
      <div class="md-body-1">
        Hier kannst du dein passwort zurücksetzen. Du kannst dich auch
        <router-link to="/account/login">einloggen</router-link> oder
        <router-link to="/account/register">registrieren</router-link>.
      </div>
    </div>
    <div class="form">
      <md-field>
        <label>E-mail</label>
        <md-input v-model="email" autofocus></md-input>
      </md-field>
    </div>

    <div class="actions md-layout md-alignment-center-space-between">
      <md-button class="md-raised md-primary" @click="resetPassword"
        >Reset Password</md-button
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
      email: ""
    };
  },
  methods: {
    resetPassword() {
      auth
        .sendPasswordResetEmail(this.email)
        .then(() => {
          this.loading = false;
          this.snackbarMessage = `Wir haben dir eine E-Mail an ${this.email} mit weiteren Anweisungen geschickt.`;
          this.showSnackbar = true;
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
