## OO Twenty One Notes ##

**Description**: The game is played with a player and a dealer. It begins with both the player and dealer dealt an initial hand of two cards from a randomized deck of playing cards. The player knows both of the cards in their hand, and one card from the dealer's hand. The player then takes their turn: they have the option to hit (draw a card from the deck), or stay (end their turn). If the value of their hand exceeds 21, they lose. Then, the dealer takes their turn: they hit until they lose (the value of their hand exceeds 21), or the value of their hand exceeds 17. After both turns, the player with the higher value hand wins. Value is determined with the following rules: numbered cards 2-10 are worth 2-10 points, face cards (jack, queen, king) are worth 10 points, and the value of an ace is determined with the following rule: the first ace is worth 11 points, unless that would make the rest of the hand worth more than 21 points, in which case it's worth 1 point. Each subsequent ace in the player's hand is worth 1 point.

**Significant nouns**: player, dealer, hand, card, deck, value/score
**Significant verbs**: take (turn), deal, draw, hit, stay

**Associating nouns to verbs**: **player/dealer**s have **hands** which have **cards**; a **deck** also has **cards** that are *dealt*. **player/dealer**s *take turns*, choosing to *hit* or *stay*. Each **card** has a point **value/score**.

**Rough Class Structure**:

`Game` - implements the procedural flow of the game. Has a `Player`, a `Dealer`, and a `Deck`.

`Player/Dealer` - has a `Hand` with `Cards`.

`Hand` - contains `Cards`.

`Card` - has a suit, number/face value, and a point value.

`Deck` - contains `Cards` that are `dealt` to the `Hand`s of `Player` and `Dealer` throughout the course of the `Game`.