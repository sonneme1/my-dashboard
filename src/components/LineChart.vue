<template>
  <line :data="chartData" :options="options" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default defineComponent({
  name: 'LineChart',
  components: { Line },
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
