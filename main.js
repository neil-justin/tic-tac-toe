const gameboard = (() => {
    const marks = [];

    return { marks };
})();

const Player = (marker) => {
    const getPlayerName = () => {
        /* To make things simple. I feel like prompting a dialog box
            just to ask for players's name is a bother for the players */
        return marker;
    }

    const placeMarker = (targetSquare, marker, targetSquareIndex) => {
        targetSquare.textContent = marker;

        marker === 'X' ?
            targetSquare.style.color = '#e63946' :
            targetSquare.style.color = '#457b9d';

        return gameboard.marks[targetSquareIndex] = marker;
    }

    return { getPlayerName, placeMarker, }
};

const playerX = Player('X');
const playerO = Player('O');

const checker = (() => {
    // playerX represents the user who's marker is X
    let _isItPlayerXTurn = true;

    const checkPlayerTurn = (targetSquare) => {
        _isItPlayerXTurn ?
            playerX.placeMarker(targetSquare, 'X', targetSquare.dataset.index) :
            playerO.placeMarker(targetSquare, 'O', targetSquare.dataset.index);

        return _isItPlayerXTurn = !_isItPlayerXTurn;
    };

    return { checkPlayerTurn };
})();

const gameboardSquares = document.querySelectorAll('.gameboardSquare');
gameboardSquares.forEach(square => {
    square.addEventListener('click', (event) => {
        if (event.target.textContent === '') {
            checker.checkPlayerTurn(event.target);
        }
    });
});