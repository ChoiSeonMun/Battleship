let Tile = require('./tile').Tile;
let SETTINGS = require('../settings');

// Map 클래스
// 각 플레이어의 배, 폭탄 등의 배치 상황을 표현한다.
class Map {
    /**
     * Map의 생성자
     */
    constructor() {
        this.width = SETTINGS.WIDTH;
        this.height = SETTINGS.HEIGHT;

        this.representation = [];
        for (let r = 0; r < this.height; ++r) {
            this.representation[r] = [];
            for (let c = 0; c < this.width; ++c) {
                this.representation[r][c] = new Tile();
            }
        }
    }

    /**
     * 맵의 너비를 반환
     * @returns {Number} 맵의 너비
     */
    get width() {
        return this.width;
    }

    /**
     * 맵의 높이를 반환
     * @returns {Number} 맵의 높이
     */
    get height() {
        return this.height;
    }

    /**
     * 해당 위치의 Tile을 가져온다.
     * @param {Number} row 행
     * @param {Number} col 열
     * @returns {Tile} 해당 위치의 Tile Reference
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