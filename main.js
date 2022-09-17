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