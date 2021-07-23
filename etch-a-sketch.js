let slider = document.getElementById('myRange');
slider.value = 4; // Default size.
let sliderNum = 4; // Default size.
let dataList = document.getElementById('dataList');
let canvas = document.getElementById('canvas');
let htmlStyle = document.getElementsByTagName('style');
let divColor = document.getElementById('color-selector');
let timeout;

// Setting up default size:
let rowAndColumnNum = sliderNum;
canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
for (k = 0; k < sliderNum ** 2; k++) {
    let lilDiv = document.createElement('div');
    lilDiv.id = `div${k}`;
    lilDiv.style.cssText = `
        background-color: white;
        border: .1px solid gray;
    `;
    canvas.appendChild(lilDiv);
}

function hoverFunc(e) {
    e.target.style.backgroundColor = divColor.value;
}

let eventsFunc = (div) => {
    canvas.addEventListener('mousedown', function clickHoldFunc(e) {
        div.addEventListener('mouseenter', hoverFunc);
        canvas.addEventListener('mouseup', function (e) {
            div.removeEventListener('mouseenter', hoverFunc);
            e.target.removeEventListener('mousedown', clickHoldFunc);
            return true;
        })
    });
}
for (h = 0; h < canvas.childElementCount; h++) {
    let eachDiv = canvas.children.item(h);
    eventsFunc(eachDiv);
}

let userInput = document.getElementById('size-input');

// If the user inputs text, use that.
userInput.addEventListener('keydown', userCustomSize = (e) => {

    if (e.key == 'Enter' || e.eventCode == 13) {
        let userInputSize = parseInt(userInput.value);// Turns the input into a number.
        if (userInputSize >= 91) {
            userInputSize = 90;
        }
        if (userInputSize < 91) {
            let rowAndColumnNum = userInputSize;
            canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
            canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
            canvas.innerHTML = '';
            for (i = 0; i < userInputSize ** 2; i++) {
                let lilDiv = document.createElement('div');
                lilDiv.style.cssText = `
                    background-color: white;
                    border: .1px solid gray;
                `;
                function hoverFunc(e) {
                    e.target.style.backgroundColor = divColor.value;
                } //PROBLEM: Lag! The canvas is creating itself over and over and over
                // again with all these event listeners firing. It's taxing.
                // Need to make separate loop.
                
                canvas.appendChild(lilDiv);
            }
        }

        let eventsFunc = (div) => {
            canvas.addEventListener('mousedown', function clickHoldFunc(e) {
                div.addEventListener('mouseenter', hoverFunc);
                canvas.addEventListener('mouseup', function (e) {
                    div.removeEventListener('mouseenter', hoverFunc);
                    e.target.removeEventListener('mousedown', clickHoldFunc);
                    return true;
                })
            });
        }
        for (h = 0; h < canvas.childElementCount; h++) {
            let eachDiv = canvas.children.item(h);
            eventsFunc(eachDiv);
        }

        userInput.value = ''; // Clears text input.
    }

})

// If the user slides the bar, use the value from that.
slider.addEventListener('input', changeCanvasSize = () => {

    sliderNum = document.getElementById('myRange').value;
    let rowAndColumnNum = sliderNum;
    canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
    canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
    canvas.innerHTML = '';
    for (i = 0; i < sliderNum ** 2; i++) {
        let lilDiv = document.createElement('div');
        lilDiv.style.cssText = `
            background-color: white;
            border: .1px solid gray;
        `;
        canvas.appendChild(lilDiv);
    }

    let eventsFunc = (div) => {
        canvas.addEventListener('mousedown', function clickHoldFunc(e) {
            div.addEventListener('mouseenter', hoverFunc);
            canvas.addEventListener('mouseup', function (e) {
                div.removeEventListener('mouseenter', hoverFunc);
                e.target.removeEventListener('mousedown', clickHoldFunc);
                return true;
            });
            
        });
    };

    if ( !timeout ) {
        timeout = setTimeout(function() {
            // Reset timeout
            timeout = null;
            // Run functions
            for (h = 0; h < canvas.childElementCount; h++) {
                let eachDiv = canvas.children.item(h);
                eventsFunc(eachDiv);
            }
        }, 20);

    };
});

