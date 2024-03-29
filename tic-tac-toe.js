// Player Factory Function
const Player = () => {
    let name;
    const setName = (newName) => { playerObj.name = newName; };
    const playerObj = { name, setName }; // Create Player Object
    return playerObj; // Return Player Object
};

let p1 = Player(), p2 = Player(), ai; // Initialize Player 1 and Player 2 Objects
const gameContainer = document.getElementById('game-container');

// Menu Module
const menu = (() => {
    const startGame = () => {
        ai = document.getElementById('ai').checked;
        p1.setName(document.getElementById('p1-name').value);
        if (ai) { p2.setName('AI'); }
        else { p2.setName(document.getElementById('p2-name').value); }
        gameContainer.innerHTML = '';
        createDetails();
        createBoard(gameBoard);
        game.updateDetails();
        if (ai && !game.p) { game.aiTurn(); } // Check if AI turn upon start
    };
    return { startGame }
})();

// Game Board Module
const gameBoard = (() => {
    let board = [[],[],[]];
    return { board };
})();

// Game Module
const game = (() => {
    let p = Math.floor(Math.random() * 2); // Randomly set current player (between 0 and 1)
    let currentPlayer = () => { return p ? p1.name : p2.name; }; // Player 1 (p == 1), Player 2 (p == 0)
    let tieGame = false;
    let gameOver = false;

    const markBoard = (space, gameBoard, x, y) => {
        let mark = p ? 'O' : 'X'; // Player 1 = 'O', Player 2 = 'X'
        space.style.color = p ? 'green' : 'red'; // Player 1 (O) = Green, Player 2 (X) = Red

        if (!gameOver) {
            gameBoard.board[y][x] = mark;
            space.innerHTML = gameBoard.board[y][x];
        }
    };

    const checkWin = (gameBoard) => {
        let total;
        const mark = p ? 'O' : 'X';
        let boardFull = true;
        let win = false;

        // Check Horizontal
        for (let y = 0; y < 3; y++) {
            total = 0;
            for (let x = 0; x < 3; x++) {
                if (mark == gameBoard.board[y][x]) { total++; } // Check if mark is equal to current mark
            }
            if (total == 3) { win = true; }
        }

        // Check Vertical
        for (let x = 0; x < 3; x++) {
            total = 0;
            for (let y = 0; y < 3; y++) {
                if (mark == gameBoard.board[y][x]) { total++; } // Check if current mark is equal to 1st mark
            }
            if (total == 3) { win = true; }
        }

        // Check Diagonal (Top-Left to Bottom-Right)
        total = 0;
        for (let xy = 0; xy < 3; xy++) {
            if (mark == gameBoard.board[xy][xy]) { total++; } // Check if current mark is equal to 1st mark
        }
        if (total == 3) { win = true; }

        // Check Diagonal (Top-Right to Bottom-Left)
        total = 0;
        for (let x = 2, y = 0; x >= 0, y < 3; x--, y++) {
            if (mark == gameBoard.board[y][x]) { total++; } // Check if current mark is equal to 1st mark
        }
        if (total == 3) { win = true; }

        // Check Tie Game
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                if (!gameBoard.board[y][x]) { boardFull = false; }
            }
        }

        if (win || boardFull) { gameOver = true; }
        if (!win && boardFull) { tieGame = true; }

        // If game over, remove all Event Listeners by cloning board
        if (gameOver) {
            let oldBoard = document.getElementById('board');
            let newBoard = oldBoard.cloneNode(true);
            oldBoard.parentNode.replaceChild(newBoard, oldBoard);
        }
    };

    const updateDetails = () => {
        const detailsContainer = document.getElementById('details-container');
        const details = document.getElementById('details');

        if (gameOver && tieGame) { details.innerHTML = 'Tie Game!'; }
        else if (gameOver && !tieGame) { details.innerHTML = currentPlayer() + ' Wins!';
        } else { details.innerHTML = 'Turn:<br />' + currentPlayer(); }

        if (gameOver) {
            const menu = document.createElement('div');
            const rematchButton = document.createElement('div');

            menu.id = 'menu';
            rematchButton.id = 'rematch-btn';
            rematchButton.innerHTML = 'Rematch?';
            rematchButton.addEventListener('click', () => { clearBoard(); });

            menu.append(rematchButton);
            detailsContainer.parentNode.insertBefore(menu, detailsContainer.nextSibling);
        }
    };

    const endTurn = () => {
        if (!gameOver) { p = 1 - p; } // Alternate player (between 0 and 1)
    };

    const clearBoard = () => {
        for (let y = 0; y < 3; y++) {
            for (let x= 0; x < 3; x++) {
                gameBoard.board[y][x] = null;
            }
        }

        p = Math.floor(Math.random() * 2); // Randomly set current player (between 0 and 1)
        currentPlayer = () => { return p ? p1.name : p2.name; };
        tieGame = false;
        gameOver = false;
        gameContainer.innerHTML = '';
        createDetails();
        createBoard(gameBoard);
        updateDetails();
        if (ai && !p) { aiTurn(); } // Check if AI turn upon start
    };

    const aiTurn = () => {
        let validPlay = false;
        let mark = p ? 'O' : 'X'; // Player 1 = 'O', Player 2 = 'X'
        let spaces = document.querySelectorAll('.space');
        let pos, space, x, y;

        if (!gameOver) {
            // Set timeout to 1 second (1000 ms) before AI turn
            setTimeout(() => {
                while (!validPlay) {
                    pos = Math.floor(Math.random() * 9); // Randomly select space (between 0 and 8)
                    space = spaces[pos];

                    // Get x based on pos
                    if (pos == 0 || pos == 3 || pos == 6) { x = 0; }
                    else if (pos == 1 || pos == 4 || pos == 7) { x = 1; }
                    else if (pos == 2 || pos == 5 || pos == 8) { x = 2; }

                    // Get y based on pos
                    if (pos == 0 || pos == 1 || pos == 2) { y = 0; }
                    else if (pos == 3 || pos == 4 || pos == 5) { y = 1; }
                    else if (pos == 6 || pos == 7 || pos == 8) { y = 2; }

                    if (!gameBoard.board[y][x]) {
                        validPlay = true;
                        gameBoard.board[y][x] = mark;
                        space.innerHTML = gameBoard.board[y][x];
                        space.style.color = p ? 'green' : 'red'; // Player 1 (O) = Green, Player 2 (X) = Red
                    }
                }
                checkWin(gameBoard);
                endTurn();
                updateDetails();
            }, 100);
        }
    };

    return { p, currentPlayer, markBoard, checkWin, updateDetails, endTurn, clearBoard, aiTurn };
})();

