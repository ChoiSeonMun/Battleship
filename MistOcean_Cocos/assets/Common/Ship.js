let types = require('./types');
let Directions = types.Directions;
class Ship {
    /**
     * Ship 생성자
     * @param {Number} row 
     * @param {Number} col 
     * @param {Directions} direction 
     * @param {Number} length 
     */
    constructor(row, col, direction, length) {
        this.row = row;
        this.col = col;
        this.direction = direction;
        this.length = length;
        this.health = length;
    }
    /**
     * 배의 위치를 [row, col] 형태로 반환
     * @returns {[Number, Number]} position
     */
    getPosition() {
        return [this.row, this.col];
    }
    /**
     * 배의 방향을 반환
     * @returns {Directions} Directions
     */
    getDirection() {
        return this.direction;
    }
    /**
     * 배의 길이를 반환
     * @returns {Number} length
     */
    getLength(){
        return this.length;
    }
    /**
     * 배의 현재 체력을 반환
     * @returns {Number} health
     */
    getHealth(){
        return this.health;
    }
    /**
     * 배의 체력을 감소시킴
     */
    takeDamage(){
        --this.health;
    }
    /**
     * 배의 침몰 여부를 반환
     * @returns {boolean}
     */
    isSunken(){
        return this.health==0;
    }
    toString() {
        return `position : (${this.row}, ${this.col}), direction : ${Directions.toString(this.directon)}, health : ${this.health}`;
    }
}
module.exports = Ship;