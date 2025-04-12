import {levels} from "./data/evolutions.js";

// Generate options for the difficulty selector
const difficultySelector = document.querySelector('#difficulty');
Object.keys(levels).forEach(levelKey => {
    const option = document.createElement('option');
    option.textContent = levels[levelKey].name;
    option.value = levelKey;
    difficultySelector.appendChild(option);
});
