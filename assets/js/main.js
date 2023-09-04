document.addEventListener('DOMContentLoaded', startAll());

function startAll() {
    let grid = document.getElementById('grid');

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
    

    let currentPosition = 4; // where to start a tetromino (x-axis)
    let currentRotation = 0;

    // randomly selecting a Tetromino
    let random = Math.floor(Math.random()*allTetrominoes.length);
    let currentTetro = allTetrominoes[random][currentRotation]; // [type of tetramino][rotation]

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
    // draw();

    function moveDown() {
        undraw();
        currentPosition += width; //always moving one row under
        
        draw();
        freeze();
    }

    function freeze() {
        if (currentTetro.some(index => squares[currentPosition + index + width].classList.contains('taken') )) {

            console.log('testeeee');
            currentTetro.forEach(index => squares[currentPosition + index].classList.add('taken'));

            // start new tetromino
            random = Math.floor(Math.random() * allTetrominoes.length);
            currentTetro = allTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
        }
    }

    // ---moving down the blocks every second
    // timerId = setInterval(moveDown, 500);

}