cc.Class({
    extends: cc.Component,

    properties: {
        width: 0,
        height: 0,
        tileMargin:cc.v2(0,0),
        scrollView: {
            default: null,
            type: cc.Node,
        },
        hexTilePrefab: {
            default: null,
            type: cc.Prefab,
        },
        ShipPrefab: {
            default: null,
            type: cc.Prefab,
        },
        ShipType:cc.Enum({
            default:-1,
        
            Small:1,
            Middle:2,
            Big:3
        }),
        EDirec:cc.Enum({
            default: -1,
        
            RIGHT: 1,
            RIGHTUP: 2,
            LEFTUP: 3,
            LEFT: 4,
            LEFTDOWN: 5,
            RIGHTDOWN: 6,
            
        })
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.tiles = [];
        this.setEvents();
        var tile=this.hexTilePrefab.data;
        this.DX=tile._contentSize.width*tile._scale.x;
        this.DY=tile._contentSize.height*tile._scale.y*0.75;
        for (var r = 0; r < this.height; ++r) {
            this.tiles[r] = [];
            for (var c = 0; c < this.width; ++c) 
                this.tiles[r][c] = this.spawnTile(r,c);
        }
    },
    setEvents:function(){//event bubble
        this.scrollView.on(cc.Node.EventType.TOUCH_START,this.onTouchStart, this.scrollView);
        this.scrollView.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove, this.scrollView);
        this.scrollView.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd, this.scrollView);
    },
    spawnTile: function (R, C) {
        var tile = cc.instantiate(this.hexTilePrefab);
        var hex = tile.getComponent("HexTile");
        hex.R = R;
        hex.C = C;
        hex.manager=this;
        this.scrollView.addChild(tile);
        tile.setPosition(this.getTilePos(R,C));
        hex.setEvent();
        return hex;
    },
    getTilePos:function(R,C){
        var hexX = C * this.DX + (R % 2 != 0 ? this.DX : this.DX / 2);
        var hexY = R * this.DY + this.DY / 1.5;

        return cc.v2(hexX+this.tileMargin.x, hexY+this.tileMargin.y);
    },
    onTouchStart:function(event){
        var hex=event.target.getComponent("HexTile");
        if(hex==null)
            return;
        console.log("시작",hex.R,hex.C);
    },
    onTouchMove:function(event){
    },
    onTouchEnd:function(event){
        var hex=event.target.getComponent("HexTile");
        if(hex==null)
            return;
        console.log("종료",hex.R,hex.C);
    },
     update (dt) {
     },
});
