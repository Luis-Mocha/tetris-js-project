document.addEventListener('DOMContentLoaded', startAll());

function startAll() {
    let grid = document.getElementById('grid');
    let preview = document.getElementById('next-preview');

    for (let y = 1; y < 21; y++) {

        for (let x = 1; x < 11; x++) {

            grid.innerHTML += `<div class="square square-${x}-${y}"></div>`;

        }
    }

    for (let index = 0; index < 10; index++) {
        grid.innerHTML += `<div class="square taken"></div>`
        
    }

    let squares = Array.from(document.querySelectorAll('.square'));
    console.log(squares);


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

    // randomly selecting a Tetromino
    let random = Math.floor(Math.random()*allTetrominoes.length);
    let currentTetro = allTetrominoes[random][currentRotation]; // [type of tetramino][rotation]
    console.log(random);

    // ---moving down the blocks every second
    timerId = setInterval(moveDown, 1000);
    // controlling the tetromino
    document.addEventListener('keydown', control);
console.log(random, currentRotation);


    // --- FUNCTIONS ---
    function moveDown() {
        undraw();
        currentPosition += width; //always moving one row under
        
        draw();
        freeze();
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
        if (currentTetro.some(index => squares[currentPosition + index + width].classList.contains('taken') )) {

            currentTetro.forEach(index => squares[currentPosition + index].classList.add('taken'));

            // start new tetromino
            random = Math.floor(Math.random() * allTetrominoes.length);
            currentTetro = allTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
        }
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
    function rotate() {
        undraw();

        currentRotation++;

        if (currentRotation === currentTetro.length) {
            currentRotation = 0
        };
        
        currentTetro = allTetrominoes[random][currentRotation];

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

}