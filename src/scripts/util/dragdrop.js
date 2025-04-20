class DragDropHandler {
    _dragged = null;

    constructor(boardElement, onMerge) {
        this._boardElement = boardElement;
        this._onMerge = onMerge;

        this._initDragEvents();
    }

    _initDragEvents() {
        const cells = this._boardElement.querySelectorAll('.board-cell');
        cells.forEach(cell => Object.entries(this._dragEventListeners)
            .forEach(([eventName, handler]) =>
                cell.addEventListener(eventName, handler.bind(this))));
    }

    _onDragStart(event) {
        if (!event.currentTarget.dataset.active) return;

        this._dragged = event.currentTarget;
        event.dataTransfer.setData('text/plain', '');
    }

    _onDrop(event) {
        event.preventDefault();

        const cell = event.currentTarget;

        if (this._canDropAt(cell)) {
            cell.classList.remove('cell-drag-over');

            const [x1, y1, x2, y2] = [
                this._dragged.dataset.x, this._dragged.dataset.y,
                cell.dataset.x, cell.dataset.y
            ];
            const tech = this._dragged.dataset.technology;

            this._dragged = null;
            this._onMerge(x1, y1, x2, y2, tech);
        } else {
            cell.classList.remove('cell-drag-over');
        }
    }

    _onDragOver(event) {
        if (this._canDropAt(event.currentTarget)) {
            event.preventDefault();
        }
    }

    _onDragEnter(event) {
        if (this._canDropAt(event.currentTarget)) {
            event.preventDefault();
            event.currentTarget.classList.add('cell-drag-over');
        }
    }

    _onDragLeave(event) {
        if (this._canDropAt(event.currentTarget) && event.currentTarget.classList.contains('cell-drag-over')) {
            event.preventDefault();
            event.currentTarget.classList.remove('cell-drag-over');
        }
    }

    _canDropAt(element) {
        return element !== this._dragged
            && element.dataset.active === 'true'
            && this._dragged.dataset.technology === element.dataset.technology;
    }

    get _dragEventListeners() {
        return {
            dragstart: this._onDragStart,
            dragover: this._onDragOver,
            drop: this._onDrop,
            dragenter: this._onDragEnter,
            dragleave: this._onDragLeave
        }
    }
}