let readline = require("readline-sync");

class Square {
  static UNUSED_SQUARE = " ";
  static HUMAN_MARKER = "X";
  static COMPUTER_MARKER = "O";
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

  static test() {
    console.log("hi");
  }
}

class Board {
  static MIDDLE_SQUARE = "5";

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
    console.clear();
    console.log("");
    console.log("");
    this.display();
  }
}

class Player {
  constructor(marker) {
    this.marker = marker;
    this.score = 0;
  }

  getMarker() {
    return this.marker;
  }

  getScore() {
    return this.score;
  }

  incrementScore() {
    this.score += 1;
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
  static POSSIBLE_WINNING_ROWS = [
    [ "1", "2", "3" ],            // top row of board
    [ "4", "5", "6" ],            // center row of board
    [ "7", "8", "9" ],            // bottom row of board
    [ "1", "4", "7" ],            // left column of board
    [ "2", "5", "8" ],            // middle column of board
    [ "3", "6", "9" ],            // right column of board
    [ "1", "5", "9" ],            // diagonal: top-left to bottom-right
    [ "3", "5", "7" ],            // diagonal: bottom-left to top-right
  ];
  static WINNING_SCORE = 3;

  constructor() {
    this.board = new Board();
    this.human = new Human();
    this.computer = new Computer();
    this.startingPlayer = this.human;
    this.currentPlayer = this.startingPlayer;
  }

  play() {
    this.displayWelcomeMessage();

    this.playMatch();

    this.displayGoodbyeMessage();
  }

  playMatch() {
    while (true) {
      this.playGame();

      if (this.hasMatchWinner()) {
        this.displayMatchWinner();
        break;
      } else if (!this.playAgain()) break;

      this.board.reset();
      this.alternateStartingPlayer();
      this.resetCurrentPlayer();
    }
  }

  playGame() {
    this.board.display();

    while (true) {
      this.playerMoves(this.currentPlayer);

      if (this.gameOver()) break;

      this.alternateCurrentPlayer();

      if (this.currentPlayer === this.human) {
        this.board.displayWithClear();
      }
    }

    this.updateGameWins();

    this.board.displayWithClear();
    this.displayResults();
    this.displayGameWins();
  }

  displayWelcomeMessage() {
    console.clear();
    console.log(`Welcome to Tic Tac Toe! First to win ${TTTGame.WINNING_SCORE} games wins the match.`);
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

  displayGameWins() {
    console.log("Current score:");
    console.log(`Player wins: ${this.human.getScore()}`);
    console.log(`Computer wins: ${this.computer.getScore()}`);
  }

  displayMatchWinner() {
    let matchWinnerString =
      this.getMatchWinner() === this.human ? "You have" : "The computer has";

    console.log(`The match is over! ${matchWinnerString} won the match!`);
  }

  getHumanPrompt(prompt, validChoices) {
    let choice;

    while (true) {
      choice = readline.question(`${prompt} (${this.joinOr(validChoices)}): `).toLowerCase();

      if (validChoices.includes(choice)) break;

      console.log("Sorry, that's not a valid choice.");
      console.log("");
    }

    return choice;
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

  playAgain() {
    let playAgainChoice =
      this.getHumanPrompt("Would you like to play again?", ["y", "n"]);

    return playAgainChoice === "y";
  }

  playerMoves(player) {
    if (player === this.human) {
      this.humanMoves();
    } else {
      this.computerMoves();
    }
  }

  humanMoves() {
    let choice = this.getHumanPrompt("Choose a square", this.board.unusedSquares());

    this.board.markSquareAt(choice, this.human.getMarker());
  }

  computerMoves() {
    let possibleMoves = this.getPossibleComputerMoves();
    let choice = this.selectComputerMove(possibleMoves);

    this.board.markSquareAt(choice, this.computer.getMarker());
  }

  getPossibleComputerMoves() {
    let squaresToAttack = this.getSquaresToAttack();
    let squaresToDefend = this.getSquaresToDefend();

    if (squaresToAttack.length > 0) {
      return squaresToAttack;
    } else if (squaresToDefend.length > 0) {
      return squaresToDefend;
    } else {
      return this.board.unusedSquares();
    }
  }

  selectComputerMove(possibleMoves) {
    if (possibleMoves.includes(Board.MIDDLE_SQUARE)) {
      return Board.MIDDLE_SQUARE;
    } else {
      let moveIndex = Math.floor(possibleMoves.length * Math.random());
      return possibleMoves[moveIndex];
    }
  }

  getSquaresToDefend() {
    return this.getVulnurableRows("defense");
  }

  getSquaresToAttack() {
    return this.getVulnurableRows("offense");
  }

  getVulnurableRows(moveType) {
    let attacker = moveType === "offense" ? this.computer : this.human;
    let defender = moveType === "defense" ? this.computer : this.human;

    return TTTGame.POSSIBLE_WINNING_ROWS.filter((row) =>
      this.isVulnurableRow(row, attacker, defender))
      .map((row) => this.getEmptySquare(row));
  }

  isVulnurableRow(row, attacker, defender) {
    return this.board.countMarkersFor(attacker, row) === row.length - 1 &&
      this.board.countMarkersFor(defender, row) === 0;
  }

  getEmptySquare(row) {
    return row.find((square) =>
      this.board.squares[square].isUnused(), this);
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

  updateGameWins() {
    if (this.isWinner(this.human)) {
      this.human.incrementScore();
    } else if (this.isWinner(this.computer)) {
      this.computer.incrementScore();
    }
  }

  getMatchWinner() {
    return [this.human, this.computer].find((player) =>
      player.getScore() >= TTTGame.WINNING_SCORE);
  }

  hasMatchWinner() {
    return !!this.getMatchWinner();
  }

  alternateStartingPlayer() {
    this.startingPlayer =
      this.startingPlayer === this.human ? this.computer : this.human;
  }

  alternateCurrentPlayer() {
    this.currentPlayer =
      this.currentPlayer === this.human ? this.computer : this.human;
  }

  resetCurrentPlayer() {
    this.currentPlayer = this.startingPlayer;
  }
}

let game = new TTTGame();
game.play();