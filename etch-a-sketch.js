let setDefaultSlider = () => {
    let slider = document.getElementById('boxRange');
    slider.value = 4; // Default size.
}

setDefaultSlider();

let setDivColorDefault = () => {
    let divColor = document.getElementById('color-selector');
    divColor.value = '000000'; // Default color.
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

let colorMode = 'default'; // Used to set how the div changes color.

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
        if (colorMode === 'default') {
            document.getElementById('style').innerHTML = '';
            console.log(`Color mode is now ${colorMode}.`);
            for (h = 0; h < canvas.childElementCount; h++) {
                canvas.children.item(h).addEventListener('click', debounced(50, setDefaultColorMode));
                canvas.children.item(h).addEventListener('mouseenter', setDefaultColorMode);
                canvas.children.item(h).addEventListener('mousedown', setDefaultColorMode);
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
        if (colorMode === 'fill'){
            fillFunc();
        }
    })
}

let setUpEventListenersFunc = (propsFunc) => {
    for (h = 0; h < canvas.childElementCount; h++) {
        canvas.children.item(h).addEventListener('click', debounced(50, propsFunc));
        canvas.children.item(h).addEventListener('mouseenter', propsFunc);
        canvas.children.item(h).addEventListener('mousedown', propsFunc);
    }
    canvas.addEventListener('mouseup', throttled(66, removalFunc));
    canvas.addEventListener('mouseleave', throttled(66, removalFunc));
}

//Event Functions.
canvas.addEventListener('mousedown', clickHoldFunc);




let pencilTool = document.getElementById('pencil');
pencilTool.addEventListener('click', function backToDefault () {
    colorMode = 'default';
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
});

let fillProperties = (e) => {

    let div = e.target;
    let divNum = e.target.id;
    let letterReg = /[^0-9]/g
    divNum = parseInt(divNum.replace(letterReg, ''));
    let fillColor = document.getElementById('color-selector').value

    let checkUp = (upNum) => { //Checks colors of divs above and moves up until there isn't one of the same color.
        let upRow = upNum - rowAndColumnNum; //The number of divs in each row, so 
        upNum = upRow;                      //we move backwards that many places
        while (upNum > 0) {                 //Until we've selected to next one up.
            let nextUp = document.getElementById(`div${upNum}`);
            if (nextUp.style.backgroundColor == div.style.backgroundColor && upNum >= rowAndColumnNum) { //Checks upNum (div id) to make sure
                upNum = upNum - rowAndColumnNum;                                                         //it exists. Negative id doesn't exist.
                nextUp = document.getElementById(`div${upNum}`);
                let currentSelect = document.getElementById(`div${upNum + rowAndColumnNum}`); //Stops on the inside of a 'div'. 
                if (currentSelect.style.backgroundColor == nextUp.style.backgroundColor) { //Used to stop on the 'outline'. Take it out and see.
                    currentSelect = nextUp;
                }
                console.log(currentSelect);
            } else {
                console.log(div);
                upNum = -1; //Stops the loop.
            }
        } 
    }
                    // Put this is down and right funcs >> div.style.cssText = `background-color: ${fillColor}; border: .1px solid #ededed; display: none;`
    checkUp(divNum);
}

let fillFunc = () => {
    setUpEventListenersFunc(fillProperties);
}

let fillBucketTool = document.getElementById('fill-bucket');
fillBucketTool.addEventListener('click', function () {
    colorMode = 'fill';
})

//Next task: Fill bucket.
//How: Starting with the div selected, check the next
//one's color. If it's the same, make that one the same color
//as the last. (The color selected.)

//First instinct is to go up from the selection point.
//It'll go until the next div is not the same color. (NO color changing at this point.)
//Then it'll check left AND up until there is a div that's NOT the same color.
//Now it'll go right and change the last div's color whilst moving right.
//until finding a div not of the same color. Then it'll check down.
//If down is the same color, then it'll move left until it hits one that's not the same color. 
//Only when moving right or down will the last div's color be changed.
//Continue until there is a div not of the same color as the one up, left, right, or down.
//At that point, change that div to the color selected and end the function.

//Second to last task: ink dropper. Selects a div and changes the color selector value to 
//that div's background color. Simple, easy.

//Last task: media query for mobile.

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
    let colorVal = '#' + Math.floor(Math.random()*16777215).toString(16); // Returns random color.
    e.target.style.backgroundColor = colorVal;
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
                animation-duration: 1s;
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
    }, 1000)
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
    canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
    canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
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
