import { formatPercent } from "@/utils/numbers";
import { Game } from "./game";

type AnalysisResult<Constrains> = {
  isViable: boolean;
  viabilityReason: string;
  constraints: Constrains;
};

abstract class Analysis {
  constructor(public game: Game) {}

  abstract analyze(): AnalysisResult<Object>;

  abstract isViable(): boolean;

  abstract getViabilityReason(): string;
}

type WaitedValueConstraints = {
  expectedValue: number;
  realValue: number;
  absError: number;
};

class WaitedValue extends Analysis {
  private readonly expectedValue = 4.485;
  private readonly errorMargin = 0.05;

  private absError: number;

  constructor(game: Game) {
    super(game);

    this.absError = 0;
  }

  analyze(): AnalysisResult<WaitedValueConstraints> {
    const realValue = this.calculateRealValue(this.game.result.combinations);
    this.absError = this.calculateError(this.expectedValue, realValue);

    return {
      isViable: this.isViable(),
      viabilityReason: this.getViabilityReason(),
      constraints: {
        expectedValue: this.expectedValue,
        realValue,
        absError: this.absError,
      },
    };
  }

  isViable(): boolean {
    return this.absError < this.errorMargin;
  }

  getViabilityReason(): string {
    const errorAsPercent = formatPercent(this.errorMargin);

    if (this.isViable()) {
      return `El experimiento es confiable porque no supera el margen de error del ${errorAsPercent}`;
    }

    return `El experimiento no es confiable porque supera el margen de error del ${errorAsPercent}`;
  }

  calculateError(expectedValue: number, realValue: number) {
    return Math.abs((expectedValue - realValue) / expectedValue);
  }

  calculateRealValue(combinations: { [key: string]: number }) {
    let code = 1;
    let accumulated = 0;

    for (const [_, count] of Object.entries(combinations)) {
      accumulated += code * count;
      code++;
    }

    return accumulated / this.game.config.maxTries;
  }
}

export { WaitedValue };
