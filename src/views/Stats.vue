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
      <div class="game-json" v-if="showJSON">
        <md-field>
          <label>Export JSON</label>
          <md-textarea
            v-model="gameJSON"
            ref="exportjson"
            readonly
          ></md-textarea>
        </md-field>
      </div>
    </md-card-content>
    <md-card-actions>
      <md-button
        @click="exportGame()"
        class="md-icon-button md-raised md-primary"
      >
        <md-icon>import_export</md-icon>
      </md-button>
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
.game-json {
  margin: 16px 0;
  .md-field.md-has-value .md-textarea {
    height: 300px;
    font-size: 12px;
  }
}

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
      snackbarMsg: "",
      showJSON: false
    };
  },
  methods: {
    exportGame() {
      this.showJSON = true;
      this.$nextTick(function() {
        this.$refs.exportjson.$el.select();
      });
    },
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
    },
    gameJSON: function() {
      return JSON.stringify(this.game, 0, 2);
    }
  })
};
</script>
