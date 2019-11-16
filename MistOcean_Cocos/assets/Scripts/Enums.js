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
    }

    
});
var ShipType=cc.Enum({
    default:-1,

    Small:1,
    Middle:2,
    Big:3
})
module.exports.EDirec = EDirec;
module.exports.ShipType = ShipType;