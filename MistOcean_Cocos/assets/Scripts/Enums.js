var EDirec=cc.Enum({
    default: -1,

    RIGHT: 1,
    RIGHTUP: 2,
    LEFTUP: 3,
    LEFT: 4,
    LEFTDOWN: 5,
    RIGHTDOWN: 6,
    
});

var ShipType=cc.Enum({
    default:-1,

    Small:1,
    Middle:2,
    Big:3
})
module.exports.EDirec = EDirec;
module.exports.ShipType = ShipType;