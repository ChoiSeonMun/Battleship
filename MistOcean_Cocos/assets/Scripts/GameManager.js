var Enums = require('./Enums');
var EDirec = Enums.EDirec;
var ShipType = Enums.ShipType;
var Ship= require('./Ship').Ship;
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
        ShipBlockPrefab: {
            default: null,
            type: cc.Prefab,
        },
        ShipPreviewPrefab: {
            default: null,
            type: cc.Prefab,
        },
        TileHilightPrefab:{
            default:null,
            type:cc.Prefab,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.declareVariable();
        this.setEvents();
        this.setShipPrefabs();
        this.spawnTiles();
    },
    setEvents:function(){//set eventhandler
        this.scrollView.on(cc.Node.EventType.TOUCH_START,this.onTouchStart, this.scrollView);
        this.scrollView.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove, this.scrollView);
        this.scrollView.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel, this.scrollView);
        this.scrollView.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd, this.scrollView);
    },
    declareVariable:function(){ //declare iner variable
        var tile=this.hexTilePrefab.data;
        this.tiles = [];
        this.shipPrefabs=[];
        this.ShipPreviewPrefabs=[];
        this.shipPreview=null;
        this.target=null;
        this.hilight=null;
        this.shipType=2;
        this.cursorDirec=EDirec.default;
        this.DX=parseInt(tile._contentSize.width*tile._scale.x-2);
        this.DY=parseInt(tile._contentSize.height*tile._scale.y*0.75 -2);
    },
    spawnTiles:function(){      //widthxhegiht 갯수만큼 타일 생성
        for (var r = 0; r < this.height; ++r) {
            this.tiles[r] = [];
            for (var c = 0; c < this.width; ++c) 
                this.tiles[r][c*2+r%2] = this.spawnTile(r,c*2+r%2);
        }
    },
    spawnTile: function (R, C) {    //R행C열 타일 생성
        var tile = cc.instantiate(this.hexTilePrefab);
        tile.setPosition(this.getTilePos(R,C));
        this.scrollView.addChild(tile);
        var hex = tile.getComponent("HexTile");
        hex.R = R;
        hex.C = C;
        hex.manager=this;
        hex.setEvent();
        return hex;
    },
    getTilePos:function(R,C){   //R행C열 타일의 위치 반환
        var x = parseInt(C * this.DX/2+this.DX/2)+this.tileMargin.x;
        var y = parseInt(R * this.DY + this.DY / 1.5)+this.tileMargin.y;
        return cc.v2(x,y);
    },
    setShipPrefabs:function(){  //2,3,4칸 배의 prefab과 preview생성
        for(var i=0;i<3;++i){
            var s=new cc.Node("ShipPrefab"+i);
            var sc=s.addComponent("Ship");
            var sp=new cc.Node("ShipPreviewPrefab"+i);
            sc.blocks=[];
            for(var j=0;j<2+i;++j){
                sc.blocks[j]=cc.instantiate(this.ShipBlockPrefab);
                sc.blocks[j].setPosition(cc.v2(this.DX*j,0));
                s.addChild(sc.blocks[j]);
                var spb=cc.instantiate(this.ShipPreviewPrefab);
                spb.setPosition(cc.v2(this.DX*j,0));
                sp.addChild(spb);
            }
            this.shipPrefabs[i]=s;
            this.ShipPreviewPrefabs[i]=sp;
        }
    },
    spawnShip:function(R,C,direc,size){ //R행C열에 size크기의 direc방향 ship 생성
        var angle=EDirec.getAngle(direc);
        var step=EDirec.getVector(direc);
        for(var i=0;i<size;++i){
            var block=cc.instantiate(this.ShipBlockPrefab);
            block.angle=angle;
            block.position=this.getTilePos(R+step.y*i,C+step.x*i);
            this.scrollView.addChild(block);
        }
    },
    getRealTilePos:function(R,C){   //tile node의 실제 pos를 반환
        var pos=this.getTilePos(R,C);
        pos.y+=this.scrollView.position.y;
        return pos;
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
    selectTile:function(hex){       //타일을 선택하고 hex위치에 hilight 생성
        if(this.target==hex){   //다시 누르면 선택 취소
            this.hilight.destroy();
            this.hilight=null;
            this.target=null;
            return false;
        }
        this.target=hex;
        if(this.hilight==null){
            this.hilight=cc.instantiate(this.TileHilightPrefab);
            this.scrollView.addChild(this.hilight);
        }
        this.hilight.setPosition(this.getTilePos(hex.R,hex.C));
        return true;
    },
//EventHandler--------------------//
    onTouchStart:function(event){
        var hex=event.target.getComponent("HexTile");
        if(hex==null)
            return;
        if(hex.manager.selectTile(hex)){
            var m=hex.manager;
            m.shipPreview=cc.instantiate(m.ShipPreviewPrefabs[m.shipType-2]);
            m.shipPreview.setPosition(m.getTilePos(hex.R,hex.C));
            m.scrollView.addChild(m.shipPreview);
        }
        console.log("시작",hex.R,hex.C);
    },
    onTouchMove:function(event){
        var hex=event.target.getComponent("HexTile");
        if(hex==null||hex.manager.target==null)
            return;
        var origin=hex.manager.getRealTilePos(hex.R,hex.C);
        var foward=event.touch.getLocation();
        this.cursorDirec=hex.manager.getEdirect(origin,foward);
        hex.manager.shipPreview.angle=EDirec.getAngle(this.cursorDirec);
    },
    onTouchCancel:function(event){
        var hex=event.target.getComponent("HexTile");
        if(hex==null||hex.manager.target==null)
            return;
        console.log("취소",hex.R,hex.C);
        hex.manager.shipPreview.destroy();
        hex.manager.shipPreview=null;
    },
    onTouchEnd:function(event){
        var hex=event.target.getComponent("HexTile");
        if(hex==null||hex.manager.target==null)
            return;
        console.log("종료",hex.R,hex.C);
        hex.manager.shipPreview.destroy();
        hex.manager.shipPreview=null;
    },
    onSettingButtonClick:function(event,customEventData){
        this.shipType=customEventData;
        console.log(this.shipType);
    },
//--------------------------------//
     update (dt) {
     },
});
