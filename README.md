# Tic Tac Toe

A browser-based Tic Tac Toe game built as part of **The Odin Project JavsScript** curriculum.

## Live Demo

[Play Tic Tac Toe]( https://aliousang.github.io/tic-tac-toe/) 

## Features

- Play Tic Tac Toe with two players.
- Enter player names.
- Alternate turn between X and O.
- Detect winning combinations across rows, columns, and diagonals.
- Detect a tie when all cells are occupied without a winner.
- Highlight the winning cells.
- Restart the game and play again.
- Use accessible labels to describe board cells.

## Built With

- HTML5--semantic structure.
- CSS3--layout, styling, and responsive design.
- JavaScript(ES6+)--game logic, DOM manipulation, and event handling.

## Project Structure

```text
tic-tac-toe/
├── index.html
├── README.md
├── script.js
└── style.css
```

## JavaScript Architecture

The project uses separate modules and factories to keep responsibilities organized.

### Gameboard

An IIFE (Immediately Invoked Function Expression) manages the game board and keeps its internal state private.

Its responsibilities include:

- Storing the nine cells. 
- Placing player marks.
- Returning a copy of the board state.
- Checking for winning combinations.
- Resetting the board.

### Player

A factory function creates player objects containing their names and marks.

### GameController

The game controller manages the rules and flow of the game, including:

- Tracking the active player.
- Validating moves.
- Detecting wins and ties.
- Switching turns.
- Managing game status.

### DisplayController

The display controller connects the game logic to the browser interface. It renders the board, handles user interactions, and updates the displayed game state.

## What I Learned

This project helped me practice several important JavaScript concepts:

- **IIFEs and closures**: encapsulating private data and exposing a controlled public interface.

- **Factory functions**: creating player objects.
- **Separation of concerns**:  keeping game rules separate from DOM manipulation.
-  keeping game rules separate from DOM manipulation.
- **Array methods**: using methods such as find() to identify winning combinations.
- **Array destructuring**: extracting cell indexes from winning combinations.
- **DOM manipulation**: creating elements, updating classes, and setting attributes.
- **Event handling**: responding to player interactions.
- **CSS class management**: using `classList.toggle()` and `classList.remove()` to update the interface.
- **Accessibility**: using `aria-label` to provide meaningful descriptions of board cells.

## Design and CSS Naming

The stylesheet uses descriptive names to make the code easier to understand and maintain.

- `.game-panel` identifies the main area containing the game interface.
- `.eyebrow` identifies the small introductory text above the main heading.

These naming conventions help communicate the purpose of each element and make future design changes easier.

## Acknowledgments

This project was completed as part of [The Odin Project's JavaScript curriculum](https://www.theodinproject.com/lessons/node-path-javascript).

### Author

**AliouSang**

[GitHub Profile](https://github.com/AliouSang)