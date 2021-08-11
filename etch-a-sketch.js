let setDefaultSlider = () => {
    let slider = document.getElementById('boxRange');
    slider.value = 4; // Default size.
}

setDefaultSlider();

let setDivColorDefault = () => {
    let divColor = document.getElementById('color-selector');
    divColor.value = '000000'; // Black.
    let backgroundColor = document.getElementById('bgc-selector');
    backgroundColor.value = '000000'; // Black.
}

setDivColorDefault();

let setDefaultColorMode = (e) => { //Default-- Sets color of div interacted with to the color selected.
    let divColor = document.getElementById('color-selector').value;
    e.target.style.backgroundColor = divColor;
};

let sliderNum = 4; // Default size.
let canvas = document.getElementById('canvas');

// Setting up default size:
let rowAndColumnNum = sliderNum;
canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
for (k = 0; k < sliderNum ** 2; k++) {
    let lilDiv = document.createElement('div');
    lilDiv.id = `div${k}`;
    lilDiv.style.cssText = `
        background-color: #FFFFFF;
        border: .1px solid #ededed;
    `;
    lilDiv.onclick = 'e.stopPropagation();'
    canvas.appendChild(lilDiv);
}

//Performace functions.
function throttled(delay, fn) { // Helps reduce ammount of times color change/mouseenter event listener is called.
    let lastCall = 0;
    return function (...args) {
      const nowBigTime = (new Date);
      const now = nowBigTime.getMilliseconds();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return fn(...args);
    }
}

function debounced(delay, fn) { // Helps reduces amount of click event listener calls.
    let timerId;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    }
}

function factory() { // Function call limiter. Only applied to event listener removal function.
    let time = 0, count = 0, difference = 0, queue = [];
    return function limit(func){
        if(func) queue.push(func);
        difference = 1000 - (window.performance.now() - time);
        if(difference <= 0) {
            time = window.performance.now();
            count = 0;
        }
        if(++count <= canvas.childElementCount) (queue.shift())();
        else setTimeout(limit, difference);
    }
};

let colorMode = 'default/pencil'; // Used to set how the div changes color.

let removalFunc = () => {
   setTimeout(function () {
       let limited = factory(); //Constructor.
        // This is to show a separator when waiting.
        let prevDate = window.performance.now();
        limited(function() {
            let difference = window.performance.now() - prevDate;
            prevDate = window.performance.now();
            //////////
            for (h = 0; h < canvas.childElementCount; h++) {
                let div = canvas.children.item(h);
                let replacementDiv = document.getElementById('replacement-div');
                newDiv = replacementDiv.cloneNode(true);
                newDiv.style.display = 'block';
                newDiv.id = div.id;
                newDiv.style.backgroundColor = div.style.backgroundColor;
                div.parentNode.replaceChild(newDiv, div);
            }
            setTimeout(function () {document.getElementById('style').innerHTML = ''}, 300);
        })
    }, 100);
};


let clickHoldFunc = () => {
    let limited = factory(); //Constructor.
    // This is to show a separator when waiting.
    let prevDate = window.performance.now();
    limited(function() {
        prevDate = window.performance.now();
        let difference = window.performance.now() - prevDate;
        if (difference < 30) console.log('canvas wait');
        if (colorMode === 'default/pencil') {
            document.getElementById('style').innerHTML = '';
            console.log(`Color mode is now ${colorMode}.`);
            for (h = 0; h < canvas.childElementCount; h++) {
                canvas.children.item(h).addEventListener('click', debounced(50, setDefaultColorMode));
                canvas.children.item(h).addEventListener('mouseenter', setDefaultColorMode);
                canvas.children.item(h).addEventListener('mousemove', setDefaultColorMode);
            }
            canvas.addEventListener('mouseup', throttled(66, removalFunc));
            canvas.addEventListener('mouseleave', throttled(66, removalFunc));
        } 
        if (colorMode === 'trailbrush') {
            setTrailBrush();
        }
        if (colorMode === 'rgbbrush') {
            setRbgBrush();
        }
        if (colorMode === 'eraser') {
            eraseFunc();
        }
        if (colorMode === 'coloring'){
            colorInFunc();
        }
    })
}

