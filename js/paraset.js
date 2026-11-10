// your script.js
const margin = { top: 40, right: 40, bottom: 40, left: 60 };
const vwidth = 700
const vheight = 700

let q1, median, q3, max, min;

const svg = d3.select('#vis')
    .append("svg")
    .attr("width", vwidth + margin.left + margin.right)
    .attr("height", vheight + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
const g = svg.append('g');

function createVis(data) {

  dimensions = [data.filter(d=> d.continent === "Asia"), data.filter(d => d.continent === "Europe"), data.filter(d => d.continent === "Africa"), data.filter(d => d.continent === "South America"), data.filter(d => d.continent === "North America"), data.filter(d => d.continent === "Oceania")
    ];
    contients = ["Asia", "Europe", "Africa", "South America", "North America", "Oceania"];

    const color = d3.scaleOrdinal()
    .domain(data.map(d => d.country))
    .range(data.map((d, i) => d3.interpolateRainbow(i / data.length)));
    const cols = 3;
    const cellSpacing = 60;
    const width = (Math.floor(vwidth - (cols * cellSpacing)) / cols);
    const height = (Math.floor(vheight - (cols * cellSpacing)) / cols);

  dimensions.forEach((d, i) => {

    const row = Math.floor(i / cols);
    const col = i % cols;

    const panel = g.append("g")
        .attr("transform", `translate(${col * (width + cellSpacing)}, ${row * (height + cellSpacing)})`);

    const years = ["gdp_2018", "gdp_2019", "gdp_2020", "gdp_2021"];

    const y = d3.scaleLinear()
        .domain([0, d3.max(d.flatMap(c => years.map(y => c[y])))])
        .range([height, 0]);

    const x = d3.scalePoint()
        .domain(years)
        .range([0, width])
        .padding(0.5);

    panel.append("g").call(d3.axisLeft(y));

    panel.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    panel.append("text")
        .attr("x", width/2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .text(contients[i]);

    // draw lines for each country
    panel.selectAll(".line")
        .data(d)
        .enter()
        .append("path")
        .attr("d", c => d3.line()
            .x(yname => x(yname))
            .y(yname => y(c[yname]))
            (years)
        )
        .attr("fill", "none")
        .attr("stroke", c => color(c.country))
        .attr("stroke-width", 1.5);
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

function parseNumber(str) {
  if (!str || str === "-" || str.trim() === "") return 0; // handle undefined, empty, or "-"
  return +str.replace(/,/g, "");
}

// Load and process data
function init() {
    d3.csv("data/with_continent.csv", d => ({
        country: d.Country,
        continent: d.Continent,

        gdp_2018: parseNumber(d["gdp_2018"]),
        gdp_2019: parseNumber(d["gdp_2019"]),
        gdp_2020: parseNumber(d["gdp_2020"]),
        gdp_2021: parseNumber(d["gdp_2021"]),
    })).then(data => {
        console.log(data); // Debugging check
        createVis(data);   // Call visualization function
    });
}

// Run `init()` when the page loads
window.addEventListener('load', init);
