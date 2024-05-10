/*  TO DO:
    - Let players input their own names
    - Score counter update
*/

/*  Gameboard stored as an array inside an object
    2-D Array, 3 rows and 3 columns
    [   [cell, cell, cell], 
        [cell, cell, cell], 
        [cell, cell, cell] ]
    Places player marker in cells, either X or O
    Prevents placement if cell is populated
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

    function resetWinner() {
        isWinner = false;
    }
    return {checkWin, getWinner, resetWinner};
};

/*  GameController controls the flow of the game.
    It sets up the players and handles switching players and
    the winning conditions checks.
*/
const GameController = (function() {
    const player1 = Player('Player 1', 1);
    const player2 = Player('Player 2', 2);
    const player1Name = document.querySelector('#player1-name');
    const player2Name = document.querySelector('#player2-name');
    let currentPlayer = player1;
    let winner = null;
    let isValidCell = false;
    
    function switchPlayer(player) {
        currentPlayer = player.number === 1 ? player2 : player1;
    }
    
    function playRound(rowChoice, colChoice) {
        isValidCell = Gameboard.placeMarker(currentPlayer, rowChoice, colChoice);
        if (isValidCell) {
            const scoreHandler = GameRules(Gameboard.getBoard(), 
                                            currentPlayer.marker);
            if (scoreHandler.getWinner() !== false) scoreHandler.resetWinner();
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

    player1Name.addEventListener('input', (e) => {
        player1.name = e.target.value;
    })

    player2Name.addEventListener('input', (e) => {
        player2.name = e.target.value;
    })

    return {playRound, printNewRound, getWinner}
}());

GameController.printNewRound();

// Updates the DOM board to match the Gameboard
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
            ScreenNotifications.updateWinner(isWinner);
            ScreenNotifications.showResults();
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

// Displays a modal with the results of the game and resets the board
const ScreenNotifications = (function() {
    const gameNotif = document.querySelector('.game-notif');
    const gameResults = document.querySelector('.game-results');
    const nextGameBtn = document.querySelector('.next-game-btn');

    function updateWinner(isWinner) {
        const winner = GameController.getWinner();
        switch (isWinner) {
            case true:
                gameResults.textContent = `Winner: ${winner.name}`;
                break;
            case 'tie':
                gameResults.textContent = 'tie';
                break;
        }
    }
    
    function showResults() {
        gameNotif.showModal();
    }

    nextGameBtn.addEventListener('click', () => {
        gameNotif.close();
        ScreenController.resetBoard();
    })
    
    return {updateWinner, showResults};
})();