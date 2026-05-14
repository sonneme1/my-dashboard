<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-toolbar-title>FastForward Logistics</v-toolbar-title>
      <v-spacer />
      <!-- Filters: Date Range, Region, Month -->
      <v-select
        v-model="selectedRegion"
        :items="regionOptions"
        label="Region"
        style="max-width: 180px;"
        class="mr-4"
        clearable
      />
      <v-select
        v-model="selectedDateRange"
        :items="dateRangeOptions"
        item-title="label"
        item-value="value"
        label="Date Range"
        style="max-width: 180px; color: #fff;"
        class="mr-4"
        clearable
      />
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <!-- Summary Cards -->
        <v-row class="mt-6" dense>
          <v-col cols="12" sm="6" md="3" v-for="card in summaryCards" :key="card.title">
            <v-card class="pa-4 summary-card summary-card-dark" dark>
              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="text-h6">{{ card.title }}</div>
                  <div class="text-h4 font-weight-bold">{{ card.value }}</div>
                </div>
                <v-icon :color="card.trend > 0 ? 'green' : card.trend < 0 ? 'red' : 'grey'">
                  {{ card.trend > 0 ? 'mdi-arrow-up' : card.trend < 0 ? 'mdi-arrow-down' : 'mdi-minus' }}
                </v-icon>
              </div>
              <div class="caption mt-2">{{ card.subtitle }}</div>
            </v-card>
          </v-col>
        </v-row>
        <!-- Charts -->
        <v-row class="mt-8" dense align="stretch">
          <v-col cols="12" md="6">
            <v-card class="pa-4 chart-card" height="100%">
              <div class="text-h6 mb-2">Shipment Volume Trend</div>
              <line-chart :chart-data="shipmentVolumeChartData" />
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-4 chart-card" height="100%">
              <div class="text-h6 mb-2">On-Time Delivery Rate</div>
              <bar-chart :chart-data="onTimeRateChartData" />
            </v-card>
          </v-col>
        </v-row>
        <v-row class="mt-8" dense>
          <v-col cols="12" md="6">
            <v-card class="pa-4">
              <div class="text-h6 mb-2">Regional Performance</div>
              <bar-chart :chart-data="regionalPerformanceChartData" />
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="pa-4">
              <div class="text-h6 mb-2">Open Exceptions</div>
              <bar-chart :chart-data="exceptionsChartData" />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { VApp, VAppBar, VToolbarTitle, VSpacer, VSelect, VMenu, VBtn, VDatePicker, VMain, VContainer, VRow, VCol, VCard, VIcon } from 'vuetify/components';
import LineChart from '../components/LineChart.vue';
import BarChart from '../components/BarChart.vue';
import metricsData from '../data/metrics.json';

const regionOptions = ['All', 'North', 'South', 'East', 'West'];

