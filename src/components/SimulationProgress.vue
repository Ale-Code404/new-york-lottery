<script setup lang="ts">
  import { computed } from "vue";
  import ProgressBar from "primevue/progressbar";
  import { formatNumber } from "@/utils/numbers";

  interface Props {
    tries: number;
    maxTries: number;
  }

  const props = defineProps<Props>();

  const progress = computed(() => {
    return Math.round((props.tries / props.maxTries) * 100);
  });
</script>

<template>
  <div class="flex flex-col gap-2">
    <ProgressBar
      :value="progress"
      class="h-4" />

    <div class="flex justify-between text-sm">
      <span>0</span>
      <span>{{ formatNumber(tries) }} / {{ formatNumber(maxTries) }}</span>
    </div>
  </div>
</template>
