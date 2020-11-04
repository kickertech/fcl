<template>
  <div>
    <svg :id="'set-heatmap-' + id"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  props: {
    stats: { required: true, type: Array, default: null },
    id: { required: true, type: String, default: "noop" },
    title: { required: true, type: String, default: "noop" }
  },
  data() {
    return {
      heatmapChart: undefined
    };
  },

  watch: {
    stats: {
      handler: function(stats) {
        this.stats = stats;
        this.$forceUpdate();
        this.$nextTick(function() {
          this.renderHeatmap();
        });
      },
      deep: true
    }
  },

  mounted: function() {
    this.$nextTick(function() {
      this.renderHeatmap();
    });
  },

  methods: {
    renderHeatmap() {
      if (this.heatmapChart) {
        this.heatmapChart.selectAll("*").remove();
      }
      if (!this.stats) {
        return;
      }
      const margin = { top: 64, right: 64, bottom: 64, left: 64 };
      const width = 356;
      const height = 356;
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      // append the svg object to the body of the page
      this.heatmapChart = d3
        .select(`#set-heatmap-${this.id}`)
        .attr("width", width)
        .attr("height", height);

      const g = this.heatmapChart
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Labels of row and columns
      const xDimensions = ["DEFENSE", "MID", "OFFENSE"];
      const yDimensions = [
        "LOSS",
        "TIMEOUT",
        "MID",
        "OFFENSE",
        // @remove:at_goal
        //"AT_GOAL",
        "GOAL"
      ];

      // Build X scales and axis:
      const x = d3
        .scaleBand()
        .range([0, chartWidth])
        .domain(xDimensions)
        .padding(0.1);
      g.append("g")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(x));

      // Build X scales and axis:
      const y = d3
        .scaleBand()
        .range([chartHeight, 0])
        .domain(yDimensions)
        .padding(0.1);
      g.append("g").call(d3.axisLeft(y));

      // Build color scale
      const color = d3
        .scaleLinear()
        .range(["#E2F2F5", "#055C74"])
        .domain([1, 10]);

      //
      const rectg = g
        .selectAll()
        .data(this.stats, function(d) {
          return d.group + ":" + d.variable;
        })
        .enter()
        .append("g");

      rectg
        .append("rect")
        .attr("x", function(d) {
          return x(d.group);
        })
        .attr("y", function(d) {
          return y(d.variable);
        })
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", function(d) {
          return color(d.value);
        });

      rectg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "9px")
        .attr("x", function(d) {
          return x(d.group) + x.bandwidth() / 2;
        })
        .attr("y", function(d) {
          return y(d.variable) + y.bandwidth() / 2;
        })
        .text(d => d.value);

      this.heatmapChart
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text(this.title);

      this.heatmapChart
        .append("text")
        .attr("class", "label")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom / 4)
        .attr("text-anchor", "middle")
        .text("events by bar");
    }
  }
};
</script>
