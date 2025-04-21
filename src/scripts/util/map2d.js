class Map2D {
    _map = new Map();

    constructor(rows, cols = rows, defaultValue = null) {
        if (rows === undefined) return;

        if (rows < 1 || cols < 1) {
            throw new Error('Invalid board size, rows and cols must be greater than 0');
        }

        this.cols = cols;
        this.rows = rows;

        this.eventListeners = {
            onSet: null,
            onDelete: null,
            onClear: null
        };

        this.fill(this.rows, this.cols, defaultValue);
    }

    // Using the Cantor pairing function to encode 2D coordinates into a single number
    _encode(x, y) {
        return 1 / 2 * (x + y) * (x + y + 1) + y;
    }

    _decode(z) {
        let w = Math.floor((Math.sqrt(8 * z + 1) - 1) / 2);
        let t = (w * (w + 1)) / 2;
        let y = z - t;
        let x = w - y;
        return [x, y];
    }

    get(x, y) {
        const key = this._encode(x, y);
        return this._map.get(key);
    }

    random() {
        const keys = Array.from(this._map.keys());
        if (keys.length === 0) return null;

        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const [x, y] = this._decode(randomKey);
        return { x, y, value: this._map.get(randomKey) };
    }

    set(x, y, value) {
        const key = this._encode(x, y);
        this._map.set(key, value);

        if (this.eventListeners.onSet) {
            this.eventListeners.onSet(x, y, value);
        }
    }

    has(x, y) {
        const key = this._encode(x, y);
        return this._map.has(key);
    }

    delete(x, y) {
        const key = this._encode(x, y);
        const deleted = this._map.delete(key);

        if (deleted && this.eventListeners.onDelete) {
            this.eventListeners.onDelete(x, y);
        }

        return deleted;
    }

    clear() {
        this._map.clear();

        if (this.eventListeners.onClear) {
            this.eventListeners.onClear();
        }
    }

    keys() {
        return Array.from(this._map.keys()).map(this._decode);
    }

    values() {
        return Array.from(this._map.values());
    }

    entries() {
        return Array.from(this._map.entries()).map(([key, value]) => {
            const [x, y] = this._decode(key);
            return [x, y, value];
        });
    }

    forEach(callback) {
        this.entries().forEach(([x, y, value]) => callback(value, x, y));
    }

    get size() {
        return this._map.size;
    }

    get [Symbol.iterator]() {
        return this.entries();
    }

    fill(rows, cols, value) {
        value = value || null;
        for (let x = 0; x < rows; x++) {
            for (let y = 0; y < cols; y++) {
                this.set(x, y, value);
            }
        }
    }

    setEventListeners(onSet, onDelete, onClear) {
        this.eventListeners.onSet = onSet;
        this.eventListeners.onDelete = onDelete;
        this.eventListeners.onClear = onClear;
    }
}

class Map2DDisplay {
    constructor(map, boardElement) {
        this._map = map;
        this._boardElement = boardElement;

        this._map.setEventListeners(
            this._onSet.bind(this),
            this._onDelete.bind(this),
            this._onClear.bind(this));
    }

    _getCell(x, y) {
        return this._boardElement.querySelector(this._cellSelector(x, y));
    }

    _cellSelector(x, y) {
        return `.board-cell[data-x="${x}"][data-y="${y}"]`;
    }

    _activateCell(cell, value) {
        cell.dataset.active = 'true';
        cell.classList.add('active-cell');
        cell.draggable = true;

        const {evolutionName, stepName} = value;
        const {step} = getTechnologyByName(evolutionName, stepName);

        cell.dataset.evolution = evolutionName;
        cell.dataset.step = stepName;

        cell.style.backgroundImage = `url('assets/logos/${step.img}')`;
    }

    _deactivateCell(cell) {
        cell.dataset.active = 'false';
        cell.classList.remove('active-cell');
        cell.draggable = false;

        delete cell.dataset.evolution;
        delete cell.dataset.step;

        cell.style.removeProperty('background-image');
    }

    _onSet(x, y, value) {
        const cell = this._getCell(x, y);
        if (cell) {
            this._activateCell(cell, value);
        }
    }

    _onDelete(x, y) {
        const cell = this._getCell(x, y);
        if (cell) {
            this._deactivateCell(cell);
        }
    }

    _onClear() {
        const cells = this._boardElement.querySelectorAll('.board-cell');
        cells.forEach(cell => this._deactivateCell(cell));
    }

    static getTechnologyFromCell(cell) {
        const {evolution: evolutionName, step: stepName} = cell.dataset;
        return getTechnologyByName(evolutionName, stepName);
    }
}
