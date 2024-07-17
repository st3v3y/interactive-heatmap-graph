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


*Screenshot Showing the UI:*

![image](https://github.com/user-attachments/assets/78f5a984-f393-43da-9ffe-f60248dad9a6)

*Here the function "Display total unique visitors" is activated, showing the horizontal bars representing the total visitor numbers (and visitor numbers themselves, which are removed in this screenshot):*

![image](https://github.com/user-attachments/assets/b3217b58-c4ec-4912-b7e6-cbc5697bb006)

*Tooltip showing the data of a single datapoint*

![image](https://github.com/user-attachments/assets/5c0e3db1-a965-4023-85a0-5ab64bb3b8a6)


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
| hour    | number | The hour of the day (1-24)                |
| value   | number | The number of unique visitors for this entry |


#### ChartTick

Used for x and y axis, where each object represents one x or y axis coordinate.

| Name  | Type   | Description                                                |
|-------|--------|------------------------------------------------------------|
| value | string | The actual value used for positioning of ChartData values  |
| label | string | The displayed label for the tick                           |

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


## Responsive Design

It was not directlty a requirement of this coding challenge, but as responsive design is crucial in today's multi-device world, I developed this project fully responsive, adapting seamlessly to various screen sizes and devices. With mobile devices accounting for almost 60% of global website traffic, and Google's mobile-first indexing, it's essential for UX and SEO performance.

I've utilized Tailwind CSS classes throughout the application to ensure a consistent and user-friendly experience across desktops, tablets, and mobile devices.
Tailwind CSS's responsive utility classes have been used to adjust layouts and component dimensions based on screen size. 

![image](https://github.com/user-attachments/assets/95d53977-66a5-487d-844a-75fb2a2d4a3d)


## Why ESQL Instead of DSL

Initially, the project used DSL (Domain Specific Language) to query ElasticSearch for the required data (visible in earlier commits). However, I decided to switch to ESQL (ElasticSearch SQL) for several reasons:

1. ESQL is easier to read and maintain, with syntax similar to SQL.
2. The result is typed and doesn't require additional processing.

I updated the ElasticSearch package to version 8.14.0, which provides additional ESQL support through:
   - The helper function `client.helpers.esql({ query: "" })`
   - The `.toRecords<MyDataType>()` function, which returns only the results (without column information) and types them according to the given type.

These features make working with ESQL more straightforward and type-safe compared to DSL.

## Ideas for Further Improvements

1. The vertical lines currently set statically to 6am and 6pm could be dynamically calculated. They could display the average core visitor times across all countries. This could be achieved by calculating the average value for each country from 0-12 and 12-24 hours, then taking the average of those to determine the average start and end times. This could be further enhanced by displaying the average core visit times for a single country when hovering over the country "row" in the chart. The vertical lines could animate into their positions for a more dynamic user experience.
2. Due to the decision to use ESQL instead of DSL, it was necessary to implement two separate database calls to retrieve the required data. This could be improved by implementing a JOIN or subquery once Elastic Search provides this functionality in ESQL (which, to my knowledge, is not currently possible).
3. Regarding database efficiency, a significant portion of the database traffic could be reduced by implementing an appropriate caching strategy. As this chart does not display real-time data, the information could be cached for several hours or even a full day.
4. The dropdown used to limit the number of countries displayed in the chart could be enhanced by implementing a tag list field with autocomplete functionality. This would allow users to add and remove specific countries, which might be useful for viewing data for particular countries or comparing data between two or more countries.
5. While the chart is implemented in a Svelte-friendly way by generating SVG elements declaratively rather than imperatively, the generation of SVG elements could be further improved. Creating reusable components for elements such as `<Axis>`, `<Labels>`, `<Lines>`, and `<Circles>` (data points) would make the chart code more modular, easier to read, and simpler to maintain.
6. Currently, when activating the "Display total unique visitors" toggle, text elements are displayed on the right side of the chart. While this works well, implementing a Dual Axis chart could be considered for a more integrated visualization of this data.
