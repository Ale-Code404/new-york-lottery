<script setup lang="ts">
  import { ref, onMounted } from "vue";

  import Chart from "primevue/chart";

  interface Props {
    combinations: { [key: string]: number };
  }

  const props = defineProps<Props>();
  const chartData = ref();

  const setChartData = () => {
    return {
      labels: Object.keys(props.combinations),
      datasets: [
        {
          data: Object.values(props.combinations),
        },
      ],
    };
  };

  onMounted(() => {
    chartData.value = setChartData();
  });
</script>

<template>
  <div class="flex justify-center p-4">
    <Chart
      type="doughnut"
      :data="chartData"
      :options="{ responsive: true }"
      class="w-90" />
  </div>
</template>
