class Map2D {
    _map = new Map();

    constructor(rows, cols, defaultValue) {
        if (rows === undefined) return;

        cols = cols || rows;
        defaultValue = defaultValue || null;

        if (rows < 1 || cols < 1) {
            throw new Error('Invalid board size, rows and cols must be greater than 0');
        }

        this.fill(rows, cols, defaultValue);
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

    set(x, y, value) {
        const key = this._encode(x, y);
        this._map.set(key, value);
    }

    has(x, y) {
        const key = this._encode(x, y);
        return this._map.has(key);
    }

    delete(x, y) {
        const key = this._encode(x, y);
        return this._map.delete(key);
    }

    clear() {
        this._map.clear();
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
}
