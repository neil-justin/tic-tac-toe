const gameboard = (() => {
    const marks = [];

    const insertMarker = (clickedSquareIndex, marker) => {
        gameboard.marks[clickedSquareIndex] = marker;
    };

    const emptyMarks = () => {
        /* This was more safer and faster as compared to "marks = []" when
            emptying an array, as it also empties other references */
        gameboard.marks.length = 0;
    };

    return { marks, insertMarker, emptyMarks };
})();

const displayController = (() => {
    const renderMarker = (targetSquare, marker) => {
        targetSquare.textContent = marker;

        marker === 'X' ?
            targetSquare.style.color = '#e63946' :
            targetSquare.style.color = '#457b9d';
    };

    /* I have to declare this using the 'let' keyword because I will use this
        as a reference later on to revert the squares to their initial state. */
    let _winningSquares;

    const highlightWinningPattern = (winningMarker, square1, square2, square3) => {
        _winningSquares = document.querySelectorAll(`[data-index='${square1}'],
            [data-index='${square2}'], [data-index='${square3}']`);

        switch (winningMarker) {
            case 'X':
                _winningSquares.forEach(square => {
                    // a lighter shade of the red
                    square.style.backgroundColor = 'hsl(355, 78%, 76%)';
                });
                break;
            case 'O':
                _winningSquares.forEach(square => {
                    square.style.backgroundColor = 'hsl(203, 39%, 64%)';
                });
        }

        _winningSquares.forEach(square => square.classList.add('winning-square'));
    };

    const clearGameboard = () => {
        if (checker.gameWinner) {
            _winningSquares.forEach(square => {
                square.classList.remove('winning-square');
                square.style.backgroundColor = '#a8dadc';
            });
        }

        const gameboardSquares = document.querySelectorAll('.gameboard-square');
        gameboardSquares.forEach(square => {
            // this again allow the players from clicking on the gameboard
            square.style.pointerEvents = 'auto';
            square.textContent = ''
        });
    };

    const dialogBox = document.querySelector('#game-result-dialog-box');
    const playAgainBtnCntr = document.querySelector('[method=dialog]');
    const playAgainBtn = document.querySelector('#play-again-btn');

    return {
        renderMarker,
        highlightWinningPattern,
        clearGameboard,
        dialogBox,
        playAgainBtnCntr,
        playAgainBtn,
    };
})();

const Player = (marker) => {
    const placeMarker = (targetSquare, targetSquareIndex) => {
        gameboard.insertMarker(targetSquareIndex, marker);
        displayController.renderMarker(targetSquare, marker);
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
    let gameWinner;

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
                checker.gameWinner = marker;
                break;
            }
        }

        if (checker.totalInputtedMarkers === 9 && !checker.gameWinner) {
            checker.isGameOver = true;
        }
    };

    let totalInputtedMarkers = 0;

    const incrementTotalInputtedMarkers = () => {
        checker.totalInputtedMarkers++;
    };

    const announceGameResult = (dialogBox, playAgainBtnCntr) => {
        const gameResult = document.createElement('p');
        gameResult.setAttribute('id', 'game-result-text');
        dialogBox.insertBefore(gameResult, playAgainBtnCntr);

        switch (checker.gameWinner) {
            case 'X':
            case 'O':
                gameResult.textContent = `Player ${checker.gameWinner}'s win`;
                break;
            case undefined:
                gameResult.textContent = `Draw`;
        }
    };

    const removeGameResult = () => {
        const gameResult = document.querySelector('#game-result-text');
        gameResult.remove();
    };

    const revertVariables = () => {
        _isItPlayerXTurn = true;
        checker.isGameOver = false;
        checker.gameWinner = undefined;
        checker.totalInputtedMarkers = 0;
    };

    return {
        checkPlayerTurn,
        isGameOver,
        gameWinner,
        checkGameStatus,
        totalInputtedMarkers,
        incrementTotalInputtedMarkers,
        announceGameResult,
        removeGameResult,
        revertVariables,
    };
})();

const gameboardSquares = document.querySelectorAll('.gameboard-square');
gameboardSquares.forEach(square => {
    square.addEventListener('click', (event) => {
        if (event.target.textContent === '') {
            checker.checkPlayerTurn(event.target);

            checker.incrementTotalInputtedMarkers();
            /* The least amount of moves before either side could get a winning
            pattern is 5 moves, right? It would be a waste of time to check if
            there's a 3-in-a-row pattern or if the game results in a draw if
            the totalInputtedMarkers is still below 5. Hope that make sense */
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

displayController.playAgainBtn.addEventListener('click', () => {
    checker.removeGameResult();
    gameboard.emptyMarks();
    displayController.clearGameboard();
    checker.revertVariables();
});