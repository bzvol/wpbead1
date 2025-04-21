class Gameplay {
    constructor(name, difficulty, levels) {
        this.playerName = name;
        this.difficulty = difficulty;

        const settings = levels[difficulty];
        this._map = new Map2D(settings.rows, settings.cols);
        this._timer = new Timer(settings.time * 60, this._timerExpired.bind(this));

        const boardElement = document.querySelector('#board');
        this._mapDisplay = new Map2DDisplay(this._map, boardElement);
        this._dndHandler = new DragDropHandler(boardElement, this._onMerge.bind(this));

        this._initUiWithParams();
        this._initBoard();
    }

    _initUiWithParams() {
        GameplayUI.setName(this.playerName);
        GameplayUI.setDifficulty(this.difficulty);
        GameplayUI.setScore(0);
        this._timer.updateDisplay();
    }

    _initBoard() {
        const n = Math.min(levels[this.difficulty].rows, levels[this.difficulty].cols);
        for (let i = 0; i < n; i++) {
            const randomCell = this._map.random();
            const randomTech = this._randomTech();
            this._map.set(randomCell.x, randomCell.y, {
                evolutionName: randomTech.evolutionName,
                stepName: randomTech.step.name
            });
        }
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
}

