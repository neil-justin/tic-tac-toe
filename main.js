const gameboard = (() => {
    const marks = [];

    return { marks };
})();

const displayController = (() => {
    const renderMarker = (targetSquare, marker) => {
        targetSquare.textContent = marker;

        return marker === 'X' ?
            targetSquare.style.color = '#e63946' :
            targetSquare.style.color = '#457b9d';
    };

    const highlightWinningPattern = (marker, square1, square2, square3) => {
        const winningSquares = document.querySelectorAll(`[data-index='${square1}'],
            [data-index='${square2}'], [data-index='${square3}']`);

        switch (marker) {
            case 'X':
                winningSquares.forEach(square => {
                    // a lighter shade of the red
                    square.style.backgroundColor = 'hsl(355, 78%, 76%)';
                    square.style.color = 'whitesmoke';
                });
                break;
            case 'O':
                winningSquares.forEach(square => {
                    square.style.backgroundColor = 'hsl(203, 39%, 64%)';
                    square.style.color = 'whitesmoke';
                });
        }
    }

    return { renderMarker, highlightWinningPattern };
})();

const Player = (marker) => {
    const getPlayerName = () => {
        /* To make things simple. I feel like prompting a dialog box
            just to ask for players's name is a bother for the players */
        return marker;
    }

    const placeMarker = (targetSquare, marker, targetSquareIndex) => {
        displayController.renderMarker(targetSquare, marker);

        return gameboard.marks[targetSquareIndex] = marker;
    }

    return { getPlayerName, placeMarker, }
};

const playerX = Player('X');
const playerO = Player('O');

const checker = (() => {
    // playerX represents the user who's marker is X
    let _isItPlayerXTurn = true;

    const checkPlayerTurn = (clickedSquare) => {
        _isItPlayerXTurn ?
            playerX.placeMarker(clickedSquare, 'X', clickedSquare.dataset.index) :
            playerO.placeMarker(clickedSquare, 'O', clickedSquare.dataset.index);

        return _isItPlayerXTurn = !_isItPlayerXTurn;
    };

    const winningPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]

    let isGameOver = false;
    let isThereAWinner;

    const checkWinningPattern = (marker, patterns, gameboard) => {
        const isEqualToMarker = (element) => {
            return gameboard[element] === marker;
        };

        for (let i = 0; i <= patterns.length - 1; i++) {
            if (patterns[i].every(isEqualToMarker)) {
                displayController.highlightWinningPattern(marker,
                    patterns[i][0], patterns[i][1], patterns[i][2]);

                checker.isGameOver = true;
                checker.isThereAWinner = true;

                return patterns[i];
            }
        }
    };

    let totalInputtedMarkers = 0;

    const checkIfDraw = () => {
        if (!isGameOver && !isThereAWinner) {
            checker.isGameOver = true;
            checker.isThereAWinner = false;
        }

        return checker.isGameOver, checker.isThereAWinner;
    };

    return {
        checkPlayerTurn,
        winningPatterns,
        isGameOver,
        isThereAWinner,
        checkWinningPattern,
        totalInputtedMarkers,
        checkIfDraw,
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
                checker.checkWinningPattern(event.target.textContent,
                    checker.winningPatterns, gameboard.marks);

                if (checker.totalInputtedMarkers === 9) {
                    checker.checkIfDraw();
                }

                if (checker.isGameOver) {
                    gameboardSquares.forEach(square => {
                        square.style.pointerEvents = 'none';
                    });

                    if (!checker.isThereAWinner) {
                        gameboardSquares.forEach(square => {
                            square.style.color = '#1d3557';
                        });
                    }
                }
            }
        }
    });
});