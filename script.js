let fakeBar = null;
let selectedBars = { left: [], right: [] };
let realBars = new Set(); // Set to track real bars
let weighCount = 0; // Counter for weigh attempts
let currentMessage = ''; // Store the current result message

// Initialize the game
function init() {
    fakeBar = Math.floor(Math.random() * 9) + 1;
    selectedBars = { left: [], right: [] };
    realBars.clear();
    weighCount = 0; // Reset weigh count
    currentMessage = ''; // Reset the current message
    updateBarButtons();
    updateScales();
    updateResultMessage(''); // Clear result message on initialization
}

// Create bar buttons
function updateBarButtons() {
    const container = document.getElementById('barsContainer');
    container.innerHTML = '';
    for (let i = 1; i <= 9; i++) {
        const button = document.createElement('div');
        button.className = 'bar-container';
        button.innerHTML = `
            <span class="bar ${realBars.has(i) ? 'real-bar' : ''}">Bar ${i}</span>
            <button onclick="addBar(${i}, 'left')">Add to Left</button>
            <button onclick="addBar(${i}, 'right')">Add to Right</button>
            <button onclick="removeBar(${i})">Remove</button>
            <button onclick="markAsReal(${i})">Mark as Real</button>
        `;
        container.appendChild(button);
    }
}

// Add bar to scale
function addBar(barNumber, scale) {
    if (!realBars.has(barNumber)) {
        const scaleArray = selectedBars[scale];
        if (!scaleArray.includes(barNumber)) {
            scaleArray.push(barNumber);
            weighScales(); // Weigh scales on add
            updateScales();
        }
    }
}

// Remove bar from scale
function removeBar(barNumber) {
    for (const scale in selectedBars) {
        const index = selectedBars[scale].indexOf(barNumber);
        if (index !== -1) {
            selectedBars[scale].splice(index, 1);
        }
    }
    weighScales(); // Weigh scales on remove
    updateScales();
}

// Mark a bar as real
function markAsReal(barNumber) {
    if (barNumber === fakeBar) {
        loseGame(); // End the game if the fake bar is marked real
        return;
    }
    realBars.add(barNumber);
    removeBar(barNumber); // Remove from scales if marked real
    updateBarButtons(); // Update the display to show marked bars

    // Check if only one bar is unmarked
    if (realBars.size === 8) {
        endGame();
    }
}

// End the game when the fake bar is found
function endGame() {
    const fakeBarNumber = [...Array(10).keys()].find(i => !realBars.has(i) && i !== 0);
    updateResultMessage(`Fake bar is Bar ${fakeBarNumber}. Found in ${weighCount} weighings.`);
}

// Lose the game when the fake bar is marked as real
function loseGame() {
    updateResultMessage('You marked the fake bar as real! Game over.');
}

// Update the display of the scales
function updateScales() {
    const leftScale = document.getElementById('leftScale').getElementsByClassName('bars')[0];
    const rightScale = document.getElementById('rightScale').getElementsByClassName('bars')[0];

    leftScale.innerHTML = selectedBars.left.map(bar => `<div class="bar">Bar ${bar}</div>`).join('');
    rightScale.innerHTML = selectedBars.right.map(bar => `<div class="bar">Bar ${bar}</div>`).join('');
}

// Update the result message
function updateResultMessage(message) {
    const resultMessageElement = document.getElementById('resultMessage');
    if (resultMessageElement) {
        resultMessageElement.textContent = message;
        if (message.includes('Game over')) {
            resultMessageElement.style.fontSize = '24px'; // Make the game-over message larger
            resultMessageElement.style.color = 'red'; // Make the game-over message red
        }
    }
}

// Weigh the scales and update the current message
function weighScales() {
    const leftWeight = selectedBars.left.reduce((acc, bar) => acc + (bar === fakeBar ? 0 : 1), 0);
    const rightWeight = selectedBars.right.reduce((acc, bar) => acc + (bar === fakeBar ? 0 : 1), 0);

    if (leftWeight < rightWeight) {
        currentMessage = 'Left Scale is lighter.';
    } else if (rightWeight < leftWeight) {
        currentMessage = 'Right Scale is lighter.';
    } else {
        currentMessage = 'Scales are balanced.';
    }
}

// Display the result when the "Weigh" button is clicked
function showResult() {
    weighCount++; // Increment weigh count
    updateResultMessage(`${currentMessage} Weigh attempts: ${weighCount}`);
}

// Clear scales
function clearScales() {
    selectedBars = { left: [], right: [] };
    updateScales();
    currentMessage = 'Scales are balanced.'; // Reset the message
}

// Reset the game
function resetGame() {
    init();
}

// Initialize the game on page load
window.onload = init;
