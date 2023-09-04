document.addEventListener('DOMContentLoaded', startAll());

function startAll() {
    let grid = document.getElementById('grid');

    for (let index = 0; index < 200; index++) {
        grid.innerHTML += `<div class="block-${index}"></div>`
    }
    
}