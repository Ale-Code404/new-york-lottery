import { WaitedValue } from "@/domain/analysis";
import { Game } from "@/domain/game";

type PossibleAnalysis = "waited-value";

const createAnalysis = (game: Game, analysis: PossibleAnalysis) => {
  switch (analysis) {
    case "waited-value":
      return new WaitedValue(game);
    default:
      throw new Error(`Analysis ${analysis} not found`);
  }
};

export { createAnalysis };
