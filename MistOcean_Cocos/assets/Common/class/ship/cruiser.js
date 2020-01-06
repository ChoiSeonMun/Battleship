let Ship = require('./Ship');

class Cruiser extends Ship {
    /**
     * Cruiser 생성자
     * @param {Number} row 행
     * @param {Number} col 열
     * @param {Directions} direction 방향
     */
    constructor(row, col, direction) {
        super(row, col, direction, 4);
    }

    toString() {
        return "type : Cruiser, " + super.toString();
    }
}

module.exports = Cruiser;