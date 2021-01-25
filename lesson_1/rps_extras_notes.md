## RPS Bonus Features Notes ##

**Keeping Score**

New object type or state of an existing class: within the context of the program, the score for each player is updated after each round, so it makes sense to implement score as part of the state of the player object. 

Within the game, each player's score is updated after each round (winning player's score is incremented by 1, losing player's is unchanged), and if one player has at least 5 points, they win and the game loop ends. Therefore, the engine object should also be responsible for handling the logic of checking which player wins.

Since `score` is part of the state of the player object, instead of directly accessing or changing the `score` property of each player, `RPSGame` will update the score using methods provided by the player object.

**Add Lizard and Spock**

To make the `getRoundWinner` method more readable/easier to maintain, turn the conditionals in the `if` statement into a `winningMoves` collaborator object, where the keys are possible moves, and the corresponding values are an array of losing moves from the other player (for example, `winningMoves.rock = ['scissors', 'lizard']`). This simplifies the conditional to

```javascript
if (this.winningMoves[humanMove].includes(computerMove)) {
  return 'human';
} else if (this.winningMoves[computerMove].includes(humanMove)) {
  return 'computer';
} else {
  return null;
}
```

From a design perspective it makes sense for `winningMoves` to be a property of the `RPSGame` object since `RPSGame` is an object that implements the game logic, which includes the possible moves and the interactions between the possible moves. Also, since the `human` and `computer` objects are collaborators of the `RPSGame` object, having the possible moves available through the keys of `winningMoves` allows the `choose` method to work if the set of possible moves is changed.

**Keep Track of a History of Moves**

There are two relevant pieces of information regarding move history: the moves themselves and whether and the result of the round (win, loss or tie). A nested array, where the 1st element of each subarray is the move, and the 2nd element of each subarray is the result, can store this information. After every round, the `moveHistory` property of each player is updated with this information, and the user is given the option to display the previous moves to console.

**Adjust Computer Choices Based on History**

Initially, the computer is equally likely to choose each choices - equivalently, each choice has the same weight (1). After each match, the weights on each choices are adjusted in the following way: for each choice, the number of wins, losses and ties are counted for each choice. Wins are worth 1 point, losses are worth -1 point, ties are worth 0 point. These weights of each choice are updated with these point values - for each choice, the updated weight is its point value, or is 1 (to ensure that it remains possible for the computer to make any choice, even losing ones). When the computer makes a choice, it randomly selects a choice from an array of possible choices. The weights determine how many copies of each choice appear in the array - choices with higher weights will appear more and have a higher probability of being chosen.