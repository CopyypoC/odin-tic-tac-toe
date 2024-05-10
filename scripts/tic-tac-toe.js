/*  Gameboard stored as an array inside an object
    2-D Array, 3 rows and 3 columns
    [   [cell, cell, cell], 
        [cell, cell, cell], 
        [cell, cell, cell] ]
    Places player marker in cells, either X or O
    Prevents placement if cell is populated
    Expose: - Getting the board
            - Placing the player marker
            - Printing board to console (temporary for testing)
*/
const Gameboard = (function() {
    const rows = 3;
    const columns = 3;
    let board = [];

    function createBoard() {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i][j] = 0;
            }
        }
    }
    createBoard();

    const getBoard = () => board;

    const placeMarker = (player, row, column, isValidCell = false) => {
        isValidCell = false;
        if (board[row][column] === 0) {
            board[row][column] = player.marker;
            isValidCell = true;
        }
        return isValidCell;
    }

    const resetBoard = () => {
        createBoard();
    }

    const printBoard = () => {
        console.log(board);
    }
    return {getBoard, placeMarker, resetBoard, printBoard};
}());

/*  Player sets names and markers for both players and changes the turns
    Each player chooses the cell they want to place their marker and the turn changes
    Player 1 = X, Player 2 = O
    Expose: - Player info and turn choice
*/
function Player(name, number) {
    const marker = number === 1 ? 'X' : 'O';
    let score = 0;
    return {name, number, marker, score};
}

/*  Score checks rows, columns, and diagonals for all three cells and if
    they match (same marker in each) then that player wins the round
*/
function GameRules(board, marker) {
    let isWinner = false;
    let markerCount = 0;

    function checkRows() {
        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board[0].length; column++) {
                if (board[row][column] === marker) markerCount++;
                if (markerCount === 3) isWinner = true;
            }
            markerCount = 0;
        }
    }

    function checkColumns(column) {
        for (let row = 0; row < board.length; row++) {
            if (board[row][column] === marker) markerCount++;
            if (markerCount === 3) isWinner = true;
        }
        markerCount = 0;
    }

    function checkDiagonals() {
        if ((board[0][0] === marker) &&
            (board[1][1] === marker) &&
            (board[2][2] === marker)) {
            isWinner = true;
        }
        if ((board[0][2] == marker) &&
            (board[1][1] == marker) &&
            (board[2][0] == marker)) {
            isWinner = true;
            }
    }

    function checkTie() {
        let cellCount = 0;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[0].length; col++) {
                if (board[row][col] !== 0) cellCount++;
            }
        }
        if (cellCount === 9) isWinner = 'tie';
    }

    const checkWin = () => {
        checkRows();
        checkDiagonals();
        for (let column = 0; column < board[0].length; column++) {
            checkColumns(column);
        }
        if (!isWinner) checkTie();
    }

    const getWinner = () => isWinner
    return {checkWin, getWinner};
};

/*  GameController controls the flow of the game
    Sets up each player
    Gets the board
    Player plays their turn
    Score conditions checked
    If win, display winner and update score
    If no winner, continue
*/
const GameController = (function() {
    const player1 = Player('Player 1', 1);
    const player2 = Player('Player 2', 2);
    let currentPlayer = player1;
    let winner;
    const scoreHandler = GameRules(Gameboard.getBoard(), currentPlayer.marker);
    let isValidCell = false;

    function switchPlayer(player) {
        currentPlayer = player.number === 1 ? player2 : player1;
    }

    function playRound(rowChoice, colChoice) {
        isValidCell = Gameboard.placeMarker(currentPlayer, rowChoice, colChoice);
        if (isValidCell) {
            scoreHandler.checkWin();

            if (scoreHandler.getWinner()) {
                console.log(`Winner: ${currentPlayer.name}!`);
                currentPlayer.score++;
                winner = currentPlayer;
                currentPlayer = player1;
                return scoreHandler.getWinner();
            } else if (scoreHandler.getWinner() === 'tie') {
                console.log('Tied!');
                currentPlayer = player1;
                return scoreHandler.getWinner();
            }
            switchPlayer(currentPlayer);
        }
    }

    function printNewRound() {
        console.log(`${currentPlayer.name}'s Turn`);
        Gameboard.printBoard();
    }

    const getWinner = () => winner;

    return {playRound, printNewRound, getWinner}
}());

GameController.printNewRound();

const ScreenController = (function() {
    const boardContainer = document.querySelector('.board-container');
    const cellList = document.getElementsByClassName('cell');
    const board = Gameboard.getBoard();
    let rowChoice = '';
    let colChoice = '';
    
    boardContainer.addEventListener('click', (e) => {
        rowChoice = Number(e.target.dataset.row);
        colChoice = Number(e.target.dataset.col);
        const isWinner = GameController.playRound(rowChoice, colChoice);
        updateBoard();
        if (isWinner) {
            updateWinner(isWinner);
        }
        GameController.printNewRound();
    })
    
    function updateBoard() {
        let cell = 0;
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[0].length; col++) {
                if (board[row][col] !== 0) {
                    cellList[cell].textContent = board[row][col];
                }
                cell++;
            }
        }
    }
    
    
    function resetBoard() {
        Gameboard.resetBoard();
        for (let cell = 0; cell < cellList.length; cell++) {
            cellList[cell].textContent = '';
        }
    }
    
    return {resetBoard};
})();

const ScreenNotifications = (function() {
    const winnerContainer = document.querySelector('.winner-container');
    
    function updateWinner(isWinner) {
        const winner = GameController.getWinner();
        switch (isWinner) {
            case true:
                winnerContainer.textContent = `Winner: ${winner.name}`;
                ScreenController.resetBoard();
            case 'tie':
                winnerContainer.textContent = 'tie';
                ScreenController.resetBoard();
        }
    }

})();

/* Data attributes on html divs to associate with .dataset
use the cell dataset as the choice in selecting a cell
Might need to use mod and division to get row/column
if I cant figure out a way to set cell dataset to the index
of each array item
Remove play button and refactor to play each round on a cell click
*/
