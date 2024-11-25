import {
  Simulation,
  SimulationConfig,
  SimulationHooks,
} from "@/domain/simulation";
import { createGame } from "./gameService";

const createSimulation = (tries: number, hooks?: SimulationHooks) => {
  const game = createGame(`game-simulation-with-${tries}`, tries);

  return new Simulation(
    game,
    new SimulationConfig({
      // Create a same distribution for all options
      weights: Array(game.config.options.length).fill(1 / 2),
      ticks: 1_000,
      hooks,
    })
  );
};

export { createSimulation };
