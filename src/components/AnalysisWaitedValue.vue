<script setup lang="ts">
  import { Game } from "@/domain/game";

  import Card from "primevue/card";
  import Panel from "primevue/panel";
  import Badge from "primevue/badge";

  import { formatNumber, formatPercent } from "@/utils/numbers";
  import { createAnalysis } from "@/services/analysisService";

  const errorMargin = 0.05;

  interface Props {
    game: Game;
  }

  const props = defineProps<Props>();

  const analysis = createAnalysis(props.game, "waited-value");
  const results = analysis.analyze();
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="grid grid-cols-2 gap-x-8 pt-4">
      <div class="flex flex-col gap-6">
        <Card class="!bg-slate-700">
          <template #content>
            <div class="flex justify-between">
              <span>Valor esperado</span>
              <Badge
                :value="formatNumber(results.constraints.expectedValue)"
                severity="contrast" />
            </div>
          </template>
        </Card>

        <Card class="!bg-slate-700">
          <template #content>
            <div class="flex justify-between">
              <span>Valor obtenido</span>
              <Badge
                :value="formatNumber(results.constraints.realValue)"
                severity="contrast" />
            </div>
          </template>
        </Card>
      </div>

      <div class="flex flex-col gap-6">
        <Card class="!bg-slate-700">
          <template #content>
            <div class="flex justify-between">
              <span>Margén de error</span>
              <Badge
                :value="`${errorMargin * 100}%`"
                severity="contrast" />
            </div>
          </template>
        </Card>

        <Card
          :class="{
            '!bg-red-700': !results.isViable,
            '!bg-green-700': results.isViable,
          }">
          <template #content>
            <div class="flex justify-between">
              <span>Error absoluto</span>
              <div class="flex gap-2">
                <Badge
                  :value="formatNumber(results.constraints.absError)"
                  severity="contrast" />
                /
                <Badge
                  :value="formatPercent(results.constraints.absError)"
                  severity="contrast" />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <Panel
      header="Conclusión"
      class="!bg-slate-800">
      {{ results.viabilityReason }}
    </Panel>
  </div>
</template>
