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
  const selectedCountries = ["United States", "Canada", "Brazil", "Germany", "Vietnam", "India", "China", "Australia", "South Africa", "Norway"];

  const countries = data.filter(d => selectedCountries.includes(d.country));
  const usdata = countries.find(d => d.country === "United States");

  // Remove US from trellis iteration
  const otherCountries = countries.filter(d => d.country !== "United States");
  console.log(countries); // debugging
    const cols = 3; // number of columns in the trellis
    const cellSpacing = 60; // spacing between charts
    const width = (Math.floor(vwidth-(cols*cellSpacing))/cols);  // width of each radar chart
    const height = (Math.floor(vheight-(cols*cellSpacing))/cols);  // height of each radar chart

 otherCountries.forEach((country, i) => {

    const row = Math.floor(i / cols);
    const col = i % cols;

    const panel = svg.append("g")
      .attr("transform", `translate(${col * (width + cellSpacing)}, ${row * (height + cellSpacing)})`);

    // Metrics names
    const metricNames = country.metrics.map(m => m.axis);

    // X scale
    const x = d3.scaleBand()
      .domain(metricNames)
      .range([0, width])
      .padding(0.2);

    // Y scale
    const allValues = [...country.metrics.map(m => m.value), ...usdata.metrics.map(m => m.value)];
    const y = d3.scaleLinear()
      .domain([0, d3.max(allValues)])
      .nice()
      .range([height, 0]);

    // Axes
    panel.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "10px");

    panel.append("g")
      .call(d3.axisLeft(y));

    const barWidth = x.bandwidth() / 2;

    // US bars (red)
    panel.selectAll(".bar.us")
      .data(usdata.metrics)
      .enter()
      .append("rect")
      .attr("class", "bar us")
      .attr("x", (d, i) => x(metricNames[i]))
      .attr("y", d => y(d.value))
      .attr("width", barWidth)
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", "red");

    // Country bars (green)
    panel.selectAll(".bar.country")
      .data(country.metrics)
      .enter()
      .append("rect")
      .attr("class", "bar country")
      .attr("x", (d, i) => x(metricNames[i]) + barWidth)
      .attr("y", d => y(d.value))
      .attr("width", barWidth)
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", "green");

    // Country label below
    panel.append("text")
      .attr("x", width / 2)
      .attr("y", height + 55)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text(country.country + " (green) vs US (red)");
  });
}

function parseNumber(str) {
  if (!str || str === "-" || str.trim() === "") return 0; // handle undefined, empty, or "-"
  return +str.replace(/,/g, "");
}

// Load and process data
async function init() {
    try {
        const rows = await d3.csv("data/data.csv");

        const data = rows.map(d => ({
            country: d.indicator,
            metrics: [
                { axis: "GINI", value: parseNumber(d["GINI index"]) },
                { axis: "HPI 2016", value: parseNumber(d["happy planet index 2016"]) },
                { axis: "HPI 2019", value: parseNumber(d["happy planet index 2019"]) },
                { axis: "HDI 2017", value: parseNumber(d["human development index 2017"]) },
                { axis: "HDI 2021", value: parseNumber(d["human development index 2021"]) },
                { axis: "SEDA", value: parseNumber(d["sustainable economic development assessment (SEDA)"]) }
            ]
        }));

        console.log(data); // debugging
        createVis(data);
    } catch (err) {
        console.error("Error loading CSV:", err);
    }
}

// Run `init()` when the page loads
window.addEventListener('load', init);
