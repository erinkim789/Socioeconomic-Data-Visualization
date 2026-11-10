// your script.js
const margin = { top: 40, right: 40, bottom: 40, left: 60 };
const vwidth = 700
const vheight = 700

function parseNumber(str) {
  if (!str || str === "-" || str.trim() === "") return 0; // handle undefined, empty, or "-"
  return +str.replace(/,/g, "");
}
function init() {

d3.csv("data/data.csv").then(rows => {

        // --- Pick ANY 9 countries you want ---
        const selectedCountries = [
            "Afghanistan",
            "Vietnam",
            "China",
            "India",
            "Brazil",
            "Germany",
            "Nigeria",
            "Mexico",
            "Japan"
        ];

        const filtered = rows.filter(d => selectedCountries.includes(d.indicator));

        if (filtered.length === 0) {
            console.error("None of the selected countries were found.");
            return;
        }

        // Column definitions
        const columns = [
            { col: "happy planet index 2016", metric: "HPI" },
            { col: "happy planet index 2019", metric: "HPI" },
            { col: "human development index 2017", metric: "HDI" },
            { col: "human development index 2021", metric: "HDI" },
            { col: "sustainable economic development assessment (SEDA)", metric: "SEDA" },
            { col: "GDP growth\n(annual %) 2018", metric: "GDP Growth" },
            { col: "GDP growth\n(annual %) 2021+", metric: "GDP Growth" }
        ];

        // Build metric objects for each country
        const dataByCountry = filtered.map(countryRow => {

            const points = columns.map(c => {
                const yearMatch = c.col.match(/\d{4}/);
                const year = yearMatch ? +yearMatch[0] : 2018;
                return {
                    metric: c.metric,
                    year: year,
                    value: parseNumber(countryRow[c.col])
                };
            });

            return {
                name: countryRow.indicator,
                metrics: points
            };
        });

        console.log("Processed:", dataByCountry);

        // --- Scatter Plot ---
        const cellWidth = 260;
        const cellHeight = 220;
        const margin = {top: 30, right: 20, bottom: 35, left: 40};

        const container = d3.select("#vis")
            .style("display", "grid")
            .style("grid-template-columns", "repeat(3, 1fr)")
            .style("gap", "20px");

        // Shared scales across all charts
        const allYears = dataByCountry.flatMap(c => c.metrics.map(m => m.year));
        const allValues = dataByCountry.flatMap(c => c.metrics.map(m => m.value));

        const x = d3.scaleLinear()
            .domain(d3.extent(allYears))
            .nice()
            .range([0, cellWidth - margin.left - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(allValues)])
            .nice()
            .range([cellHeight - margin.top - margin.bottom, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // ----------- DRAW EACH COUNTRY PANEL -------------
        dataByCountry.forEach(country => {

            const panel = container.append("svg")
                .attr("width", cellWidth)
                .attr("height", cellHeight)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Title
            panel.append("text")
                .attr("x", 0)
                .attr("y", -10)
                .style("font-size", "14px")
                .style("font-weight", "bold")
                .text(country.name);

            // Axes
            panel.append("g")
                .attr("transform", `translate(0,${cellHeight - margin.top - margin.bottom})`)
                .call(d3.axisBottom(x).ticks(4).tickFormat(d3.format("d")));

            panel.append("g")
                .call(d3.axisLeft(y).ticks(5));

            // Points
            panel.selectAll("circle")
                .data(country.metrics)
                .enter()
                .append("circle")
                .attr("cx", d => x(d.year))
                .attr("cy", d => y(d.value))
                .attr("r", 4)
                .attr("fill", d => color(d.metric));

            // Labels
            panel.selectAll("text.label")
                .data(country.metrics)
                .enter()
                .append("text")
                .attr("x", d => x(d.year))
                .attr("y", d => y(d.value) - 6)
                .attr("text-anchor", "middle")
                .style("font-size", "8px")
                .text(d => d.metric);
        });
    });
}

// Run `init()` when the page loads
window.addEventListener('load', init);
