const readline = require('readline-sync');

class Player {
  constructor(name, mark) {
    this.name = name;
    this.marker = mark;
  }

  getName() {
    return this.name;
  }

  getMarker() {
    return this.marker;
  }

  displayInvalidSpaceMessage() {

  }
}

class HumanPlayer extends Player {
  constructor(name = "Player", mark = "X") {
    super(name, mark);
  }

  getMove() {
    console.log("Your turn. Input move: ('row,col', where row/col are 0, 1 or 2)");
    let answer;

    while (true) {
      answer = readline.question().split(",").map((num) => Number(num));

      if (answer.every((num) => [0, 1, 2].includes(num))) break;

      console.log("Invalid answer, please try again. ('row, col', where row/col are 0, 1 or 2)");
    }

    return {
      row: answer[0],
      col: answer[1]
    };
  }

  displayInvalidSpaceMessage() {
    console.log("Space was already filled. Please try again.");
  }
}

class ComputerPlayer extends Player {
  constructor(name = "Computer", mark = "O") {
    super(name, mark);
  }

  getMove() {
    let row = null;
    let col = null;

    while (![row, col].every((num) => [0, 1, 2].includes(num))) {
      row = Math.floor(Math.random() * 3);
      col = Math.floor(Math.random() * 3);
    }

    return {
      row,
      col
    };
  }
}

class Board {
  constructor(humanMarker = "X", computerMarker = "O") {
    this.board = [];
    this.blank = " ";
    this.humanMarker = humanMarker;
    this.computerMarker = computerMarker;
    this.winningRows =
      [ [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
        [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
        [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
        [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
        [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
        [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
        [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }]
      ];

    for (let index = 0; index < 3; index += 1) {
      this.board.push((new Array(3)).fill(this.blank));
    }
  }

  displayBoard() {
    console.log("     |     |     ");
    console.log(`  ${this.board[0][0]}  |  ${this.board[0][1]}  |  ${this.board[0][2]}  `);
    console.log("     |     |     ");
    console.log("-----|-----|-----");
    console.log("     |     |     ");
    console.log(`  ${this.board[1][0]}  |  ${this.board[1][1]}  |  ${this.board[1][2]}  `);
    console.log("     |     |     ");
    console.log("-----|-----|-----");
    console.log("     |     |     ");
    console.log(`  ${this.board[2][0]}  |  ${this.board[2][1]}  |  ${this.board[2][2]}  `);
    console.log("     |     |     ");
  }

  getMoveString(row, col) {
    return `row ${row}, column ${col}`;
  }

  isFilled(row, col) {
    return this.board[row][col] !== this.blank;
  }

  fillBoard(row, col, val) {
    if (!this.isFilled(row, col)) {
      this.board[row][col] = val;
      return true;
    } else {
      return false;
    }
  }

  getWinner() {
    const rowHasWinner =
      (row, mark) => row.every((space) =>
        this.board[space.row][space.col] === mark);

    const getRowWinner = (row) => {
      if (rowHasWinner(row, this.humanMarker)) {
        return this.humanMarker;
      } else if (rowHasWinner(row, this.computerMarker)) {
        return this.computerMarker;
      } else {
        return false;
      }
    };

    for (let index = 0; index < this.winningRows.length; index += 1) {
      let rowWinner = getRowWinner(this.winningRows[index]);

      if (rowWinner) return rowWinner;
    }

    return this.isTied() ? "Tie" : null;
  }

  isTied() {
    for (let row = 0; row < this.board.length; row += 1) {
      for (let col = 0; col < this.board[row].length; col += 1) {
        if (this.board[row][col] === this.blank) {
          return false;
        }
      }
    }

    return true;
  }

  resetBoard() {
    for (let row = 0; row < this.board.length; row += 1) {
      for (let col = 0; col < this.board[row].length; col += 1) {
        this.board[row][col] = this.blank;
      }
    }
  }
}

class TicTacToeGame {
  constructor() {
    this.human = new HumanPlayer();
    this.computer = new ComputerPlayer();
    this.board = new Board(this.human.getMarker(), this.computer.getMarker());
    this.currentPlayer = this.human;
  }

  displayWelcomeMessage() {
    console.log("Welcome to Tic Tac Toe!");
  }

  displayGoodbyeMessage() {
    console.log("Thank you for playing Tic Tac Toe!");
  }

  displayMoveMessage(player, row, col) {
    console.log(`${player.getName()} moved to ${this.board.getMoveString(row, col)}.`);
  }

  displayWinner(winner) {
    this.board.displayBoard();

    if (winner === this.human.getMarker()) {
      console.log(`The winner is ${this.human.getName()}!`);
    } else if (winner === this.computer.getMarker()) {
      console.log(`The winner is ${this.computer.getName()}!`);
    } else {
      console.log("The game is a tie!");
    }
  }

  playAgain() {
    console.log("Would you like to play again? (y/n)");
    let answer;

    while (true) {
      answer = readline.question().toLowerCase();

      if (['y', 'n'].includes(answer)) break;

      console.log("Invalid answer, please try again. (y/n)");
    }

    return answer === 'y';
  }

  swapCurrentPlayer() {
    this.currentPlayer =
      this.currentPlayer === this.human ? this.computer : this.human;
  }

  resetCurrentPlayer() {
    this.currentPlayer = this.human;
  }

  move(player) {
    let validMove;
    let playerMove;

    while (true) {
      playerMove = player.getMove();
      validMove =
        this.board.fillBoard(playerMove.row, playerMove.col, player.marker);

      if (validMove) break;

      player.displayInvalidSpaceMessage();
    }

    this.displayMoveMessage(player, playerMove.row, playerMove.col);
  }

  play() {
    this.displayWelcomeMessage();

    while (true) {
      this.board.resetBoard();
      this.resetCurrentPlayer();

      while (true) {
        this.board.displayBoard();
        this.move(this.currentPlayer);

        let winner = this.board.getWinner();

        if (winner) {
          this.displayWinner(winner);
          break;
        }

        this.swapCurrentPlayer();
      }

      if (!this.playAgain()) break;

      console.clear();
    }

    this.displayGoodbyeMessage();
  }
}

let game = new TicTacToeGame();

game.play();