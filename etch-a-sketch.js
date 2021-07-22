let slider = document.getElementById('myRange');
let sliderNum =  4; // Default size.
let dataList = document.getElementById('dataList');
let canvas = document.getElementById('canvas');
let htmlStyle = document.getElementsByTagName('style');
let divColor = document.getElementById('color-selector');

// Setting up default size:
let rowAndColumnNum = Math.sqrt(sliderNum);
canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
for (k = 0; k < sliderNum; k++) {
    let lilDiv = document.createElement('div');
    lilDiv.id = `div${k}`;
    lilDiv.style.cssText = `
        background-color: white;
        border: .1px solid gray;
    `;
    lilDiv.addEventListener('mouseenter', function(e) {
        e.target.style.backgroundColor = divColor.value;
    });
    canvas.appendChild(lilDiv);
}

// Snaps to the closest (least difference) square in array with
// all squares under 1000:
function getClosest(arr, valueOfSlider) {
	return arr.reduce(function (prev, curr) { 
    return (Math.abs(curr - valueOfSlider) < Math.abs(prev - valueOfSlider) ? curr : prev);
  });
}


let userInput = document.getElementById('size-input'); 

// If the user inputs text, use that.

userInput.addEventListener('keydown', userCustomSize = (e) => {
    if (e.key == 'Enter' || e.eventCode == 13) {
        let userInputSize = parseInt(userInput.value);// Turns the input into a number.
        let optionArr = []; // Array that holds values available (to snap to).
        for (i = 4; i < 1000; i ++) {
            if (Math.sqrt(i) % 1 == 0) {
                optionArr.push(i);
            }
        }
        userInputSqrt = getClosest(optionArr, userInputSize);
        if (Math.sqrt(userInputSqrt) % 1 == 0) {
            let rowAndColumnNum = Math.sqrt(userInputSqrt);
            canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
            canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
            canvas.innerHTML = '';
            for (i = 0; i < userInputSqrt; i++) {
                let lilDiv = document.createElement('div');
                lilDiv.style.cssText = `
                    background-color: white;
                    border: .1px solid gray;
                `;
                lilDiv.addEventListener('mouseenter', function(e) {
                    e.target.style.backgroundColor = divColor.value;
                    // When the cursor 'hovers'/'enters' a div, it will
                    // change color.
                });
                canvas.appendChild(lilDiv);
            }
        }
        userInput.value = ''; // Clears text input.
    }
})

// If the user slides the bar, use the value from that.
slider.addEventListener('input', changeCanvasSize = () => {
    sliderNum = document.getElementById('myRange').value;
    let optionArr = []; // Array that holds values available (to snap to).
    for (i = 4; i < 1000; i ++) {
        if (Math.sqrt(i) % 1 == 0) {
            optionArr.push(i);
        }
    }
    sliderNumSqrt = getClosest(optionArr, sliderNum);
    if (Math.sqrt(sliderNumSqrt) % 1 == 0) {
        let rowAndColumnNum = Math.sqrt(sliderNumSqrt);
        canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
        canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
        canvas.innerHTML = '';
        for (i = 0; i < sliderNumSqrt; i++) {
            let lilDiv = document.createElement('div');
            lilDiv.style.cssText = `
                background-color: white;
                border: .1px solid gray;
            `;
            lilDiv.addEventListener('mouseenter', function(e) {
                e.target.style.backgroundColor = divColor.value;
            });
        canvas.appendChild(lilDiv);
        }
    }
})

let stepList = () => {
    for (j = 4; j < 1000; j++) {
        if (Math.sqrt(j) % 1 == 0) {
            let newOption = document.createElement('option');
            newOption.innerHTML = j;
            dataList.appendChild(newOption);
        }
    }
}

stepList();

slider.list = dataList;