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
  let initialChoices = Object.keys(winningMoves);

  for (let key in winningMoves) {
    initialWeights[key] = 1;
  }

  let computerObject = {
    weights: initialWeights,
    choices: initialChoices,

    choose () {
      let randomIndex = Math.floor(Math.random() * this.choices.length);
      this.move =  this.choices[randomIndex];
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

    updateChoices () {
      this.choices = [];

      for (let key in this.weights) {
        for (let reps = 0; reps < this.weights[key]; reps += 1) {
          this.choices.push(key);
        }
      }
    },

    updateWeights () {
      let newPoints = this.getPoints();

      for (let key in this.weights) {
        this.weights[key] = Math.max(newPoints[key], 1) || this.weights[key];
      }

      this.updateChoices();
    },
  };

  return Object.assign(playerObject, computerObject);
}

function createHuman(winningMoves) {
  let playerObject = createPlayer();

  let humanObject = {
    choose () {
      let possibleChoices = Object.keys(winningMoves);
      let choice;

      while (true) {
        console.log(`Choose a move (${possibleChoices.join(", ")}):`);
        choice = readline.question();

        if (possibleChoices.includes(choice)) break;

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

    displayWelcomeMessage () {
      console.log('Welcome to Rock, Paper, Scissors!');
      console.log('Each round is worth one point. First player to 5 points wins!');
    },

    displayGoodbyeMessage () {
      console.log(`Thanks for playing Rock, Paper, Scissors!`);
    },

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
    },

    displayScore () {
      console.log(`Your score: ${this.human.getScore()}`);
      console.log(`Computer score: ${this.computer.getScore()}`);
    },

    displayMatchWinner () {
      let matchWinner = this.getMatchWinner();

      console.log(`${matchWinner === 'human' ? "You have" : "The computer has"} won the match with 5 points!`);
    },

    displayMoveHistories () {
      let playerMoves = this.human.getMoveHistory();
      let computerMoves = this.computer.getMoveHistory();

      console.log("Round | Player   | Computer");

      for (let index = 0; index < playerMoves.length; index += 1) {
        console.log(`${String(index + 1).padStart(3).padEnd(5)} | ${playerMoves[index][0].padEnd(8)} | ${computerMoves[index][0]}`);
      }
    },

    matchHasWinner () {
      return Math.max(this.human.getScore(), this.computer.getScore()) >= 5;
    },

    getMatchWinner () {
      return this.human.getScore() >= 5 ? "human" : "computer";
    },

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
    },

    updateScore (roundWinner) {
      this[roundWinner].incrementScore();
    },

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
    },

    resetMatch () {
      this.human.resetScore();
      this.computer.resetScore();
    },

    getUserInput (input) {
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

        console.log(this.computer.choices);

        this.resetMatch();

        if (!this.getUserInput("Would you like to play again?")) break;

        console.clear();
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