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