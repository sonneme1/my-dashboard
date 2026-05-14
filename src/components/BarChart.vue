<template>
  <bar :data="chartData" :options="options" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default defineComponent({
  name: 'BarChart',
  components: { Bar },
  props: {
    chartData: { type: Object as PropType<any>, required: true },
  },
  setup() {
    const options = {
      responsive: true,
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
      },
      scales: {
        x: { grid: { color: '#333' }, ticks: { color: '#fff' } },
        y: { grid: { color: '#333' }, ticks: { color: '#fff' } },
      },
    };
    return { options };
  },
});
</script>
