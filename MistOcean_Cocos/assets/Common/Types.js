//==============================================
//comon enum define
//
const EDirec = {
    default: -1,
    RIGHTUP: 1,
    RIGHT: 2,
    RIGHTDOWN: 3,
    LEFTDOWN: 4,
    LEFT: 5,
    LEFTUP: 6,
    /**
     * EDirec to vector
     * @param {*} direc 
     * @return {Vector} direc's vector 
     */
    getVector: function (direc) {
        switch (direc) {
            case this.RIGHTUP: return new Vector(1, 1);
            case this.RIGHT: return new Vector(2, 0);
            case this.RIGHTDOWN: return new Vector(1, -1);
            case this.LEFTDOWN: return new Vector(-1, -1);
            case this.LEFT: return new Vector(-2, 0);
            case this.LEFTUP: return new Vector(-1, 1);
            default: return new Vector(0, 0);
        }
    },
    /**
     * EDirec to angle
     * @param {*} direc 
     * @returns {Number} degree angle
     */
    getAngle: function (direc) {
        switch (direc) {
            case this.RIGHTUP: return 60;
            case this.RIGHT: return 0;
            case this.RIGHTDOWN: return 300;
            case this.LEFTDOWN: return 240;
            case this.LEFT: return 180;
            case this.LEFTUP: return 120;
            default: return 0;
        }
    },
    /**
     * angle to EDirec
     * @param {Number} angle 
     * @returns {*} matching EDirec
     */
    getDirec: function (angle) {
        if (angle <= -150 || angle >= 150) return this.LEFT;
        if (angle > 90) return this.LEFTUP;
        if (angle > 30) return this.RIGHTUP;
        if (angle < -90) return this.LEFTDOWN;
        if (angle < -30) return this.RIGHTDOWN;
        return this.RIGHT;
    },
    /**
     * vector to EDirec
     * @param {Vector} vec
     * @returns {*} matching EDirec 
     */
    toDirec: function (vec) {
        if (vec.x < 0)
            return vec.y == 1 ? this.LEFTUP : vec.y == 0 ? this.LEFT : this.LEFTDOWN;
        return vec.y == 1 ? this.RIGHTUP : vec.y == 0 ? this.RIGHT : this.RIGHTDOWN;
    },
    /**
     * get all EDirec's Vector
     * @returns {[*]} Vector array
     */
    getAllVectors() {
        var arr = [];
        for (var i = 1; i <= 6; ++i)
            arr.push(this.getVector(i));
        return arr;
    },
    /**
     * get all Vectors excluded direc, opposite direc
     * @param {*} direc origin EDirec
     * @returns {*} other Vector array 
     */
    getVerticalVectors(direc) {
        let vs = this.getAllVectors();
        let v1 = this.getVector(direc);
        let v2 = this.getVector(direc > 3 ? direc - 3 : direc + 3);
        var result = [];
        for (let v of vs)
            if (!v.equals(v1) && !v.equals(v2))
                result.push(v);
        return result;
    },
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
const ShipType = {
    default: -1,

    Small: 2,
    Middle: 3,
    Big: 4,
    toString: function (type) {
        switch (parseInt(type)) {
            case this.Small: return "소형";
            case this.Middle: return "중형";
            case this.Big: return "대형";
        }
        return "";
    },
    getAllTypes: function () {
        return [2, 3, 4];
    }
}
const ScreenType = {
    default: -1,
    Build: 1,
    Battle: 2
}
const TileType = {
    default: -1,
    Build: 1,
    Damaged: 2,
    Bomb: 3,
    Selectable: 4,
    Selected: 5,
    Enermy: 6,
    toString: function (type) {
        switch (type) {
            case this.Build: return "Build";
            case this.Damaged: return "Damaged";
            case this.Bomb: return "Bomb";
            case this.Selectable: return "Selectable";
            case this.Selected: return "Selected";
            case this.Enermy: return "Enermy";
        }
        return "";
    },
}
const ZOrder = {
    default: -1,
    Tile: 1,
    Ship: 2,
    Preview: 3,
    Highlight: 4
}
const JoinEventType = {
    default: -1,
    Wait: 1,
    Start: 2,
    Failure: 3
}
const AttackEventType = {
    default: -1,
    None: 1,
    Bomb: 2,
    Ship: 3,
    SunkenShip: 4
}
exports.EDirec = EDirec;
exports.ShipType = ShipType;
exports.ScreenType = ScreenType;
exports.TileType = TileType;
exports.ZOrder = ZOrder;
exports.JoinEventType = JoinEventType;
exports.AttackEventType = AttackEventType;
//==============================================
//common object type define
//
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    /**
     * return this+v vector
     * @param {Vector} v
     * @returns {Vector} vector added v
     */
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    /**
     * return this-v vector
     * @param {Vector} v
     * @returns {Vector} vector subed v
     */
    sub(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    /**
     * return v equal this
     * @param {Vector} v
     * @returns {boolean} v eaul this
     */
    equals(v) {
        return this.x == v.x && this.y == v.y;
    }
    toString() {
        return `(${this.x}, ${this.y})`;
    }
}
class ShipInfo {
    /**
     * parsing data to ShipInfo
     * @param {*} data object had R,C,type,direc
     * @returns {ShipInfo}
     */
    static parse(data) {
        return new ShipInfo(data.R, data.C, data.type, data.direc);
    }
    constructor(r, c, type, direc) {
        this.R = r;
        this.C = c;
        this.type = type;
        this.direc = direc;
        this.damaged = [];
    }
    /**
     * return all ship's position
     * @returns {Vector[]} position vector array
     */
    getPositions() {
        let poss = [];
        let step = EDirec.getVector(this.direc)
        for (let i = 0; i < this.type; ++i) {
            let r = this.R + step.y * i;
            let c = this.C + step.x * i;
            poss.push(new Vector(c, r));
        }
        return poss;
    }
    /**
     * return the ship is all found
     */
    isSunken() {
        return this.damaged.length == this.type;
    }
    toString() {
        return `{R:${this.R}, C:${this.R}, type:${ShipType.toString(this.type)}, diec:${EDirec.toString(this.direc)} }`;
    }

}
class TileInfo {
    constructor(r, c, type, ship = null) {
        this.R = r;
        this.C = c;
        this.type = type;
        this.ship = ship;
    }
    /**
     * return the tile is ship
     */
    isShip() {
        return this.ship != null;
    }
    /**
     * return the tile is selected
     */
    isSelected() {
        return this.type == TileType.Selected;
    }
    toString() {
        return `{R:${this.R}, C:${this.R}, type:${TileType.toString(this.type)}, ${this.ship != null ? "isShip" : ""} }`;
    };
}
class ChangedTile {
    constructor(r, c, type) {
        this.R = r;
        this.C = c;
        this.type = type;
    }
}

exports.Vector = Vector;
exports.ShipInfo = ShipInfo;
exports.TileInfo = TileInfo;
exports.ChangedTile = ChangedTile;
//==============================================