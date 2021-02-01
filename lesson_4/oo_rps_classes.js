/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
const readline = require('readline-sync');

class Player {
  constructor () {
    this.move = null;
    this.moveHistory = [];
    this.score = 0;
  }

  getMove () {
    return this.move;
  }

  getMoveHistory () {
    return this.moveHistory;
  }

  updateMoveHistory (result) {
    this.moveHistory.push({
      move: this.move,
      result: result,
    });
  }

  getScore () {
    return this.score;
  }

  incrementScore () {
    this.score += 1;
  }

  resetScore () {
    this.score = 0;
  }
}

class Computer extends Player {
  constructor (winningMoves) {
    super();
    this.weights = {};
    this.choices = Object.keys(winningMoves);

    for (let key in winningMoves) {
      this.weights[key] = 1;
    }
  }

  choose () {
    let randomIndex = Math.floor(Math.random() * this.choices.length);
    this.move = this.choices[randomIndex];
  }

  getPoints () {
    return this.getMoveHistory().reduce((weights, round) => {
      if (!weights.hasOwnProperty(round.result)) {
        weights[round.result] = 0;
      }

      if (round.result === "W") {
        weights[round.move] += 1;
      } else if (round.result === "L") {
        weights[round.move] -= 1;
      }

      return weights;
    }, {});
  }

  updateChoices () {
    this.choices = [];

    for (let key in this.weights) {
      for (let reps = 0; reps < this.weights[key]; reps += 1) {
        this.choices.push(key);
      }
    }
  }

  updateWeights () {
    let newPoints = this.getPoints();

    for (let key in this.weights) {
      this.weights[key] = Math.max(newPoints[key], 1) || this.weights[key];
    }

    this.updateChoices();
  }
}

class Human extends Player {
  constructor (winningMoves) {
    super();
    this.possibleChoices = Object.keys(winningMoves);
  }

  choose () {
    let choice;

    while (true) {
      console.log(`Choose a move (${this.possibleChoices.join(", ")}):`);
      choice = readline.question().toLowerCase();

      if (this.possibleChoices.includes(choice)) break;

      console.log('Sorry, invalid choice.');
    }

    this.move = choice;
  }
}

// engine object that orchestrates the objects and implements program flow
class RPSGame {
  constructor () {
    this.winningMoves = {
      rock: ['scissors', 'lizard'],
      paper: ['rock', 'spock'],
      scissors: ['paper', 'lizard'],
      spock: ['scissors', 'rock'],
      lizard: ['paper', 'spock'],
    };
    this.winningScore = 5;
    this.human = new Human(this.winningMoves);
    this.computer = new Computer(this.winningMoves);
  }

  displayLine () {
    console.log("------------------------------------");
  }

  displayWelcomeMessage () {
    console.log('Welcome to Rock, Paper, Scissors!');
    console.log('Each round is worth one point. First player to 5 points wins!');
    this.displayLine();
  }

  displayGoodbyeMessage () {
    console.log(`Thanks for playing Rock, Paper, Scissors!`);
  }

  displayRoundWinner (roundWinner) {
    let humanMove = this.human.getMove();
    let computerMove = this.computer.getMove();

    console.log(`You chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);

    if (roundWinner === 'human') {
      console.log("You won!");
    } else if (roundWinner === 'computer') {
      console.log("The computer won!");
    } else {
      console.log("It's a tie.");
    }
  }

  displayScore () {
    console.log(`Your score: ${this.human.getScore()}`);
    console.log(`Computer score: ${this.computer.getScore()}`);
    this.displayLine();
  }

  displayMatchWinner () {
    let matchWinner = this.getMatchWinner();

    console.log(`${matchWinner === 'human' ? "You have" : "The computer has"} won the match with 5 points!`);
  }

  displayMoveHistories () {
    let playerMoves = this.human.getMoveHistory();
    let computerMoves = this.computer.getMoveHistory();

    this.displayLine();
    console.log("Round | Player   | Computer");

    for (let index = 0; index < playerMoves.length; index += 1) {
      console.log(`${String(index + 1).padStart(3).padEnd(5)} | ${playerMoves[index].move.padEnd(8)} | ${computerMoves[index].move}`);
    }

    this.displayLine();
  }

  matchHasWinner () {
    let playerScore = this.human.getScore();
    let computerScore = this.computer.getScore();

    return Math.max(playerScore, computerScore) >= this.winningScore;
  }

  getMatchWinner () {
    return this.human.getScore() >= this.winningScore ? "human" : "computer";
  }

  getRoundWinner () {
    let humanMove = this.human.getMove();
    let computerMove = this.computer.getMove();

    if (this.winningMoves[humanMove].includes(computerMove)) {
      return 'human';
    } else if (this.winningMoves[computerMove].includes(humanMove)) {
      return 'computer';
    } else {
      return null;
    }
  }

  updateScore (roundWinner) {
    this[roundWinner].incrementScore();
  }

  updateMoveHistories (roundWinner) {
    if (roundWinner === 'human') {
      this.human.updateMoveHistory("W");
      this.computer.updateMoveHistory("L");
    } else if (roundWinner === 'computer') {
      this.human.updateMoveHistory("L");
      this.computer.updateMoveHistory("W");
    } else {
      this.human.updateMoveHistory("T");
      this.computer.updateMoveHistory("T");
    }
  }

  resetMatch () {
    this.human.resetScore();
    this.computer.resetScore();
  }

  getUserInput (input) {
    console.log(`${input} (y/n)`);
    let answer = readline.question().toLowerCase();

    while (!['y', 'n'].includes(answer)) {
      console.log("Invalid input, try again. (y/n)");
      answer = readline.question().toLowerCase();
    }

    return answer === 'y';
  }

  play () {
    this.displayWelcomeMessage();

    while (true) {
      while (!this.matchHasWinner()) {
        this.human.choose();
        this.computer.choose();

        let roundWinner = this.getRoundWinner();
        this.displayRoundWinner(roundWinner);

        if (roundWinner) {
          this.updateScore(roundWinner);
        }
        this.displayScore();
        this.updateMoveHistories(roundWinner);
      }

      this.displayMatchWinner();
      this.computer.updateWeights();

      if (this.getUserInput("Would you like to see move histories?")) {
        this.displayMoveHistories();
      }

      this.resetMatch();

      if (!this.getUserInput("Would you like to play again?")) break;

      console.clear();
    }

    this.displayGoodbyeMessage();
  }
}

let game = new RPSGame();

game.play();