<script setup lang="ts">
  import { Game } from "@/domain/game";

  import Fieldset from "primevue/fieldset";

  import AnalysisWaitedValue from "@/components/AnalysisWaitedValue.vue";

  interface Props {
    game: Game;
  }

  const props = defineProps<Props>();
</script>

<template>
  <div class="flex flex-col gap-8">
    <Fieldset
      legend="Valor esperado"
      toggleable>
      <AnalysisWaitedValue :game="props.game" />
    </Fieldset>
  </div>
</template>
