import Vue from "vue";
import Vuex from "vuex";
import Game from "../lib/Game";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    games: [] as Game[]
  },
  mutations: {
    clear(state) {
      state.games = [];
    },
    initialize(state) {
      const data = localStorage.getItem("store");
      if (data) {
        const stateData = JSON.parse(data);
        stateData.games = stateData.games.map((obj: any) => Game.fromJSON(obj));
        this.replaceState(Object.assign(state, stateData));
      }
    },

    deleteGame(state, game: Game) {
      const idx = state.games.findIndex(g => g.id == game.id);
      state.games.splice(idx, 1);
    },
    upsertGame(state, game: Game) {
      const idx = state.games.findIndex(g => g.id == game.id);
      if (idx != -1) {
        state.games[idx] = game;
      } else {
        state.games.push(game);
      }
    }
  },
  actions: {
    deleteGame({ commit, state }, game: Game) {
      return new Promise((resolve, reject) => {
        if (!state.games.find(g => g.id == game.id)) {
          reject("game not found");
          return;
        }
        commit("deleteGame", game);
        resolve();
      });
    },
    saveGame({ commit }, game: Game) {
      return new Promise(resolve => {
        setTimeout(() => {
          commit("upsertGame", game);
          resolve();
        }, 500);
      });
    }
  },
  modules: {}
});

export default store;
