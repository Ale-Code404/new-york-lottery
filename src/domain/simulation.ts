import { Game, GameTry } from "./game";

class Simulation {
  game: Game;
  config: SimulationConfig;

  constructor(game: Game, config: SimulationConfig) {
    this.game = game;
    this.config = config;
  }

  start() {
    const runner = new SimulationRunner(
      this.game.config.maxTries,
      this.config.ticks,
      this.config.hooks
    );

    runner.run(() => {
      const gameTry = this.try();

      if (this.config.hooks?.onTry) {
        this.config.hooks.onTry(Promise.resolve(gameTry));
      }
    });
  }

  /**
   * Given a card, creates a try selecting a random option based on the weights
   */
  try(): GameTry {
    return new GameTry([1, 2, 1]);
  }
}

class SimulationConfig {
  weights: number[];
  ticks: number;
  hooks?: SimulationHooks;

  constructor({
    weights,
    ticks = 1_000,
    hooks = undefined,
  }: {
    weights: number[];
    ticks?: number;
    hooks?: SimulationHooks;
  }) {
    this.weights = weights;
    this.ticks = ticks;
    this.hooks = hooks;
  }
}

class SimulationRunner {
  tries: number;
  currentTries: number;
  chunkSize: number;
  hooks?: SimulationRunnerHooks;

  constructor(
    tries: number,
    chunkSize: number = 1_000,
    hooks?: SimulationRunnerHooks
  ) {
    this.tries = tries;
    this.chunkSize = chunkSize;
    this.currentTries = 0;
    this.hooks = hooks;
  }

  run(task: () => void) {
    const toEnd = Math.min(this.currentTries + this.chunkSize, this.tries);

    for (let i = this.currentTries; i < toEnd; i++) {
      task();
    }

    this.currentTries = toEnd;

    if (this.hooks?.onProgress) {
      this.hooks.onProgress(
        Promise.resolve({
          currentTries: this.currentTries,
          maxTries: this.tries,
        })
      );
    }

    if (this.currentTries < this.tries) {
      setTimeout(() => this.run(task), 0);
    } else {
      if (this.hooks?.onFinish) {
        this.hooks.onFinish(Promise.resolve());
      }
    }
  }
}

type SimulationProgress = {
  currentTries: number;
  maxTries: number;
};

type SimulationGameHooks = {
  onTry?: (event: Promise<GameTry>) => void;
};

type SimulationRunnerHooks = {
  onProgress?: (event: Promise<SimulationProgress>) => void;
  onFinish?: (event: Promise<void>) => void;
};

type SimulationHooks = SimulationGameHooks & SimulationRunnerHooks;

export {
  Simulation,
  SimulationConfig,
  type SimulationHooks,
  type SimulationProgress,
};
