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
        background-color: white;
        border: .1px solid #ededed;
    `;
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
        setTimeout(function () {document.getElementById('style').innerHTML = ''}, 400);
    });
};

let clickHoldFunc = () => {
    let limited = factory(); //Constructor.
    // This is to show a separator when waiting.
    let prevDate = window.performance.now();
    limited(function() {
        let difference;
        difference = window.performance.now() - prevDate;
        prevDate = window.performance.now();
        if (difference < 30) console.log('canvas wait');
        if (colorMode === 'default') {
            document.getElementById('style').innerHTML = '';
            console.log(`Color mode is now ${colorMode}.`);
            for (h = 0; h < canvas.childElementCount; h++) {
                canvas.children.item(h).addEventListener('mouseenter', setDefaultColorMode);
                canvas.children.item(h).addEventListener('mousedown', setDefaultColorMode);
                canvas.children.item(h).addEventListener('click', setDefaultColorMode);
            }
            canvas.addEventListener('mouseup', throttled(66, removalFunc));
            canvas.addEventListener('mouseleave', throttled(66, removalFunc));
        } if (colorMode === 'trailbrush') {
            setTrailBrush();
        } else if (colorMode === 'rgbbrush') {
            setRbgBrush();
        }
    })
}

//Event Functions.
canvas.addEventListener('mousedown', clickHoldFunc);

let setDefaultColorMode = (e) => { //Default-- Sets color of div interacted with to the color selected.
    let divColor = document.getElementById('color-selector');
    e.target.style.backgroundColor = divColor.value;
};

let backToDefault = () => {
    colorMode = 'default';
    console.log(`Color mode is now ${colorMode}.`);
};

let pencilTool = document.getElementById('pencil');
pencilTool.addEventListener('click', backToDefault);

let eraseFunc = () => {
    let divColor = document.getElementById('color-selector');
    divColor.value = '#FFFFFF';
}

let eraserTool = document.getElementById('eraser');
eraserTool.addEventListener('click', eraseFunc);

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

    let limited = factory(); //Constructor.
    // This is to show a separator when waiting.
    let prevDate = window.performance.now();
    limited(function() {
        let difference = window.performance.now() - prevDate;
        prevDate = window.performance.now();
        //////////
        for (h = 0; h < canvas.childElementCount; h++) {
            let div = canvas.children.item(h);
            div.addEventListener('mouseenter', setTrailBrushProperties);
            div.addEventListener('mousedown', setTrailBrushProperties);
            div.addEventListener('click', debounced(50, setTrailBrushProperties));
        }
        canvas.addEventListener('mouseup', throttled(66, removalFunc));
        canvas.addEventListener('mouseleave', throttled(66, removalFunc));
    })

};

let setColorModeTrail = () => {
    colorMode = 'trailbrush';
    console.log(`Color mode is now ${colorMode}.`);
}
document.getElementById('trail-button').addEventListener('click', setColorModeTrail);

let setRbgBrushProperties = (e) => { // Randomizes a color for the div interacted with.
    let colorVal = '#' + Math.floor(Math.random()*16777215).toString(16); // Returns random color.
    e.target.style.backgroundColor = colorVal;
};

let setRbgBrush = () => {

    let limited = factory(); //Constructor.
    // This is to show a separator when waiting.
    let prevDate = window.performance.now();
    limited(function() {
        let difference = window.performance.now() - prevDate;
        prevDate = window.performance.now();
        //////////
        for (h = 0; h < canvas.childElementCount; h++) {
            canvas.children.item(h).addEventListener('mouseenter', setRbgBrushProperties);
            canvas.children.item(h).addEventListener('mousedown', setRbgBrushProperties);
            canvas.children.item(h).addEventListener('click', debounced(50, setRbgBrushProperties));
        }
        canvas.addEventListener('mouseup', throttled(66, removalFunc));
        canvas.addEventListener('mouseleave', throttled(66, removalFunc));
    })
        
};

let setColorModeRgb = () => {
    colorMode = 'rgbbrush';
    console.log(`Color mode is now ${colorMode}.`);
}
document.getElementById('rgb-button').addEventListener('click', setColorModeRgb);

let resetCanvasProperties = () => {
    let style = document.getElementById('style');
    let keyFrames = '\
        @keyframes trail {\
            100% {\
                background-color: white ;\
            }\
        }';
    for (h = 0; h < canvas.childElementCount; h++) {
        let div = canvas.children.item(h);
        let resetAnim =`
            #${div.id} {
                animation-name: trail;
                animation-duration: 1s;
                animation-timing function: ease-out;
            }`
        style.innerHTML = style.innerHTML + keyFrames + resetAnim;
    }
    setTimeout(function () {
        for (h = 0; h < canvas.childElementCount; h++) {
            let div = canvas.children.item(h);
            let replacementDiv = document.getElementById('replacement-div');
            newDiv = replacementDiv.cloneNode(true);
            newDiv.style.display = 'block';
            newDiv.id = div.id;
            newDiv.style.backgroundColor = 'white';
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
            let rowAndColumnNum = userInputSize;
            canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
            canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
            canvas.innerHTML = '';
            for (i = 0; i < userInputSize ** 2; i++) {
                let lilDiv = document.createElement('div');
                lilDiv.id = `div${i}`;
                lilDiv.style.cssText = `
                    background-color: white;
                    border: .1px solid #ededed;
                `;
                
                canvas.appendChild(lilDiv);
            }
        userInput.value = ''; // Clears text input
    }

});

// If the user slides the bar, use the value from that.
let slider = document.getElementById('boxRange');

slider.addEventListener('input', changeCanvasSize = () => {

    sliderNum = document.getElementById('boxRange').value;
    let rowAndColumnNum = sliderNum;
    canvas.style.gridTemplateRows = `repeat(${rowAndColumnNum}, 1fr)`;
    canvas.style.gridTemplateColumns = `repeat(${rowAndColumnNum}, 1fr)`;
    canvas.innerHTML = '';
    for (i = 0; i < sliderNum ** 2; i++) {
        let lilDiv = document.createElement('div');
        lilDiv.id = `div${i}`;
        lilDiv.style.cssText = `
            background-color: white;
            border: .1px solid #ededed;
        `;
        canvas.appendChild(lilDiv);
    }

});