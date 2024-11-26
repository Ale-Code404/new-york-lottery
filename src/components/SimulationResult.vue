<script setup lang="ts">
  import { GameResult } from "@/domain/game";

  import Fieldset from "primevue/fieldset";
  import Skeleton from "primevue/skeleton";
  import ScrollPanel from "primevue/scrollpanel";

  import SimulationResultCombination from "@/components/SimulationResultCombination.vue";
  import SimulationResultCombinationChart from "@/components/SimulationResultCombinationChart.vue";

  interface Props {
    loading: boolean;
    results: GameResult;
  }

  const props = defineProps<Props>();
</script>

<template>
  <div class="grid grid-cols-2 gap-x-8">
    <Fieldset legend="Acumulados">
      <div
        class="flex flex-col gap-4"
        v-if="!props.loading">
        <SimulationResultCombinationChart :combinations="props.results.wins" />

        <SimulationResultCombination
          v-for="(count, combination) in props.results.wins"
          :key="combination"
          :name="`Ganadas con ${combination}`"
          :count="count" />

        <SimulationResultCombination
          :name="`Perdidas`"
          :count="props.results.losses" />
      </div>

      <Skeleton
        width="100%"
        height="150px"
        v-else />
    </Fieldset>

    <Fieldset legend="Combinaciones">
      <div
        class="flex flex-col gap-4"
        v-if="!props.loading">
        <SimulationResultCombinationChart
          :combinations="props.results.combinations" />

        <ScrollPanel class="w-full h-60">
          <div class="flex flex-col gap-6">
            <SimulationResultCombination
              v-for="(count, combination) in props.results.combinations"
              :key="combination"
              :name="`Jugadas con ${combination}`"
              :count="count" />
          </div>
        </ScrollPanel>
      </div>

      <Skeleton
        width="100%"
        height="150px"
        v-else />
    </Fieldset>
  </div>
</template>