export default defineComponent({
  name: 'HomeView',
  components: {
    VApp, VAppBar, VToolbarTitle, VSpacer, VSelect, VMenu, VBtn, VDatePicker, VMain, VContainer, VRow, VCol, VCard, VIcon,
    LineChart, BarChart,
  },
  setup() {
        // Only close menu when both start and end dates are selected
        function onDateRangeChange(val: Date[]) {
          dateRange.value = val;
          if (val && val.length === 2 && val[0] && val[1]) {
            menu.value = false;
          }
        }
    const today = new Date('2025-12-31');
    const selectedRegion = ref('All');
    const selectedDateRange = ref('1y');
    const dateRangeOptions = [
      { label: 'Last 30 Days', value: '30d' },
      { label: 'Last 60 Days', value: '60d' },
      { label: 'Last 6 Months', value: '6m' },
      { label: 'Last Year', value: '1y' },
    ];

    // Filtered data
    const filteredData = computed(() => {
      let regionFilter: string[];
      if (selectedRegion.value === 'All') {
        regionFilter = ['North', 'South', 'East', 'West'];
      } else {
        regionFilter = [selectedRegion.value];
      }
      // Calculate start date based on selectedDateRange
      let startDate = new Date(today);
      if (selectedDateRange.value === '30d') {
        startDate.setDate(today.getDate() - 30);
      } else if (selectedDateRange.value === '60d') {
        startDate.setDate(today.getDate() - 60);
      } else if (selectedDateRange.value === '6m') {
        startDate.setMonth(today.getMonth() - 6);
      } else if (selectedDateRange.value === '1y') {
        startDate.setFullYear(today.getFullYear() - 1);
      }
      return metricsData.filter((item: any) => {
        const inRegion = regionFilter.includes(item.region);
        const monthDate = new Date(item.month + '-01');
        const inRange = monthDate >= startDate && monthDate <= today;
        return inRegion && inRange;
      });
    });

    // Summary cards
    const summaryCards = computed(() => {
      // Example: total shipments, on-time rate, open exceptions, late shipments
      const data = filteredData.value;
      const totalShipments = data.reduce((sum: number, d: any) => sum + d.shipments.total, 0);
      const onTimeRate = data.length ? (data.reduce((sum: number, d: any) => sum + d.on_time_delivery.rate, 0) / data.length) : 0;
      const openExceptions = data.reduce((sum: number, d: any) => sum + d.exceptions.open, 0);
      const lateShipments = data.reduce((sum: number, d: any) => sum + d.on_time_delivery.late_count, 0);
      // Trends: compare last month to previous
      const lastMonth = data[data.length - 1];
      const prevMonth = data[data.length - 2];
      return [
        {
          title: 'Total Shipments',
          value: totalShipments.toLocaleString(),
          subtitle: 'All selected regions',
          trend: lastMonth && prevMonth ? lastMonth.shipments.total - prevMonth.shipments.total : 0,
          color: 'primary',
        },
        {
          title: 'On-Time Delivery Rate',
          value: (onTimeRate * 100).toFixed(1) + '%',
          subtitle: 'Avg. for period',
          trend: lastMonth && prevMonth ? lastMonth.on_time_delivery.rate - prevMonth.on_time_delivery.rate : 0,
          color: 'success',
        },
        {
          title: 'Open Exceptions',
          value: openExceptions,
          subtitle: 'Current period',
          trend: lastMonth && prevMonth ? lastMonth.exceptions.open - prevMonth.exceptions.open : 0,
          color: 'error',
        },
        {
          title: 'Late Shipments',
          value: lateShipments,
          subtitle: 'Current period',
          trend: lastMonth && prevMonth ? lastMonth.on_time_delivery.late_count - prevMonth.on_time_delivery.late_count : 0,
          color: 'warning',
        },
      ];
    });

    // Chart data (dummy, to be implemented)
    // Shipment Volume Trend (Line)
    const shipmentVolumeChartData = computed(() => {
      const data = filteredData.value;
      // Group by month
      const months = Array.from(new Set(data.map((d: any) => d.month))).sort();
      // Always use an array for regionSet
      let regionSet: string[];
      if (selectedRegion.value === 'All') {
        regionSet = ['North', 'South', 'East', 'West'];
      } else {
        regionSet = [selectedRegion.value];
      }
      // Cohesive palette: blue, teal, grey, cyan
      const palette = ['#1976d2', '#26a69a', '#90a4ae', '#00bcd4'];
      const datasets = regionSet.map((region: string, idx: number) => {
        const color = palette[idx % palette.length];
        return {
          label: region,
          data: months.map((m: string) => {
            const found = data.find((d: any) => d.month === m && d.region === region);
            return found ? found.shipments.total : 0;
          }),
          borderColor: color,
          backgroundColor: color + '55',
          tension: 0.3,
          fill: false,
        };
      });
      return {
        labels: months,
        datasets,
      };
    });

    // On-Time Delivery Rate (Bar)
    const onTimeRateChartData = computed(() => {
      const data = filteredData.value;
      const months = Array.from(new Set(data.map((d: any) => d.month))).sort();
      let regionSet: string[];
      if (selectedRegion.value === 'All') {
        regionSet = ['North', 'South', 'East', 'West'];
      } else {
        regionSet = [selectedRegion.value];
      }
      const palette = ['#1976d2', '#26a69a', '#90a4ae', '#00bcd4'];
      return {
        labels: months,
        datasets: regionSet.map((region: string, idx: number) => {
          const color = palette[idx % palette.length];
          return {
            label: region,
            data: months.map((m: string) => {
              const found = data.find((d: any) => d.month === m && d.region === region);
              return found ? Math.round(found.on_time_delivery.rate * 100) : 0;
            }),
            backgroundColor: color,
          };
        }),
      };
    });

    // Regional Performance (Bar)
    const regionalPerformanceChartData = computed(() => {
      const data = filteredData.value;
      // Always use an array for regionSet
      let regionSet: string[];
      if (selectedRegion.value === 'All') {
        regionSet = ['North', 'South', 'East', 'West'];
      } else {
        regionSet = [selectedRegion.value];
      }
      const palette = ['#1976d2', '#26a69a', '#90a4ae', '#00bcd4'];
      const paletteLight = ['#64b5f6', '#4dd0e1', '#b0bec5', '#80cbc4'];
      return {
        labels: regionSet,
        datasets: [
          {
            label: 'Total Shipments',
            data: regionSet.map((region: string) => {
              return data.filter((d: any) => d.region === region).reduce((sum: number, d: any) => sum + d.shipments.total, 0);
            }),
            backgroundColor: palette,
          },
          {
            label: 'On-Time Rate (%)',
            data: regionSet.map((region: string) => {
              const regionData = data.filter((d: any) => d.region === region);
              return regionData.length ? Math.round(regionData.reduce((sum: number, d: any) => sum + d.on_time_delivery.rate, 0) / regionData.length * 100) : 0;
            }),
            backgroundColor: paletteLight,
          },
        ],
      };
    });

    // Open Exceptions (Bar)
    const exceptionsChartData = computed(() => {
      const data = filteredData.value;
      const months = Array.from(new Set(data.map((d: any) => d.month))).sort();
      // Exception types
      const types = ['open', 'damaged', 'delayed', 'lost', 'customs_hold'];
      const palette = ['#1976d2', '#26a69a', '#90a4ae', '#00bcd4', '#78909c'];
      return {
        labels: months,
        datasets: types.map((type: string, idx: number) => {
          const color = palette[idx % palette.length];
          return {
            label: type.charAt(0).toUpperCase() + type.slice(1),
            data: months.map((m: string) => {
              return data.filter((d: any) => d.month === m).reduce((sum: number, d: any) => sum + (d.exceptions[type] || 0), 0);
            }),
            backgroundColor: color,
          };
        }),
      };
    });

    const dateRangeLabel = computed(() => {
      const [start, end] = dateRange.value;
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    });

    return {
      selectedRegion,
      regionOptions,
      selectedDateRange,
      dateRangeOptions,
      summaryCards,
      shipmentVolumeChartData,
      onTimeRateChartData,
      regionalPerformanceChartData,
      exceptionsChartData,
    };
  },
});
</script>

<style scoped>
.dashboard-bg,
html,
body,
#app,
.v-application,
.v-main,
.v-container {
  background: #181818 !important;
  min-height: 100vh;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}
.summary-card-dark {
  background-color: #23232b !important;
  color: #fff !important;
}
.v-application {
  background: #181818;
}
/* Make summary cards the same height */
.summary-card {
  min-height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.summary-card-dark {
  background-color: #23232b !important;
  /* Matches the chart card background */
}

/* Make chart cards in 2nd row same height */
.chart-card {
  min-height: 340px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>
