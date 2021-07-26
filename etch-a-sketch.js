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
    };
};

let colorMode; // <-- used to set how the div changes color.

//Event Functions.
let setDefaultColorMode = (e) => { //Default-- Sets color of div interacted with to the color selected.
    let divColor = document.getElementById('color-selector');
    e.target.style.backgroundColor = divColor.value;
}
document.getElementById('color-selector').addEventListener('change', function() {
    colorMode = false;
});


let setTrailBrush = (e) => { // Sets an animation for the div interacted with so it looks like a 'trail'.
    colorMode = 'trailbrush';
    let style = document.getElementById('style');
    let keyFrames = '\
    @-moz-keyframes trail {\
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
        -moz-animation-name: trail;\
        -moz-animation-duration: 2s;\
        -moz-animation-timing function: ease-out;\
    }'
    let selectedDiv = `#${e.target.id}`;
    colorAnimAdd = colorAnimAdd.replace(/DIV_SELECTED/g, selectedDiv);
    style.innerHTML = style.innerHTML + keyFrames + colorAnimAdd;
    console.log(style)
}
document.getElementById('trail-button').addEventListener('click', setTrailBrush);

let setRbgBrush = (e) => { // Randomizes a color for the div interacted with.
    colorMode = 'rgbbrush'
    let colorVal = '#' + Math.floor(Math.random()*16777215).toString(16); // Returns random color.
    e.target.style.backgroundColor = colorVal;
}
document.getElementById('rgb-button').addEventListener('click', setRbgBrush);

let removalFunc = () => {
    let limited = factory(); //Constructor.
    // This is to show a separator when waiting.
    let prevDate = window.performance.now();
    limited(function() {
        let difference = window.performance.now() - prevDate;
        prevDate = window.performance.now();
        //////////
        if (!colorMode) {
            for (h = 0; h < canvas.childElementCount; h++) {
                canvas.children.item(h).removeEventListener('mouseenter', setDefaultColorMode);
                canvas.children.item(h).removeEventListener('click', setDefaultColorMode);
            }
        } else if (colorMode == 'trailbrush') {
            for (h = 0; h < canvas.childElementCount; h++) {
                canvas.children.item(h).removeEventListener('mouseenter', setTrailBrush);
                canvas.children.item(h).removeEventListener('click', setTrailBrush);
            }
        } else if (colorMode == 'rgbbrush') {
            for (h = 0; h < canvas.childElementCount; h++) {
                canvas.children.item(h).removeEventListener('mouseenter', setRbgBrush);
                canvas.children.item(h).removeEventListener('click', setRbgBrush);
            }
        }

    })
}

canvas.addEventListener('mousedown', function clickHoldFunc() {
    let limited = factory(); //Constructor.
    // This is to show a separator when waiting.
    let prevDate = window.performance.now();
    limited(function() {
        let difference;
        difference = window.performance.now() - prevDate;
        prevDate = window.performance.now();
        if (difference < 30) console.log('wait');
        if (!colorMode) {
            for (h = 0; h < canvas.childElementCount; h++) {
                canvas.children.item(h).addEventListener('mouseenter', setDefaultColorMode);
                canvas.children.item(h).addEventListener('mousedown', setDefaultColorMode);
                canvas.children.item(h).addEventListener('click', debounced(50, setDefaultColorMode));
            }
            canvas.addEventListener('mouseup', throttled(66, removalFunc));
            canvas.addEventListener('mouseleave', throttled(66, removalFunc));
        } else if (colorMode == 'trailbrush') {
            for (h = 0; h < canvas.childElementCount; h++) {
                canvas.children.item(h).addEventListener('mouseenter', setTrailBrush);
                canvas.children.item(h).addEventListener('mousedown', setTrailBrush);
                canvas.children.item(h).addEventListener('click', debounced(50, setTrailBrush));
            }
            canvas.addEventListener('mouseup', throttled(66, removalFunc));
            canvas.addEventListener('mouseleave', throttled(66, removalFunc));
        } else if (colorMode == 'rgbbrush') {
            for (h = 0; h < canvas.childElementCount; h++) {
                canvas.children.item(h).addEventListener('mouseenter', setRbgBrush);
                canvas.children.item(h).addEventListener('mousedown', setRbgBrush);
                canvas.children.item(h).addEventListener('click', debounced(50, setRbgBrush));
            }
            canvas.addEventListener('mouseup', throttled(66, removalFunc));
            canvas.addEventListener('mouseleave', throttled(66, removalFunc));
        }

    });
});





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
                    border: .1px solid #ededed;
                `;
                
                canvas.appendChild(lilDiv);
            }
            
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
        lilDiv.style.cssText = `
            background-color: white;
            border: .1px solid #ededed;
        `;
        canvas.appendChild(lilDiv);
    }
    
});