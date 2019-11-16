var Enums = require('./Enums');
var EDirec = Enums.EDirec;
var ShipType = Enums.ShipType;
var Ship = require('./Ship').Ship;
cc.Class({
    extends: cc.Component,

    properties: {
        width: 0,
        height: 0,
        tileMargin: cc.v2(0, 0),
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
        TileHilightPrefab: {
            default: null,
            type: cc.Prefab,
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
        this.scrollView.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this.scrollView);
        this.scrollView.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this.scrollView);
        this.scrollView.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this.scrollView);
        this.scrollView.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this.scrollView);
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
        this.shipType = 2;
        this.shipCount = [2, 2, 1];
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
    spawnTile: function (R, C) {    //R행C열 타일 생성
        var tile = cc.instantiate(this.hexTilePrefab);
        tile.setPosition(this.getTilePos(R, C));
        this.scrollView.addChild(tile);
        var hex = tile.getComponent("HexTile");
        hex.R = R;
        hex.C = C;
        hex.manager = this;
        hex.ship = null;
        hex.setEvent();
        return hex;
    },
    getTilePos: function (R, C) {   //R행C열 타일의 위치 반환
        var x = parseInt(C * this.DX / 2 + this.DX / 2) + this.tileMargin.x;
        var y = parseInt(R * this.DY + this.DY / 1.5) + this.tileMargin.y;
        return cc.v2(x, y);
    },
    setShipPrefabs: function () {  //2,3,4칸 배의 prefab과 preview생성
        for (var i = 0; i < 3; ++i) {
            var s = new cc.Node("ShipPrefab" + i);
            var sc = s.addComponent("Ship");
            sc.R=0;
            sc.C=0;
            sc.direc = EDirec.RIGHT;
            var sp = new cc.Node("ShipPreviewPrefab" + i);
            for (var j = 0; j < 2 + i; ++j) {
                var b = cc.instantiate(this.ShipBlockPrefab);
                b.setPosition(cc.v2(this.DX * j, 0));
                s.addChild(b);

                var spb = cc.instantiate(this.ShipPreviewPrefab);
                spb.setPosition(cc.v2(this.DX * j, 0));
                sp.addChild(spb);
            }
            this.shipPrefabs[i] = s;
            this.ShipPreviewPrefabs[i] = sp;
        }
    },
    getRealTilePos: function (R, C) {   //tile node의 실제 pos를 반환
        var pos = this.getTilePos(R, C);
        pos.y += this.scrollView.position.y;
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
    selectTile: function (hex) {       //타일을 선택하고 hex위치에 hilight 생성
        if (this.target == hex) {   //다시 누르면 선택 취소
            this.hilight.destroy();
            this.hilight = null;
            this.target = null;
            return false;
        }
        this.target = hex;
        if (this.hilight == null) {
            this.hilight = cc.instantiate(this.TileHilightPrefab);
            this.scrollView.addChild(this.hilight);
        }
        this.hilight.setPosition(this.getTilePos(hex.R, hex.C));
        return true;
    },
    showShipPreview: function (R, C) {  //ship preview 표시
        if (this.shipCount[this.shipType - 2] <= 0||!this.isValidTile(R,C))
            return;
        this.shipPreview = cc.instantiate(this.ShipPreviewPrefabs[this.shipType - 2]);
        this.shipPreview.setPosition(this.getTilePos(R, C));
        this.scrollView.addChild(this.shipPreview);
    },
    updateCursorDirec: function (hex, touch) {  //커서방향 갱신
        var origin = this.getRealTilePos(hex.R, hex.C);
        var foward = touch.getLocation();
        this.cursorDirec = this.getEdirect(origin, foward);
        this.shipPreview.angle = EDirec.getAngle(this.cursorDirec);
    },
    coverShipPreview: function () {    ////ship preview 가리기
        if (this.shipPreview != null)
            this.shipPreview.destroy();
        this.shipPreview = null;
    },
    spwanShip: function (R, C) {
        var step = EDirec.getVector(this.cursorDirec);
        for (var i = 0; i < this.shipType; ++i) {
            if (!this.isValidTile(R + step.y * i, C + step.x * i))
                return;
        }
        var typeindex = this.shipType - 2;
        var ship = cc.instantiate(this.shipPrefabs[typeindex]);
        var sc = ship.getComponent("Ship");
        sc.R=R;
        sc.C=C;
        sc.shipType = this.shipType;
        sc.direc = this.cursorDirec;
        ship.angle = EDirec.getAngle(this.cursorDirec);
        ship.setPosition(this.getTilePos(R, C));
        for (var i = 0; i < this.shipType; ++i) {
            this.tiles[R + step.y * i][C + step.x * i].ship = sc;
        }
        this.scrollView.addChild(ship);
        this.ships.push(ship);
        this.ShipCountLabel[typeindex]._components[0].string = --this.shipCount[typeindex];
        this.hilight.destroy();
        this.hilight = null;
        this.target = null;
    },
    isValidTile: function (R, C) {
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
    //EventHandler--------------------//
    onTouchStart: function (event) {
        var hex = event.target.getComponent("HexTile");
        if (hex == null)
            return;
        if (hex.manager.selectTile(hex))
            hex.manager.showShipPreview(hex.R, hex.C);
        console.log("시작", hex.R, hex.C);
    },
    onTouchMove: function (event) {
        var hex = event.target.getComponent("HexTile");
        if (hex == null || hex.manager.shipPreview == null)
            return;
        hex.manager.updateCursorDirec(hex, event.touch);
    },
    onTouchCancel: function (event) {
        var hex = event.target.getComponent("HexTile");
        if (hex == null || hex.manager.shipPreview == null)
            return;
        console.log("취소", hex.R, hex.C);
        hex.manager.spwanShip(hex.R, hex.C);
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
    onDeleteButtonClick:function(event){
        if (this.target == null || this.target.ship == null)
            return;
        var ship=this.target.ship;
        var step=EDirec.getVector(ship.direc);
        for (var i = 0; i < ship.shipType; ++i) {
            this.tiles[ship.R+step.y*i][ship.C+step.x*i].ship=null;
        }
        this.ShipCountLabel[ship.shipType-2]._components[0].string = ++this.shipCount[ship.shipType-2];
        this.ships.splice(this.ships.indexOf(ship),1);
        ship.node.destroy();
    },
    //--------------------------------//
    update(dt) {
    },
});
