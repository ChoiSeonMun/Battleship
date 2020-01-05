//==============================================
//공통 열거형 정의
//
const Directions = {
    RightUp: 1,
    Right: 2,
    RightDown: 3,
    LeftDown: 4,
    Left: 5,
    LeftUp: 6,
    /**
     * 모든 방향을 오른쪽 위부터 시계방향으로 반환한다.
     * @returns {*} [Directions]
     */
    getAllDirections() {
        return [this.RightUp, this.Right, this.RightDown, this.LeftDown, this.Left, this.LeftUp];
    },
    /**
     * 방향에 해당하는 벡터를 반환한다.
     * @param {*} direc 
     * @return {*} [R, C]
     */
    toVector: function (direc) {
        switch (direc) {
            case this.RightUp:
                return [1, 1];
            case this.Right:
                return [0, 2];
            case this.RightDown:
                return [-1, 1];
            case this.LeftDown:
                return [-1, -1];
            case this.Left:
                return [0, -2];
            case this.LeftUp:
                return [1, -1];
            default:
                return [0, 0];
        }
    },
    /**
     * 방향에 해당하는 각도를 반환한다.
     * @param {*} direc 
     * @returns {Number}
     */
    toAngle: function (direc) {
        switch (direc) {
            case this.RightUp:
                return 60;
            case this.Right:
                return 0;
            case this.RightDown:
                return 300;
            case this.LeftDown:
                return 240;
            case this.Left:
                return 180;
            case this.LeftUp:
                return 120;
            default:
                return 0;
        }
    },
    toString: function (direc) {
        switch (direc) {
            case this.RightUp:
                return "RightUp";
            case this.Right:
                return "Right";
            case this.RightDown:
                return "RightDown";
            case this.LeftDown:
                return "LeftDown";
            case this.Left:
                return "Left";
            case this.LeftUp:
                return "LeftUp";
            default:
                return "default";
        }
    }
}

const ShipTypes = {
    PatrolKiller: 0,
    Destroyer: 1,
    Cruiser: 2
}
exports.Directions = Directions;
exports.ShipTypes = ShipTypes;
//==============================================
