let enums = require('../../enums');
let Directions = enums.Directions;
class Ship {
    /**
     * Ship 생성자
     * @param {Number} row 행 
     * @param {Number} col 열
     * @param {Directions} direction 방향 
     * @param {Number} length 배의 길이
     */
    constructor(row, col, direction, length) {
        this.row = row;
        this.col = col;
        this.direction = direction;
        this.length = length;
        this.health = length;
    }

    /**
     * 배의 위치를 가져온다.
     * @returns {[Number, Number]} 위치값으로 [row, col]의 형태
     */
    get position() {
        return [this.row, this.col];
    }

    /**
     * 배의 방향을 가져온다.
     * @returns {Directions} 배의 방향
     */
    get direction() {
        return this.direction;
    }

    /**
     * 배의 길이를 가져온다.
     * @returns {Number} 배의 길이
     */
    get length() {
        return this.length;
    }

    /**
     * 배의 현재 체력을 가져온다.
     * @returns {Number} 배의 현재 체력
     */
    get health() {
        return this.health;
    }

    /**
     * 배의 체력을 1 감소시킨다.
     */
    takeDamage() {
        --this.health;
    }

    /**
     * 배가 완전히 난파당했는지 확인한다.
     * @returns {boolean} 결과값
     */
    isSunken() {
        return this.health == 0;
    }

    toString() {
        return `position : (${this.row}, ${this.col}), direction : ${Directions.toString(this.direction)}, health : ${this.health}`;
    }
}

module.exports = Ship;