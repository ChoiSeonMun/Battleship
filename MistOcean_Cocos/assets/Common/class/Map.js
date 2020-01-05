let tile = require('./Tile');
let Tile = tile.Tile;
let TileTypes = tile.TileTypes;
class Map {
    constructor(width, height) {
        this.representation = [];
        this.width = width;
        this.height = height;
        this.initRepresentation();
    }
    initRepresentation() {
        for (let r = 0; r < this.height; ++r) {
            this.representation[r] = [];
            for (let c = 0; c < this.width; ++c) {
                this.representation[r][c] = new Tile();
            }
        }
    }
    /**
     * 맵의 넓이를 반환
     * @returns {Number} width
     */
    getWidth() {
        return this.width;
    }
    /**
     * 맵의 높이를 반환
     * @returns {Number} height
     */
    getHeight() {
        return this.height;
    }
    /**
     * Map이 가지고 있는 타일에 접근
     * @param {Number} row 
     * @param {Number} col 
     * @returns {Tile} Tile
     */
    getTile(row, col) {
        return this.representation[row][col];
    }
    toString() {
        let str = "";
        for (let r = 0; r < this.height; ++r) {
            for (let c = 0; c < this.width; ++c) {
                str += this.getTile(r, c).getType() + ' ';
            }
            str += '\n';
        }
        return str;
    }
}
module.exports = Map;