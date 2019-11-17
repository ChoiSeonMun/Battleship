var Enums = require('./Enums');
var EDirec = Enums.EDirec;
var ShipType = Enums.ShipType;
var ScreenType = Enums.ScreenType;
var TileType = Enums.TileType;
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
            default: [],
            type: [cc.Node],
        },
        hexTilePrefabs: {
            default: [],
            type: [cc.Prefab],
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
        buildPanel: {
            default: null,
            type: cc.Node
        },
        battlePanel: {
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function () {
        this.declareVariable();
        this.enableBuildEvents();
        this.setShipPrefabs();
        this.spawnTiles();
    },
    enableBuildEvents: function () {//set eventhandler
        var target = this.tileContainer[ScreenType.Build - 1];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.on(cc.Node.EventType.TOUCH_MOVE, this.onBuildTouchMove, target);
        target.on(cc.Node.EventType.TOUCH_CANCEL, this.onBuildTouchCancel, target);
        target.on(cc.Node.EventType.TOUCH_END, this.onBuildTouchEnd, target);
    },
    disableBuildEvents: function () {
        var target = this.tileContainer[ScreenType.Build - 1];
        target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.off(cc.Node.EventType.TOUCH_MOVE, this.onBuildTouchMove, target);
        target.off(cc.Node.EventType.TOUCH_CANCEL, this.onBuildTouchCancel, target);
        target.off(cc.Node.EventType.TOUCH_END, this.onBuildTouchEnd, target);
    },
    enableBattleEvents: function () {//set eventhandler
        var target = this.tileContainer[ScreenType.Battle - 1];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.on(cc.Node.EventType.TOUCH_MOVE, this.onBattleTouchMove, target);
        target.on(cc.Node.EventType.TOUCH_CANCEL, this.onBattleTouchCancel, target);
        target.on(cc.Node.EventType.TOUCH_END, this.onBattleTouchEnd, target);
    },
    disableBattleEvents: function () {
        var target = this.tileContainer[ScreenType.Battle - 1];
        target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.off(cc.Node.EventType.TOUCH_MOVE, this.onBattleTouchMove, target);
        target.off(cc.Node.EventType.TOUCH_CANCEL, this.onBattleTouchCancel, target);
        target.off(cc.Node.EventType.TOUCH_END, this.onBattleTouchEnd, target);
    },
    declareVariable: function () { //declare iner variable
        var tile = this.hexTilePrefabs[0].data;
        this.tiles = [];
        this.enermyTiles = [];
        this.ships = [];
        this.shipPrefabs = [];
        this.ShipPreviewPrefabs = [];
        this.shipPreview = null;
        this.target = null;
        this.hilight = null;
        this.shipType = ShipType.Small;
        this.cursorDirec = EDirec.default;
        this.currentScreen = ScreenType.Build;
        this.DX = parseInt(tile._contentSize.width * tile._scale.x - 2);
        this.DY = parseInt(tile._contentSize.height * tile._scale.y * 0.75 - 2);
    },
    spawnTiles: function () {      //widthxhegiht 갯수만큼 타일 생성
        for (var r = 0; r < this.height; ++r) {
            this.tiles[r] = [];
            for (var c = 0; c < this.width; ++c)
                this.tiles[r][c * 2 + r % 2] = this.spawnTile(r, c * 2 + r % 2, TileType.Build);
        }
    },
    spawnTile: function (R, C, type) {    //hextile prefab의 node를 생성
        var tile = cc.instantiate(this.hexTilePrefabs[type - 1]);
        tile.setPosition(this.getTilePos(R, C));
        this.tileContainer[this.currentScreen - 1].addChild(tile);

        var hex = tile.getComponent("HexTile");
        hex.init(R, C, type, this);

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
        pos.y += this.tileContainer[0].position.y;
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
            this.tileContainer[this.currentScreen - 1].addChild(this.hilight);
        }
        this.hilight.setPosition(this.getTilePos(hex.R, hex.C));
        hex.manager.showShipPreview();
    },
    deselectTile: function () {//target 해제
        if (this.hilight != null)
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
        this.tileContainer[this.currentScreen - 1].addChild(this.shipPreview);
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
        this.tileContainer[this.currentScreen - 1].addChild(ship);
        this.ships.push(ship);

        var sc = ship.getComponent("Ship");
        sc.init(R, C, this.shipType, this.cursorDirec, this);
        for (var i = 0; i < this.shipType; ++i)
            this.tiles[R + step.y * i][C + step.x * i].ship = sc;
        this.buildPanel.getComponent("BuildPanel").setShipCount(typeindex, --this.shipCount[typeindex]);
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
    inRange:function(R,C){
        return R >= 0 && C >= 0 && R < this.height && C < this.width * 2 + R % 2 - 1;
    },
    isValidTile: function (R, C) {  //타일의 유효성 검사
        if (!this.inRange(R, C) || this.tiles[R][C].ship != null)
            return false;
        var isvalid = true;
        var vecs=EDirec.getAllDirec();
        for (var v of vecs)
            if (this.inRange(R + v.y, C + v.x) && this.tiles[R + v.y][C + v.x].ship != null)
                isvalid = false;
        return isvalid;
    },

    deleteTargetShip: function () {    //target 위의 ship 제거
        var ship = this.target.ship;
        var step = EDirec.getVector(ship.direc);
        var typeindex = ship.type - 2;
        for (var i = 0; i < ship.type; ++i)
            this.tiles[ship.R + step.y * i][ship.C + step.x * i].ship = null;
        this.buildPanel.getComponent("BuildPanel").setShipCount(typeindex, ++this.shipCount[typeindex]);
        this.ships.splice(this.ships.indexOf(ship), 1);
        ship.node.destroy();
        this.deselectTile();
    },
    buildComplete: function () {
        if (this.shipCount[0] + this.shipCount[1] + this.shipCount[2] != 0) {
            console.log("배치가 끝나지 않음");
            return;
        }
        this.currentScreen = ScreenType.Battle;
        this.buildPanel.setPosition(cc.v2(-884, this.buildPanel._position.y));
        this.battlePanel.getComponent("BattlePanel").onChangeButtonClick();
        this.battlePanel.setPosition(cc.v2(0, this.battlePanel._position.y));
        this.disableBuildEvents();
        this.enableBattleEvents();
        this.spawnEnermyTiles();
    },
    spawnEnermyTiles: function () {
        for (var r = 0; r < this.height; ++r) {
            this.enermyTiles[r] = [];
            for (var c = 0; c < this.width; ++c)
                this.enermyTiles[r][c * 2 + r % 2] = this.spawnTile(r, c * 2 + r % 2, TileType.Selectable);
        }
    },
    attackTarget: function () {
        if (this.currentScreen != ScreenType.Battle || this.target == null || this.target.type != TileType.Selectable)
            return;
        var R=this.target.R;
        var C=this.target.C;
        if(this.isEnermy(R,C))
            this.attackEnermy(R,C);
        else
            this.enermyTiles[R][C]=this.spawnTile(R,C,TileType.Selected);
        this.target.node.destroy();
        this.deselectTile();
    },
    isEnermy:function(R,C){
        return this.tiles[R][C].ship!=null;
    },
    attackEnermy:function(R,C){
        this.enermyTiles[R][C]=this.spawnTile(R,C,TileType.Enermy);
        var enermyship=this.tiles[R][C].ship;
        enermyship.damaged.push(cc.v2(C,R));
        if(enermyship.damaged.length==enermyship.type)
            this.attackAround(enermyship);
        else if(enermyship.damaged.length>1)
            this.attackSide(enermyship);
    },
    attackAround:function(ship){
        var direcs=EDirec.getAllDirec();
        this.attackDirec(ship,direcs);
    },
    attackSide:function(ship){
        var direcs=[];
        var pdirec=EDirec.getParallelDirec(ship.direc);
        for(var i=1;i<=6;++i){
            if(i!=ship.direc&&i!=pdirec)
                direcs.push(EDirec.getVector(i));
        }
        this.attackDirec(ship,direcs);
    },
    attackDirec:function(ship,direcs){
        for(var v1 of ship.damaged){
            for(var v2 of direcs){
                var R=v1.y+v2.y;
                var C=v1.x+v2.x;
                if(this.inRange(R,C)&&this.enermyTiles[R][C].type==TileType.Selectable){
                    this.enermyTiles[R][C].node.destroy();
                    this.enermyTiles[R][C]=this.spawnTile(R,C,TileType.Selected);
                }
            }
        }
    },
    //EventHandler--------------------//
    onTouchStart: function (event) {
        var hex = event.target.getComponent("HexTile");
        if (hex != null)
            hex.manager.selectTile(hex);
        console.log("시작", hex.R, hex.C);
    },
    onBuildTouchMove: function (event) {
        var hex = event.target.getComponent("HexTile");
        if (hex == null || hex.manager.shipPreview == null)
            return;
        hex.manager.updateCursorDirec(event.touch.getLocation());
    },
    onBuildTouchCancel: function (event) {
        var hex = event.target.getComponent("HexTile");
        if (hex == null || hex.manager.shipPreview == null)
            return;
        console.log("취소", hex.R, hex.C);
        hex.manager.spwanShip();
        hex.manager.coverShipPreview();
    },
    onBuildTouchEnd: function (event) {
        var hex = event.target.getComponent("HexTile");
        if (hex == null || hex.manager.shipPreview == null)
            return;
        console.log("종료", hex.R, hex.C);
        hex.manager.coverShipPreview();
    },
    onBattleTouchMove: function (event) {
        console.log("공격이동");
    },
    onBattleTouchCancel: function (event) {
        console.log("공격취소");
    },
    onBattleTouchEnd: function (event) {
        console.log("공격끝");
    },
    //--------------------------------//
    update(dt) {
    },
});
