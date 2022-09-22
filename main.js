const gameboard = (() => {
    const marks = [];

    return { marks, };
})();

const displayController = (() => {
    const renderMarker = (targetSquare, marker) => {
        targetSquare.textContent = marker;

        marker === 'X' ?
            targetSquare.style.color = '#e63946' :
            targetSquare.style.color = '#457b9d';
    };

    const highlightWinningPattern = (winningMarker, square1, square2, square3) => {
        const winningSquares = document.querySelectorAll(`[data-index='${square1}'],
            [data-index='${square2}'], [data-index='${square3}']`);

        switch (winningMarker) {
            case 'X':
                winningSquares.forEach(square => {
                    // a lighter shade of the red
                    square.style.backgroundColor = 'hsl(355, 78%, 76%)';
                });
                break;
            case 'O':
                winningSquares.forEach(square => {
                    square.style.backgroundColor = 'hsl(203, 39%, 64%)';
                });
        }

        winningSquares.forEach(square => square.classList.add('winning-square'));
    };

    const dialogBox = document.querySelector('#game-result-dialog-box');
    const playAgainBtnCntr = document.querySelector('[method=dialog]');
    const playAgainBtn = document.querySelector('#play-again-btn');

    return {
        renderMarker,
        highlightWinningPattern,
        dialogBox,
        playAgainBtnCntr,
        playAgainBtn,
    };
})();

const Player = (marker) => {
    const placeMarker = (targetSquare, targetSquareIndex) => {
        displayController.renderMarker(targetSquare, marker);

        gameboard.marks[targetSquareIndex] = marker;
    };

    return { placeMarker, };
};

const playerX = Player('X');
const playerO = Player('O');

const checker = (() => {
    // playerX represents the user who's marker is X
    let _isItPlayerXTurn = true;

    const checkPlayerTurn = (clickedSquare) => {
        _isItPlayerXTurn ?
            playerX.placeMarker(clickedSquare, clickedSquare.dataset.index) :
            playerO.placeMarker(clickedSquare, clickedSquare.dataset.index);

        _isItPlayerXTurn = !_isItPlayerXTurn;
    };

    const _winningPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let isGameOver = false;
    let _gameWinner;

    const checkGameStatus = (marker, gameboard) => {
        const isEqualToMarker = (square) => {
            return gameboard[square] === marker;
        };

        for (let i = 0; i <= _winningPatterns.length - 1; i++) {
            if (_winningPatterns[i].every(isEqualToMarker)) {
                displayController.highlightWinningPattern(marker,
                    _winningPatterns[i][0], _winningPatterns[i][1],
                    _winningPatterns[i][2]);

                checker.isGameOver = true;
                checker._gameWinner = marker;
                break;
            }

            if (totalInputtedMarkers === 9 && !_gameWinner) {
                checker.isGameOver = true;
                break;
            }
        }
    };

    let totalInputtedMarkers = 0;

    const announceGameResult = (dialogBox, playAgainBtnCntr) => {
        const gameResult = document.createElement('p');
        gameResult.setAttribute('id', 'game-result-text');
        dialogBox.insertBefore(gameResult, playAgainBtnCntr);

        switch (_gameWinner) {
            case 'X':
            case 'O':
                gameResult.textContent = `Player ${_gameWinner}'s win`;
                break;
            case undefined:
                gameResult.textContent = `Draw`;
        }
    }

    return {
        checkPlayerTurn,
        isGameOver,
        checkGameStatus,
        totalInputtedMarkers,
        announceGameResult,
    };
})();

const gameboardSquares = document.querySelectorAll('.gameboard-square');
gameboardSquares.forEach(square => {
    square.addEventListener('click', (event) => {
        if (event.target.textContent === '') {
            checker.checkPlayerTurn(event.target);

            checker.totalInputtedMarkers++;
            /* the least amount of moves before either side could get
            a winning pattern is 5, right? */
            if (checker.totalInputtedMarkers >= 5) {
                checker.checkGameStatus(event.target.textContent,
                    gameboard.marks);

                if (checker.isGameOver) {
                    gameboardSquares.forEach(square => {
                        square.style.pointerEvents = 'none';
                    });

                    setTimeout(() => {
                        displayController.dialogBox.showModal();
                    }, 2000);

                    checker.announceGameResult(displayController.dialogBox,
                        displayController.playAgainBtnCntr);
                }
            }
        }
    });
});

displayController.playAgainBtn.addEventListener('click', gameboard.reset);