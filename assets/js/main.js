document.addEventListener('DOMContentLoaded', startAll());

function startAll() {
    let grid = document.getElementById('grid');
    let preview = document.getElementById('preview-display');
    let scoreDisplay = document.getElementById('score');
    let restartBtn = document.getElementById('restart-btn');
    let score = 0;
    let pointsMade = 0;
    let timerId;

    // creating blocks in grid
    for (let y = 1; y < 21; y++) {

        for (let x = 1; x < 11; x++) {

            grid.innerHTML += `<div class="square square-${x}-${y}"></div>`;

        }
    }
    // blocks "under" the grid
    for (let index = 0; index < 10; index++) {
        grid.innerHTML += `<div class="square taken"></div>`
        
    }

    let squares = Array.from(document.querySelectorAll('.square'));
    console.log(squares);

    // creating blocks in preview display
    for (let i = 0; i < 16; i++) {
        preview.innerHTML += `<div></div>`        
    }

    // defining all tetraminos
    const width = 10;
    const jTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const lTetromino = [
        [0, 1, width + 1, width*2+1],
        [2, width, width + 1, width + 2],
        [0, width, width*2, width*2+1],
        [0, 1, 2, width]
    ];

    const zTetromino = [
        [0,width,width+1,width*2+1],
        // [width+1, width+2,width*2,width*2+1],
        [1,2,width,width+1],
        [0,width,width+1,width*2+1],
        [1,2,width,width+1],

    ];

    const sTetromino = [
        [0, 1, width + 1, width + 2],
        [1, width, width + 1, width * 2],
        [0, 1, width + 1, width + 2],
        [1, width, width + 1, width * 2],
    ];

    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];

    const allTetrominoes = [jTetromino, lTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino ];
    const colors = ['blu', 'orange', 'red', 'green', 'violet', 'yellow', 'aqua', ]; // respective colors
    

    let currentPosition = 4; // where to start a tetromino (every block in the squares array has an index)
    let currentRotation = 0;

    let nextRandom = 0;
    // randomly selecting a Tetromino
    let random = Math.floor(Math.random()*allTetrominoes.length);
    let currentTetro = allTetrominoes[random][currentRotation]; // [type of tetramino][rotation]
    // console.log(random);

    
    // --- START / PAUSE BUTTON ---
    let startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('click', playPauseFunction);

    // controlling the tetromino
    document.addEventListener('keydown', control);


    // --- FUNCTIONS ---
    function moveDown() {
        displayTetro(); // showing next tetromino

        if(!currentTetro.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            undraw()
            currentPosition += width
            draw()
        } else {
            freeze();  
        }
    }

    // drawing the tetromino
    function draw() {
        currentTetro.forEach(block => {
            squares[currentPosition + block].classList.add('tetromino');

            squares[currentPosition + block].style.backgroundColor = colors[random]; // adding colors
        })
    };
    
    //undrawing function
    function undraw() {
        currentTetro.forEach(block => {
            squares[currentPosition + block].classList.remove('tetromino');

            squares[currentPosition + block].style.backgroundColor = ''; // removing colors
        });
    }

    // freezing when touching the end or a taken block
    function freeze() {

        currentTetro.forEach(index => squares[currentPosition + index].classList.add('taken'));

        // start new tetromino
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * allTetrominoes.length);
        
        currentTetro = allTetrominoes[random][currentRotation];
        currentPosition = 4;

        //update score
        addScore();

        draw();

        // next-up tetromino
        displayTetro();
        
        gameOver();
    }

    // horizontal moves, unless it touches an edge or a taken block
    function moveLeft() {
        undraw();
        const atLeftEdge = currentTetro.some(index => (currentPosition + index) % width === 0); // returns tru if is at the left edge

        if (!atLeftEdge) {
            currentPosition -=1   
        };

        if (currentTetro.some(index => squares[currentPosition + index].classList.contains('taken') )) {
            currentPosition += 1
        };

        draw(); // redraw in new position
    };
    function moveRight() {
        undraw();
        const atRightEdge = currentTetro.some(index => (currentPosition + index) % width === width - 1); // returns tru if is at the Right edge

        if (!atRightEdge) {
            currentPosition += 1   
        };

        if (currentTetro.some(index => squares[currentPosition + index].classList.contains('taken') )) {
            currentPosition -= 1
        };

        draw();
    }

    // function to rotate the tetromino
    function checkRotatedPosition(P){ // function to fix rotation at edges

        P = P || currentPosition //getting current position

        // checking if is near left side
        if ((P+1) % width < 4) { //add 1 because the position index can be 1 less than where the piece is (with how they are indexed)

            if (currentTetro.some(index=> (currentPosition + index + 1) % width === 0) ){   //use actual position to check if it's flipped over to right side
                currentPosition += 1    //if so, add one to wrap it back around
                checkRotatedPosition(P) //check again (for long tetrominoes)
            }
        }
        else if (P % width > 5) { // checking if is near right side
            if (currentTetro.some(index=> (currentPosition + index) % width === 0)){
                currentPosition -= 1
                checkRotatedPosition(P)
            }
        }
    };
    function rotate() {
        undraw();

        currentRotation++;

        if (currentRotation === currentTetro.length) {
            currentRotation = 0
        };
        
        currentTetro = allTetrominoes[random][currentRotation];

        checkRotatedPosition()

        draw();
    }

    //assigning controls
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 80) {
            playPauseFunction()
        }
    };

    // function to start or pause the game
    function playPauseFunction() {
        if (timerId) {
            startBtn.innerHTML= `<i class="fa-solid fa-circle-play"></i> Play`;

            clearInterval(timerId)
            timerId = null

            
        } else {
            startBtn.innerHTML= `<i class="fa-solid fa-circle-pause"></i> Pause`;
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*allTetrominoes.length );
            displayTetro();
        }
    };


    // --- UP-NEXT DISPLAY ---
    const displaySquares = document.querySelectorAll('#preview-display div');
    // console.log(displaySquares);

    const displayWidth = 4;
    let displayIndex = 1;

    //Tetrominos without rotations
    const upNextTetrominoes = [
        [1, 2, displayWidth+1, displayWidth*2+1], //jTetromino
        [0, 1, displayWidth+1, displayWidth*2+1], // lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth*2], //sTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ];

    function displayTetro() {
        
        // remove precedent tetromino
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
            square.style.backgroundColor = ''; // removing colors
        });

        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]; // adding colors
        })

    }

    // --- SCORE ---
    function addScore() {
        for (let i = 0; i < 199; i += width) { // cheking every row
            const row = [i, i+1, i+2, i+3, i+4, i+5,i+6,i+7, i+8, i+9];

            if (row.every(index => squares[index].classList.contains('taken') )) {  //I check if every square in pur defined row contains a div with class taken
                

                pointsMade += 10;

                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');

                    squares[index].style.backgroundColor = '';
                });       
                
                // splice the completed row and append it on again on top
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(block => grid.appendChild(block));

            }
            
        }

        if (pointsMade % 40 === 0) {
            score += (pointsMade / 40) * 100;
        } else {
            score += pointsMade;
        }

        scoreDisplay.innerHTML = `Score: ${score}`;
        pointsMade = 0;
    }

    // --- GAME OVER ---
    function gameOver() {
        if (currentTetro.some(index => squares[currentPosition + index].classList.contains('taken') )) {
            
            scoreDisplay.innerHTML = `GAME OVER - Final score: ${score}`;
            clearInterval(timerId);

            startBtn.classList.add('display-none');
            restartBtn.classList.remove('display-none');
        }
    };

    

}

// reloading page
function restart() {
    console.log('helloooo');
    location.reload();
}