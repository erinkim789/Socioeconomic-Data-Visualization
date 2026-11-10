import RadarChart from './radarChart.js';

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
  const selectedCountries = ["United States", "Canada", "Brazil", "Germany", "Vietnam", "India", "China", "Australia", "South Africa"];

  // Filter data to only those countries
  const countries = data.filter(d => selectedCountries.includes(d.country));
  console.log(countries); // debugging
    const cols = 3; // number of columns in the trellis
    const cellSpacing = 60; // spacing between charts
    const width = (Math.floor(vwidth-(cols*cellSpacing))/cols);  // width of each radar chart
    const height = (Math.floor(vheight-(cols*cellSpacing))/cols);  // height of each radar chart

 countries.forEach((d, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    
    // Create a unique class for each radar chart
    const chartClass = `radarChart-${i}`;
    
    // Append a group for positioning (optional, depends on your RadarChart implementation)
    svg.append("g")
      .attr("class", chartClass)
      .attr("transform", `translate(${col * (width + cellSpacing)}, ${row * (height + cellSpacing)})`);

    // Set radar chart options
    const radarChartOptions = {
      w: width,
      h: height,
      margin: { top: 30, right: 30, bottom: 30, left: 30 },
      maxValue: 0.5,      // adjust if needed
      levels: 5,
      roundStrokes: true,
      color: d3.scale.category10(),
    };

    // Call the radar chart on this country's g element
    RadarChart(`.${chartClass}`, [d.metrics], radarChartOptions);

    // Optionally, add country label below
    svg.append("text")
      .attr("x", col * (width + cellSpacing) + width / 2)
      .attr("y", row * (height + cellSpacing) + height + 15)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text(d.country);
  });
}

function parseNumber(str) {
  if (!str || str === "-" || str.trim() === "") return 0; // handle undefined, empty, or "-"
  return +str.replace(/,/g, "");
}

// Load and process data
function init() {
   d3.csv("data/data.csv", function(error, rows) {
        if (error) throw error;

        const data = rows.map(function(d) {
            return {
                country: d.indicator,
                metrics: [
                    {axis: "GINI", value: parseNumber(d["GINI index"])},
                    {axis: "HPI 2016", value: parseNumber(d["happy planet index 2016"])},
                    {axis: "HPI 2019", value: parseNumber(d["happy planet index 2019"])},
                    {axis: "HDI 2017", value: parseNumber(d["human development index 2017"])},
                    {axis: "HDI 2021", value: parseNumber(d["human development index 2021"])},
                    {axis: "SEDA", value: parseNumber(d["sustainable economic development assessment (SEDA)"])}
                ]
            };
        });

        console.log(data); // debugging
        createVis(data);   // call your radar chart function
    });
}

// Run `init()` when the page loads
window.addEventListener('load', init);
