let Ship = require('./ship/Ship');
class Player {
    extends
    /**
     * PatrolKiller 생성자
     * @param {String} nickname
     */
    constructor(nickname) {
        this.nickname = nickname;
        this.ships = [];
    }
    /**
     * 플레이어의 닉네임을 반환한다.
     * @returns {String}
     */
    getNickname() {
        return this.nickname;
    }
    /**
     * 플레이어가 가지고 있는 배의 배열을 반환한다.
     * @returns {Ship[]}
     */
    getShips() {
        return this.ships;
    }
    /**
     * row, col 위치를 공격한다.
     * @param {Number} row 
     * @param {Number} col 
     */
    attackTo(row, col) {
        // row,col 위치 공격
    }
    /**
     * row, col 위치에 배를 배치한다.
     * @param {Ship} ship 
     * @param {row} row 
     * @param {col} col 
     */
    placeOn(ship, row, col) {
        this.ships.push(ship);
    }
}
module.exports = Player;