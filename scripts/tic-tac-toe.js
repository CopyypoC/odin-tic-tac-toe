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

    const placeMarker = (player, row, column) => {
        if (board[row][column] === 0) {
            board[row][column] = player.marker;
        }
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
    return {name, number, marker, score}
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
    return {checkWin, getWinner}
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
    let scoreHandler = GameRules(Gameboard.getBoard(), currentPlayer.marker);

    function switchPlayer(player) {
        currentPlayer = player.number === 1 ? player2 : player1;
    }

    function playRound() {
        const rowChoice = Number(prompt('Choose the row'));
        const columnChoice = Number(prompt('Choose the column'));
        Gameboard.placeMarker(currentPlayer, rowChoice, columnChoice);
        scoreHandler.checkWin();

        if (scoreHandler.getWinner()) {
            console.log(`Winner: ${currentPlayer.name}!`);
            currentPlayer.score++;
            Gameboard.resetBoard();
            currentPlayer = player2;
        } else if (scoreHandler.getWinner() === 'tie') {
            console.log('Tied!');
            Gameboard.resetBoard();
            currentPlayer = player2;
        }
        switchPlayer(currentPlayer);
    }

    function printNewRound() {
        console.log(`${currentPlayer.name}'s Turn`);
        Gameboard.printBoard();
    }
    return {playRound, printNewRound}
}());

GameController.printNewRound();
const playBtn = document.querySelector('.play-btn');
playBtn.addEventListener('click', () => {
    GameController.playRound();
    GameController.printNewRound();
})