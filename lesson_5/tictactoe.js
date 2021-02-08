const readline = require('readline-sync');

const INITIAL_MARKER = ' ';
const HUMAN_MARKER = 'X';
const COMPUTER_MARKER = 'O';
const WINNING_LINES = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9],
  [1, 4, 7], [2, 5, 8], [3, 6, 9],
  [1, 5, 9], [3, 5, 7]
];
const MIDDLE_SQUARE = '5';
const GAMES_TO_WIN_MATCH = 5;
const PLAY_AGAIN_OPTIONS = ["y", "n"];
const FIRST_PLAYER_OPTIONS = ["player", "computer"];

const prompt = (message) => {
  console.log(`=> ${message}`);
};

const joinOr = (arr, delimiter = ', ', lastElementStr = 'or') => {
  let arrCopy = arr.slice();

  if (arrCopy.length < 2) {
    return arrCopy.join();
  } else {
    arrCopy[arrCopy.length - 1] =
      lastElementStr + ' ' + arrCopy[arrCopy.length - 1];

    if (arrCopy.length === 2) {
      return arrCopy.join(' ');
    } else {
      return arrCopy.join(delimiter);
    }
  }
};

const capitalize = (string) => string[0].toUpperCase() + string.slice(1);

const validateInput = (message, responses) => {
  prompt(message);
  let answer = readline.question().toLowerCase().trim();

  while (!responses.includes(answer)) {
    prompt(`Invalid response, try again. valid responses are ${joinOr(responses)}:`);
    answer = readline.question().toLowerCase().trim();
  }

  return answer;
};

const initializeBoard = () => {
  let board = {};

  for (let square = 1; square <= 9; square += 1) {
    board[square] = INITIAL_MARKER;
  }

  return board;
};

const displayBoard = (board) => {
  console.clear();

  console.log(`You are ${HUMAN_MARKER}. Computer is ${COMPUTER_MARKER}`);

  console.log('');
  console.log('     |     |');
  console.log(`  ${board['1']}  |  ${board['2']}  |  ${board['3']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['4']}  |  ${board['5']}  |  ${board['6']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['7']}  |  ${board['8']}  |  ${board['9']}`);
  console.log('     |     |');
  console.log('');
};

const emptySquares = (board) =>
  Object.keys(board).filter((square) => board[square] === INITIAL_MARKER);

const playerChoosesSquare = (board) => {
  let validChoices = emptySquares(board);
  let square =
    validateInput(`Choose a square: ${joinOr(validChoices)}`, validChoices);

  board[square] = HUMAN_MARKER;
};

const countMarkers = (board, line, marker) =>
  line.reduce((markerCount, square) =>
    (board[square] === marker ? markerCount + 1 : markerCount), 0);

const isImmediateThreat = (board, line) => {
  return countMarkers(board, line, HUMAN_MARKER) === 2 &&
    countMarkers(board, line, INITIAL_MARKER) === 1;
};

const getEmptySquare = (board, line) =>
  line.find((square) => board[square] === INITIAL_MARKER);

const findImmediateThreats = (board) =>
  WINNING_LINES.filter((line) => isImmediateThreat(board, line))
    .map((line) => getEmptySquare(board, line));

const isVulnerableSquare = (board, line) => {
  return countMarkers(board, line, COMPUTER_MARKER) === 2 &&
    countMarkers(board, line, INITIAL_MARKER) === 1;
};

const findVulnerableSquares = (board) =>
  WINNING_LINES.filter((line) => isVulnerableSquare(board, line))
    .map((line) => getEmptySquare(board, line));

const computerChoosesSquare = (board) => {
  let immediateThreats = findImmediateThreats(board);
  let vulnerableSquares = findVulnerableSquares(board);

  let possibleMoves;
  if (vulnerableSquares.length > 0) {
    possibleMoves = vulnerableSquares;
  } else if (immediateThreats.length > 0) {
    possibleMoves = immediateThreats;
  } else {
    possibleMoves = emptySquares(board);
  }

  let randomIndex = Math.floor(Math.random() * possibleMoves.length);

  // pick square 5 (middle square) if available
  let square = possibleMoves.includes(MIDDLE_SQUARE) ?
    MIDDLE_SQUARE : possibleMoves[randomIndex];
  board[square] = COMPUTER_MARKER;
};

const chooseSquare = (board, currentPlayer) => {
  if (currentPlayer === "player") {
    playerChoosesSquare(board);
  } else if (currentPlayer === "computer") {
    computerChoosesSquare(board);
  }
};

const alternatePlayer = (currentPlayer) =>
  (currentPlayer === "player" ? "computer" : "player");

const boardFull = (board) => emptySquares(board).length === 0;

const detectWinner = (board) => {
  for (let line = 0; line < WINNING_LINES.length; line += 1) {
    let [ sq1, sq2, sq3 ] = WINNING_LINES[line];

    if (
      board[sq1] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq3] === HUMAN_MARKER
    ) {
      return 'player';
    } else if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq3] === COMPUTER_MARKER
    ) {
      return 'computer';
    }
  }

  return null;
};

const someoneWon = (board) => !!detectWinner(board);

const printGameWins = (gameWins) => {
  prompt(`First to win ${GAMES_TO_WIN_MATCH} games wins the match.`);
  prompt(`Player: ${gameWins.player} wins.`);
  prompt(`Computer: ${gameWins.computer} wins.`);
};

const updateGameWins = (winner, gameWins) => {
  gameWins[winner] += 1;
};

const detectMatchWinner = (gameWins) => {
  if (gameWins.player === GAMES_TO_WIN_MATCH) {
    return 'player';
  } else if (gameWins.computer === GAMES_TO_WIN_MATCH) {
    return 'computer';
  }

  return null;
};

const someoneWonMatch = (gameWins) => !!detectMatchWinner(gameWins);

while (true) {
  let answer;
  let gameWins = {
    player: 0,
    computer: 0
  };

  while (true) {
    let board = initializeBoard();

    let firstPlayer =
      validateInput(`Who will move first? (${joinOr(FIRST_PLAYER_OPTIONS)})`,
        FIRST_PLAYER_OPTIONS);
    let currentPlayer = firstPlayer;

    while (true) {
      displayBoard(board);

      chooseSquare(board, currentPlayer);
      currentPlayer = alternatePlayer(currentPlayer);

      if (someoneWon(board) || boardFull(board)) break;
    }

    displayBoard(board);

    if (someoneWon(board)) {
      let winner = detectWinner(board);
      prompt(`${capitalize(winner)} won!`);
      updateGameWins(winner, gameWins);
    } else {
      prompt("It's a tie!");
    }

    printGameWins(gameWins);

    let matchWinner = detectMatchWinner(gameWins);

    if (someoneWonMatch(gameWins)) {
      prompt(`${matchWinner} has won the match!`);
      break;
    }

    answer = validateInput("Play another game? (y or n)", PLAY_AGAIN_OPTIONS);
    if (answer !== 'y') break;
  }

  answer = validateInput("Play another match? (y or n)", PLAY_AGAIN_OPTIONS);
  if (answer !== 'y') break;
}

prompt('Thanks for playing Tic Tac Toe!');
