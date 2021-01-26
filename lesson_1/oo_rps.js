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
      this.moveHistory.push({
        move: this.move,
        result: result,
      });
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
        choice = readline.question().toLowerCase();

        if (possibleChoices.includes(choice)) break;

        console.log('Sorry, invalid choice.');
      }

      this.move = choice;
    },
  };

  return Object.assign(playerObject, humanObject);
}

// engine object that orchestrates the objects and implements program flow
function createRPSGame() {
  const winningMoves = {
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    spock: ['scissors', 'rock'],
    lizard: ['paper', 'spock'],
  };
  const winningScore = 5;

  return {
    winningMoves,
    winningScore,
    human: createHuman(winningMoves),
    computer: createComputer(winningMoves),

    displayLine () {
      console.log("------------------------------------");
    },

    displayWelcomeMessage () {
      console.log('Welcome to Rock, Paper, Scissors!');
      console.log('Each round is worth one point. First player to 5 points wins!');
      this.displayLine();
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
      this.displayLine();
    },

    displayMatchWinner () {
      let matchWinner = this.getMatchWinner();

      console.log(`${matchWinner === 'human' ? "You have" : "The computer has"} won the match with 5 points!`);
    },

    displayMoveHistories () {
      let playerMoves = this.human.getMoveHistory();
      let computerMoves = this.computer.getMoveHistory();

      this.displayLine();
      console.log("Round | Player   | Computer");

      for (let index = 0; index < playerMoves.length; index += 1) {
        console.log(`${String(index + 1).padStart(3).padEnd(5)} | ${playerMoves[index].move.padEnd(8)} | ${computerMoves[index].move}`);
      }

      this.displayLine();
    },

    matchHasWinner () {
      let playerScore = this.human.getScore();
      let computerScore = this.computer.getScore();

      return Math.max(playerScore, computerScore) >= this.winningScore;
    },

    getMatchWinner () {
      return this.human.getScore() >= this.winningScore ? "human" : "computer";
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

        this.resetMatch();

        if (!this.getUserInput("Would you like to play again?")) break;

        console.clear();
      }

      this.displayGoodbyeMessage();
    },
  };
}

let RPSGame = createRPSGame();

RPSGame.play();