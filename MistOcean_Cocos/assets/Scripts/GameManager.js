var Enums = require('./Enums');
var EDirec = Enums.EDirec;
var ShipType = Enums.ShipType;
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
        EnemyscrollView: {
            default: null,
            type: cc.Node,
        },
        PageScorllButton:{
            default : null,
            type: cc.Node
        },
        hexTilePrefab: {
            default: null,
            type: cc.Prefab,
        },
        ShipPrefab: {
            default: null,
            type: cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.tiles = [];
        this.target=null;
        this.setEvents();
        var tile=this.hexTilePrefab.data;
        this.DX=tile._contentSize.width*tile._scale.x-2;
        this.DX=parseInt(this.DX);
        this.DY=tile._contentSize.height*tile._scale.y*0.75 -2;
        this.DY=parseInt(this.DY);

        for (var r = 0; r < this.height; ++r) {
            this.tiles[r] = [];
            for (var c = 0; c < this.width; ++c) 
                this.tiles[r][c] = this.spawnTile(r,c);
        }
    },
    setEvents:function(){//event bubble
        this.scrollView.on(cc.Node.EventType.TOUCH_START,this.onTouchStart, this.scrollView);
        this.scrollView.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove, this.scrollView);
        this.scrollView.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel, this.scrollView);
        this.scrollView.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd, this.scrollView);
        this.EnemyscrollView.on(cc.Node.EventType.TOUCH_START,this.onTouchStart, this.EnemyscrollView);
        this.EnemyscrollView.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove, this.EnemyscrollView);
        this.EnemyscrollView.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel, this.EnemyscrollView);
        this.EnemyscrollView.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd, this.EnemyscrollView);
    },
    spawnTile: function (R, C) {    //hextile prefab의 node를 생성
        var tile = cc.instantiate(this.hexTilePrefab);
        var hex = tile.getComponent("HexTile");
        hex.R = R;
        hex.C = C;
        hex.manager=this;
        
        this.scrollView.addChild(tile);
        tile.setPosition(this.getTilePos(R,C));
        hex.setEvent();

        var tile2 = cc.instantiate(this.hexTilePrefab);
        var hex2 = tile2.getComponent("HexTile");
        hex2.R = R;
        hex2.C = C;
        hex2.manager=this;
        
        this.EnemyscrollView.addChild(tile2);
        tile2.setPosition(this.getTilePos(R,C));
        hex2.setEvent();
        return hex;
    },
    getTilePos:function(R,C){   //tile node의 position을 반환
        var hexX = C * this.DX + (R % 2 != 0 ? this.DX : this.DX / 2);
        var hexY = R * this.DY + this.DY / 1.5;
        hexX=parseInt(hexX);
        hexY=parseInt(hexY);
        return cc.v2(hexX+this.tileMargin.x, hexY+this.tileMargin.y);
    },
    getRealTilePos:function(R,C){   //tile node의 실제 pos를 반환
        var pos=this.getTilePos(R,C);
        pos.y+=this.scrollView.position.y;
        return pos;
    },
    onTouchStart:function(event){
        var hex=event.target.getComponent("HexTile");
        if(hex==null)
            return;
        hex.manager.selectTile(hex);
        
        console.log("시작",hex.R,hex.C);
    },
    selectTile:function(hex){
        if(this.target!=null)
            this.target.endSelectEffect();
        hex.beginSelectEffect();
        this.target=hex;
    },
    getEdirect:function(origin,forward){//v2 to v2의 방향을 계산
        var left=origin.x>forward.x;
        var angle=Math.atan2(forward.y-origin.y,forward.x-origin.x)*180/Math.PI;
        if(left){
            if(angle>150 || angle<-150) return EDirec.LEFT;
            if(angle<-90) return EDirec.LEFTDOWN;
            return EDirec.LEFTUP;
        }
        if(angle>30) return EDirec.RIGHTUP;
        if(angle<-30) return EDirec.RIGHTDOWN;
        return EDirec.RIGHT;
    },
    onTouchMove:function(event){
        var hex=event.target.getComponent("HexTile");
        if(hex==null)
            return;
        
    },
    onTouchCancel:function(event){
        var hex=event.target.getComponent("HexTile");
        if(hex==null)
            return;
        console.log("취소",hex.R,hex.C);
        var l=hex.manager.getRealTilePos(hex.R,hex.C);
        var c=event.touch.getLocation();
        console.log(hex.manager.getEdirect(l,c));
    },
    onTouchEnd:function(event){
        var hex=event.target.getComponent("HexTile");
        if(hex==null)
            return;
        console.log("종료",hex.R,hex.C);
    },


});
