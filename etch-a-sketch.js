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


//Performace functions.
function throttled(delay, fn) { // Helps reduce ammount of times color change/mouseenter event listener is called.
    let lastCall = 0;
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

//Event Functions.
function hoverFunc(e) { //Changes the color of the div.
    let divColor = document.getElementById('color-selector');
    e.target.style.backgroundColor = divColor.value;
}

let removalFunc = () => {
    let limited = factory(); //Constructor.
    // This is to show a separator when waiting.
    let prevDate = window.performance.now();
    limited(function() {
        let difference;
        difference = window.performance.now() - prevDate;
        prevDate = window.performance.now();
        if (difference > 60) console.log('wait');
        //////////
        for (h = 0; h < canvas.childElementCount; h++) {
            canvas.children.item(h).removeEventListener('mouseenter', hoverFunc);
            canvas.children.item(h).removeEventListener('click', hoverFunc);
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
        //////////
        for (h = 0; h < canvas.childElementCount; h++) {
            canvas.children.item(h).addEventListener('mouseenter', hoverFunc);
            canvas.children.item(h).addEventListener('click', debounced(100, hoverFunc));
        }
        canvas.addEventListener('mouseup', throttled(200, removalFunc));
        canvas.addEventListener('mouseleave', throttled(200, removalFunc));
    })
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