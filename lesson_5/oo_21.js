const readline = require('readline-sync');

class Card {
  static SUITS = ["Diamonds", "Clubs", "Hearts", "Spades"];
  static RANKS =
    ["2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];
  static ACE = "Ace";

  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  getRank() {
    return this.rank;
  }

  toString() {
    return `${this.rank} of ${this.suit}`;
  }
}

class Hand {
  static CARD_VALUES = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    Jack: 10,
    Queen: 10,
    King: 10
  };
  static MAX_ACE_VALUE = 11;
  static MAX_HAND_VALUE = 21;
  static DEALER_STAY_VALUE = 17;

  constructor() {
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  toString() {
    return this.cards.map((card) => card.toString()).join(", ");
  }

  reset() {
    this.cards = [];
  }

  getScore() {
    let numberOfAces =
      this.cards.filter((card) => card.getRank() === Card.ACE).length;
    let maxAceScore = this.getMaxAceScore(numberOfAces);
    let nonAceCards =
      this.cards.filter((card) => card.getRank() !== Card.ACE);

    let restOfHandScore =
      nonAceCards.reduce((total, card) =>
        total + Hand.CARD_VALUES[card.getRank()], 0);

    if (restOfHandScore + maxAceScore > Hand.MAX_HAND_VALUE) {
      return restOfHandScore + numberOfAces;
    } else {
      return restOfHandScore + maxAceScore;
    }
  }

  getMaxAceScore(numberOfAces) {
    return numberOfAces === 0 ?
      0 : Hand.MAX_ACE_VALUE + numberOfAces - 1;
  }

  busted() {
    return this.getScore() > Hand.MAX_HAND_VALUE;
  }

  hitDealerLimit() {
    return this.getScore() > Hand.DEALER_STAY_VALUE;
  }
}

class Deck {
  constructor() {
    this.cards = [];

    this.resetDeck();
  }

  dealTo(player) {
    player.addCard(this.cards.pop());
  }

  dealOpeningHand(player) {
    this.dealTo(player);
    this.dealTo(player);
  }

  deckEmpty() {
    return this.cards.length === 0;
  }

  resetDeck() {
    for (let suitIndex = 0; suitIndex < Card.SUITS.length; suitIndex += 1) {
      for (let rankIndex = 0; rankIndex < Card.RANKS.length; rankIndex += 1) {
        let card = new Card(Card.RANKS[rankIndex], Card.SUITS[suitIndex]);
        this.cards.push(card);
      }
    }

    for (let cardIndex = 0; cardIndex < this.cards.length; cardIndex += 1) {
      let randomIndex = Math.floor(this.cards.length * Math.random());
      [ this.cards[cardIndex], this.cards[randomIndex] ] =
        [ this.cards[randomIndex], this.cards[cardIndex] ];
    }
  }
}

class Player {
  constructor() {
    this.hand = new Hand();
  }

  getHandString() {
    return this.hand.toString();
  }

  getHandScore() {
    return this.hand.getScore();
  }

  addCard(card) {
    this.hand.addCard(card);
  }

  resetHand() {
    this.hand.reset();
  }

  hasBusted() {
    return this.hand.busted();
  }
}

class HumanPlayer extends Player {
  static STARTING_MONEY = 5;
  static MIN_MONEY = 0;
  static MAX_MONEY = 10;

  constructor() {
    super();
    this.money = HumanPlayer.STARTING_MONEY;
  }

  getMoney() {
    return this.money;
  }

  moneyToString() {
    return `You currently have $${this.money}.`;
  }

  winMoney() {
    this.money += 1;
  }

  loseMoney() {
    this.money -= 1;
  }

  hasWonMatch() {
    return this.getMoney() >= HumanPlayer.MAX_MONEY;
  }

  hasLostMatch() {
    return this.getMoney() <= HumanPlayer.MIN_MONEY;
  }
}

class Dealer extends Player {
  constructor() {
    super();
  }

  getHandString(showHand = false) {
    return showHand ? super.getHandString() :
      this.hand.toString().split(", ")[0] + ", one other card";
  }

  hitLimit() {
    return this.hand.hitDealerLimit();
  }
}

class TwentyOneGame {
  static PLAYER_CHOICES = ["h", "s"];
  static PLAYER_MOVE_INPUT = "Your turn. Choose to (h)it or (s)tay.";
  static PLAY_AGAIN_INPUT = "Play again?";
  static PLAY_AGAIN_CHOICES = ["y", "n"];

  constructor() {
    this.player = new HumanPlayer();
    this.dealer = new Dealer();
    this.deck = new Deck();
  }

