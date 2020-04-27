<template>
  <md-card>
    <md-tabs>
      <template slot="md-tab" slot-scope="{ tab }">
        {{ tab.label }}
        <i class="badge" v-if="tab.data.badge">{{ tab.data.badge }}</i>
      </template>

      <md-tab id="tab-home" md-label="Clicker">
        <div class="two-col-wrapper">
          <div class="main-area">
            <div class="clicker">
              <div class="set-results">
                <div v-for="set in game.sets" v-bind:key="set.id">
                  {{ set.results }}
                </div>
              </div>

              <div class="clicker-area">
                <div class="table-section dummy"></div>
                <div class="table-section shot-at-goal right">
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-accent"
                    @click="pushEvent(GAME_EVENTS.R_SHOT_AT_GOAL())"
                    >Shot At Goal</md-button
                  >
                </div>
                <div class="table-section goal right">
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-accent"
                    @click="pushEvent(GAME_EVENTS.R_GOAL())"
                    >Goal</md-button
                  >
                </div>
                <div class="table-section defense left">
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-primary"
                    @click="pushEvent(GAME_EVENTS.L_DEFENSE())"
                    >Defense</md-button
                  >
                </div>
                <div
                  class="table-section offense right"
                  @click="pushEvent(GAME_EVENTS.R_OFFENSE())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-accent"
                    >Offense</md-button
                  >
                </div>
                <div
                  class="table-section middle left"
                  @click="pushEvent(GAME_EVENTS.L_MIDDLE())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-primary"
                    >Mid</md-button
                  >
                </div>
                <div
                  class="table-section middle right"
                  @click="pushEvent(GAME_EVENTS.R_MIDDLE())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-accent"
                    >Mid</md-button
                  >
                </div>
                <div
                  class="table-section offense left"
                  @click="pushEvent(GAME_EVENTS.L_OFFENSE())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-primary"
                    >Offense</md-button
                  >
                </div>
                <div
                  class="table-section defense right"
                  @click="pushEvent(GAME_EVENTS.R_DEFENSE())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-accent"
                    >Defense</md-button
                  >
                </div>

                <div
                  class="table-section goal left"
                  @click="pushEvent(GAME_EVENTS.L_GOAL())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-primary"
                    >Goal</md-button
                  >
                </div>
                <div class="table-section shot-at-goal left">
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-primary"
                    @click="pushEvent(GAME_EVENTS.L_SHOT_AT_GOAL())"
                    >Shot At Goal</md-button
                  >
                </div>
                <div class="table-section dummy"></div>

                <div
                  class="table-section timeout left"
                  @click="pushEvent(GAME_EVENTS.L_TIMEOUT())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-primary"
                    >Timout</md-button
                  >
                </div>
                <div
                  class="table-section lost"
                  @click="pushEvent(GAME_EVENTS.N_BALL_LOST())"
                >
                  <md-button class="md-raised" v-bind:disabled="disabled"
                    >Ball Lost</md-button
                  >
                </div>
                <div
                  class="table-section timeout right"
                  @click="pushEvent(GAME_EVENTS.R_TIMEOUT())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    class="md-raised md-accent"
                    >Timeout</md-button
                  >
                </div>
              </div>
              <md-divider></md-divider>
              <div class="game-controls">
                <md-button
                  class="md-raised md-primary"
                  v-bind:disabled="!disabled"
                  @click="startGame()"
                >
                  {{
                    game.sets.length == 1 && !game.getCurrentSet().finished()
                      ? "Start Game"
                      : `Start Set ${game.sets.length + 1}`
                  }}</md-button
                >
                <md-button
                  class="md-raised md-accent"
                  v-bind:disabled="disabled"
                  @click="endGame()"
                  >End Set {{ game.sets.length }}</md-button
                >
              </div>
            </div>
          </div>
          <div class="sidebar">
            <div class="form-wrapper">
              <md-field>
                <label>Left Team</label>
                <md-input v-model="game.leftTeam" maxlength="30"></md-input>
              </md-field>
              <md-field>
                <label>Right Team</label>
                <md-input v-model="game.rightTeam" maxlength="30"></md-input>
              </md-field>
              <md-progress-bar md-mode="indeterminate" v-if="sending" />
              <md-button
                type="submit"
                class="md-raised md-primary"
                :disabled="sending"
                v-on:click="save()"
              >
                Save</md-button
              >
              <md-checkbox v-model="showEventLog">show event log</md-checkbox>
            </div>

            <ul class="event-log" v-if="showEventLog">
              <li v-for="event in logs()" v-bind:key="event.timestamp">
                {{ event.toString() }}
              </li>
            </ul>
          </div>
        </div>
      </md-tab>
      <md-tab id="tab-metrics" md-label="Metrics">
        <game-metrics :game="game" />
      </md-tab>
      <md-snackbar
        md-position="center"
        :md-active.sync="showSnackbar"
        md-persistent
      >
        <span>{{ snackbarMsg }}</span>
      </md-snackbar>
    </md-tabs>
  </md-card>
