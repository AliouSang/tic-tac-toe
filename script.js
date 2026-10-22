const Gameboard = (() => {
  const board = Array(9).fill(null);
  
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]     // Diagonals
  ];

  const getBoard = () => [...board];

  const placeMark = (index, mark) => {
    if (!Number.isInteger(index) || index < 0 || index > 8) {
      return false;
    }

    if (mark !== "X" && mark !== "O") {
      return false;
    }
    
    if (board[index] !== null) {
      return false;
    }

    board[index] = mark;
    return true;
  };

  const getWinningCombination = () => {
    return winningCombinations.find(([a, b, c]) => {
      return (
        board[a] !== null &&
        board[a] === board[b] && 
        board[b] === board[c]
      );
    }) ?? null;
  }; 

  const isFull = () => board.every(cell => cell !== null);

  const reset = () => board.fill(null);

  return { getBoard, placeMark, getWinningCombination, isFull, reset };
})(); 

const Player = (name, mark) => {
  return { name, mark };
};

const GameController =  (() => {
  let players = [];
  let activePlayerIndex = 0;
  let gameStatus = "not-started";
  let winningCombination = null;

  const startGame = (playerOneName, playerTwoName) => {
    const nameOne = playerOneName.trim() || "Player 1";
    const nameTwo = playerTwoName.trim() || "Player 2";

    players = [
      Player(nameOne, "X"),
      Player(nameTwo, "O")
    ];

    activePlayerIndex = 0;
    gameStatus = "playing";
    winningCombination = null;

    Gameboard.reset();

    return getGameState();
  };

  const getActivePlayer = () => players[activePlayerIndex];


  const playRound = (index) => {
    if (gameStatus !== "playing") {
      return { success: false, message: "The game is not currently in progress."};
    };

    const player = getActivePlayer();

    const moveWasSuccessful = Gameboard.placeMark(index, player.mark);

    if (!moveWasSuccessful) {
      return { success: false, message: "That square is unavailable. Choose another."};
    }

    winningCombination = Gameboard.getWinningCombination();

    if (winningCombination !== null) {
      gameStatus = "won";

      return { success: true, message: `${player.name} wins!` };
    }

    if (Gameboard.isFull()) {
        gameStatus = "tie";

        return { success: true, message: "It's a tie!" };
      }

      activePlayerIndex = 1 - activePlayerIndex;
      
      return { success: true, message: `${getActivePlayer().name}'s turn.`};
  };

  const getGameState = () => {
    return {
      board: Gameboard.getBoard(),
      players: players.map(player => ({ ...player })),
      activePlayer: players[activePlayerIndex] ?? null,
      status: gameStatus,
      winningCombination: winningCombination ? [...winningCombination] : null
    };
  };

  return { startGame, playRound, getGameState };
})();

const DisplayController = (() => {
  const boardElement = document.querySelector("#gameboard");
  const playerForm = document.querySelector("#player-form");
  const playerOneInput = document.querySelector("#player-one");
  const playerTwoInput = document.querySelector("#player-two");
  const statusElement = document.querySelector("#game-status");
  const messageElement = document.querySelector("#game-message");
  const turnBadge = document.querySelector("#turn-badge");
  const restartButton = document.querySelector("#restart-button");

  const createBoard = () => {
    boardElement.replaceChildren();

    for (let index = 0; index < 9; index++) {
      const cell = document.createElement("button");

      cell.type = "button";
      cell.classList.add("cell");
      cell.dataset.index = index;
      cell.setAttribute("aria-label", `square ${index + 1}`);
      cell.disabled = true;

      boardElement.appendChild(cell);
    }
  };

  const render = () => {
    const state = GameController.getGameState();
    const cells = boardElement.querySelectorAll(".cell");

    cells.forEach((cell, index) => {
      const mark = state.board[index];

      cell.textContent = mark ?? "";
      cell.classList.toggle("mark-o", mark === "O");
      cell.classList.remove("winning-cell");

      cell.setAttribute(
        "aria-label",
        mark
          ? `Square ${index + 1} : ${mark}`
          : `Square ${index + 1} : empty`
      );

      cell.disabled = state.status !== "playing" || mark !== null;
    });

    if (state.status === "not-started") {
      statusElement.textContent = "Enter player names to begin";
      messageElement.textContent = "Each player takes a turn.";
      turnBadge.textContent = "—";
      restartButton.disabled = true;
      return;
    }

    if (state.status === "playing") {
      const player = state.activePlayer;

      statusElement.textContent = `${player.name}'s turn`;
      messageElement.textContent = `Playing as ${player.mark}.`;
      turnBadge.textContent = player.mark;
      restartButton.disabled = false;
      return;
    }

    if (state.status === "won") {
      const winnerMark = state.board.find(
        (mark, index) => state.winningCombination.includes(index) && mark !== null
      );

      const winner = state.players.find(player => player.mark === winnerMark);
    
      statusElement.textContent = `${winner.name} wins!`;
      messageElement.textContent = "Congratulations! Start a new game to play again.";
      turnBadge.textContent = winner.mark;

      state.winningCombination.forEach(index => {
        cells[index].classList.add("winning-cell");
      });

      restartButton.disabled = false;
      return;
    }

    statusElement.textContent = "It's a tie!";
    messageElement.textContent = "Nobody won this round. Try again!";

    turnBadge.textContent = "=";
    restartButton.disabled = false;
  };

  const handleBoardClick = event => {
    const cell = event.target.closest(".cell");

    if (!cell || !boardElement.contains(cell)) {
      return;
    }

    const index = Number(cell.dataset.index);
    const result = GameController.playRound(index);

    if (result.success) {
      render();
    } else {
      messageElement.textContent = result.message;
    }
  };

  const handleStart = event => {
    event.preventDefault();

    GameController.startGame(
      playerOneInput.value,
      playerTwoInput.value
    );

    render();
  };

  const handleRestart = () => {
    GameController.startGame(
      playerOneInput.value,
      playerTwoInput.value      
    );

    render();
  };

  const bindEvents = () => {
    playerForm.addEventListener("submit", handleStart);
    
    restartButton.addEventListener("click", handleRestart);

    boardElement.addEventListener("click", handleBoardClick);
  };

  const init = () => {
    createBoard();
    bindEvents();
    render();
  }

  return { init };
})();

DisplayController.init();
