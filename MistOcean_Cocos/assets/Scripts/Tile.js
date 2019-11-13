var Tile = cc.Class({
    extends: cc.Component,

    properties: {
        ETile : cc.Enum({
            default :-1,

            OCEAN : 1,
            SHORE : 2,
            ISLAND : 3,
            LAND : 4
        })
    },
});
