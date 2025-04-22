class Gameplay {
    constructor(name, difficulty) {
        this.playerName = name;
        this.difficulty = difficulty;
        this.score = 0;
        this.evolutionPoints = new Map(evolutions.map(e => [e.shortName, 0]));

        const settings = levels[difficulty];
        this._map = new Map2D(settings.rows, settings.cols);
        this._timer = new Timer(settings.time * 60, this._timerExpired.bind(this));

        const boardElement = document.querySelector('#board');
        this._mapDisplay = new Map2DDisplay(this._map, boardElement);
        this._dndHandler = new DragDropHandler(boardElement, this._onMerge.bind(this));
        this._tooltipHoverHandler = new TooltipHoverHandler(boardElement);

        this._initUiWithParams();
        this._initBoard();
        this._initDrawBtn();
    }

    _initUiWithParams() {
        GameplayUI.setName(this.playerName);
        GameplayUI.setDifficulty(this.difficulty);
        GameplayUI.setScore(this.score);
        evolutions.forEach(e => GameplayUI.setEvolutionPoints(e, 0));
        this._timer.updateDisplay();
    }

    _initBoard() {
        const n = Math.min(levels[this.difficulty].rows, levels[this.difficulty].cols);
        for (let i = 0; i < n; i++) this._draw();

        document.querySelectorAll('#board .board-cell')
            .forEach(cell =>
                cell.addEventListener('click', this._onCellClick.bind(this)));
    }

    _initDrawBtn() {
        const drawBtn = document.querySelector('#btn-draw');
        drawBtn.addEventListener('click', this._draw.bind(this));
    }

    start() {
        this._timer.start();
    }

    _timerExpired() {
    }

    _onMerge(x1, y1, x2, y2, tech) {
        const {evolution, step, level} = tech;

        if (step.step >= evolution.steps.length) return;
        const nextStep = evolution.steps.find(s => s.step === level + 1);
        if (!nextStep) throw new Error(`Could not find step ${level + 1} for evolution ${evolution.name}`);

        this._map.set(x2, y2, {
            evolutionName: evolution.name,
            stepName: nextStep.name
        });

        if (nextStep.step === evolution.steps.length) {
            this._mapDisplay.setLastStepCell(x2, y2);
        }

        const randomTech = this._randomTech();
        this._map.set(x1, y1, {
            evolutionName: randomTech.evolutionName,
            stepName: randomTech.step.name
        });
    }

    _randomTech(level = 1) {
        if (level < 1) throw new Error('Level must be greater than 0');

        const evolutionsForDifficulty = getEvolutionsForDifficulty(this.difficulty);

        const evolutionIdx = Math.floor(Math.random() * evolutionsForDifficulty.length);
        const evolution = evolutionsForDifficulty[evolutionIdx];
        const step = evolution.steps.find(step => step.step === level);

        return {step, evolutionName: evolution.name};
    }

    _draw() {
        const randomCell = this._map.random();
        if (!randomCell) return;

        const randomTech = this._randomTech();
        this._map.set(randomCell.x, randomCell.y, {
            evolutionName: randomTech.evolutionName,
            stepName: randomTech.step.name
        });

        if (randomCell.isLastKey) {
            const drawBtn = document.querySelector('#btn-draw');
            drawBtn.disabled = true;
        }
    }

    _onCellClick(event) {
        const cell = event.currentTarget;
        if (cell.dataset.active === 'true' &&
            cell.dataset.lastStep === 'false') return;

        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);

        if (cell.dataset.lastStep === 'true') {
            const {evolution} = Map2DDisplay.getTechnologyFromCell(cell);
            this._increaseScore(evolution);
            this._map.delete(x, y);

            return;
        }

        const randomTech = this._randomTech();
        this._map.set(x, y, {
            evolutionName: randomTech.evolutionName,
            stepName: randomTech.step.name
        });
    }

    _increaseScore(evolution) {
        this.score += evolution.points;
        const evolutionPoints = this.evolutionPoints.get(evolution.shortName) + evolution.points;
        this.evolutionPoints.set(evolution.shortName, evolutionPoints);

        GameplayUI.setScore(this.score);
        GameplayUI.setEvolutionPoints(evolution, evolutionPoints);
    }
}

class GameplayUI {
    static setName(name) {
        const nameElement = document.querySelector('#info-name');
        nameElement.textContent = ': ' + name;
    }

    static setDifficulty(difficulty) {
        const difficultyElement = document.querySelector('#info-difficulty');
        difficultyElement.textContent = ': ' + difficulty;
    }

    static setScore(score) {
        const scoreElement = document.querySelector('#info-score');
        scoreElement.textContent = ': ' + score.toString().padStart(6, '0');
    }

    static setEvolutionPoints(evolution, points) {
        const labels = [...document.querySelectorAll('#points .label')];
        const labelElement = labels.find(l => l.textContent === evolution.shortName);
        if (!labelElement) return;

        const valueElement = labelElement.nextSibling;

        const pointsPerIncreaseString = evolution.points.toString().padStart(2, '0');
        const pointsString = points.toString().padStart(2, '0');
        valueElement.textContent = `* ${pointsPerIncreaseString}p = ${pointsString}`;
    }
}

