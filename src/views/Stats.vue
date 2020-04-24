<template>
  <md-card>
    <md-card-header>
      <md-card-header-text>
        <div class="md-title">
          {{ game.name() }} ({{
            new Date(game.startTime()).toLocaleDateString()
          }})
        </div>
        <div class="md-subhead">
          <div>
            Result: {{ game.result().leftGoals }} :
            {{ game.result().rightGoals }}
          </div>
        </div>
      </md-card-header-text>
    </md-card-header>
    <md-card-content>
      <game-metrics :game="game" />
    </md-card-content>
    <div class="actions-row"></div>
    <md-card-actions>
      <md-button
        @click="deleteGame()"
        class="md-icon-button md-raised md-accent"
      >
        <md-icon>delete</md-icon>
      </md-button>
    </md-card-actions>
    <md-snackbar
      md-position="center"
      :md-active.sync="showSnackbar"
      md-persistent
    >
      <span>{{ snackbarMsg }}</span>
    </md-snackbar>
  </md-card>
</template>

<style lang="scss">
.actions-row {
  padding: 16px;
}
</style>

<script>
import { mapState } from "vuex";
import GameMetrics from "../components/GameMetrics.vue";

export default {
  name: "Stats",
  components: {
    "game-metrics": GameMetrics
  },
  data: function() {
    return {
      showSnackbar: false,
      snackbarMsg: ""
    };
  },
  methods: {
    deleteGame() {
      this.$store
        .dispatch("deleteGame", this.game)
        .then(() => {
          this.$router.push({ path: "/" });
        })
        .catch(err => {
          this.showSnackbar = true;
          this.snackbarMsg = err;
        });
    }
  },
  computed: mapState({
    game: function(state) {
      return state.games.find(g => g.id == this.$route.params.id);
    }
  })
};
</script>
