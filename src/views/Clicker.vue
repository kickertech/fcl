<template>
  <div class="wrapper">
    <md-card>
      <md-card-content>
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
                    class=""
                    v-bind:class="{
                      'md-raised': true,
                      'md-accent': true,
                      'last-event': isLastEvent(GameEvent.TYPE_R_AT_GOAL)
                    }"
                    @click="pushEvent(GAME_EVENTS.R_AT_GOAL())"
                    >Shot At Goal</md-button
                  >
                </div>
                <div class="table-section goal right">
                  <md-button
                    v-bind:disabled="disabled"
                    v-bind:class="{
                      'md-raised': true,
                      'md-accent': true,
                      'last-event': isLastEvent(GameEvent.TYPE_R_GOAL)
                    }"
                    @click="pushEvent(GAME_EVENTS.R_GOAL())"
                    >Goal</md-button
                  >
                </div>
                <div class="table-section defense left">
                  <md-button
                    v-bind:disabled="disabled"
                    v-bind:class="{
                      'md-raised': true,
                      'md-primary': true,
                      'last-event': isLastEvent(GameEvent.TYPE_L_DEFENSE)
                    }"
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
                    v-bind:class="{
                      'md-raised': true,
                      'md-accent': true,
                      'last-event': isLastEvent(GameEvent.TYPE_R_OFFENSE)
                    }"
                    >Offense</md-button
                  >
                </div>
                <div
                  class="table-section mid left"
                  @click="pushEvent(GAME_EVENTS.L_MID())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    v-bind:class="{
                      'md-raised': true,
                      'md-primary': true,
                      'last-event': isLastEvent(GameEvent.TYPE_L_MID)
                    }"
                    >Mid</md-button
                  >
                </div>
                <div
                  class="table-section mid right"
                  @click="pushEvent(GAME_EVENTS.R_MID())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    v-bind:class="{
                      'md-raised': true,
                      'md-accent': true,
                      'last-event': isLastEvent(GameEvent.TYPE_R_MID)
                    }"
                    >Mid</md-button
                  >
                </div>
                <div
                  class="table-section offense left"
                  @click="pushEvent(GAME_EVENTS.L_OFFENSE())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    v-bind:class="{
                      'md-raised': true,
                      'md-primary': true,
                      'last-event': isLastEvent(GameEvent.TYPE_L_OFFENSE)
                    }"
                    >Offense</md-button
                  >
                </div>
                <div
                  class="table-section defense right"
                  @click="pushEvent(GAME_EVENTS.R_DEFENSE())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    v-bind:class="{
                      'md-raised': true,
                      'md-accent': true,
                      'last-event': isLastEvent(GameEvent.TYPE_R_DEFENSE)
                    }"
                    >Defense</md-button
                  >
                </div>

                <div
                  class="table-section goal left"
                  @click="pushEvent(GAME_EVENTS.L_GOAL())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    v-bind:class="{
                      'md-raised': true,
                      'md-primary': true,
                      'last-event': isLastEvent(GameEvent.TYPE_L_GOAL)
                    }"
                    >Goal</md-button
                  >
                </div>
                <div class="table-section shot-at-goal left">
                  <md-button
                    v-bind:disabled="disabled"
                    v-bind:class="{
                      'md-raised': true,
                      'md-primary': true,
                      'last-event': isLastEvent(GameEvent.TYPE_L_AT_GOAL)
                    }"
                    @click="pushEvent(GAME_EVENTS.L_AT_GOAL())"
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
                    v-bind:class="{
                      'md-raised': true,
                      'md-primary': true,
                      'last-event': isLastEvent(GameEvent.TYPE_L_TIMEOUT)
                    }"
                    >Timout</md-button
                  >
                </div>
                <div
                  class="table-section lost"
                  @click="pushEvent(GAME_EVENTS.N_BALL_LOST())"
                >
                  <md-button
                    v-bind:class="{
                      'md-raised': true,
                      'last-event': isLastEvent(GameEvent.TYPE_N_BALL_LOST)
                    }"
                    v-bind:disabled="disabled"
                    >Ball Lost</md-button
                  >
                </div>
                <div
                  class="table-section timeout right"
                  @click="pushEvent(GAME_EVENTS.R_TIMEOUT())"
                >
                  <md-button
                    v-bind:disabled="disabled"
                    v-bind:class="{
                      'md-raised': true,
                      'md-accent': true,
                      'last-event': isLastEvent(GameEvent.TYPE_R_TIMEOUT)
                    }"
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
            <md-card-actions md-alignment="left">
              <md-button disabled
                >Score: {{ game.getCurrentSet().score()[0] }} :
                {{ game.getCurrentSet().score()[1] }}</md-button
              >
              <md-button disabled>Timer: {{ timer }}</md-button>
              <md-button class="md-button md-raised" @click="undo()"
                >undo</md-button
              >
            </md-card-actions>
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
      </md-card-content>
    </md-card>
    <md-card class="metrics-card">
      <md-card-header>
        <md-card-header-text>Statistics </md-card-header-text>
      </md-card-header>
      <md-card-content>
        <game-metrics :game="game" />
        <md-snackbar
          md-position="center"
          :md-active.sync="showSnackbar"
          md-persistent
        >
          <span>{{ snackbarMsg }}</span>
        </md-snackbar>
      </md-card-content>
    </md-card>
  </div>
