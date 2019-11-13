var MapManager = cc.Class({
    extends: cc.Component,

    properties: {
        hexOcean:{
            default : null,
            type : cc.Prefab
        },
        hexShore:{
            default : null,
            type : cc.Prefab
        },
        hexIsland:{
            default : null,
            type : cc.Prefab
        },
        hexLand:{
            default : null,
            type : cc.Prefab
        },

        width : 0,
        height : 0,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    GenerateMap(){
        for (y = 0; y < height; y++)
        {
            for (x = 0; x < width; x++)
            {
                var pos = Hex.HexToSqr(x, y);
                switch (Tiles[y, x])
                {
                    case Tile.ETile.OCEAN:  // 바다
                        var tile = cc.instantiate(hexOcean);
                        tile.setPosition(pos.x,pos.y);
                        break;
                    case Tile.ETile.SHORE:  // 연안
                        var tile = cc.instantiate(hexShore);
                        tile.setPosition(pos.x,pos.y);
                        break;
                    case Tile.ETile.ISLAND:  // 섬
                        var tile = cc.instantiate(hexIsland);
                        tile.setPosition(pos.x,pos.y);
                        break;
                    case Tile.ETile.LAND:  // 육지
                        var tile = cc.instantiate(hexLand);
                        tile.setPosition(pos.x,pos.y);
                        break;
                }
            }
        }
    },

    LoadMap(path){

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
