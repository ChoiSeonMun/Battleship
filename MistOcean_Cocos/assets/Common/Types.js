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
    },
    toString:function(direc){
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
const JoinEventType={
    default: -1,
    Wait: 1,
    Start:2,
    Failure:3
}
const AttackEventType = {
    default: -1,
    None: 1,
    Bomb: 2,
    Ship: 3,
    SunkenShip: 4
}
module.exports.EDirec=EDirec;
module.exports.ShipType=ShipType;
module.exports.ScreenType=ScreenType;
module.exports.TileType=TileType;
module.exports.ZOrder=ZOrder;
module.exports.JoinEventType=JoinEventType;
module.exports.AttackEventType=AttackEventType;
//==============================================
//common object type define
//
const Vector=function(x=0,y=0){
    this.x = x;
    this.y = y;
    Vector.prototype.toString=function(){
        return `(${this.x}, ${this.y})`;
    }
}
const ShipInfo=function(r,c,type,direc){
    this.R = r;
    this.C = c;
    this.type=type;
    this.direc=direc;
    ShipInfo.prototype.toString=function(){
        return `{R:${this.R}, C:${this.R}, type:${ShipType.toString(this.type)}, diec:${EDirec.toString(this.direc)} }`;
    }
}
const TileInfo=function(r,c,type,ship=null){
    this.R = r;
    this.C = c;
    this.type=type;
    this.ship=ship;
    TileInfo.prototype.toString=function(){
        return `{R:${this.R}, C:${this.R}, type:${TileType.toString(this.type)}, ${this.ship!=null?"isShip":""} }`;
    }
}
const ChangedTile=function(r,c,type){
    this.R=r;
    this.C=c;
    this.type=type;
}

module.exports.Vector=Vector;
module.exports.ShipInfo=ShipInfo;
module.exports.TileInfo=TileInfo;
module.exports.ChangedTile=ChangedTile;
//==============================================