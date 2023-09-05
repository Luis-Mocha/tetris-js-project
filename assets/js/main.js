document.addEventListener('DOMContentLoaded', startAll());

function startAll() {
    let grid = document.getElementById('grid');
    let preview = document.getElementById('preview-display');

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
    // console.log(squares);

    // creating blocks in preview display
    for (let i = 0; i < 16; i++) {
        preview.innerHTML += `<div></div>`        
    }

    // defining all tetraminos
    const width = 10;
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
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

    const allTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    

    let currentPosition = 4; // where to start a tetromino (every block in the squares array has an index)
    let currentRotation = 0;

    let nextRandom = 0;
    // randomly selecting a Tetromino
    let random = Math.floor(Math.random()*allTetrominoes.length);
    let currentTetro = allTetrominoes[random][currentRotation]; // [type of tetramino][rotation]
    console.log(random);

    // ---moving down the blocks every second
    timerId = setInterval(moveDown, 1000);
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
        })
    };
    
    //undrawing function
    function undraw() {
        currentTetro.forEach(block => {
            squares[currentPosition + block].classList.remove('tetromino');
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
        draw();

        // next-up tetromino
        displayTetro();
        
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
        }
    };


    // -- UP-NEXT DISPLAY ---
    const displaySquares = document.querySelectorAll('#preview-display div');
    console.log(displaySquares);

    const displayWidth = 4;
    let displayIndex = 1;

    //Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
        [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
        [0, 1, displayWidth, displayWidth+1], //oTetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ];

    function displayTetro() {
        
        // remove precedent tetromino
        displaySquares.forEach(square => {
            square.classList.remove('tetromino');
        });

        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
        })

    }

    // --- START / PAUSE BUTTON ---

}