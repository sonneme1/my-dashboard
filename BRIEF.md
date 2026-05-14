# My Dashboard - Project Brief

## Summary
A single-page analytics dashboard showing monthly business metrics.
Primary stakeholder is VP of operations who needs consolidated, at-a-glance view
Think Shopify admin or a simple Google Analytics view. 

## Data
Generate a fake dataset as a JSON file (src/data/metrics.json).
12 months of data (Jan-Dec 2025) that can be filtered down to day, week, month, year etc. Data is by Region (North, West, South, East) and should include:
- Shipment volume
    - Total shipments (daily, weekly and monthly)
    - Shipments in transit vs. delivered vs. pending
    - Volume trends over time (rolling 30, 60, 90 days)
- On-time delivery
    - On-time delivery rate (%) by time period
    - Late shipment count and percentage
    - Trend line comparing current vs. prior period
- Regional Performance
    - Shipment volume by region
    - On-time rate by region
    - Region-level exception counts
- Open Exceptions
    - Total count of open exceptions
    - Exception type breakdown (damaged, delayed, lost, customs hold)
    
## Layout (Vuetify)
- v-app-bar at the top with the dashboard title "FastForward Logistics" and filters
- The data range picker should default to the last year.
- When a specific date range is selected, all cards and charts filter to that range.
- The region filter should default to all regions.
- The month picker should default to showing ALL months
- When a specific range selected, all cards and charts filter to that range. 
- Use a top-down hierarchy, prioritizing the most critical KPIs at the top and drilling into details as the user scrolls or interacts
- Below the app bar: a row of summary cards (v-card) showing the key metrics
- Use v-container, v-row, v-col for responsive grid layout

## Interactions
- Data range filter that toggles between preset ranges (Today, Last 7 days, Last 30 days, Last Year, and custom)
- Region filter - dropdown or toggle to filter all panels by one or more regions
- Hovering over data points reveals exact values, date, and percentage changes
- Data range filter that toggles between preset ranges (Today, Last 7 days, Last 30 days, custom)
- Region filter - dropdown or toggle to filter all panels by one or more regions
- Hovering over data points reveals exact values, date, and percentage changes
- When "All" is selected, summary cards show yearly totals/averages and charts show all 12 months
- Cards should show a small up/down arrow or color indicating change from previous month
## Style
- Dark theme by default (Vuetify dark theme)
- Clean, minimal, lots of whitespace
- Charts should use a cohesive color palette - not rainbow
- Mobile responsive - cards stack on small screens

## Tech
- Vue 3 + TypeScript + Vuetify 3
- Chart.js via vue-chartjs for all charts
- Fake data from a local JSON file (no API calls)
- Single page - no routing needed for this app