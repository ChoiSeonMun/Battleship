var Enums = require('./Enums');
var EDirec = Enums.EDirec;
var ShipType = Enums.ShipType;
cc.Class({
    extends: cc.Component,

    properties: {
        width: 0,
        height: 0,
        tileMargin: cc.v2(0, 0),
        shipCount: {
            default: [],
            type: [cc.Integer]
        },
        tileContainer: {
            default: null,
            type: cc.Node,
        },
        EnemytileContainer: {
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
        TileHilightPrefab: {
            default: null,
            type: cc.Prefab,
        },
        buildPanel:{
            default:null,
            type:cc.node
        },
        battlePanel:{
            default:null,
            type:cc.node
        },
        ShipCountLabel: {
            default: [],
            type: [cc.Node],
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.declareVariable();
        this.setEvents();
        this.setShipPrefabs();
        this.spawnTiles();
    },
    setEvents: function () {//set eventhandler
        this.tileContainer.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this.tileContainer);
        this.tileContainer.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this.tileContainer);
        this.tileContainer.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this.tileContainer);
        this.tileContainer.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this.tileContainer);

        this.EnemytileContainer.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this.tileContainer);
        this.EnemytileContainer.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this.tileContainer);
        this.EnemytileContainer.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this.tileContainer);
        this.EnemytileContainer.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this.tileContainer);
    },
    declareVariable: function () { //declare iner variable
        var tile = this.hexTilePrefab.data;
        this.tiles = [];
        this.ships = [];
        this.shipPrefabs = [];
        this.ShipPreviewPrefabs = [];
        this.shipPreview = null;
        this.target = null;
        this.hilight = null;
        this.shipType = ShipType.Small;
        this.cursorDirec = EDirec.default;
        this.DX = parseInt(tile._contentSize.width * tile._scale.x - 2);
        this.DY = parseInt(tile._contentSize.height * tile._scale.y * 0.75 - 2);
    },
    spawnTiles: function () {      //widthxhegiht 갯수만큼 타일 생성
        for (var r = 0; r < this.height; ++r) {
            this.tiles[r] = [];
            for (var c = 0; c < this.width; ++c)
                this.tiles[r][c * 2 + r % 2] = this.spawnTile(r, c * 2 + r % 2);
        }
    },
    spawnTile: function (R, C) {    //hextile prefab의 node를 생성
        var tile = cc.instantiate(this.hexTilePrefab);
        tile.setPosition(this.getTilePos(R, C));
        this.tileContainer.addChild(tile);

        var hex = tile.getComponent("HexTile");
        hex.init(R, C, this);

        var tile2 = cc.instantiate(this.hexTilePrefab);
        tile2.setPosition(this.getTilePos(R, C));
        this.EnemytileContainer.addChild(tile2);

        var hex2 = tile2.getComponent("HexTile");
        hex2.init(R, C, this);

        return hex;
    },
    getTilePos: function (R, C) {   //R행C열 타일의 위치 반환
        var x = parseInt(C * this.DX / 2 + this.DX / 2) + this.tileMargin.x;
        var y = parseInt(R * this.DY + this.DY / 1.5) + this.tileMargin.y;
        return cc.v2(x, y);
    },
    setShipPrefabs: function () {  //세 종류 배의 prefab과 preview생성
        for (var t = ShipType.Small; t <= ShipType.Big; ++t) {
            var s = new cc.Node("ShipPrefab" + ShipType.toString(t));
            s.addComponent("Ship");
            var sp = new cc.Node("ShipPreviewPrefab" + ShipType.toString(t));
            for (var j = 0; j < t; ++j) {
                var b = cc.instantiate(this.ShipBlockPrefab);
                b.setPosition(cc.v2(this.DX * j, 0));
                s.addChild(b);

                var spb = cc.instantiate(this.ShipPreviewPrefab);
                spb.setPosition(cc.v2(this.DX * j, 0));
                sp.addChild(spb);
            }
            this.shipPrefabs[t - 2] = s;
            this.ShipPreviewPrefabs[t - 2] = sp;
        }
    },
    getRealTilePos: function (R, C) {   //tile node의 실제 pos를 반환
        var pos = this.getTilePos(R, C);
        pos.y += this.tileContainer.position.y;
        return pos;
    },
    getEdirect: function (origin, forward) {//v2 to v2의 방향을 계산
        var left = origin.x > forward.x;
        var angle = Math.atan2(forward.y - origin.y, forward.x - origin.x) * 180 / Math.PI;
        if (left) {
            if (angle > 150 || angle < -150) return EDirec.LEFT;
            if (angle < -90) return EDirec.LEFTDOWN;
            return EDirec.LEFTUP;
        }
        if (angle > 30) return EDirec.RIGHTUP;
        if (angle < -30) return EDirec.RIGHTDOWN;
        return EDirec.RIGHT;
    },
    selectTile: function (hex) {       //target을 지정하고 hilight와 preview 생성
        this.target = hex;
        if (this.hilight == null) {
            this.hilight = cc.instantiate(this.TileHilightPrefab);
            this.tileContainer.addChild(this.hilight);
        }
        this.hilight.setPosition(this.getTilePos(hex.R, hex.C));
        hex.manager.showShipPreview();
    },
    deselectTile:function(){//target 해제
        if(this.hilight!=null)
            this.hilight.destroy();
        this.hilight = null;
        this.target = null;
    },
    showShipPreview: function () {  //ship preview 표시
        var R = this.target.R;
        var C = this.target.C;
        var typeindex = this.shipType - 2;
        if (this.shipCount[typeindex] <= 0 || !this.isValidTile(R, C))
            return;
        this.shipPreview = cc.instantiate(this.ShipPreviewPrefabs[typeindex]);
        this.shipPreview.setPosition(this.getTilePos(R, C));
        this.tileContainer.addChild(this.shipPreview);
    },
    updateCursorDirec: function (forward) {  //커서방향 갱신
        var origin = this.getRealTilePos(this.target.R, this.target.C);
        this.cursorDirec = this.getEdirect(origin, forward);
        this.shipPreview.angle = EDirec.getAngle(this.cursorDirec);
    },
    coverShipPreview: function () {    ////ship preview 제거
        if (this.shipPreview != null)
            this.shipPreview.destroy();
        this.shipPreview = null;
    },
    spwanShip: function () {        //target위치 cursor 방향에 배 생성
        var R = this.target.R;
        var C = this.target.C;
        var step = EDirec.getVector(this.cursorDirec);
        var typeindex = this.shipType - 2;

        if (!this.isValidShip(R, C, this.shipType, this.cursorDirec))
            return;

        var ship = cc.instantiate(this.shipPrefabs[typeindex]);
        ship.angle = EDirec.getAngle(this.cursorDirec);
        ship.setPosition(this.getTilePos(R, C));
        this.tileContainer.addChild(ship);
        this.ships.push(ship);

        var sc = ship.getComponent("Ship");
        sc.init(R, C, this.shipType, this.cursorDirec, this);
        for (var i = 0; i < this.shipType; ++i)
            this.tiles[R + step.y * i][C + step.x * i].ship = sc;

        this.ShipCountLabel[typeindex]._components[0].string = --this.shipCount[typeindex];
        this.deselectTile();
    },
    isValidShip: function (R, C, type, direc) {  //배의 유효성 검사
        var step = EDirec.getVector(direc);
        for (var i = 0; i < type; ++i) {
            if (!this.isValidTile(R + step.y * i, C + step.x * i))
                return false;
        }
        return true;
    },
    isValidTile: function (R, C) {  //타일의 유효성 검사
        var inrange = function (R, C, w, h) { return R >= 0 && C >= 0 && R < h && C < w * 2 + R % 2 - 1 };
        if (!inrange(R, C, this.width, this.height))
            return false;
        if (this.tiles[R][C].ship != null)
            return false;
        for (var t = 1; t <= 6; ++t) {
            var v = EDirec.getVector(t);
            if (inrange(R + v.y, C + v.x, this.width, this.height) && this.tiles[R + v.y][C + v.x].ship != null)
                return false;
        }
        return true;
    },
    deleteTargetShip:function(){    //target 위의 ship 제거
        var ship = this.target.ship;
        var step = EDirec.getVector(ship.direc);
        var typeindex=ship.type-2;
        for (var i = 0; i < ship.type; ++i)
            this.tiles[ship.R + step.y * i][ship.C + step.x * i].ship = null;
        this.ShipCountLabel[typeindex]._components[0].string = ++this.shipCount[typeindex];
        this.ships.splice(this.ships.indexOf(ship), 1);
        ship.node.destroy();
        this.deselectTile();
    },
    changeScene:function(){
        window.Global={tiles:this.tiles};
        cc.director.loadScene("BattleScene"); 
    },
    //EventHandler--------------------//
    onTouchStart: function (event) {
        var hex = event.target.getComponent("HexTile");
        if (hex == null)
            return;
        hex.manager.selectTile(hex);
        console.log("시작", hex.R, hex.C);
    },
    onTouchMove: function (event) {
        var hex = event.target.getComponent("HexTile");
        if (hex == null || hex.manager.shipPreview == null)
            return;
        hex.manager.updateCursorDirec(event.touch.getLocation());
    },
    onTouchCancel: function (event) {
        var hex = event.target.getComponent("HexTile");
        if (hex == null || hex.manager.shipPreview == null)
            return;
        console.log("취소", hex.R, hex.C);
        hex.manager.spwanShip();
        hex.manager.coverShipPreview();
    },
    onTouchEnd: function (event) {
        var hex = event.target.getComponent("HexTile");
        if (hex == null || hex.manager.shipPreview == null)
            return;
        console.log("종료", hex.R, hex.C);
        hex.manager.coverShipPreview();
    },
    onSettingButtonClick: function (event, customEventData) {
        this.shipType = customEventData;
        console.log(this.shipType);
    },
    onDeleteButtonClick: function (event) {
        if (this.target != null && this.target.ship != null)
            this.deleteTargetShip();
    },
    onCompleteButtonClick:function(event){
        this.changeScene();
    },
    //--------------------------------//
    update(dt) {
    },
});
