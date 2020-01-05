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

    toString: function (direction) {
        switch (direction) {
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

module.exports.Directions = Directions;
module.exports.ShipTypes = ShipTypes;
//==============================================
