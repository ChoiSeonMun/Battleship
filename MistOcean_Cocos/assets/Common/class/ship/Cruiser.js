let Ship = require('./Ship');
class Cruiser extends Ship {
    extends
    /**
     * PatrolKiller 생성자
     * @param {Number} row 
     * @param {Number} col 
     * @param {Directions} direction 
     */
    constructor(row, col, direction) {
        super(row,col,direction,4);
    }
    toString() {
        return "type : Cruiser, "+super.toString();
    }
}
module.exports = Cruiser;