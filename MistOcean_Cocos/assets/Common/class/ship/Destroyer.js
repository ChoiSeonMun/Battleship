let Ship = require('./Ship');
class Destroyer extends Ship {
    extends
    /**
     * PatrolKiller 생성자
     * @param {Number} row 
     * @param {Number} col 
     * @param {Directions} direction 
     */
    constructor(row, col, direction) {
        super(row,col,direction,3);
    }
    toString() {
        return "type : Destroyer, "+super.toString();
    }
}
module.exports = Destroyer;