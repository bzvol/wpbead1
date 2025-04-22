class TooltipHoverHandler {
    _currentHover = null;

    constructor(boardElement) {
        const cells = boardElement.querySelectorAll('.board-cell');
        cells.forEach(cell => {
            cell.addEventListener('mouseenter', this._onHoverEnter.bind(this));
            cell.addEventListener('mouseleave', this._onHoverLeave.bind(this));
        });
    }

    _onHoverEnter(event) {
        const cell = event.currentTarget;
        if (cell.dataset.active !== 'true') return;

        this._currentHover = {
            timeout: setTimeout(() => {
                const tooltip = cell.querySelector('.tooltip');
                tooltip.classList.add('show-tooltip');
            }, 3000),
            x: cell.dataset.x,
            y: cell.dataset.y
        };
    }

    _onHoverLeave(event) {
        if (!this._currentHover) return;

        const cell = event.currentTarget;
        if (cell.dataset.x !== this._currentHover.x ||
            cell.dataset.y !== this._currentHover.y) return;

        const tooltip = cell.querySelector('.tooltip');
        tooltip.classList.remove('show-tooltip');

        const timeout = this._currentHover.timeout;
        this._currentHover = null;
        clearTimeout(timeout);
    }
}