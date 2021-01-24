/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
const readline = require('readline-sync');

function createPlayer() {
  return {
    move: null,
    moveHistory: [],
    score: 0,

    getMove () {
      return this.move;
    },

    getMoveHistory () {
      return this.moveHistory;
    },

    updateMoveHistory (result) {
      this.moveHistory.push([this.getMove(), result]);
    },

    getScore () {
      return this.score;
    },

    incrementScore () {
      this.score += 1;
    },

    resetScore () {
      this.score = 0;
    },
  };
}

function createComputer(winningMoves) {
  let playerObject = createPlayer();
  let initialWeights = {};

  for (let key in winningMoves) {
    initialWeights[key] = 1;
  }

  let computerObject = {
    weights: initialWeights,

    choose () {
      const choices = [];

      for (let key in this.weights) {
        for (let length = 0; length < this.weights[key]; length += 1) {
          choices.push(key);
        }
      }

      let randomIndex = Math.floor(Math.random() * choices.length);
      this.move =  choices[randomIndex];
    },

    getPoints () {
      return this.getMoveHistory().reduce((weights, round) => {
        if (!weights.hasOwnProperty(round[0])) {
          weights[round[0]] = 0;
        }

        if (round[1] === "W") {
          weights[round[0]] += 1;
        } else if (round[1] === "L") {
          weights[round[0]] -= 1;
        }

        return weights;
      }, {});
    },

    updateWeights () {
      let newPoints = this.getPoints();

      for (let key in this.weights) {
        this.weights[key] = Math.max(newPoints[key], 1) || this.weights[key];
      }
    },
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman(winningMoves) {
  let playerObject = createPlayer();

  let humanObject = {
    choose () {
      let choice;

      while (true) {
        console.log(`Choose a move (${Object.keys(winningMoves).join(", ")}):`);
        choice = readline.question();

        if (Object.keys(winningMoves).includes(choice)) break;

        console.log('Sorry, invalid choice.');
      }

      this.move = choice;
    },
  };

  return Object.assign(playerObject, humanObject);
}

// engine object that orchestrates the objects and implements program flow
function createRPSGame(winningMoves) {
  return {
    winningMoves,
    human: createHuman(winningMoves),
    computer: createComputer(winningMoves),

    displayWelcomeMessage() {
      console.log('Welcome to Rock, Paper, Scissors!');
      console.log('Each round is worth one point. First player to 5 points wins!');
    },

    displayGoodbyeMessage() {
      console.log(`Thanks for playing Rock, Paper, Scissors!`);
    },

    displayRoundWinner(roundWinner) {
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
    },

    displayScore() {
      console.log(`Your score: ${this.human.getScore()}`);
      console.log(`Computer score: ${this.computer.getScore()}`);
    },

    displayMatchWinner() {
      let matchWinner = this.getMatchWinner();

      console.log(`${matchWinner === 'human' ? "You have" : "The computer has"} won the match with 5 points!`);
    },

    displayMoveHistories() {
      let playerMoves = this.human.getMoveHistory();
      let computerMoves = this.computer.getMoveHistory();

      console.log("Round | Player   | Computer");

      for (let index = 0; index < playerMoves.length; index += 1) {
        console.log(`${String(index + 1).padStart(3).padEnd(5)} | ${playerMoves[index][0].padEnd(8)} | ${computerMoves[index][0]}`);
      }
    },

    hasWinner() {
      return Math.max(this.human.getScore(), this.computer.getScore()) >= 5;
    },

    getRoundWinner() {
      let humanMove = this.human.getMove();
      let computerMove = this.computer.getMove();

      if (this.winningMoves[humanMove].includes(computerMove)) {
        return 'human';
      } else if (this.winningMoves[computerMove].includes(humanMove)) {
        return 'computer';
      } else {
        return null;
      }
    },

    getMatchWinner() {
      if (this.human.getScore() >= 5) {
        return 'human';
      } else {
        return 'computer';
      }
    },

    updateScore(roundWinner) {
      if (roundWinner === 'human') {
        this.human.incrementScore();
      } else if (roundWinner === 'computer') {
        this.computer.incrementScore();
      }
    },

    updateMoveHistories(roundWinner) {
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
    },

    resetMatch() {
      this.human.resetScore();
      this.computer.resetScore();
    },

    getUserInput(input) {
      console.log(`${input} (y/n)`);
      let answer = readline.question().toLowerCase();

      while (!['y', 'n'].includes(answer)) {
        console.log("Invalid input, try again. (y/n)");
        answer = readline.question().toLowerCase();
      }

      return answer === 'y';
    },

    play () {
      this.displayWelcomeMessage();

      while (true) {
        while (!this.hasWinner()) {
          this.human.choose();
          this.computer.choose();

          let roundWinner = this.getRoundWinner();
          this.displayRoundWinner(roundWinner);
          this.updateScore(roundWinner);
          this.displayScore();
          this.updateMoveHistories(roundWinner);
        }

        this.displayMatchWinner();
        this.computer.updateWeights();
        console.log(this.computer.weights);
        if (this.getUserInput("Would you like to see move histories?")) {
          this.displayMoveHistories();
        }

        this.resetMatch();

        if (!this.getUserInput("Would you like to play again?")) break;
      }

      this.displayGoodbyeMessage();
    },
  };
}

const winningMoves =  {
  rock: ['scissors', 'lizard'],
  paper: ['rock', 'spock'],
  scissors: ['paper', 'lizard'],
  spock: ['scissors', 'rock'],
  lizard: ['paper', 'spock'],
};

let RPSGame = createRPSGame(winningMoves);

RPSGame.play();