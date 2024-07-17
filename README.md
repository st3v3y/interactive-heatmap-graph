# Interactive Heatmap Graph

## About the Project

This project was developed as part of the application process for [Bilby](https://www.bilby.ai/). It is forked from their provided repository: [full-stack-dev-take-home-project](https://github.com/bilbyai/full-stack-dev-take-home-project/).

## Project Objective

The main goal of this project is to implement an interactive heatmap graph that visualizes the number of unique visitors by country and hour of the day. Users can select a date range to filter the data, providing a dynamic and insightful view of visitor patterns across different time periods and geographical locations. As a basic project template served their provided [repository](https://github.com/bilbyai/full-stack-dev-take-home-project/) (where also more details about the objectives can be found) and for the design Bilby provided a link to a Figma file.

## Tech Stack

This project leverages a modern web development stack to deliver a responsive and interactive data visualization tool:

- [SvelteKit](https://kit.svelte.dev/): For building the web application
- [tRPC](https://trpc.io/): For type-safe API calls
- [ElasticSearch](https://www.elastic.co/): As the database for storing and querying visitor data
- [D3.js](https://d3js.org/): For creating the interactive heatmap visualization
- [Tailwind CSS](https://tailwindcss.com/): For styling the user interface

## Configuration

To set up the project:

1. Rename the `.env.example` file to `.env`
2. Assign values to the following environment variables:
   - `ELASTIC_SEARCH_CLOUD_ID`: Your ElasticSearch Cloud ID
   - `ELASTIC_SEARCH_API_KEY`: Your ElasticSearch API Key
   - `ELASTIC_SEARCH_INDEX`: Your ElasticSearch Index name

## Installation

To get the project running locally:

```bash
# Clone the repository
git clone https://github.com/st3v3y/interactive-heatmap-graph.git

# Navigate to the project directory
cd interactive-heatmap-graph

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```


## Components

Separating logic into components was a key focus to enhance code reusability, maintainability, and reduce duplication. These components could potentially be moved into a separate library for use across multiple projects. The main components created include:

- `Heatmap`: Implements the logic for visualizing data as a heatmap (more details below)
- `UniqueVisitorsWidget`: Processes data from the page and adds information for the `Heatmap` component
- Control components: `Dropdown` and `Toggle`
- Wrapper components: `Alert` for showing errors, `PageTitle` for reuse on future pages, `Widget` for card visualization
- Layout components: `BaseLayout`, `Header`, and `Footer`

## How to Use the Heatmap

### UI

- **Chart**: Visualizes visitor numbers per country and hour using colored circles. Color intensity represents relative visitor numbers (brighter for lower, darker for higher).
- **Vertical Lines**: 
  - Solid line at 12 pm
  - Two dashed lines at 6 am and 6 pm, marking "core visitor" times
- **Filter Options**:
  - Time range dropdown: "Last Week", "Last 2 Weeks", "Last Month", "Last Quarter", "Last Year"
  - Country display dropdown: Change the number of countries shown (This feature was not a requirement, but I found it a useful and quick-to-add feature, so I decided to add it.)
- **"Display total unique visitors" toggle**: Shows total visits per country for the chosen time range (Also not a required feature, but I was very keen on adding this feature as it was (even wirth the example data) very interesting to see and visualize the total amount of visits per country for the chosen time range. This might be very helpful for the end user to identify from which countries come most of their visitors.)
- **Legend**: Displays the color scale used in the heatmap

### API

The Heatmap component exports several variables for customization:

| Name | Type | Default | Description |
|------|------|---------|-------------|
| data | ChartData[] | undefined | Chart data array |
| xTicks | ChartTick[] | [] | X-axis values and labels |
| yTicks | ChartTick[] | [] | Y-axis values and labels |
| colorScale | string[] | ["#FFECE3", "#800020"] | Color range for the heatmap |
| width | number | 1000 | Initial chart width |
| yTickHeight | number | 40 | Height of a single Y-axis data point |
| padding | object | { top: 20, right: 0, bottom: 40, left: 30 } | Chart padding |
| tooltipOffsetY | number | 20 | Tooltip Y-offset |
| verticalMarkers | LineMarker[] | [] | Vertical lines on the chart |
| getTooltipData | function | () => [] | Function to generate tooltip data |
| displayTotals | boolean | false | Toggle for displaying X-axis totals |

### Types

The following tables provide a clear overview of the structure and purpose of each type used in the project and can give developers a quick reference for the data structures used in this codebase.


#### UniqueVisitorData

This type serves as interface for data returned from the database and forwarded to the client-side.

| Name    | Type   | Description                               |
|---------|--------|-------------------------------------------|
| country | string | The country name                          |
| hour    | number | The hour of the day (likely 0-23)         |
| value   | number | The number of unique visitors for this entry |


#### ChartTick

Used for x and y axis, where each object represents one x or y axis coordinate.

| Name  | Type   | Description                           |
|-------|--------|---------------------------------------|
| value | string | The actual value used for positioning |
| label | string | The displayed label for the tick      |

#### ChartData

`ChartData` represents a single data point.

| Name   | Type   | Description                               |
|--------|--------|-------------------------------------------|
| yValue | string | The value for the y-axis                  |
| xValue | string | The value for the x-axis                  |
| value  | number | The numerical value for the data point    |

#### LineMarker

This type is used to draw a vertical line on the chart. 

| Name   | Type    | Description                                   |
|--------|---------|-----------------------------------------------|
| xValue | string  | The x-axis value where the line should appear |
| dashed | boolean | Whether the line should be dashed or solid    |

#### TooltipData

Each object of the `TooltipData` type represents a data row that should be rendered in the chart tooltips.

| Name  | Type   | Description                              |
|-------|--------|------------------------------------------|
| label | string | The label for the tooltip data point     |
| value | string | The value to display for the data point  |


## Why ESQL Instead of DSL

Initially, the project used DSL (Domain Specific Language) to query ElasticSearch for the required data (visible in earlier commits). However, I decided to switch to ESQL (ElasticSearch SQL) for several reasons:

1. ESQL is easier to read and maintain, with syntax similar to SQL.
2. The result is typed and doesn't require additional processing.

I updated the ElasticSearch package to version 8.14.0, which provides additional ESQL support through:
   - The helper function `client.helpers.esql({ query: "" })`
   - The `.toRecords<MyDataType>()` function, which returns only the results (without column information) and types them according to the given type.

These features make working with ESQL more straightforward and type-safe compared to DSL.
