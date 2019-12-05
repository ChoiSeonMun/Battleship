var EDirec = {
    default: -1,

    RIGHTUP: 1,
    RIGHT: 2,
    RIGHTDOWN: 3,
    LEFTDOWN: 4,
    LEFT: 5,
    LEFTUP: 6,
    getVector: function (direc) {
        switch (direc) {
            case this.RIGHTUP: return cc.v2(1, 1);
            case this.RIGHT: return cc.v2(2, 0);
            case this.RIGHTDOWN: return cc.v2(1, -1);
            case this.LEFTDOWN: return cc.v2(-1, -1);
            case this.LEFT: return cc.v2(-2, 0);
            case this.LEFTUP: return cc.v2(-1, 1);
            default: return cc.v2(0, 0);
        }
    },
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
    getDirec: function (angle) {
        if (angle <= -150 || angle >= 150) return this.LEFT;
        if (angle > 90) return this.LEFTUP;
        if (angle > 30) return this.RIGHTUP;
        if (angle < -90) return this.LEFTDOWN;
        if (angle < -30) return this.RIGHTDOWN;
        return this.RIGHT;
    },
    toDirec:function(vec){
        if(vec.x<0)
            return vec.y==1?this.LEFTUP:vec.y==0?this.LEFT:this.LEFTDOWN;
        return vec.y==1?this.RIGHTUP:vec.y==0?this.RIGHT:this.RIGHTDOWN;
    },
    getAllDirec: function () {
        var arr = [];
        for (var i = 1; i <= 6; ++i)
            arr.push(this.getVector(i));
        return arr;
    },
    getParallelDirec: function (direc) {
        if (direc > 3)
            return direc - 3;
        return direc + 3;
    }
};

var ShipType = {
    default: -1,

    Small: 2,
    Middle: 3,
    Big: 4,
    toString: function (type) {
        switch (type) {
            case this.Small: return "Small";
            case this.Middle: return "Middle";
            case this.Big: return "Big";
            default: return "Default";
        }
    },
    getAllTypes: function () {
        return [2, 3, 4];
    }
}
var ScreenType = {
    default: -1,
    Build: 1,
    Battle: 2
}
var TileType = {
    default: -1,
    Build: 1,
    Damaged: 2,
    Bomb: 3,
    Selectable: 4,
    Selected: 5,
    Enermy: 6
}
var ZOrder = {
    default: -1,
    Tile: 1,
    Ship: 2,
    Preview: 3,
    Highlight: 4
}
var AttackEventType = {
    default: -1,
    None: 1,
    Bomb: 2,
    Ship: 3,
    SunkenShip: 4
}
cc.EDirec = cc.Enum(EDirec);
cc.ShipType = cc.Enum(ShipType);
cc.ScreenType = cc.Enum(ScreenType);
cc.TileType = cc.Enum(TileType);
cc.ZOrder = cc.Enum(ZOrder);
cc.AttackEventType = cc.Enum(AttackEventType);