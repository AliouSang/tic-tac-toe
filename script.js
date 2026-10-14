const GameBoard = (() => {
  const board = Array(9).fill(null);

  const getBoard = () => [...board];

  const setCell = (index, marker) => {
    if (marker !== "X" && marker !== "O") {
      return false;
    }

    if (!Number.isInteger(index) || index < 0 || index > 8) {
      return false;
    }
    
    if (board[index] !== null) {
      return false;
    }

    board[index] = marker;
    return true;
  };

  const resetBoard = () => {
    board.fill(null);
  };

  return { getBoard, setCell, resetBoard };
})();

const createPlayer = (name, marker) => {
  return { name, marker };
};

const GameController = (() => {
  const playerX = createPlayer("player 1", "X");
  const playerO = createPlayer("player 2", "O");
  let activePlayer = playerX;
  let isGameOver = false;

  const getActivePlayer = () => activePlayer;

  const switchTurn = () => {
    activePlayer = activePlayer === playerX ?  playerO : playerX; 
  };

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const checkWin = () => {
    const board = GameBoard.getBoard();
    return winningCombinations.some(combination => {
      const [a, b, c] = combination;
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  };

  const checkTie = () => {
    const board = GameBoard.getBoard();
    return board.every(cell => cell !== null);
  };

  const playRound = (index) => {
    if (isGameOver) {
      console.log("Game is over! Call GameController.resetGame() to play again.");
      return;
    }

    const success = GameBoard.setCell(index, activePlayer.marker);

    if (success) {
      console.log(`${activePlayer.name} placed ${activePlayer.marker} at index ${index}`);
      displayController.log(GameBoard.getBoard());

      if (checkWin()) {
        console.log(`🎉 ${activePlayer.name} wins!`);
        isGameOver = true;
        return;
      }

      if (checkTie()) {
        console.log("It's a tie!");
        isGameOver = true;
        return;
      }

      switchTurn();
    } else {
      console.log("That spot is already taken! Choose another.");
    }
  };

  const resetGame = () => {
    GameBoard.resetBoard();
    activePlayer = playerX;
    isGameOver = false;
    console.log("Game reset. Player 1's turn.");
    displayController.log(GameBoard.getBoard());
  };

  return { playRound, getActivePlayer, resetGame };
})();

const displayController = (() => {
  function log(board) {
    console.log(
      `${board[0] ?? " "} | ${board[1] ?? " "} | ${board[2] ?? " "}\n` +
      `---------\n` +
      `${board[3] ?? " "} | ${board[4] ?? " "} | ${board[5] ?? " "}\n` +
      `---------\n` +  
      `${board[6] ?? " "} | ${board[7] ?? " "} | ${board[8] ?? " "}`     
    );
  }

  return { log };
})();









