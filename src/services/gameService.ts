import { Game, GameConfig } from "@/domain/game";

const createGame = (name: string, maxTries: number) => {
  return new Game({
    name,
    config: new GameConfig({
      maxTries,
      options: [1, 5],
    }),
  });
};

export { createGame };
