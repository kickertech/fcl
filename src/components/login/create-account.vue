<template>
  <div class="container">
    <div class="title">
      <img src="/assets/favicon/apple-touch-icon.png" />
      <div class="md-title">fcl clicker</div>
      <div class="md-body-1">
        Erstelle einen Account um deine Daten nachhaltig zu speichern.
        <router-link to="/account/login">Logge dich ein</router-link> wenn du
        bereits einen hast.
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
          autocomplete="new-password"
          v-model="password"
          type="password"
        ></md-input>
      </md-field>
    </div>

    <div class="actions md-layout md-alignment-center-space-between">
      <router-link to="/account/reset-password">Reset password</router-link>

      <md-button class="md-raised md-primary" @click="createUser"
        >Create Account</md-button
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
    <cookie-law theme="base"></cookie-law>
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
    createUser() {
      this.loading = true;
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
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
