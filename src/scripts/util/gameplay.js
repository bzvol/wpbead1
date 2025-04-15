class Gameplay {
    constructor(name, difficulty, levels) {
        this.playerName = name;
        this.difficulty = difficulty;

        const settings = levels[difficulty];
        this._map = new Map2D(settings.rows, settings.cols);
        this._timer = new Timer(settings.time * 60, this._timerExpired.bind(this));

        this._initUiWithParams();
    }

    _initUiWithParams() {
        GameplayUI.setName(this.playerName);
        GameplayUI.setDifficulty(this.difficulty);
        GameplayUI.setScore(0);
        this._timer.updateDisplay();
    }

    start() {
        this._timer.start();
    }

    _timerExpired() {
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

class Timer {
    constructor(seconds, onExpire) {
        this.seconds = seconds;
        this._interval = null;
        this._onExpire = onExpire;

        this._timerElement = document.querySelector('#info-time');
    }

    start() {
        this._interval = setInterval(() => {
            this.seconds--;
            this.updateDisplay();

            if (this.seconds <= 0) {
                clearInterval(this._interval);
                this._onExpire();
            }
        }, 1000);
    }

    updateDisplay() {
        const minutes = Math.floor(this.seconds / 60);
        const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const seconds = this.seconds % 60;
        const paddedSeconds = seconds < 10 ? '0' + seconds : seconds;
        this._timerElement.textContent = `: ${paddedMinutes}:${paddedSeconds}`;
    }
}