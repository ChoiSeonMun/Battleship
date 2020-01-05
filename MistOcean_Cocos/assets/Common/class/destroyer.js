let Ship = require('./ship');

class Destroyer extends Ship {
    /**
     * Destroyer 생성자
     * @param {Number} row 행
     * @param {Number} col 열
     * @param {Directions} direction 방향
     */
    constructor(row, col, direction) {
        super(row, col, direction, 3);
    }

    toString() {
        return "type : Destroyer, " + super.toString();
    }
}

module.exports = Destroyer;