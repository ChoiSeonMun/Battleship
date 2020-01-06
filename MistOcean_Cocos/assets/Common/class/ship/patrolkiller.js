let Ship = require('./Ship');

class PatrolKiller extends Ship {
    /**
     * PatrolKiller 생성자
     * @param {Number} row 행
     * @param {Number} col 열
     * @param {Directions} direction 방향
     */
    constructor(row, col, direction) {
        super(row, col, direction, 2);
    }

    toString() {
        return "type : PatrolKiller, " + super.toString();
    }
}

module.exports = PatrolKiller;