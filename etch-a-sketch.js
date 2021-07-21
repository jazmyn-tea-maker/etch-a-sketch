
let slider = document.getElementById('myRange');
let sliderNum =  4;
let dataList = document.getElementById('dataList');

function getClosest(arr, valueOfSlider) {
	return arr.reduce(function (prev, curr) { //Snaps to the closest (least difference) square in array.
    return (Math.abs(curr - valueOfSlider) < Math.abs(prev - valueOfSlider) ? curr : prev);
  });
}

slider.addEventListener('change', function () {
    sliderNum = document.getElementById('myRange').value;
    let optionArr = []; //Array that will allow snapping to values.
    for (i = 4; i < 1000; i ++) {
        if (Math.sqrt(i) % 1 == 0) {
            optionArr.push(i);
        }
    }
    sliderNumSqrt = getClosest(optionArr, sliderNum);
    console.log(optionArr);
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

console.log(dataList);

slider.list = dataList;



let canvas = document.getElementById('canvas');





