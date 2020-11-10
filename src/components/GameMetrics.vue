<template>
  <div>
    <section class="graph-section">
      <div class="set-wrapper" v-for="set in game.sets" v-bind:key="set.id">
        <h3>Set {{ set.number }}</h3>
        <div class="statistics-wrapper">
          <goal-graph
            :stats="set.goalStatistics()"
            :id="set.id"
            :start="set.startTime()"
            :end="set.endTime()"
          />
          <set-heatmap
            :title="game.leftTeam"
            :id="'l-' + set.id"
            :stats="set.getStatistics().left"
          />
          <set-heatmap
            :title="game.rightTeam"
            :id="'r-' + set.id"
            :stats="set.getStatistics().right"
          />
        </div>
      </div>
    </section>

    <section class="metrics-table-section">
      <h3>Game Statistics (total)</h3>
      <md-table md-card v-if="statistics && statistics.total">
        <md-table-row>
          <md-table-head>Metric</md-table-head>
          <md-table-head>{{ game.leftTeam }}</md-table-head>
          <md-table-head>{{ game.rightTeam }}</md-table-head>
        </md-table-row>
        <md-table-row>
          <md-table-cell>Forward Offense %</md-table-cell>
          <md-table-cell
            >{{ statistics.total.left.bars.offense.goalRate.toFixed(0) }}% ({{
              statistics.total.left.bars.offense.goal
            }}
            goals<!-- @remove:at_goal / {{ statistics.total.left.bars.offense.atGoal }} at
            goal-->)</md-table-cell
          >
          <md-table-cell
            >{{ statistics.total.right.bars.offense.goalRate.toFixed(0) }}% ({{
              statistics.total.right.bars.offense.goal
            }}
            goals<!-- @remove:at_goal / {{ statistics.total.right.bars.offense.atGoal }} at
            goal-->)</md-table-cell
          >
        </md-table-row>
        <md-table-row>
          <md-table-cell>Forward Offense Retry</md-table-cell>
          <md-table-cell>{{
            statistics.total.left.bars.offense.retry
          }}</md-table-cell>
          <md-table-cell>{{
            statistics.total.right.bars.offense.retry
          }}</md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>Forward Loss %</md-table-cell>
          <md-table-cell
            >{{
              statistics.total.left.bars.offense.lossRate.toFixed(0)
            }}%</md-table-cell
          >
          <md-table-cell
            >{{
              statistics.total.right.bars.offense.lossRate.toFixed(0)
            }}%</md-table-cell
          >
        </md-table-row>

        <md-table-row>
          <md-table-cell>Mid Pass</md-table-cell>
          <md-table-cell
            >{{ statistics.total.left.bars.mid.passRate.toFixed(0) }}% ({{
              statistics.total.left.bars.mid.pass
            }}
            pass /
            {{ statistics.total.left.bars.mid.loss }} loss)</md-table-cell
          >
          <md-table-cell
            >{{ statistics.total.right.bars.mid.passRate.toFixed(0) }}% ({{
              statistics.total.right.bars.mid.pass
            }}
            pass / {{ statistics.total.right.bars.mid.loss }} loss)
          </md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>Mid Goals</md-table-cell>
          <md-table-cell
            >{{ statistics.total.left.bars.mid.goal }}
          </md-table-cell>
          <md-table-cell
            >{{ statistics.total.right.bars.mid.goal }}
          </md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>Mid Retry</md-table-cell>
          <md-table-cell>{{
            statistics.total.left.bars.mid.retry
          }}</md-table-cell>
          <md-table-cell>{{
            statistics.total.right.bars.mid.retry
          }}</md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>Defense Goal</md-table-cell>
          <md-table-cell>{{
            statistics.total.left.bars.defense.goal
          }}</md-table-cell>
          <md-table-cell>{{
            statistics.total.right.bars.defense.goal
          }}</md-table-cell>
        </md-table-row>
        <md-table-row>
          <md-table-cell>Defense Pass</md-table-cell>
          <md-table-cell>{{
            statistics.total.left.bars.defense.pass
          }}</md-table-cell>
          <md-table-cell>{{
            statistics.total.right.bars.defense.pass
          }}</md-table-cell>
        </md-table-row>
      </md-table>

      <div class="set-stats" v-for="(set, i) in statistics.sets" v-bind:key="i">
        <h3>Set {{ i + 1 }}</h3>
        <md-table md-card>
          <md-table-row>
            <md-table-head>Metric</md-table-head>
            <md-table-head>{{ game.leftTeam }}</md-table-head>
            <md-table-head>{{ game.rightTeam }}</md-table-head>
          </md-table-row>
          <md-table-row>
            <md-table-cell>Forward Offense %</md-table-cell>
            <md-table-cell
              >{{ set.left.bars.offense.goalRate.toFixed(0) }}% ({{
                set.left.bars.offense.goal
              }}
              goals<!-- @remove:at_goal / {{ set.left.bars.offense.atGoal }} at goal-->)</md-table-cell
            >
            <md-table-cell
              >{{ set.right.bars.offense.goalRate.toFixed(0) }}% ({{
                set.right.bars.offense.goal
              }}
              goals<!-- @remove:at_goal / {{ set.right.bars.offense.atGoal }} at
              goal-->)</md-table-cell
            >
          </md-table-row>
          <md-table-row>
            <md-table-cell>Forward Offense Retry</md-table-cell>
            <md-table-cell>{{ set.left.bars.offense.retry }}</md-table-cell>
            <md-table-cell>{{ set.right.bars.offense.retry }}</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell>Forward Loss %</md-table-cell>
            <md-table-cell
              >{{ set.left.bars.offense.lossRate.toFixed(0) }}%</md-table-cell
            >
            <md-table-cell
              >{{ set.right.bars.offense.lossRate.toFixed(0) }}%</md-table-cell
            >
          </md-table-row>

          <md-table-row>
            <md-table-cell>Mid Pass</md-table-cell>
            <md-table-cell
              >{{ set.left.bars.mid.passRate.toFixed(0) }}% ({{
                set.left.bars.mid.pass
              }}
              pass /
              {{ set.left.bars.mid.loss }} loss)</md-table-cell
            >
            <md-table-cell
              >{{ set.right.bars.mid.passRate.toFixed(0) }}% ({{
                set.right.bars.mid.pass
              }}
              pass / {{ set.right.bars.mid.loss }} loss)
            </md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell>Mid Goals</md-table-cell>
            <md-table-cell>{{ set.left.bars.mid.goal }} </md-table-cell>
            <md-table-cell>{{ set.right.bars.mid.goal }} </md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell>Mid Retry</md-table-cell>
            <md-table-cell>{{ set.left.bars.mid.retry }}</md-table-cell>
            <md-table-cell>{{ set.right.bars.mid.retry }}</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell>Defense Goal</md-table-cell>
            <md-table-cell>{{ set.left.bars.defense.goal }}</md-table-cell>
            <md-table-cell>{{ set.right.bars.defense.goal }}</md-table-cell>
          </md-table-row>
          <md-table-row>
            <md-table-cell>Defense Pass</md-table-cell>
            <md-table-cell>{{ set.left.bars.defense.pass }}</md-table-cell>
            <md-table-cell>{{ set.right.bars.defense.pass }}</md-table-cell>
          </md-table-row>
        </md-table>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.graph-section {
  .set-wrapper {
    padding: 0 0 16px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    h3 {
      text-align: center;
    }
    .statistics-wrapper {
      overflow-x: scroll;
      display: flex;
    }
  }
}
.metrics-table-section {
  .set-stats {
    padding: 16px 0;
  }
}
</style>

<script>
import * as d3 from "d3";
import _ from "lodash";
import Game from "../lib/Game";
import { mapBarStats } from "../lib/Statistics";
import GoalGraph from "./GoalGraph.vue";
import SetHeatmap from "./SetHeatmap.vue";

export default {
  props: ["game"],

  components: {
    "goal-graph": GoalGraph,
    "set-heatmap": SetHeatmap
  },

  data() {
    return {
      goalCharts: []
    };
  },

  watch: {
    game: {
      handler: function(game) {
        this.game = game;
        this.$forceUpdate();
      },
      deep: true
    }
  },

  computed: {
    statistics: function() {
      return this.game.getStatistics();
    },
    totalGameStats: function() {
      const evs = _.flatten(this.game.sets.map(s => s.events));
      return {
        left: mapBarStats("L", evs),
        right: mapBarStats("R", evs)
      };
    }
  },

  mounted: function() {
    // null
  },

  methods: {}
};
</script>