</template>

<style lang="scss">
.md-card {
  max-width: 1100px;
  margin: 0 auto !important;
}
.md-tab {
  background: #fff;
}

.metrics-card {
  margin-top: 32px !important;
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

    @media screen and (max-width: 980px) {
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      margin-top: 16px;
      padding-top: 16px;
    }

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
    &.last-event {
      background: #2d132c !important;
    }
  }
  &.dummy {
    width: 50%;
    @media screen and (max-width: 980px) {
      display: none;
    }
  }
  &.goal {
    width: 25%;
    // @remove:at_goal
    width: 50%;
    @media screen and (max-width: 980px) {
      width: 50%;
      // @remove:at_goal
      width: 100%;
    }
  }

  &.shot-at-goal {
    // @remove:at_goal
    display: none;
    width: 25%;
    @media screen and (max-width: 980px) {
      width: 50%;
    }
  }
  &.mid {
    width: 50%;
  }
  &.offense {
    width: 50%;
  }
  &.defense {
    width: 50%;
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
  height: 247px;
  overflow: auto;
  border: 1px solid #ccc;
  padding: 1em 2em;
}
</style>

<script>
import Game from "../lib/Game";
import * as GameEvent from "../lib/GameEvents";
import GameMetrics from "../components/GameMetrics.vue";

export default {
  name: "Clicker",
  components: {
    "game-metrics": GameMetrics
  },
  data: function() {
    return {
      timer: 0,
      sending: false,
      disabled: true,
      showSnackbar: false,
      snackbarMsg: "",
      showEventLog: false,
      game: new Game(undefined, "left team", "right team"),
      GAME_EVENTS: GameEvent.EVENTS,
      GameEvent: GameEvent
    };
  },
  mounted: function() {
    this.startInterval();
  },
  methods: {
    isLastEvent(type) {
      const evt = this.game.getCurrentSet().lastEvent();
      if (evt && evt.type == type) {
        return true;
      }
    },
    logs() {
      return this.game
        .getCurrentSet()
        .events.slice()
        .reverse();
    },
    startInterval() {
      this.timerInterval = setInterval(() => {
        if (!this.disabled) {
          this.timer++;
        }
      }, 1000);
    },
    undo() {
      const evt = this.game.undo();
      if (!evt) {
        return;
      }

      switch (evt.type) {
        case GameEvent.TYPE_START:
          this.disabled = true;
          break;
        case GameEvent.TYPE_END:
          this.disabled = false;
          break;
      }
    },
    pushEvent(evt) {
      if (this.disabled) {
        return;
      }
      window.navigator.vibrate(33);
      this.timer = 0;
      clearInterval(this.timerInterval);
      this.startInterval();
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
