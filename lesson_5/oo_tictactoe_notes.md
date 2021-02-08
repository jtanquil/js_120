## OO Tic Tac Toe - Notes ##

**Description**: Start with an empty 3x3 grid/board. Two players, one human and one computer, one using "X" and the other using "O", take turns filling the spaces on the board. The first player to complete a horizontal, vertical or diagonal line across the board (3 consecutive spaces horizontally, vertically or diagonally) wins the game. If the board is filled up without either player completing a line this way, the game is a tie.

**Significant nouns**: board, player (human/computer), line (horizontal/vertical/diagonal)
**Significant verbs**: take (turns), fill (spaces/line)

**Associating nouns to verbs**: the board is filled with spaces, players take turns

**Rough Class Structure**:

`Game` - implements the procedural flow of the game: initializing the board, alternating player turns, checking for a winner, restarting the game. contains a `Board`, `HumanPlayer` and `ComputerPlayer`

`Board` - implements the board: keeps track of the board state, contains code that determines if there is a winner

`HumanPlayer`/`ComputerPlayer` - implements the player behavior (taking user input for humans, making moves for computers). subclasses of a `Player` class

- **spike**: exploratory code that sketchs out a program's structure and design
    - similar to psuedocode, general high-level outline of a program flow
    - **idea**: OO code doesn't have a top-to-bottom flow like procedural code does, the top-to-bottom flow of the code is more apparent there once an algorithm has been determined
        - **scaffolding** code by writing high-level segments while leaving lower-level implementation for later is useful for writing OO code
        - **stubs**: placeholders for functions and methods to be written or removed later
            - don't need functionality, usually has a comment to indicate that it's a stub or a spike to help the programmer keep track of what is to be done
- **indirection**: refers to the ability to reference something indirectly
    - ex/using variables to represent values => one level of indirection, accessing a value via an object property => two levels of indirection (`object.property`)
    - **idea**: indirection via reference with variable names, object properties etc. tell you what you're working with without actually revealing more information than necessary
        - in an OOP context, modularizing code across different objects forces more indirection than when writing code procedurally because most data will be object properties or instance methods
        - **this isolates concerns** so changes in one portion of code will be less likely to directly affect other portions of code
        - **relationship to encapsulation**: the interface used to interact with a specific class or object can remain the same while the implementation can be safely changed
- loose vs tight dependencies, tradeoffs in property/method delegation/allocation