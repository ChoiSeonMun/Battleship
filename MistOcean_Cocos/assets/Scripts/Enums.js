var EDirec=cc.Enum({
    default: -1,

    RIGHTUP: 1,
    RIGHT: 2,
    RIGHTDOWN: 3,
    LEFTDOWN: 4,
    LEFT: 5,
    LEFTUP: 6,
    getVector:function(direc){
        switch(direc){
            case EDirec.RIGHTUP:return cc.v2(1,1);
            case EDirec.RIGHT:return cc.v2(2,0);
            case EDirec.RIGHTDOWN:return cc.v2(1,-1);
            case EDirec.LEFTDOWN:return cc.v2(-1,-1);
            case EDirec.LEFT:return cc.v2(-2,0);
            case EDirec.LEFTUP:return cc.v2(-1,1);
            default : return cc.v2(0,0);
        }
    },
    getAngle:function(direc){
        switch(direc){
            case EDirec.RIGHTUP:return 60;
            case EDirec.RIGHT:return 0;
            case EDirec.RIGHTDOWN:return 300;
            case EDirec.LEFTDOWN:return 240;
            case EDirec.LEFT:return 180;
            case EDirec.LEFTUP:return 120;
            default : return 0;
        }
    },
    getAllDirec:function(){
        var arr=[];
        for(var i=1;i<=6;++i)
            arr.push(EDirec.getVector(i));
        return arr;
    },
    getParallelDirec:function(direc){
        if(direc>3)
            return direc-3;
        return direc+3;
    }
});

var ShipType=cc.Enum({
    default:-1,

    Small:2,
    Middle:3,
    Big:4,
    toString:function(type){
        switch(type){
            case this.Small:return "Small";
            case this.Middle:return "Middle";
            case this.Big:return "Big";
            default: return "Default";
        }
    }
})
var ScreenType=cc.Enum({
    default:-1,
    Build:1,
    Battle:2
});
var TileType=cc.Enum({
    default:-1,
    Build:1,
    Selectable:2,
    Selected:3,
    Enermy:4
});
module.exports.EDirec = EDirec;
module.exports.ShipType = ShipType;
module.exports.ScreenType = ScreenType;
module.exports.TileType = TileType;