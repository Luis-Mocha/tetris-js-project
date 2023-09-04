document.addEventListener('DOMContentLoaded', startAll());

function startAll() {
    let grid = document.getElementById('grid');

    for (let y = 1; y < 21; y++) {

        for (let x = 1; x < 11; x++) {

            grid.innerHTML += `<div class="square square-${x}-${y}"></div>`

        }
        
    }

    let squares = Array.from(document.querySelectorAll('.square'));
    console.log(squares);
}