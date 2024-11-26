class Game {
  name: string;
  config: GameConfig;
  result: GameResult;

  tries: GameTry[];
  cards: GameCard[];

  possibleCards: GameCard[];
  possibleCombinations: string[];

  constructor({ name, config }: { name: string; config: GameConfig }) {
    this.name = name;
    this.config = config;

    this.tries = [];
    this.cards = [];

    // Use a pre-generated list of possible cards
    this.possibleCards = this.createPossibleCards();
    this.possibleCombinations = this.createPossibleCombinations();

    this.result = new GameResult(this.possibleCombinations);
  }

  play(option: GameTry): GameTryResult {
    if (this.tries.length >= this.config.maxTries) {
      throw new GameAlreadyFinished();
    }

    const card = this.getRandomCard();
    // Add card to the game
    this.cards.push(card);

    const tryResult = card.markWith(option);
    // Count result
    this.result.count(tryResult);

    return tryResult;
  }

  // A game can only be played with a possible card combination
  getRandomCard() {
    return this.possibleCards[
      Math.floor(Math.random() * this.possibleCards.length)
    ];
  }

  createPossibleCards() {
    return [
      new GameCard(this.config, [
        [1, 5],
        [1, 5],
        [1, 5],
      ]),
      new GameCard(this.config, [
        [5, 1],
        [5, 1],
        [5, 1],
      ]),
      new GameCard(this.config, [
        [1, 5],
        [1, 5],
        [5, 1],
      ]),
      new GameCard(this.config, [
        [1, 5],
        [5, 1],
        [1, 5],
      ]),
      new GameCard(this.config, [
        [1, 5],
        [5, 1],
        [5, 1],
      ]),
      new GameCard(this.config, [
        [5, 1],
        [1, 5],
        [5, 1],
      ]),
      new GameCard(this.config, [
        [5, 1],
        [5, 1],
        [1, 5],
      ]),
      new GameCard(this.config, [
        [5, 1],
        [1, 5],
        [1, 5],
      ]),
    ];
  }

  createPossibleCombinations() {
    return ["111", "115", "151", "155", "511", "515", "551", "555"];
  }
}

class GameCard {
  config: GameConfig;
  options: number[][];
  constraints: GameCardConstraints;

  gameTry?: GameTry;

  constructor(config: GameConfig, options?: number[][]) {
    this.config = config;
    this.constraints = new GameCardConstraints(config.options.length);

    this.options = options || this.getRandomOptions();
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

  // Check if the combination is a win
  isWinCombination(combination: string) {
    // Combination is a win when all the options are the same
    return combination.split("").every((option) => option == combination.at(0));
  }

  markWith(option: GameTry): GameTryResult {
    if (!this.isOptionValid(option)) {
      throw new GameTryInvalid();
    }

    // Set the game try for the card
    this.gameTry = option;
    const combination = option.getCombinationOn(this);

    return {
      combination,
      wins: this.isWinCombination(combination),
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

  getCombinationOn(card: GameCard) {
    return card.options.reduce((combination, row, rowIndex) => {
      // Get the option value
      const option = row[this.getColumnAsIndex(rowIndex)];
      // Append the option to the combination
      return combination.concat(option.toString());
    }, "");
  }
}

type GameTryResult = {
  combination: string;
  wins: boolean;
};

class GameResult {
  combinations: { [key: string]: number };
  wins: { [key: string]: number };
  losses: number;

  constructor(combinations: string[]) {
    this.combinations = this.initializeCombinations(combinations);
    this.wins = {};
    this.losses = 0;
  }

  initializeCombinations(combinations: string[]) {
    return combinations.reduce((wins: GameResult["wins"], combination) => {
      // Initialize wins for each combination
      wins[combination] = 0;
      return wins;
    }, {});
  }

  count(result: GameTryResult) {
    if (!result.wins) {
      this.losses++;
    }

    if (result.wins) {
      if (!this.wins[result.combination]) {
        this.wins[result.combination] = 0;
      }

      this.wins[result.combination]++;
    }

    // Count the combination
    this.combinations[result.combination]++;
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

export { Game, GameConfig, GameTry, GameCard, GameResult };
