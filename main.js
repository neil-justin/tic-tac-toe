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

    return { renderMarker };
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

    const checkWinningPattern = (gameboardArray, marker) => {
        switch (true) {
            // horizontal patterns
            case (gameboardArray[0] === marker && gameboardArray[1] === marker
                && gameboardArray[2] === marker):
            case (gameboardArray[3] === marker && gameboardArray[4] === marker
                && gameboardArray[5] === marker):
            case (gameboardArray[6] === marker && gameboardArray[7] === marker
                && gameboardArray[8] === marker):
            // vertical patterns
            case (gameboardArray[0] === marker && gameboardArray[3] === marker
                && gameboardArray[6] === marker):
            case (gameboardArray[1] === marker && gameboardArray[4] === marker
                && gameboardArray[7] === marker):
            case (gameboardArray[2] === marker && gameboardArray[5] === marker
                && gameboardArray[8] === marker):
            // diagonal patterns
            case (gameboardArray[0] === marker && gameboardArray[4] === marker
                && gameboardArray[8] === marker):
            case (gameboardArray[2] === marker && gameboardArray[4] === marker
                && gameboardArray[6] === marker):
                if (marker === 'X') {
                    console.log(`Player ${playerX.getPlayerName()}'s win!`);
                } else {
                    console.log(`Player ${playerO.getPlayerName()}'s win!`);
                }
        }
    };

    return { checkPlayerTurn, checkWinningPattern };
})();

const gameboardSquares = document.querySelectorAll('.gameboardSquare');
gameboardSquares.forEach(square => {
    square.addEventListener('click', (event) => {
        if (event.target.textContent === '') {
            checker.checkPlayerTurn(event.target);

            const totalInputtedMarkers = gameboard.marks
                .filter((mark) => mark !== 'undefined').length;

            /* the least amount of moves before either side could get
            a winning pattern is 5, right? */
            if (totalInputtedMarkers >= 5) {
                checker.checkWinningPattern(
                    gameboard.marks, /* marker = */ event.target.textContent);
            }
        }
    });
});