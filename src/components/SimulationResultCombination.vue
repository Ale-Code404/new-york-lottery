<script setup lang="ts">
  import Card from "primevue/card";
  import Badge from "primevue/badge";
  import { formatNumber } from "@/utils/numbers";

  interface Props {
    name: string;
    count: number;
  }

  const props = defineProps<Props>();
</script>

<template>
  <Card class="!bg-slate-700">
    <template #content>
      <div class="flex justify-between">
        <span>{{ props.name }}</span>
        <Badge
          :value="formatNumber(props.count)"
          severity="contrast" />
      </div>
    </template>
  </Card>
</template>