</template>
<style lang="scss">
.md-card {
  max-width: 1100px;
  margin: 0 auto !important;
}
.md-tab {
  background: #fff;
}

.two-col-wrapper {
  display: flex;
  @media screen and (max-width: 980px) {
    display: block;
  }

  .main-area {
    width: 100%;
    max-width: 800px;
    @media screen and (max-width: 980px) {
      display: block;
      max-width: inherit;
    }
  }
  .sidebar {
    padding: 0 8px 0 8px;
    flex-grow: 1; // use remaining space

    .md-checkbox {
    }
    .md-button {
      margin: 8px 0;
      width: 100%;
      @media screen and (max-width: 980px) {
        width: auto;
      }
    }
  }
}

.clicker-area {
  margin: 0 0 0 0;
  height: 440px;
  display: flex;
  padding-right: 8px;
  flex-wrap: wrap;
  //flex-direction: column;
  flex-direction: row;
}

.table-section {
  display: flex;
  height: 7vh;

  .md-button {
    width: 100%;
  }
  &.dummy {
    width: 40%;
    @media screen and (max-width: 980px) {
      display: none;
    }
  }
  &.goal {
    width: 30%;
    @media screen and (max-width: 980px) {
      width: 50%;
    }
  }
  &.shot-at-goal {
    width: 30%;
    @media screen and (max-width: 980px) {
      width: 50%;
    }
  }
  &.middle {
    width: 50%;
  }
  &.offense {
    width: 60%;
  }
  &.defense {
    width: 40%;
  }
  &.timeout {
    width: 33.33%;
  }
  &.lost {
    width: 33.33%;
  }
}

.game-controls {
  padding: 16px 0;
  display: flex;
  .md-button {
    width: 50%;
  }
}

.form-wrapper {
  padding: 0;
  margin: 0 auto;
}

.md-checkbox {
  margin-left: 2em !important;
}

.event-log {
  max-width: 600px;
  margin: 0 auto;
  height: 300px;
  overflow: auto;
  border: 1px solid #ccc;
  padding: 1em 2em;
}
</style>

<script>
import Game from "@/lib/Game";
import * as GameEvent from "@/lib/GameEvents";
import GameMetrics from "../components/GameMetrics.vue";

export default {
  name: "Clicker",
  components: {
    "game-metrics": GameMetrics
  },
  data: function() {
    return {
      sending: false,
      disabled: true,
      showSnackbar: false,
      snackbarMsg: "",
      showEventLog: true,
      game: new Game(undefined, "left team", "right team"),
      GAME_EVENTS: GameEvent.EVENTS
    };
  },
  methods: {
    logs() {
      return this.game
        .getCurrentSet()
        .events.slice()
        .reverse();
    },
    pushEvent(evt) {
      if (this.disabled) {
        return;
      }
      window.navigator.vibrate(50);
      this.game.pushEvent(evt);
      this.$forceUpdate();
    },
    startGame() {
      this.disabled = false;
      this.pushEvent(GameEvent.EVENTS.START());
    },
    endGame() {
      this.pushEvent(GameEvent.EVENTS.END());
      this.disabled = true;
    },

    save: function() {
      if (
        this.game.leftTeam == "" ||
        this.game.rightTeam == "" ||
        !this.game.startTime()
      ) {
        this.showSnackbar = true;
        this.snackbarMsg = "invalid game. missing team name";
        return;
      }

      this.sending = true;
      this.$store
        .dispatch("saveGame", this.game)
        .then(() => {
          this.sending = false;
          this.showSnackbar = true;
          this.snackbarMsg = "saved";
        })
        .catch(err => {
          this.sending = false;
          this.showSnackbar = true;
          this.snackbarMsg = err;
        });
    }
  }
};
</script>
