let Ship = require('./Ship');
class PatrolKiller extends Ship {
    extends
    /**
     * PatrolKiller 생성자
     * @param {Number} row 
     * @param {Number} col 
     * @param {Directions} direction 
     */
    constructor(row, col, direction) {
        super(row,col,direction,2);
    }
    toString() {
        return "type : PatrolKiller, "+super.toString();
    }
}
module.exports = PatrolKiller;