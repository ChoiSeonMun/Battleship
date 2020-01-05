let Ship = require('./ship');
let Map = require('./map');
let TileTypes = require('./tile').TileTypes;

class Player {
    /**
     * Player 생성자
     * @param {String} nickname 유저 닉네임
     */
    constructor(nickname) {
        this.nickname = nickname;
        this.ships = [];
        this.map = new Map();
    }

    /**
     * 플레이어의 닉네임을 가져온다.
     * @returns {String} 유저 닉네임
     */
    get nickname() {
        return this.nickname;
    }

    /**
     * 플레이어가 가지고 있는 배들을 가져온다.
     * @returns {Ship[]} 배의 배열
     */
    get ships() {
        return this.ships;
    }

    /**
     * 해당 플레이어의 맵을 가져온다.
     * @returns {Map} 플레어의 맵
     */
    get map() {
        return this.map;
    }

    /**
     * row, col 위치를 공격한다.
     * @param {Number} row 행
     * @param {Number} col 열
     */
    attackTo(row, col) {
        let tile = map.getTile(row, col);
        if (tile.canAttack()) {
            tile.setType(TileTypes.Attacked);
        }
    }

    /**
     * row, col 위치에 배를 배치한다.
     * @param {Ship} ship 배
     * @param {row} row 행
     * @param {col} col 열
     */
    placeOn(ship, row, col) {
        let tile = map.getTile(row, col);
        if (tile.isNormal()) {
            tile.setType(TileTypes.HasShip);
            this.ships.push(ship);
        }
    }
}

module.exports = Player;