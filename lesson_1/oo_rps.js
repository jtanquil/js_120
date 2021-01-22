const readline = require('readline-sync');

function createPlayer(playerType) {
  return {
    playerType,
    move: null,

    choose () {
      if (this.isHuman()) {
        let choice;

        while (true) {
          console.log("Choose a move ('rock', 'paper' or 'scissors'):");
          choice = readline.question();

          if (['rock', 'paper', 'scissors'].includes(choice)) break;

          console.log('Sorry, invalid choice.');
        }

        this.move = choice;
      } else {
        const choices = ['rock', 'paper', 'scissors'];
        let randomIndex = Math.floor(Math.random() * choices.length);
        this.move =  choices[randomIndex];
      }
    },

    isHuman () {
      return this.playerType === 'human';
    }
  };
}

function createMove() {
  return {
    // possible state: type of move (rock, paper or scissors)
  };
}

function createRule() {
  return {
    // possible states?
  };
}

let compare = function(move1, move2) {
  // not yet implemented
};

// engine object that orchestrates the objects and implements procedural program flow
const RPSGame = {
  human: createPlayer('human'),
  computer: createPlayer('computer'),

  displayWelcomeMessage() {
    console.log('Welcome to Rock, Paper, Scissors!');
  },

  displayGoodbyeMessage() {
    console.log(`Thanks for playing Rock, Paper, Scissors!`);
  },

  displayWinner() {
    let humanMove = this.human.move;
    let computerMove = this.computer.move;

    console.log(`You chose: ${humanMove}`);
    console.log(`The computer chose: ${computerMove}`);

    if ((humanMove === 'rock' && computerMove === 'scissors') ||
      (humanMove === 'scissors' && computerMove === 'paper') ||
      (humanMove === 'paper' && computerMove === 'rock')) {
      console.log('You win!');
    } else if ((humanMove === 'rock' && computerMove === 'paper') ||
      (humanMove === 'paper' && computerMove === 'scissors') ||
      (humanMove === 'scissors' && computerMove === 'rock')) {
      console.log('Computer wins!');
    } else {
      console.log("It's a tie");
    }
  },

  playAgain() {
    console.log('Would you like to play again? (y/n)');
    let answer = readline.question();

    return answer.toLowerCase()[0] === 'y`;
  },

  play () {
    this.displayWelcomeMessage();

    while (true) {
      this.human.choose();
      this.computer.choose();
      this.displayWinner();

      if (!this.playAgain()) break;
    }

    this.displayGoodbyeMessage();
  },
};

RPSGame.play();