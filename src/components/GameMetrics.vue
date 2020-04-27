<template>
  <div>
    <h3>Metrics</h3>

    <svg
      v-for="set in game.sets"
      :id="'goals-' + set.id"
      v-bind:key="set.id"
    ></svg>
    <md-table md-card>
      <md-table-row>
        <md-table-head>{{ game.leftTeam }}</md-table-head>
        <md-table-head></md-table-head>
        <md-table-head>{{ game.rightTeam }}</md-table-head>
      </md-table-row>
      <md-table-row>
        <md-table-cell
          >{{ statistics.total.left.goals.sum }} /
          {{
            statistics.total.left.goals.sum + statistics.total.left.atGoal.sum
          }}
          ({{
            (
              (statistics.total.left.goals.sum /
                (statistics.total.left.goals.sum +
                  statistics.total.left.atGoal.sum)) *
                100 || 0
            ).toFixed(0)
          }}%)</md-table-cell
        >
        <md-table-cell>Shots at goal</md-table-cell>
        <md-table-cell
          >{{ statistics.total.right.goals.sum }} /
          {{
            statistics.total.right.goals.sum + statistics.total.right.atGoal.sum
          }}
          ({{
            (
              (statistics.total.right.goals.sum /
                (statistics.total.right.goals.sum +
                  statistics.total.right.atGoal.sum)) *
                100 || 0
            ).toFixed(0)
          }}%)</md-table-cell
        >
      </md-table-row>
      <md-table-row>
        <md-table-cell>{{ statistics.total.left.pass }}</md-table-cell>
        <md-table-cell>Pass</md-table-cell>
        <md-table-cell>{{ statistics.total.right.pass }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import * as d3 from "d3";
import _ from "lodash";
import Game from "@/lib/Game";

export default {
  props: ["game"],

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
        this.$nextTick(function() {
          this.renderGoals(this.game);
        });
      },
      deep: true
    }
  },

  computed: {
    statistics: function() {
      return this.game.getStatistics();
    }
  },

  mounted: function() {
    this.$nextTick(function() {
      this.renderGoals(this.game);
    });
  },

  methods: {
    renderGoals(game) {
      game.sets.forEach((set, i) => {
        if (this.goalCharts[i]) {
          this.goalCharts[i].selectAll("*").remove();
        }

        const start = set.startTime();
        const end = set.endTime() || Date.now();
        const stats = set.goalStatistics();

        const margin = 60;
        const svgWidth = 300;
        const svgHeight = 300;
        const chartWidth = svgWidth - 2 * margin;
        const chartHeight = svgHeight - 2 * margin;
        const svg = d3
          .select(`#goals-${set.id}`)
          .attr("width", svgWidth)
          .attr("height", svgHeight);

        this.goalCharts[i] = svg
          .append("g")
          .attr("transform", `translate(${margin}, ${margin})`);

        const y = d3
          .scaleLinear()
          .range([chartHeight, 0])
          .domain([0, Math.max(stats.left.length, stats.right.length)]);

        this.goalCharts[i]
          .append("g")
          .call(
            d3
              .axisLeft(y)
              .ticks(Math.max(stats.left.length, stats.right.length))
          );
        const x = d3
          .scaleLinear()
          .range([0, chartWidth])
          .domain([0, (end - start) / 1000]);

        this.goalCharts[i]
          .append("g")
          .attr("transform", `translate(0, ${chartHeight})`)
          .call(d3.axisBottom(x).ticks(10));

        this.goalCharts[i]
          .append("path")
          .datum(stats.left)
          .attr("fill", "none")
          .attr("stroke", "#759ef0")
          .attr("stroke-width", 1)
          .attr(
            "d",
            d3
              .line()
              .x(function(d) {
                return x((d.timestamp - start) / 1000);
              })
              .y(function(d) {
                return y(d.value);
              })
          );

        this.goalCharts[i]
          .append("path")
          .datum(stats.right)
          .attr("fill", "none")
          .attr("stroke", "#f5a3a3")
          .attr("stroke-width", 4)
          .attr(
            "d",
            d3
              .line()
              .x(function(d) {
                return x((d.timestamp - start) / 1000);
              })
              .y(function(d) {
                return y(d.value);
              })
          );

        svg
          .append("text")
          .attr("class", "label")
          .attr("x", -(chartHeight / 2) - margin)
          .attr("y", margin / 2.4)
          .attr("transform", "rotate(-90)")
          .attr("text-anchor", "middle")
          .text("Goals");
        svg
          .append("text")
          .attr("class", "label")
          .attr("x", chartWidth / 2 + margin)
          .attr("y", chartHeight + margin * 1.7)
          .attr("text-anchor", "middle")
          .text("Time [seconds]");

        svg
          .append("text")
          .attr("x", chartWidth - margin / 2)
          .attr("y", margin / 2)
          .attr("text-anchor", "middle")
          .style("font-size", "16px")
          .style("text-decoration", "underline")
          .text(`Set ${set.number}`);
      });
    }
  }
};
</script>
