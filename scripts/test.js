// Each row, check all columns for matching marker
if (board[0][0] !== marker) return;
if (board[0][1] !== marker) return;
if (board[0][2] !== marker) return;

if (board[1][0] !== marker) return;
if (board[1][1] !== marker) return;
if (board[1][2] !== marker) return;

if (board[2][0] !== marker) return;
if (board[2][1] !== marker) return;
if (board[2][2] !== marker) return;


// Each column, check all rows for matching marker
if (board[0][0] !== marker) return;
if (board[1][0] !== marker) return;
if (board[2][0] !== marker) return;

if (board[0][1] !== marker) return;
if (board[1][1] !== marker) return;
if (board[2][1] !== marker) return;

if (board[0][2] !== marker) return;
if (board[1][2] !== marker) return;
if (board[2][2] !== marker) return;

// Check diagonals
if (board[0][0] !== marker) return;
if (board[1][1] !== marker) return;
if (board[2][2] !== marker) return;

if (board[0][2] !== marker) return;
if (board[1][1] !== marker) return;
if (board[2][0] !== marker) return;
