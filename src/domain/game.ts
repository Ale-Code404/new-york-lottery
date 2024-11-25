class Game {
  name: string;
  config: GameConfig;
  result: GameResult;

  tries: GameTry[];
  cards: GameCard[];

  constructor({ name, config }: { name: string; config: GameConfig }) {
    this.name = name;
    this.config = config;
    this.result = new GameResult(config);

    this.tries = [];
    this.cards = [];
  }

  play(option: GameTry): GameTryResult {
    if (this.tries.length >= this.config.maxTries) {
      throw new GameAlreadyFinished();
    }

    // Generates a new card
    const card = this.createCard();
    // Add card to the game
    this.cards.push(card);

    const tryResult = card.markWith(option);
    // Count result
    this.result.count(tryResult);

    return tryResult;
  }

  createCard() {
    return new GameCard(this.config);
  }
}

class GameCard {
  config: GameConfig;
  options: number[][];
  constraints: GameCardConstraints;
  gameTry?: GameTry;

  constructor(config: GameConfig) {
    this.config = config;
    this.constraints = new GameCardConstraints(config.options.length);
    this.options = this.getRandomOptions();
  }

  getConstraints() {
    return this.constraints;
  }

  isOptionValid(option: GameTry) {
    const hasSameCount =
      this.constraints.getNeededSelectionCount() == option.selections.length;

    const isEachSelectionValid = option.selections.every((selection) =>
      this.constraints.isValidColumn(selection)
    );

    return hasSameCount && isEachSelectionValid;
  }

  getRandomOptions() {
    const options = [];
    let columnOptions: number[] = [];

    for (let rowIndex = 0; rowIndex < this.constraints.getRows(); rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < this.constraints.getColumns();
        columnIndex++
      ) {
        columnOptions.push(this.getRandomOption(columnOptions));
      }

      options.push(columnOptions);
      // Reset column options
      columnOptions = [];
    }

    return options;
  }

  getRandomOption(ignore: number[] = []) {
    const options = this.config.options.filter(
      (option) => !ignore.includes(option)
    );

    if (options.length == 1) {
      return options[0];
    }

    return options[Math.floor(Math.random() * options.length)];
  }

  markWith(option: GameTry): GameTryResult {
    if (!this.isOptionValid(option)) {
      throw new GameTryInvalid();
    }

    let keyOption = null;
    let wins: GameTryResult["win"] = false;

    for (let rowIndex = 0; rowIndex < this.constraints.getRows(); rowIndex++) {
      const columnIndexSelectedInRow = option.getColumnAsIndex(rowIndex);
      const optionSelected = this.options[rowIndex][columnIndexSelectedInRow];

      if (rowIndex === 0) {
        keyOption = optionSelected;
        wins = keyOption;
      }

      if (keyOption !== optionSelected) {
        wins = false;
        break;
      }
    }

    return {
      win: wins,
    };
  }
}

class GameCardConstraints {
  columns: number;
  rows: number;

  constructor(optionsCount: number) {
    this.columns = optionsCount;
    this.rows = this.columns + 1;
  }

  getNeededSelectionCount() {
    return this.rows;
  }

  getColumns() {
    return this.columns;
  }

  getRows() {
    return this.rows;
  }

  isValidColumn(column: number) {
    return column > 0 && column <= this.columns;
  }
}

class GameConfig {
  maxTries: number;
  options: number[];

  constructor({ maxTries, options }: { maxTries: number; options: number[] }) {
    this.maxTries = maxTries;
    this.options = options;
  }
}

class GameTry {
  selections: number[];

  constructor(selections: number[]) {
    this.selections = selections;
  }

  getColumnAsIndex(rowIndex: number) {
    // The selections are indexed from 1 to n like human plays
    return this.selections[rowIndex] - 1;
  }
}

type GameTryResult = {
  win: number | false;
};

class GameResult {
  wins: { [key: number]: number };
  losses: number;

  constructor(config: GameConfig) {
    this.wins = this.getInitializedWins(config);
    this.losses = 0;
  }

  getInitializedWins(config: GameConfig) {
    return config.options.reduce((wins: GameResult["wins"], option) => {
      // Initialize wins for each option
      wins[option] = 0;
      return wins;
    }, {});
  }

  count(result: GameTryResult) {
    if (!result.win) {
      this.losses++;
      return;
    }

    // Increment wins
    this.wins[result.win]++;
  }
}

class GameAlreadyFinished extends Error {
  constructor() {
    super("Game already finished");
  }
}

class GameTryInvalid extends Error {
  constructor() {
    super("Try is invalid");
  }
}

export { Game, GameConfig, GameTry, GameCard };