const createDetails = () => {
    const detailsContainer = document.createElement('div');
    const details = document.createElement('div');

    detailsContainer.id = 'details-container';
    details.id = 'details';

    detailsContainer.append(details);
    gameContainer.append(detailsContainer);
};

const createBoard = gameBoard => {
    const boardContainer = document.createElement('div');
    boardContainer.id = 'board';
    gameContainer.append(boardContainer);

    // Get Board Style & Size
    const boardStyle = getComputedStyle(boardContainer);
    const boardWidth = parseInt(boardStyle.getPropertyValue('width'));
    const boardHeight = parseInt(boardStyle.getPropertyValue('height'));

    // Set Space Size
    let spaceWidth = boardWidth / 3;
    let spaceHeight = boardHeight / 3;
    const borderSize = 1;

    for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 3; x++) {
            // Create Space
            const space = document.createElement('div');
            space.setAttribute('class', 'space');
            space.style.width = spaceWidth - borderSize + 'px';
            space.style.height = spaceHeight - borderSize + 'px';
            space.style.background = 'rgb(32, 32, 32)';
            space.style.borderRight = '1px solid white';
            space.style.borderBottom = '1px solid white';
            space.style.cursor = 'pointer';

            // Event Listener Functions
            const spaceOnHover = () => { space.style.background = 'rgb(64, 64, 64)'; };
            const spaceOffHover = () => { space.style.background = 'rgb(32, 32, 32)'; };
            const spaceOnClick = () => {
                // If Space is empty, mark Board
                if (!gameBoard.board[y][x]) {
                    space.style.background = 'rgb(32, 32, 32)';
                    space.style.cursor = 'default';
                    game.markBoard(space, gameBoard, x, y);
                    game.checkWin(gameBoard);
                    game.endTurn();
                    game.updateDetails();
                    space.removeEventListener('mouseenter', spaceOnHover);
                    space.removeEventListener('mouseleave', spaceOffHover);
                    space.removeEventListener('click', spaceOnClick);

                    if (ai) { game.aiTurn(); };
                }
            };

            space.addEventListener('mouseenter', spaceOnHover);
            space.addEventListener('mouseleave', spaceOffHover);
            space.addEventListener('click', spaceOnClick);

            // If last column, remove right border
            if (x == 2) {
                space.style.width = spaceWidth + 'px';
                space.style.borderRight = 'unset';
            }
            // If last row, remove bottom border
            if (y == 2) {
                space.style.height = spaceHeight + 'px';
                space.style.borderBottom = 'unset';
            }

            boardContainer.append(space); // Add Space to Board
        }
    }
};