let setUpEventListenersFunc = (propsFunc) => {
    for (h = 0; h < canvas.childElementCount; h++) {
        canvas.children.item(h).addEventListener('click', debounced(50, propsFunc));
        canvas.children.item(h).addEventListener('mouseenter', propsFunc);
        canvas.children.item(h).addEventListener('mousemove', propsFunc);
    }
    canvas.addEventListener('mouseup', throttled(66, removalFunc));
    canvas.addEventListener('mouseleave', throttled(66, removalFunc));
}

//Event Functions.
canvas.addEventListener('mousedown', clickHoldFunc);

let pencilTool = document.getElementById('pencil');
pencilTool.addEventListener('click', function backToDefault () {
    colorMode = 'default/pencil';
    console.log(`Color mode is now ${colorMode}.`);
});

let eraserProperties = (e) => {
    e.target.style.backgroundColor = '#FFFFFF';
}

let eraseFunc = () => {
    setUpEventListenersFunc(eraserProperties);     
}

let eraserTool = document.getElementById('eraser');
eraserTool.addEventListener('click', function() {
    colorMode = 'eraser';
    console.log(`Color mode is now ${colorMode}.`);
});

let colorInProperties = (e) => { //Was a fill tool. Now it is a 'coloring in' helper. In short, I gave up.

    //Have to get how many elements are in one row.
    //It's stuck in a string.
    let rowAndColumnNum = canvas.style.gridTemplateRows;
    rowAndColumnNum = rowAndColumnNum.split(/[,\(]/g); //Takes out comma and parenthese surrounding the number needed.
    rowAndColumnNum = parseInt(rowAndColumnNum[1]);
    
    let divNum = e.target.id;
    let div = document.getElementById(divNum);
    let ogColor = div.style.backgroundColor;
    let letterReg = /[^0-9]/g
    divNum = parseInt(divNum.replace(letterReg, '')); //Takes number out of the div's id to be used in loop.
    let fillColor = document.getElementById('color-selector').value
    let divCords = [];

    let createDivCoordinates = () => { //Based off pixels on a canvas.
        let y = 0;
        let x = 0;
        for (i = canvas.childElementCount - 1; i >= 0; i -= rowAndColumnNum) {
            let divPlace = canvas.children.item(i).id;
            let letterReg = /[^0-9]/g
            divPlace = parseInt(divPlace.replace(letterReg, ''));
            if (i > rowAndColumnNum) {
                y++; //Counts how many times it has to 'jump' up a row, same as counting the y index.
            }
            if (i < rowAndColumnNum) {
                while (y >= 0) {
                    let j = divPlace;
                    while (j >= 0) {
                        x = j; //Goes to the largest 'x' value, and then goes backwards to show other possible values.
                        j--;
                        divCords.push([x, y]);
                    }
                    y--;    
                }
            }
        }
        divCords = divCords.reverse(); //Starts list at origin. (0,0)
    }
    createDivCoordinates();

    let divObj = {}; //Connects each coordinate to respective div by a property.
    k = 0;
    while (k < divCords.length) {
        divObj[`div${k}`] = divCords[k]; 
        k++;
    }

    let startingDivCords = divCords[divNum];
    let nextDivUpCords = [startingDivCords[0], (startingDivCords[1] - 1)];
    let nextId;
    let nextDiv;

    if (nextDivUpCords[1] < 0) {
        nextDivUpCords[1] = 0;
    }

    if (nextDivUpCords[0] < 0) {
        nextDivUpCords[0] = 0;
    }

    let getNextUpId = () => {
        
        let findDivId = () => {
            for (const [divId, cords] of Object.entries(divObj)) { //Run through prop values to check if coordinates match
                if (nextDivUpCords[0] == cords[0] && nextDivUpCords[1] == cords[1]) { //to find correct id.
                    
                    nextId = divId;
                }
                nextDiv = document.getElementById(`${nextId}`);
            }
        }

        while (nextDivUpCords[1] - 1 >= 0 || nextDivUpCords[1] == 0) { //Goes up until it gets to the highest possible same color div within the column.
            findDivId();
            if (nextDiv.style.backgroundColor == ogColor) {

                nextDivUpCords[1] = nextDivUpCords[1] - 1;
                findDivId();
            } else {
                break;
            }
        } 
    };

    getNextUpId();

        

    let checkLeft = true;
    let leftDiv, leftDivCords;
    let checkRight = true;
    let rightDiv, rightDivCords;
    let downDiv, downDivCords;

    let checkCordsforPush = (coordinates) => {

        let checkDown = (downCords) => {

            nextDivUpCords = [...downCords];
            getNextUpId();
            downDivCords = nextDivUpCords;
            downDivCords[1] = downDivCords[1] + 1;
            while (downDivCords[1] <= rowAndColumnNum) {

                for (const [divId, cords] of Object.entries(divObj)) {

                    if (downDivCords[0] == cords[0] && downDivCords[1] == cords[1]) {
                        nextId = divId;
                    } //Loops through the coordinates to match it to the right id.

                    downDiv = document.getElementById(nextId);
                }
                if (downDiv.style.backgroundColor == ogColor) {

                    if (downDiv.style.backgroundColor == nextDiv.style.backgroundColor) {

                        nextDiv.style.backgroundColor = fillColor;
                    }
                    downDiv.style.backgroundColor = fillColor;
                    nextDiv = downDiv;
                    downDivCords[1] = downDivCords[1] + 1;
                } else {
                    break;
                }
            }
        }

        checkDown(coordinates);
        
        if (checkLeft) {

            nextDivUpCords = [...coordinates];
            getNextUpId();
            leftDivCords = nextDivUpCords;
            leftDivCords[0] = leftDivCords[0] - 1;
            if (nextDiv.style.backgroundColor != ogColor) {
                leftDivCords[1] = leftDivCords[1] + 1;
            }
            for (const [divId, cords] of Object.entries(divObj)) {

                if (leftDivCords[0] == cords[0] && leftDivCords[1] == cords[1]) {

                    nextId = divId; //Loops through the coordinates to match it to the right id.
                    if (leftDivCords[0] >= 0 && leftDivCords[1] >= 0) {

                        leftDiv = document.getElementById(nextId);
                        if (leftDiv.style.backgroundColor == ogColor) {
                            checkDown(leftDivCords);
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        if (checkRight) {

            nextDivUpCords = [...coordinates];
            getNextUpId();
            nextDiv = document.getElementById(nextId);
            rightDivCords = [...coordinates];
            rightDivCords[0] = rightDivCords[0] + 1;
            if (nextDiv.style.backgroundColor != ogColor) {
                rightDivCords[1] = rightDivCords[1] + 1;
            }
            for (const [divId, cords] of Object.entries(divObj)) {

                if (rightDivCords[0] == cords[0] && rightDivCords[1] == cords[1]) {

                    nextId = divId; //Loops through the coordinates to match it to the right id.
                    if (rightDivCords[0] >= 0 && rightDivCords[1] >= 0) {

                        rightDiv = document.getElementById(nextId);
                        if (rightDiv.style.backgroundColor == ogColor) {

                            checkDown(rightDivCords);
                        } else {
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
        }

        
    }

    checkCordsforPush(nextDivUpCords);
    
}


let colorInFunc = () => {
    setUpEventListenersFunc(colorInProperties);
}

let colorInTool = document.getElementById('color-in-tool');
colorInTool.addEventListener('click', function () {
    colorMode = 'coloring';
    console.log(`Color mode is now ${colorMode}`);
})

let setTrailBrushProperties = (e) => { // Sets an animation for the div interacted with so it looks like a 'trail'.
    let style = document.getElementById('style');
    let keyFrames = '\
    @keyframes trail {\
        0% {\
            background-color: COLOR ;\
        }\
        100% {\
            background-color: OGC ;\
        }\
    }';
    let divColor = document.getElementById('color-selector');
    let origBGColor = e.target.style.backgroundColor;
    keyFrames = keyFrames.replace(/OGC/g, origBGColor);
    keyFrames = keyFrames.replace(/COLOR/g, divColor.value);
    let colorAnimAdd =`
    #${e.target.id} {
        animation-name: trail;
        animation-duration: 1s;
        animation-timing function: ease-out;
    }`
    style.innerHTML = style.innerHTML + keyFrames + colorAnimAdd;
};

let setTrailBrush = () => {
    setUpEventListenersFunc(setTrailBrushProperties);     
};

document.getElementById('trail-button').addEventListener('click', function () {
    colorMode = 'trailbrush';
    console.log(`Color mode is now ${colorMode}.`);
});

let setRbgBrushProperties = (e) => { // Randomizes a color for the div interacted with.
    let colorVal = Math.floor(Math.random()*16777215).toString(16); // Returns random color.
    e.target.style.backgroundColor = '#' + colorVal;
};

let setRbgBrush = () => {
    setUpEventListenersFunc(setRbgBrushProperties);     
};

document.getElementById('rgb-button').addEventListener('click', function () {
    colorMode = 'rgbbrush';
    console.log(`Color mode is now ${colorMode}.`);
});

let resetCanvasProperties = () => {
    let style = document.getElementById('style');
    let keyFrames = '\
        @keyframes reset {\
            100% {\
                background-color: #FFFFFF ;\
            }\
        }';
    for (h = 0; h < canvas.childElementCount; h++) {
        let div = canvas.children.item(h);
        let resetAnim =`
            #${div.id} {
                animation-name: reset;
                animation-duration: .5s;
                animation-timing function: ease-out;
            }`
        style.innerHTML = style.innerHTML + keyFrames + resetAnim;
    }
    setTimeout(function () {
        for (h = 0; h < canvas.childElementCount; h++) { //Replaces all divs with clean ones.
            let replacementDiv = document.getElementById('replacement-div'); //Made a 'replacement' example that
            newDiv = replacementDiv.cloneNode(true);                         //is set to display: none so that I have an invisible
            newDiv.style.display = 'block';                                  //template for the new divs that ARE visible.
            let div = canvas.children.item(h);
            newDiv.id = div.id; 
            newDiv.style.backgroundColor = '#FFFFFF';
            div.parentNode.replaceChild(newDiv, div);
        }
    }, 500)
}

document.getElementById('reset-button').addEventListener('click', resetCanvasProperties);

let userInput = document.getElementById('size-input');
// If the user inputs text, use that.
userInput.addEventListener('keydown', userCustomSize = (e) => {

    if (e.key == 'Enter' || e.eventCode == 13) {

        let userInputSize = parseInt(userInput.value);// Turns the input into a number.
        if (userInputSize >= 91) {
            userInputSize = 90;
        }
            rowAndColumnNum = userInputSize;
            canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
            canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
            canvas.innerHTML = '';
            for (i = 0; i < userInputSize ** 2; i++) {
                let lilDiv = document.createElement('div');
                lilDiv.id = `div${i}`;
                lilDiv.style.cssText = `
                    background-color: #FFFFFF;
                    border: .1px solid #ededed;
                `;
                lilDiv.onclick = 'e.stopPropagation();'
                canvas.appendChild(lilDiv);
            }
        
        userInput.value = ''; // Clears text input
    }

});

// If the user slides the bar, use the value from that.
let slider = document.getElementById('boxRange');

slider.addEventListener('input', changeCanvasSize = () => {

    sliderNum = document.getElementById('boxRange').value;
    rowAndColumnNum = sliderNum;
    canvas.style.gridTemplateRows = `repeat(
        ${rowAndColumnNum}
        , 1fr)`;
    canvas.style.gridTemplateColumns = `repeat(  ${rowAndColumnNum}  , 1fr)`;
    canvas.innerHTML = '';
    for (i = 0; i < sliderNum ** 2; i++) {
        let lilDiv = document.createElement('div');
        lilDiv.id = `div${i}`;
        lilDiv.style.cssText = `
            background-color: #FFFFFF;
            border: .1px solid #ededed;
        `;
        lilDiv.onclick = 'e.stopPropagation();'
        canvas.appendChild(lilDiv);
    }

});

document.getElementById('bgc-selector').addEventListener('input', function () {
    let backgroundColor = document.getElementById('bgc-selector').value;
    let background = document.getElementsByTagName('body').item(0);
    background.style.backgroundColor = backgroundColor;
});