//==============================================
//공통 열거형 정의
//
const Directions = {
    RIGHTUP: 1,
    RIGHT: 2,
    RIGHTDOWN: 3,
    LEFTDOWN: 4,
    LEFT: 5,
    LEFTUP: 6,
    toString: function (direc) {
        switch (direc) {
            case this.RIGHTUP: return "RIGHTUP";
            case this.RIGHT: return "RIGHT";
            case this.RIGHTDOWN: return "RIGHTDOWN";
            case this.LEFTDOWN: return "LEFTDOWN";
            case this.LEFT: return "LEFT";
            case this.LEFTUP: return "LEFTUP";
            default: return "default";
        }
    }
}

exports.Directions = Directions;
//==============================================
