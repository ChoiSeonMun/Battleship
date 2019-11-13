var Ship = cc.Class({
    extends: cc.Component,

    properties: {
        EShip : cc.Enum({
            default : -1,

            NONE : 1,
            BATTLESHIP : 2,
            CRUISER : 3,
            DESTROYER : 4
        })
    },

    statics : {
        GetSizeOf : function(eShip){
            switch (eShip)
            {
                case EShip.BATTLESHIP:
                    return 4;
                case EShip.CRUISER:
                    return 3;
                case EShip.DESTROYER:
                    return 2;
            }
        }
    }
});
