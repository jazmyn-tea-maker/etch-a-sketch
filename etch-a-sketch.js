let slider = document.getElementById('myRange');
slider.value = 4; // Default size.
let sliderNum = 4; // Default size.
let dataList = document.getElementById('dataList');
let canvas = document.getElementById('canvas');
let htmlStyle = document.getElementsByTagName('style');
let divColor = document.getElementById('color-selector');
let killScript;

function throttled(delay, fn) { //Helps reduce ammount of times an event listener is called.
    let lastCall = 0; // Also helps the whole thing not crash.
    return function (...args) {
      const now = (new Date).getTime();
      if (now - lastCall < delay) {
          console.log('delayed')
        return;
      }
      lastCall = now;
      return fn(...args);
    }
  }

  function debounced(delay, fn) { // Also helps reduces amount of event listener calls.
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

  var factory = function(){
    var time = 0, count = 0, difference = 0, queue = [];
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

var limited = factory();

// This is to show a separator when waiting.
var prevDate = window.performance.now(), difference;


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

//Event Functions.
function hoverFunc(e) { //Changes the color of the div.
    e.target.style.backgroundColor = divColor.value;
} 

let removalFunc = () => {
    limited(function() {
        //
        difference = window.performance.now() - prevDate;
        prevDate = window.performance.now();
        if (difference > 200) console.log('wait');
        //
        for (h = 0; h < canvas.childElementCount; h++) {
            canvas.children.item(h).removeEventListener('mouseenter', hoverFunc);
            canvas.children.item(h).removeEventListener('click', hoverFunc);
        }
    })
}

canvas.addEventListener('mousedown', function clickHoldFunc() {
    for (h = 0; h < canvas.childElementCount; h++) {
        canvas.children.item(h).addEventListener('mouseenter', hoverFunc);
        canvas.children.item(h).addEventListener('click', debounced(200, hoverFunc));
    }
    canvas.addEventListener('mouseup', throttled(200, removalFunc, {once: true}));
    canvas.addEventListener('mouseleave', throttled(200, removalFunc, {once: true}));
});



let userInput = document.getElementById('size-input');

// If the user inputs text, use that.
userInput.addEventListener('keydown', userCustomSize = (e) => {
    console.log('userInput');

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
                //PROBLEM: Lag! The canvas is creating itself over and over and over
                // again with all these event listeners firing. It's taxing.
                // Need to make separate loop.
                
                canvas.appendChild(lilDiv);
            }

            
        }
        userInput.value = ''; // Clears text input
    }

});

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
            border: .1px solid #ededed;
        `;
        canvas.appendChild(lilDiv);
    }
    
});