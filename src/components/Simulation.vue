<script setup lang="ts">
  import { ref } from "vue";
  import { SimulationProgress as SimulationProgressEvent } from "@/domain/simulation";
  import { createSimulation } from "@/services/simulationService";

  import SimulationProgress from "@/components/SimulationProgress.vue";

  interface Props {
    tries: number;
  }

  const props = defineProps<Props>();

  const hasFinished = ref(false);
  const progress = ref<SimulationProgressEvent>({
    currentTries: 0,
    maxTries: props.tries,
  });

  function onProgress(event: Promise<SimulationProgressEvent>) {
    event.then((value) => {
      progress.value = value;
    });
  }

  function onFinish() {
    // Add a delay to show the animation
    setTimeout(() => {
      hasFinished.value = true;
    }, 1000);
  }

  const simulation = createSimulation(props.tries, {
    onProgress,
    onFinish,
  });

  simulation.start();
</script>

<template>
  <section class="simulation-details">
    <!-- Simulation progress -->
    <SimulationProgress
      :tries="progress.currentTries"
      :max-tries="tries"
      v-show="!hasFinished" />

    {{ simulation.game.result }}
  </section>
</template>
