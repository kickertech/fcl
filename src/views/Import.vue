<template>
  <md-card>
    <md-card-content>
      <h1>Import</h1>
      <p>
        Hier kannst du Spiele importieren.
      </p>
      <md-field>
        <label>JSON</label>
        <md-textarea v-model="textarea"></md-textarea>
      </md-field>
      <md-button class="md-raised md-primary" @click="importJSON"
        >Importieren</md-button
      >
      <md-snackbar
        md-position="center"
        :md-active.sync="showSnackbar"
        md-persistent
      >
        <span>{{ snackbarMsg }}</span>
        <md-button class="md-primary" @click="showSnackbar = false"
          >Retry</md-button
        >
      </md-snackbar>
    </md-card-content>
  </md-card>
</template>

<style lang="scss">
.md-card {
  max-width: 1100px;
  margin: 0 auto !important;
}
</style>

<script>
import Game from "../lib/Game";
export default {
  name: "Home",
  data: function() {
    return {
      textarea: "",
      showSnackbar: false,
      snackbarMsg: ""
    };
  },
  methods: {
    importJSON() {
      let game;
      try {
        const gameJSON = JSON.parse(this.textarea);
        game = Game.fromJSON(gameJSON);
      } catch (e) {
        this.snackbarMsg = e;
        this.showSnackbar = true;
        return;
      }

      const idx = this.$store.state.games.findIndex(g => g.id == game.id);
      if (idx != -1) {
        this.snackbarMsg = `game already exists: ${game.name()}`;
        this.showSnackbar = true;
      }

      this.$store
        .dispatch("upsertGame", this.game)
        .then(() => {
          this.$router.push({ path: "/" });
        })
        .catch(err => {
          this.showSnackbar = true;
          this.snackbarMsg = err;
        });
    }
  },
  components: {}
};
</script>
