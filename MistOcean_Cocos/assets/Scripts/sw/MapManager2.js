cc.Class({
    extends: cc.Component,
    properties: {
        width: 0,
        height: 0,
        hexTilePrefab: {
            default: null,
            type: cc.Prefab,
        },
        EDirec: cc.Enum({
            default: -1,

            RIGHT: 1,
            RIGHTUP: 2,
            LEFTUP: 3,
            LEFT: 4,
            LEFTDOWN: 5,
            RIGHTDOWN: 6
        })
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.tiles = [];

    },

    start: function () {
        for (var r = 0; r < this.height; ++r) {
            this.tiles[r] = [];
            for (var c = 0; c < this.width; ++c) 
                this.tiles[r][c] = this.spawnTile(r,c);
        }
    },
    spawnTile: function (R, C) {
        var tile = cc.instantiate(this.hexTilePrefab);
        var hex = tile.getComponent("HexTile");
        hex.R = R;
        hex.C = C;
        this.node.addChild(tile);
        tile.setPosition(hex.toSqr());
        return hex;
    }

    // update (dt) {},
});
