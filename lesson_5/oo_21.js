const readline = require('readline-sync');

class Card {
  static SUITS = ["Diamonds", "Clubs", "Hearts", "Spades"];
  static RANKS =
    ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  static ACE = "A";

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
  constructor() {
    this.cards = [];
  }

  addCard(card) {
    this.cards.push(card);
  }

  toString() {
    return this.cards.map((card) => card.toString()).join(", ");
  }
}

class Deck {
  constructor() {
    this.cards = [];

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

  dealTo(player) {
    player.addCard(this.cards.pop());
  }

  dealOpeningHand(player) {
    this.dealTo(player);
    this.dealTo(player);
  }
}

class Player {
  constructor() {
    this.hand = new Hand();
  }

  getHand() {
    return this.hand;
  }

  getHandString() {
    return this.hand.toString();
  }

  addCard(card) {
    this.hand.addCard(card);
  }
}

class HumanPlayer extends Player {
  constructor() {
    super();
  }
}

class Dealer extends Player {
  constructor() {
    super();
  }

  getHandString(hideHand = true) {
    return hideHand ? this.hand.toString().split(", ")[0] + ", one other card"
      : super.getHandString();
  }
}

class TwentyOneGame {
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
    J: 10,
    Q: 10,
    K: 10
  };
  static MAX_ACE_VALUE = 11;
  static MAX_HAND_VALUE = 21;
  static DEALER_STAY_VALUE = 17;
  static PLAYER_CHOICES = ['h', 's'];
  static PLAYER_MOVE_INPUT = "Your turn. Choose to (h)it or (s)tay.";

  constructor() {
    this.player = new HumanPlayer();
    this.dealer = new Dealer();
    this.deck = new Deck();
    this.winner = null;
  }

  play () {
    let currentPlayer = this.player;

    this.displayStartMessage();

    this.dealOpeningHands();
    this.displayOpeningHands();

    while (true) {
      this.takeTurn(currentPlayer);

      if (this.gameIsOver() || currentPlayer === this.dealer) break;

      currentPlayer = this.dealer;
    }

    this.displayResults();
    this.displayGoodbyeMessage();
  }

  displayStartMessage() {
    console.log("Welcome to Twenty One!");
  }

  displayOpeningHands() {
    this.displayHand(this.player);
    this.displayHand(this.dealer);
  }

  displayEndHands() {
    console.log(this.player.getHandString());
    console.log(this.dealer.getHandString(false));
  }

  displayHand(player) {
    let prefix = player === this.player ? "Your" : "Dealer's";
    let scoreString =
      player === this.player ? ` (score: ${this.getHandScore(player)})` : "";

    console.log(`${prefix} hand : ${player.getHandString()}${scoreString}`);
  }

  displayMove(player, move) {
    console.log(`${player === this.player ? "Player" : "Dealer"} ${move === "h" ? "hits" : "stays"}.`);
  }

  displayResults() {
    console.log("Results:");
    this.displayEndHands();
  }

  displayGoodbyeMessage() {
    console.log("Thank you for playing Twenty One!");
  }

  takeTurn(currentPlayer) {
    if (currentPlayer === this.player) {
      this.takePlayerTurn();
    } else {
      this.takeDealerTurn();
    }
  }

  takePlayerTurn() {
    let choice;

    do {
      choice = this.getPlayerInput(TwentyOneGame.PLAYER_MOVE_INPUT,
        TwentyOneGame.PLAYER_CHOICES);

      this.displayMove(this.player, choice);

      if (choice === "h") {
        this.hit(this.player);
        this.displayHand(this.player);
      } else break;
    } while (this.getHandScore(this.player) <= TwentyOneGame.MAX_HAND_VALUE);
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
    do {
      this.hit(this.dealer);
      this.displayMove(this.dealer, "h");
    } while (this.getHandScore(this.dealer) <= TwentyOneGame.DEALER_STAY_VALUE);
  }

  dealOpeningHands() {
    this.deck.dealOpeningHand(this.player);
    this.deck.dealOpeningHand(this.dealer);
  }

  getHandScore(player) {
    let hand = player.getHand();
    let numberOfAces =
      hand.cards.filter((card) => card.getRank() === Card.ACE).length;
    let maxAceScore = this.getMaxAceScore(numberOfAces);
    let nonAceCards = hand.cards.filter((card) => card.getRank() !== Card.ACE);

    let restOfHandScore =
      nonAceCards.reduce((total, card) =>
        total + TwentyOneGame.CARD_VALUES[card.getRank()], 0);

    if (restOfHandScore + maxAceScore > TwentyOneGame.MAX_HAND_VALUE) {
      return restOfHandScore + numberOfAces;
    } else {
      return restOfHandScore + maxAceScore;
    }
  }

  getMaxAceScore(numberOfAces) {
    return numberOfAces === 0 ?
      0 : TwentyOneGame.MAX_ACE_VALUE + numberOfAces - 1;
  }

  gameIsOver() {
    let scores =
      [this.player, this.dealer].map((player) => this.getHandScore(player));

    return scores.some((score) => score > TwentyOneGame.MAX_HAND_VALUE);
  }
}

let game = new TwentyOneGame();

game.play();