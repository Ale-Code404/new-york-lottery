<script setup lang="ts">
  import { ref, computed } from "vue";

  import Panel from "primevue/panel";
  import InputNumber from "primevue/inputnumber";
  import Button from "primevue/button";
  import Message from "primevue/message";

  import Simulation from "@/components/Simulation.vue";
  import Analysis from "@/components/Analysis.vue";

  import { formatNumber } from "./utils/numbers";
  import { Game } from "./domain/game";

  const MIN_TRIES = 100;
  const MAX_TRIES = 1_000_000;
  const tries = ref(10_000);

  const canStartSimulation = computed(() => tries.value >= MIN_TRIES);

  const simulationStatus = ref<"idle" | "running" | "finished">("idle");
  const gameSimulated = ref<Game>();

  function onStartSimulation() {
    simulationStatus.value = "running";
  }

  function onFinishSimulation(game: Game) {
    gameSimulated.value = game;
    simulationStatus.value = "finished";
  }

  function is(status: string) {
    return simulationStatus.value === status;
  }
</script>

<template>
  <div class="max-w-4xl mx-auto p-8">
    <header class="bg-primary p-4 text-center rounded-md">
      <h1 class="prose text-color-emphasis font-bold text-2xl">
        Loteria de New York
      </h1>
    </header>

    <main class="mt-12 prose max-w-full prose-h2:mt-4">
      <h2>¿Qué es?</h2>
      <p>
        Este <b>simulador</b> permite realizar una gran cantidad de intentos
        para determinar la viabilidad del juego, para ello hace uso de pruebas
        de bondad y ajuste las cuales son técnicas estadísticas que permiten
        determinar el punto critico del experimento.
      </p>

      <h2>¿Cómo funciona?</h2>
      <ol>
        <li>Realizar una simulación de <b>n</b> cantidad de intentos.</li>
        <li>Aplicar un prueba de bondad para determinar el punto critico.</li>
        <li>Analisar los resultados</li>
      </ol>

      <div class="flex flex-col gap-8">
        <Panel header="Empezar la simulación">
          <div class="flex items-start gap-4">
            <div class="flex flex-col gap-2 flex-1">
              <InputNumber
                v-model="tries"
                type="number"
                label="Número de intentos"
                suffix=" intentos"
                :min="MIN_TRIES"
                :max="MAX_TRIES" />
              <Message
                size="small"
                severity="secondary"
                variant="simple">
                Desde {{ formatNumber(MIN_TRIES) }} hasta
                {{ formatNumber(MAX_TRIES) }}
              </Message>
            </div>

            <Button
              label="Simular"
              :disabled="!canStartSimulation"
              :loading="is('running')"
              @click="onStartSimulation" />
          </div>
        </Panel>

        <Panel header="Resultados de la simulación">
          <Message
            severity="secondary"
            v-show="!canStartSimulation || is('idle')">
            ❗️ Primero debes realizar una simulación
          </Message>

          <Simulation
            :tries="tries"
            @onFinish="onFinishSimulation"
            v-if="canStartSimulation && !is('idle')" />
        </Panel>

        <Panel
          header="Analsis de resultados"
          v-if="is('finished') && gameSimulated">
          <Analysis :game="gameSimulated" />
        </Panel>
      </div>
    </main>
  </div>
</template>
