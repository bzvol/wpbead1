const {name, difficulty} = readGameParams();
initUi(difficulty, evolutions, levels);
runGame(name, difficulty);

function initUi(difficulty, evolutions, levels) {
    const {cols, rows} = levels[difficulty];
    setBoardSize(cols, rows);
    initializePoints(evolutions, difficulty);
    initializeLeaderboard(levels);
    loadLeaderboardData();
}

function readGameParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const name = (urlParams.get('name') || 'Player 1').toUpperCase();
    const difficulty = urlParams.get('difficulty') || 'medium';

    return {name, difficulty};
}

function setBoardSize(cols, rows) {
    const board = document.querySelector('#board');
    board.innerHTML = '';

    board.style.setProperty('--cols', cols);
    board.style.setProperty('--rows', rows);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = createBoardCell(j, i);
            const tooltip = createTooltip();
            cell.appendChild(tooltip);
            board.appendChild(cell);
        }
    }
}

function createBoardCell(x, y) {
    const cell = document.createElement('div');

    cell.dataset.active = 'false';
    cell.classList.add('board-cell');
    cell.dataset.x = x.toString();
    cell.dataset.y = y.toString();

    return cell;
}

function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');

    const title = document.createElement('h3');
    title.classList.add('tooltip-title');
    const description = document.createElement('div');
    description.classList.add('tooltip-desc');
    const tooltipImage = document.createElement('img');
    tooltipImage.classList.add('tooltip-img');
    tooltipImage.alt = 'Evolution chain';

    tooltip.append(title, description, tooltipImage);

    return tooltip;
}

function initializePoints(evolutions, difficulty) {
    const pointsSection = document.querySelector('#points');
    pointsSection.innerHTML = '';

    for (const evolution of getEvolutionsForDifficulty(difficulty)) {
        const {shortName, points} = evolution;

        const label = document.createElement('span');
        label.classList.add('label');
        label.textContent = shortName;
        pointsSection.appendChild(label);

        const value = document.createElement('span');
        value.classList.add('value');
        const pointsString = points.toString().padStart(2, '0');
        value.textContent = `* ${pointsString}p = ##`;
        pointsSection.appendChild(value);
    }
}

function initializeLeaderboard(levels) {
    const leaderboard = document.querySelector('#leaderboard');
    leaderboard.innerHTML = '<h2>Leaderboard</h2>';

    for (const level of Object.keys(levels)) {
        const {name} = levels[level];

        const section = document.createElement('div');
        section.classList.add('lb-section');
        section.dataset.level = level;

        const title = document.createElement('h3');
        title.textContent = name;
        section.appendChild(title);

        const list = document.createElement('div');
        list.classList.add('lb-list');

        for (let i = 0; i < 5; i++) {
            const label = document.createElement('span');
            label.classList.add('label');
            label.textContent = '********';
            list.appendChild(label);

            const value = document.createElement('span');
            value.classList.add('value');
            value.textContent = ': 000000';
            list.appendChild(value);
        }

        section.appendChild(list);
        leaderboard.appendChild(section);
    }
}

function loadLeaderboardData() {
    let lbData = localStorage.getItem('leaderboard');
    if (!lbData) return;

    lbData = JSON.parse(lbData);
    const loadedLevels = Object.keys(lbData);

    const sections = document.querySelectorAll('#leaderboard > .lb-section');
    for (const section of sections) {
        const sectionLevel = section.dataset.level;
        if (!loadedLevels.includes(sectionLevel)) continue;
        const scores = lbData[sectionLevel].toSorted((a, b) => b.score - a.score);

        const labels = section.querySelectorAll('.lb-list > .label');
        const values = section.querySelectorAll('.lb-list > .value');

        for (let i = 0; i < Math.min(scores.length, 5); i++) {
            const {name, score} = scores[i];
            labels[i].textContent = name;
            const scoreString = score.toString().padStart(6, '0');
            values[i].textContent = `: ${scoreString}`;
        }
    }
}
