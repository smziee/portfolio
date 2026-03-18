let display = document.getElementById('display');
let historyContainer = document.getElementById('history-container');
let calcValue = '';
let justCalculated = false;

function updateDisplay(value) {
    if (justCalculated) {
        display.value = '';
        calcValue = '';
        justCalculated = false;
    }

    if (value === '*') {
        calcValue += '*';
        display.value += '×';
    } else if (value === '/') {
        calcValue += '/';
        display.value += '÷';
    } else {
        calcValue += value;
        display.value += value;
    }
}

function percent() {
    calcValue += '/100';
    display.value += '%';
}

function calculate() {
    try {
        let result = eval(calcValue);

        // clear previous history so only 1 item shows
        historyContainer.innerHTML = '';

        // push previous calculation to history
        if (display.value !== '') {
            const span = document.createElement('span');
            span.className = 'history-item';
            span.textContent = display.value;
            historyContainer.prepend(span);
        }

        display.value = result;
        calcValue = result.toString();
        justCalculated = true;
    } catch {
        display.value = 'Error';
        calcValue = '';
        justCalculated = true;
    }
}

function clearDisplay() {
    display.value = '';
    calcValue = '';
    historyContainer.innerHTML = '';
}

function backspace() {
    if (calcValue.length > 0) calcValue = calcValue.slice(0, -1);
    if (display.value.length > 0) display.value = display.value.slice(0, -1);
}