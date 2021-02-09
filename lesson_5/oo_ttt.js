let readline = require("readline-sync");

class Square {
  constructor(marker = Square.UNUSED_SQUARE) {
    this.marker = marker;
  }

  toString() {
    return this.marker;
  }

  setMarker(marker) {
    this.marker = marker;
  }

  isUnused() {
    return this.marker === Square.UNUSED_SQUARE;
  }

  getMarker() {
    return this.marker;
  }
}

Square.UNUSED_SQUARE = " ";
Square.HUMAN_MARKER = "X";
Square.COMPUTER_MARKER = "O";

class Board {
  constructor() {
    this.squares = {};
    for (let counter = 1; counter <= 9; ++counter) {
      this.squares[String(counter)] = new Square();
    }
  }

  display() {
    console.log("");
    console.log("     |     |");
    console.log(`  ${this.squares["1"]}  |  ${this.squares["2"]}  |  ${this.squares["3"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["4"]}  |  ${this.squares["5"]}  |  ${this.squares["6"]}`);
    console.log("     |     |");
    console.log("-----+-----+-----");
    console.log("     |     |");
    console.log(`  ${this.squares["7"]}  |  ${this.squares["8"]}  |  ${this.squares["9"]}`);
    console.log("     |     |");
    console.log("");
  }

  markSquareAt(key, marker) {
    this.squares[key].setMarker(marker);
  }

  reset() {
    Object.values(this.squares)
      .forEach((square) => square.setMarker(Square.UNUSED_SQUARE));
  }

  isFull() {
    return this.unusedSquares().length === 0;
  }

  unusedSquares() {
    let keys = Object.keys(this.squares);
    return keys.filter(key => this.squares[key].isUnused());
  }

  countMarkersFor(player, keys) {
    let markers = keys.filter(key => {
      return this.squares[key].getMarker() === player.getMarker();
    });

    return markers.length;
  }

  displayWithClear() {
    //console.clear();
    console.log("");
    console.log("");
    this.display();
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
  }

  getMarker() {
    return this.marker;
  }
}

class Human extends Player {
  constructor() {
    super(Square.HUMAN_MARKER);
  }
}

class Computer extends Player {
  constructor() {
    super(Square.COMPUTER_MARKER);
  }
}

class TTTGame {
  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
  }

  play() {
    this.displayWelcomeMessage();

    while (true) {
      this.playGame();

      if (!this.playAgain()) break;

      this.board.reset();
    }

    this.displayGoodbyeMessage();
  }

  playGame() {
    this.board.display();

    while (true) {
      this.humanMoves();
      if (this.gameOver()) break;

      this.computerMoves();
      if (this.gameOver()) break;

      this.board.displayWithClear();
    }

    this.board.displayWithClear();
    this.displayResults();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log("Welcome to Tic Tac Toe!");
    console.log("");
  }

  displayGoodbyeMessage() {
    console.log("Thanks for playing Tic Tac Toe! Goodbye!");
  }

  displayResults() {
    if (this.isWinner(this.human)) {
      console.log("You won! Congratulations!");
    } else if (this.isWinner(this.computer)) {
      console.log("I won! I won! Take that, human!");
    } else {
      console.log("A tie game. How boring.");
    }
  }

  joinOr(arr, delimiter = ', ', lastElementDelimiter = 'or') {
    let arrCopy = arr.slice();

    if (arrCopy.length < 2) {
      return arrCopy.join();
    } else {
      arrCopy[arrCopy.length - 1] =
        lastElementDelimiter + ' ' + arr[arrCopy.length - 1];

      if (arrCopy.length === 2) {
        return arrCopy.join(' ');
      } else {
        return arrCopy.join(delimiter);
      }
    }
  }

  getHumanPrompt(prompt, validChoices) {
    let choice;

    while (true) {
      choice = readline.question(`${prompt} (${this.joinOr(validChoices)}): `);

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    return choice;
  }

  playAgain() {
    let playAgainChoice =
      this.getHumanPrompt("Would you like to play again?", ["y", "n"]);

    return playAgainChoice === "y";
  }

  humanMoves() {
    let choice = this.getHumanPrompt("Choose a square", this.board.unusedSquares());

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let squaresToAttack = this.getSquaresToAttack();
    let squaresToDefend = this.getSquaresToDefend();
    let validChoices;

    if (squaresToAttack.length > 0) {
      validChoices = squaresToAttack;
    } else if (squaresToDefend.length > 0) {
      validChoices = squaresToDefend;
    } else {
      validChoices = this.board.unusedSquares();
    }

    let choiceIndex =
      Math.floor(validChoices.length * Math.random());
    let choice = validChoices[choiceIndex];

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  isVulnurableRow(row, attacker, defender) {
    return this.board.countMarkersFor(attacker, row) === 2 &&
      this.board.countMarkersFor(defender, row) === 0;
  }

  getEmptySquare(row) {
    return row.find((square) =>
      this.board.squares[square].isUnused(), this);
  }

  getSquaresToDefend() {
    return TTTGame.POSSIBLE_WINNING_ROWS.filter((row) =>
      this.isVulnurableRow(row, this.human, this.computer))
      .map((row) => this.getEmptySquare(row));
  }

  getSquaresToAttack() {
    return TTTGame.POSSIBLE_WINNING_ROWS.filter((row) =>
      this.isVulnurableRow(row, this.computer, this.human))
      .map((row) => this.getEmptySquare(row));
  }

  gameOver() {
    return this.board.isFull() || this.someoneWon();
  }

  someoneWon() {
    return this.isWinner(this.human) || this.isWinner(this.computer);
  }

  isWinner(player) {
    return TTTGame.POSSIBLE_WINNING_ROWS.some(row => {
      return this.board.countMarkersFor(player, row) === 3;
    });
  }
}

TTTGame.POSSIBLE_WINNING_ROWS = [
  [ "1", "2", "3" ],            // top row of board
  [ "4", "5", "6" ],            // center row of board
  [ "7", "8", "9" ],            // bottom row of board
  [ "1", "4", "7" ],            // left column of board
  [ "2", "5", "8" ],            // middle column of board
  [ "3", "6", "9" ],            // right column of board
  [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
  [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
];

let game = new TTTGame();
game.play();