  play() {
    this.displayStartMessage();

    while (true) {
      this.playGame();

      if (this.matchOver() || !this.playAgain()) break;

      console.clear();
      this.resetHands();
      this.resetDeck();
    }

    this.displayMatchResults();
    this.displayGoodbyeMessage();
  }

  playGame() {
    this.dealOpeningHands();
    this.displayHands();

    this.takePlayerTurn();
    if (!this.gameIsOver()) {
      this.takeDealerTurn();
    }

    let winner = this.getWinner();

    this.updatePlayerMoney(winner);
    this.displayResults(winner);
  }

  displayStartMessage() {
    console.log("Welcome to Twenty One!");
  }

  displayHands(showDealerHand = false) {
    this.displayHand(this.player);
    this.displayHand(this.dealer, showDealerHand);
  }

  displayHand(player, showHand = true) {
    let prefix = player === this.player ? "Player's" : "Dealer's";
    let scoreString =
      showHand ? ` (score: ${player.getHandScore()})` : "";

    console.log(`${prefix} hand: ${player.getHandString(showHand)}${scoreString}`);
  }

  displayBust(player) {
    console.log(`${player === this.player ? "Player" : "Dealer"} busts!`);
  }

  displayMove(player, move) {
    console.log(`${player === this.player ? "Player" : "Dealer"} ${move === "h" ? "hits" : "stays"}.`);
  }

  displayResults(winner) {
    console.log("Results:");
    this.displayHands(true);

    if (winner) {
      console.log(`${winner === this.player ? "Player" : "Dealer"} is the winner!`);
    } else {
      console.log("The game is a tie!");
    }

    console.log(this.player.moneyToString());
  }

  displayGoodbyeMessage() {
    console.log("Thank you for playing Twenty One!");
  }

  displayMatchResults() {
    console.log("The match is over.");

    if (this.player.hasWonMatch()) {
      console.log(`You have $${HumanPlayer.MAX_MONEY}, you won the match!`);
    } else if (this.player.hasLostMatch()) {
      console.log(`You have $${HumanPlayer.MIN_MONEY}, you lost the match!`);
    } else {
      console.log(`You ended the match with $${this.player.getMoney()}.`);
    }
  }

  updatePlayerMoney(winner) {
    if (winner === this.player) {
      this.player.winMoney();
    } else if (winner === this.dealer) {
      this.player.loseMoney();
    }
  }

  getWinner() {
    let playerScore = this.player.getHandScore();
    let dealerScore = this.dealer.getHandScore();

    if (this.player.hasBusted()) {
      return this.dealer;
    } else if (this.dealer.hasBusted()) {
      return this.player;
    } else if (playerScore > dealerScore) {
      return this.player;
    } else if (playerScore < dealerScore) {
      return this.dealer;
    } else {
      return null;
    }
  }

  takePlayerTurn() {
    let choice;

    while (true) {
      choice = this.getPlayerInput(TwentyOneGame.PLAYER_MOVE_INPUT,
        TwentyOneGame.PLAYER_CHOICES);

      this.displayMove(this.player, choice);

      if (choice === "s") break;

      this.hit(this.player);
      this.displayHands();

      if (this.player.hasBusted()) {
        this.displayBust(this.player);
        break;
      }
    }
  }

  getPlayerInput(prompt, choices) {
    let choice;

    console.log(prompt);

    while (true) {
      choice = readline.question().toLowerCase();

      if (choices.includes(choice)) break;

      console.log(`Invalid answer, please try again. (choices are ${choices.join(", ")})`);
    }

    return choice;
  }

  hit(player) {
    this.deck.dealTo(player);
  }

  takeDealerTurn() {
    while (true) {
      this.displayHand(this.dealer);

      if (!this.dealer.hitLimit()) {
        this.hit(this.dealer);
        this.displayMove(this.dealer, "h");
        continue;
      } else if
      (!this.dealer.hasBusted()) {
        this.displayMove(this.dealer, "s");
      } else {
        this.displayBust(this.dealer);
      }

      break;
    }
  }

  dealOpeningHands() {
    this.deck.dealOpeningHand(this.player);
    this.deck.dealOpeningHand(this.dealer);
  }

  gameIsOver() {
    return [this.player, this.dealer].some((player) => player.hasBusted());
  }

  playAgain() {
    return this.getPlayerInput(TwentyOneGame.PLAY_AGAIN_INPUT,
      TwentyOneGame.PLAY_AGAIN_CHOICES) === "y";
  }

  resetHands() {
    this.player.resetHand();
    this.dealer.resetHand();
  }

  resetDeck() {
    this.deck.resetDeck();
  }

  matchOver() {
    return this.player.hasWonMatch() || this.player.hasLostMatch();
  }
}

let game = new TwentyOneGame();

game.play();