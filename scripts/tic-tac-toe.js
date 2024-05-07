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

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i][j] = 0;
        }
    }

    const getBoard = () => board;

    const placeMarker = (player, row, column) => {
        if (board[row][column] === 0) {
            board[row][column] = player.marker;
        }
    }

    const printBoard = () => {
        console.log(board);
    }
    return {getBoard, placeMarker, printBoard};
}());

/*  Player sets names and markers for both players and changes the turns
    Each player chooses the cell they want to place their marker and the turn changes
    Player 1 = X, Player 2 = O
    Expose: - Player info and turn choice
*/
function Player(name, number) {
    const marker = number === 1 ? 'X' : 'O';
    return {name, number, marker}
}

/*  Score checks rows, columns, and diagonals for all three cells and if
    they match (same marker in each) then that player wins the round
*/
function Score(board, marker) {
    let score = 0;
    let isWinner = false;

    function checkRows() {
        for (let row = 0; row < board.length; row++) {
            for (let column = 0; column < board[column].length; column++) {
                if (board[row][column] !== marker) continue;
                isWinner = true;
            }
        }
    }

    function checkColumns(column) {
        for (let row = 0; row < board.length; row++) {
            if (board[row][column] !== marker) continue;
            isWinner = true;
        }
    }

    function checkDiagonals() {
        if (board[0][0] !== marker) return;
        if (board[1][1] !== marker) return;
        if (board[2][2] !== marker) return;

        if (board[0][2] !== marker) return;
        if (board[1][1] !== marker) return;
        if (board[2][0] !== marker) return;
    }

    const checkWin = () => {
        checkRows();
        checkDiagonals();
        for (let column = 0; column < board[0].length; column++) {
            checkColumns(column);
        }
    }

    const updateScore = (isWinner) => {
        isWinner ? score++ : score;
    }
    return {checkWin, updateScore}
};

/*  GameController calls everything together to play each round
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

    function switchPlayer(player) {
        currentPlayer = player.number === 1 ? 2 : 1;
    }

    function playRound() {
        const rowChoice = Number(prompt('Choose the row'));
        const columnChoice = Number(prompt('Choose the column'));
        Gameboard.placeMarker(currentPlayer, rowChoice, columnChoice);
        // Score.updateScore();
        switchPlayer(currentPlayer);
    }

    function printNewRound() {
        console.log(`${currentPlayer.name}'s Turn`);
        Gameboard.printBoard();
    }
    return {playRound, printNewRound}
}());

GameController.printNewRound();
GameController.playRound();
GameController.printNewRound();