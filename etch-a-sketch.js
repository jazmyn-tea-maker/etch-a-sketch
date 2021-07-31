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
        if (colorMode === 'fill'){
            fillFunc();
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

//So, this fill tool isn't so much a fill tool, but a fill 'splash'.
let fillProperties = (e) => {
    //Have to get how many elements are in one row.
    //It's stuck in a string, as you can tell.
    let rowAndColumnNum = canvas.style.gridTemplateRows;
    rowAndColumnNum = rowAndColumnNum.split(/[,\(]/g); //Takes out comma and parenthese surrounding the number needed.
    rowAndColumnNum = parseInt(rowAndColumnNum[1]);
    
    let div = e.target;
    let divNum = e.target.id;
    let letterReg = /[^0-9]/g
    divNum = parseInt(divNum.replace(letterReg, '')); //Takes number out of the div's id to be used in loop.
    let fillColor = document.getElementById('color-selector').value

    let checkRightAndDown = (num) => {
        let nextDownDiv = document.getElementById(`div${num + rowAndColumnNum}`);
        let rightDiv = document.getElementById(`div${num + 1}`);
            if (nextDownDiv.style.backgroundColor == selectedDiv.style.backgroundColor 
                && !(rightDiv.style.backgroundColor == selectedDiv.style.backgroundColor)) {
                    selectedDiv.style.backgroundColor = fillColor;
                checkDown(num);
                } else if (rightDiv.style.backgroundColor == selectedDiv.style.backgroundColor
                            && !(nextDownDiv.style.backgroundColor == selectedDiv.style.backgroundColor)){
                    selectedDiv.style.backgroundColor = fillColor;
                    checkLeft(num);
            }
    }

    let checkUp = (num) => {
        let nextUpDiv = document.getElementById(`div${num - rowAndColumnNum}`);
            if (nextUpDiv.style.backgroundColor == selectedDiv.style.backgroundColor) {
                    selectedDiv.style.backgroundColor = fillColor;
                    checkAll(num);
            }
    }
    
    let checkDown = (num) => {
        let nextDownNum = num + rowAndColumnNum;
        let nextDivDown = document.getElementById(`div${nextDownNum}`);
        let lastDivOnRight = document.getElementById(`div${num}`);
        if (nextDivDown.style.backgroundColor == lastDivOnRight.style.backgroundColor) {
            lastDivOnRight.style.backgroundColor = fillColor;
            checkLeft(nextDownNum);
        } else {
            nextDownNum--;
            nextDivDown = document.getElementById(`div${nextDownNum}`);
                if (nextDivDown.style.backgroundColor == lastDivOnRight.style.backgroundColor) {
                lastDivOnRight.style.backgroundColor = fillColor;
                checkLeft(nextDownNum - 1);
            }
        }
        checkRightAndDown(nextDownNum);
    }
    
    let checkRight = (num) => {
        let rightId = num;
        let selectedDiv = document.getElementById(`div${rightId}`);
        let rightDiv = document.getElementById(`div${rightId + 1}`);
            while (rightId < canvas.childElementCount) {
                rightDiv = document.getElementById(`div${rightId + 1}`);
                if (!rightDiv) {
                    selectedDiv.style.backgroundColor = fillColor;
                } else if (rightDiv.style.backgroundColor == selectedDiv.style.backgroundColor) {
                    selectedDiv.style.backgroundColor = fillColor;
                    selectedDiv = rightDiv;
                } else {
                    checkDown(rightId);
                }
                rightId++;
            }
        checkUp(rightId);
        checkRightAndDown(rightId);
    }

    let checkLeft = (leftNum) => {
        let finalDiv = document.getElementById(`div${leftNum + 1}`);
        let leftDiv = document.getElementById(`div${leftNum}`);
        while (leftNum > 0) {
            if (leftDiv.style.backgroundColor == div.style.backgroundColor && (leftNum - 1) >= 0) { //Checks upNum (div id) to make sure
                leftNum--;                                                                         //it exists. Negative id doesn't exist.
                leftDiv = document.getElementById(`div${leftNum}`);
                finalDiv = document.getElementById(`div${leftNum + 1}`);
                if (finalDiv.style.backgroundColor == leftDiv.style.backgroundColor) {
                    finalDiv = leftDiv;
                }
            } else {
                leftNum = -1;
                let finId = finalDiv.id
                    .replace(letterReg, ''); //get the current div's id to use in next function.
                checkRight(parseInt(finId));
            }
        }
    }

    let checkAll = (upNum) => {              //Checks colors of divs above and moves up until there isn't one of the same color.
                                            //The number of divs in each row, so 
        upNum -= rowAndColumnNum;           //we move backwards that many places
        while (upNum > 0) { 
            let nextUp = document.getElementById(`div${upNum}`);                          //Until we've selected to next one up.
            if (nextUp.style.backgroundColor == div.style.backgroundColor && upNum > 0) { //Checks upNum (div id) to make sure
                if (upNum < rowAndColumnNum) {                                            //it exists. Negative id doesn't exist.
                    upNum = rowAndColumnNum;
                    let currentSelect = document.getElementById(`div${upNum}`);
                    let divId = currentSelect.id
                                .replace(letterReg, '');
                    checkLeft(parseInt(divId));
                }
                upNum -= rowAndColumnNum;                                         
                let nextUp = document.getElementById(`div${upNum}`);
                let currentSelect = document.getElementById(`div${upNum + rowAndColumnNum}`); //Stops on the 'inside' of a user created outline. 
                if (currentSelect.style.backgroundColor == nextUp.style.backgroundColor) { //That's why it's a step backwards.
                    currentSelect.style.backgrounColor = fillColor;
                    currentSelect = nextUp;
                    let divId = currentSelect.id
                            .replace(letterReg, '');
                    if (divId == 0) {
                        checkRight(divId);
                    }
                } else {
                    checkLeft((upNum + rowAndColumnNum));
                    console.log('here!');
                    upNum = -1; //Stops the loop.
                }
            } else if (!(nextUp.style.backgroundColor == div.style.backgroundColor ) || !nextUp) {
                let divId = currentSelect.id
                            .replace(letterReg, '');
                checkLeft(parseInt(divId));
                console.log('here!');
                upNum = -1; //Stops the loop.
            }
        }
    }

   checkAll(divNum);

}


let fillFunc = () => {
    setUpEventListenersFunc(fillProperties);
}

let fillBucketTool = document.getElementById('fill-bucket');
fillBucketTool.addEventListener('click', function () {
    colorMode = 'fill';
})

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
