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



let colorMode = 'default'; // <-- used to set how the div changes color.

let removalFunc = () => {
    let limited = factory(); //Constructor.
    // This is to show a separator when waiting.
    let prevDate = window.performance.now();
    limited(function() {
        let difference = window.performance.now() - prevDate;
        prevDate = window.performance.now();
        //////////
            for (h = 0; h < canvas.childElementCount; h++) {
                canvas.children.item(h).removeEventListener('mouseenter', setDefaultColorMode);
                canvas.children.item(h).removeEventListener('click', setDefaultColorMode);
                //
                canvas.children.item(h).removeEventListener('mouseenter', setTrailBrushProperties);
                canvas.children.item(h).removeEventListener('click', setTrailBrushProperties);
                //
                canvas.children.item(h).removeEventListener('mouseenter', setRbgBrushProperties);
                canvas.children.item(h).removeEventListener('click', setRbgBrushProperties);
            }
            setTimeout(function () {document.getElementById('style').innerHTML = '';}, 500);
        });
};

canvas.addEventListener('mousedown', function clickHoldFunc() {
    let limited = factory(); //Constructor.
    // This is to show a separator when waiting.
    let prevDate = window.performance.now();
    limited(function() {
        let difference;
        difference = window.performance.now() - prevDate;
        prevDate = window.performance.now();
        if (difference < 30) console.log('wait');
        if (colorMode === 'default') {
            console.log(`Color mode is now ${colorMode}.`);
            for (h = 0; h < canvas.childElementCount; h++) {
                canvas.children.item(h).addEventListener('mouseenter', setDefaultColorMode);
                canvas.children.item(h).addEventListener('mousedown', setDefaultColorMode);
                canvas.children.item(h).addEventListener('click', debounced(50, setDefaultColorMode));
            }
            canvas.addEventListener('mouseup', throttled(66, removalFunc));
            canvas.addEventListener('mouseleave', throttled(66, removalFunc));
        } if (colorMode === 'trailbrush') {
            setTrailBrush();
        } else if (colorMode === 'rgbbrush') {
            setRbgBrush();
        }
    })
});


//Event Functions.
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
    let colorAnimAdd ='\
    DIV_SELECTED {\
        animation-name: trail;\
        animation-duration: .5s;\
        animation-timing function: ease-out;\
    }'
    let selectedDivId = `#${e.target.id}`;
    colorAnimAdd = colorAnimAdd.replace(/DIV_SELECTED/g, selectedDivId);
    style.innerHTML = style.innerHTML + keyFrames + colorAnimAdd;
};

let setTrailBrush = () => {
    let limited = factory(); //Constructor.
    // This is to show a separator when waiting.
    let prevDate = window.performance.now();
    canvas.addEventListener('mousedown', limited(function() {
        let difference;
        difference = window.performance.now() - prevDate;
        prevDate = window.performance.now();
        if (difference < 30) console.log('wait');
        for (h = 0; h < canvas.childElementCount; h++) {
            canvas.children.item(h).addEventListener('mouseenter', setTrailBrushProperties);
            canvas.children.item(h).addEventListener('mousedown', setTrailBrushProperties);
            canvas.children.item(h).addEventListener('click', setTrailBrushProperties);
        }
        canvas.addEventListener('mouseup', throttled(66, removalFunc));
        canvas.addEventListener('mouseleave', throttled(66, removalFunc));
    }));
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
        let difference;
        difference = window.performance.now() - prevDate;
        prevDate = window.performance.now();
        if (difference < 30) console.log('wait');
        for (h = 0; h < canvas.childElementCount; h++) {
            canvas.children.item(h).addEventListener('mouseenter', setRbgBrushProperties);
            canvas.children.item(h).addEventListener('mousedown', setRbgBrushProperties);
            canvas.children.item(h).addEventListener('click', debounced(50, setRbgBrushProperties));
        }
        canvas.addEventListener('mouseup', throttled(66, removalFunc));
        canvas.addEventListener('mouseleave', throttled(66, removalFunc));
    });    
};

let setColorModeRgb = () => {
    colorMode = 'rgbbrush';
    console.log(`Color mode is now ${colorMode}.`);
}
document.getElementById('rgb-button').addEventListener('click', setColorModeRgb);

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
                lilDiv.id = `div${k}`;
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
        lilDiv.id = `div${k}`;
        lilDiv.style.cssText = `
            background-color: white;
            border: .1px solid #ededed;
        `;
        canvas.appendChild(lilDiv);
    }
    
});