//Make multiple divs.
//^Repeat a createElement and append
//loop until it's the set number.
//Default is 256 individual divs.
//Must be made into a square. (16x16)
//^^ Achieve this by having a set
//div for them to fill,
//using flex.

//Need number input. Tells loop how many times to loop.

let sliderNum = 256;

let rowAndColumnNum = Math.sqrt(sliderNum);

let canvas = document.getElementById('canvas');

for (i = 0; i <= sliderNum; i++) {
    let lilDiv = document.createElement('div');
    lilDiv.style.cssText = `
        border: 1px solid black; 
        flex-grow: 1;
    `;
    canvas.appendChild(lilDiv);
}

canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
