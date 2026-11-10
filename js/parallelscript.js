// your script.js
const margin = { top: 40, right: 40, bottom: 40, left: 60 };
const width = 700
const height = 700

let q1, median, q3, max, min;

const svg = d3.select('#vis')
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
const g = svg.append('g');

function createVis(data) {

  dimensions = [
    "population",
    "area",
    "gini",
    "hpi_2016",
    "hpi_2019",
    "hdi_2017",
    "hdi_2021",
    "seda"
    ];

    const color = d3.scaleOrdinal()
    .domain(data.map(d => d.country))
    .range(d3.quantize(d3.interpolateRainbow, data.length));

  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
      .domain( d3.extent(data, function(d) { return +d[name]; }) )
      .range([height, 0])
  }

  // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(dimensions);

  // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
  }

  // Draw the lines
  svg
    .selectAll("myPath")
    .data(data)
    .enter().append("path")
    .attr("d",  path)
    .style("fill", "none")
    .style("stroke", d=> color(d.country))
    .style("opacity", 0.5)

  // Draw the axis:
  svg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
    .data(dimensions).enter()
    .append("g")
    // I translate this element to its right position on the x axis
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    // And I build the axis with the call function
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    // Add axis title
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")
}

// Load and process data
function init() {
    d3.csv("data/data.csv", d => ({
        country: d.indicator,
        iso: d["ISO Country code"],

        population: +d.population.replace(/,/g, ""),
        area: +d["surface area (Km2)"].replace(/,/g, ""),

        gini: d["GINI index"] === "-" ? null : +d["GINI index"],

        hpi_2016: +d["happy planet index 2016"],
        hpi_2019: +d["happy planet index 2019"],

        hdi_2017: +d["human development index 2017"],
        hdi_2021: +d["human development index 2021"],

        seda: +d["sustainable economic development assessment (SEDA)"],
    })).then(data => {
        console.log(data); // Debugging check
        createVis(data);   // Call visualization function
    });
}

// Run `init()` when the page loads
window.addEventListener('load', init);
