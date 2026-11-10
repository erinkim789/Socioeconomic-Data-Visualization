// your script.js
const margin = { top: 40, right: 40, bottom: 40, left: 60 };
const vwidth = 700
const vheight = 700

const svg = d3.select('#vis')
    .append("svg")
    .attr("width", vwidth + margin.left + margin.right)
    .attr("height", vheight + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
const g = svg.append('g');

function createVis(data) {
    const metrics = ["gini","hpi_2016","hpi_2019","hdi_2017","hdi_2021","seda"];
    const cols = 3;
    const cellSpacing = 60;
    const width = (Math.floor(vwidth - (cols * cellSpacing)) / cols);
    const height = (Math.floor(vheight - (cols * cellSpacing)) / cols);

    const countryNames = data.map(d => d.country);
const color = d3.scaleOrdinal()
    .domain(countryNames)
    .range(d3.schemeCategory10.concat(d3.schemeSet3));

    metrics.forEach((metric, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;

        const panel = svg.append("g")
            .attr("transform", `translate(${col * (width + cellSpacing)}, ${row * (height + cellSpacing)})`);

        // Sort countries by metric value
        const sortedData = data.slice().sort((a, b) => a[metric] - b[metric]);

        // x scale: index of sorted values
        const x = d3.scaleLinear()
            .domain([0, sortedData.length - 1])
            .range([0, width]);

        // y scale: metric value
        const y = d3.scaleLinear()
            .domain([0, d3.max(sortedData, d => d[metric])])
            .nice()
            .range([height, 0]);

        // Axes
        panel.append("text")
    .attr("x", width / 2)
    .attr("y", height + 15)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Countries sorted by " + metric);

        panel.append("g")
            .call(d3.axisLeft(y));

        // Plot points
        panel.selectAll("circle")
            .data(sortedData)
            .enter()
            .append("circle")
            .attr("cx", (_, i) => x(i))
            .attr("cy", d => y(d[metric]))
            .attr("r", d => d.country === "United States" ? 5 : 2) // US 2x radius
            .attr("fill", d => d.country === "United States" ? "red" : color(d.country));

        // Title
        panel.append("text")
            .attr("x", width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text(metric);
    });
}


function parseNumber(str) {
  if (!str || str === "-" || str.trim() === "") return 0; // handle undefined, empty, or "-"
  return +str.replace(/,/g, "");
}

// Load and process data
async function init() {
    d3.csv("data/data.csv", d => ({
        country: d.indicator,
        iso: d["ISO Country code"],

        population: parseNumber(d.population.replace(/,/g, "")),
        area: parseNumber(d["surface area (Km2)"].replace(/,/g, "")),

        gini: parseNumber(d["GINI index"]),

        hpi_2016: parseNumber(d["happy planet index 2016"]),
        hpi_2019: parseNumber(d["happy planet index 2019"]),

        hdi_2017: parseNumber(d["human development index 2017"]),
        hdi_2021: parseNumber(d["human development index 2021"]),

        seda: parseNumber(d["sustainable economic development assessment (SEDA)"]),
    })).then(data => {
        console.log(data); // Debugging check
        createVis(data);   // Call visualization function
    });
}

// Run `init()` when the page loads
window.addEventListener('load', init);
