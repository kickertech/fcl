<template>
  <div>
    <svg :id="'goals-' + id"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: {
    id: { required: true, type: String, default: "noop" },
    title: { required: false, type: String, default: "Goals" },
    stats: { required: true, type: Object, default: null },
    start: { required: true, type: Number, default: Date.now() },
    end: { required: true, type: Number, default: 0 }
  },

  data() {
    return {
      goalChart: null
    };
  },

  watch: {
    stats: {
      handler: function(stats) {
        this.stats = stats;
        this.$forceUpdate();
        this.$nextTick(function() {
          this.renderGoals();
        });
      },
      deep: true
    }
  },

  mounted: function() {
    this.$nextTick(function() {
      this.renderGoals();
    });
  },

  methods: {
    renderGoals() {
      if (this.goalChart) {
        this.goalChart.selectAll("*").remove();
      }
      const start = this.start;
      const end = this.end || Date.now();
      const margin = { top: 64, right: 64, bottom: 64, left: 32 };
      const svgWidth = 356;
      const svgHeight = 356;
      const chartWidth = svgWidth - margin.left - margin.right;
      const chartHeight = svgHeight - margin.top - margin.bottom;
      const svg = d3
        .select(`#goals-${this.id}`)
        .attr("width", svgWidth)
        .attr("height", svgHeight);

      this.goalChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const y = d3
        .scaleLinear()
        .range([chartHeight, 0])
        .domain([0, Math.max(this.stats.left.length, this.stats.right.length)]);

      this.goalChart
        .append("g")
        .call(
          d3
            .axisLeft(y)
            .ticks(Math.max(this.stats.left.length, this.stats.right.length))
        );
      const x = d3
        .scaleLinear()
        .range([0, chartWidth])
        .domain([0, (end - start) / 1000]);

      this.goalChart
        .append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(x).ticks(10));

      this.goalChart
        .append("path")
        .datum(this.stats.left)
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

      this.goalChart
        .append("path")
        .datum(this.stats.right)
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
        .attr("x", chartWidth / 2 + margin.left)
        .attr("y", chartHeight + margin.bottom * 1.7)
        .attr("text-anchor", "middle")
        .text("time [seconds]");

      svg
        .append("text")
        .attr("x", chartWidth / 2 + margin.left)
        .attr("y", margin.bottom / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(this.title);
    }
  }
};
</script>
