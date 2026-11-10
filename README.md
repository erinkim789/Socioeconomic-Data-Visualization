# Interactive Data Visualization Collection

## Overview

This project is a collection of interactive data visualizations built with **D3.js**, exploring socioeconomic and development indicators across countries and regions.

Each visualization presents the data from a different perspective, allowing users to examine relationships between indicators, compare countries against the United States, and explore changes in metrics over time.

The project includes multiple visualizations accessible through separate routes.

## Visualizations

| Route | Preview |
|---|---|
| `/startrellis.html` | (images/startrellis.png) |
| `/barcomp.html` | (images/barcomp.png) |
| `/parallel3.html` | (images/parallel3.png) |
| `/parallel.html` | (images/parallel.png) |
| `/paraset.html` | (images/paraset.png) |
| `/scatmetric.html` | (images/scatmetric.png) |
| `/scattrell.html` | (images/scattrell.png) |

## Data Sources

The project uses multiple CSV datasets stored in the `data/` directory. These datasets contain socioeconomic, demographic, and development indicators collected from various external sources, such as the World Bank Data Group.

Source information is provided within the individual CSV files.

The datasets are used to generate the visualizations, enabling comparisons between countries, exploration of relationships between indicators, and analysis of changes over time.

## Technologies

- **D3.js** – Data visualization and interactive SVG graphics
- **JavaScript** – Data processing and visualization logic
- **HTML5** – Page structure
- **CSS3** – Styling and layout
- **CSV** – Data storage and input

## Running the Project

This project is designed to run locally using the **Live Server** extension in Visual Studio Code.

1. Clone or download the repository.
2. Open the project folder in Visual Studio Code.
3. Install the Live Server extension if it is not already installed.
4. Open the relevant HTML file.
5. Right-click and select **Open with Live Server**.

Navigate to the corresponding visualization route in your browser to explore the different visualizations.

## Project Goals

This project explores how different visualization techniques can reveal patterns and relationships in socioeconomic data. It demonstrates the use of D3.js to process external datasets, construct interactive visualizations, and present multidimensional information through a variety of graphical approaches.