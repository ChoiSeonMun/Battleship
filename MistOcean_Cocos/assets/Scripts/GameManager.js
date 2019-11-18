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
        this.spawnBuildTiles();
    },
    enableBuildEvents: function () {//set eventhandler
        var target = this.tileContainer[cc.ScreenType.Build - 1];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, target);
        target.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, target);
        target.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, target);
    },
    disableBuildEvents: function () {
        var target = this.tileContainer[cc.ScreenType.Build - 1];
        target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, target);
        target.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, target);
        target.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, target);
    },
    enableBattleEvents: function () {
        this.disableBuildEvents();
        var target = this.tileContainer[cc.ScreenType.Battle - 1];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
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
        this.shipType = cc.ShipType.Small;
        this.cursorDirec = cc.EDirec.default;
        this.currentScreen = cc.ScreenType.Build;
        this.DX = parseInt(tile._contentSize.width * tile._scale.x - 2);
        this.DY = parseInt(tile._contentSize.height * tile._scale.y * 0.75 - 2);
    },
    spawnBuildTiles: function () {      //width x hegiht 갯수만큼 build타일 생성
        for (var r = 0; r < this.height; ++r) {
            this.tiles[r] = [];
            for (var c = 0; c < this.width; ++c)
                this.tiles[r][c * 2 + r % 2] = this.spawnTile(r, c * 2 + r % 2, cc.TileType.Build);
        }
    },
    spawnTile: function (R, C, type) {    //현재 screen R,C위치에 type형 tile을 생성
        var tile = cc.instantiate(this.hexTilePrefabs[type - 1]);
        tile.zIndex=cc.ZOrder.Tile;
        tile.setPosition(this.getTilePos(R, C));
        this.tileContainer[this.currentScreen - 1].addChild(tile);

        var hex = tile.getComponent("HexTile");
        hex.init(R, C, type, this);

        return hex;
    },
    getTilePos: function (R, C) {   //R행C열 타일의 position 반환
        var x = parseInt(C * this.DX / 2 + this.DX / 2) + this.tileMargin.x;
        var y = parseInt(R * this.DY + this.DY / 1.5) + this.tileMargin.y;
        return cc.v2(x, y);
    },
    setShipPrefabs: function () {  //모든 종류 배의 prefab과 preview생성
        for (var t of cc.ShipType.getAllTypes()) {
            var s = new cc.Node("ShipPrefab" + cc.ShipType.toString(t));
            s.addComponent("Ship");
            var sp = new cc.Node("ShipPreviewPrefab" + cc.ShipType.toString(t));
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
        pos.y += this.tileContainer[0].parent.position.y;
        return pos;
    },
    getDirect: function (origin, forward) {//v2 to v2의 방향을 계산
        var angle = Math.atan2(forward.y - origin.y, forward.x - origin.x) * 180 / Math.PI;
        return cc.EDirec.getDirec(angle);
    },
    selectTile: function (hex) {       //target을 지정하고 hilight와 preview 생성
        this.target = hex;
        this.showTileHilight(hex.R,hex.C);
        if(this.currentScreen==cc.ScreenType.Build)
            this.showShipPreview();
    },
    showTileHilight:function(R,C){  //현재 화면 R,C위치에 hilight 생성
        if (this.hilight == null) {
            this.hilight = cc.instantiate(this.TileHilightPrefab);
            this.hilight.zIndex=cc.ZOrder.Hilight;
            this.tileContainer[this.currentScreen - 1].addChild(this.hilight);
        }
        this.hilight.setPosition(this.getTilePos(R, C));
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
        this.shipPreview.zIndex=cc.ZOrder.Preview;
        this.shipPreview.setPosition(this.getTilePos(R, C));
        this.tileContainer[this.currentScreen - 1].addChild(this.shipPreview);
    },
    coverShipPreview: function () {    ////ship preview 제거
        if (this.shipPreview != null)
            this.shipPreview.destroy();
        this.shipPreview = null;
    },
    updateCursorDirec: function (forward) {  //커서방향 갱신
        var origin = this.getRealTilePos(this.target.R, this.target.C);
        this.cursorDirec = this.getDirect(origin, forward);
        this.shipPreview.angle = cc.EDirec.getAngle(this.cursorDirec);
    },
    spwanShip: function () {        //target위치 cursor 방향에 배 생성
        var R = this.target.R;
        var C = this.target.C;
        var direc=this.cursorDirec;
        var type=this.shipType;
        var step = cc.EDirec.getVector(direc);
        var typeindex = type - 2;

        if (!this.isValidShip(R, C, type, direc))
            return;

        var ship = cc.instantiate(this.shipPrefabs[typeindex]);
        ship.zIndex=cc.ZOrder.Ship;
        ship.angle = cc.EDirec.getAngle(direc);
        ship.setPosition(this.getTilePos(R, C));
        this.tileContainer[this.currentScreen - 1].addChild(ship);
        this.ships.push(ship);

        var sc = ship.getComponent("Ship");
        sc.init(R, C, type, direc, this);
        for (var i = 0; i < type; ++i)
            this.tiles[R + step.y * i][C + step.x * i].ship = sc;
        this.buildShip(typeindex);
        this.deselectTile();
    },
    buildShip: function (typeindex, built = true) {       //배 건설/삭제 후 갯수 변동
        this.shipCount[typeindex] -= built ? 1 : -1;
        this.buildPanel.getComponent("BuildPanel").setShipCount(typeindex, this.shipCount[typeindex]);
    },
    detectShip: function (typeindex) {     //배를 모두 찾았을 경우 갯수 감소
        this.battlePanel.getComponent("BattlePanel").setShipCount(typeindex, --this.shipCount[typeindex]);
    },
    isValidShip: function (R, C, type, direc) {  //배의 유효성 검사
        var step = cc.EDirec.getVector(direc);
        for (var i = 0; i < type; ++i) {
            if (!this.isValidTile(R + step.y * i, C + step.x * i))
                return false;
        }
        return true;
    },
    inRange: function (R, C) {  //위치 유효성 검사
        return R >= 0 && C >= 0 && R < this.height && C < this.width * 2 + R % 2 - 1;
    },
    isValidTile: function (R, C) {  //타일의 유효성 검사
        if (!this.inRange(R, C) || this.tiles[R][C].ship != null)   // 위치가 유효하지 않으면 false
            return false;
        for (var v of cc.EDirec.getAllDirec())
            if (this.inRange(R + v.y, C + v.x) && this.tiles[R + v.y][C + v.x].ship != null)    //근처에 배가 있으면 false
                return false;
        return true;
    },
    deleteTargetShip: function () {    //target 위의 ship 제거
        var ship = this.target.ship;
        var step = cc.EDirec.getVector(ship.direc);
        for (var i = 0; i < ship.type; ++i)
            this.tiles[ship.R + step.y * i][ship.C + step.x * i].ship = null;
        this.buildShip(ship.type-2, false);
        this.ships.splice(this.ships.indexOf(ship), 1);
        ship.node.destroy();
        this.deselectTile();
    },
    buildComplete: function () {
        if (this.shipCount[0] + this.shipCount[1] + this.shipCount[2] != 0) {
            console.log("배치가 끝나지 않음");
            return;
        }
        this.deselectTile();
        this.changeBattlePhase();
    },
    changeBattlePhase:function(){   //battle phase로 전환
        this.currentScreen = cc.ScreenType.Battle;
        this.buildPanel.setPosition(cc.v2(-884, 0));
        this.battlePanel.setPosition(cc.v2(0, 0));
        this.battlePanel.getComponent("BattlePanel").onChangeButtonClick();
        this.shipCount = [2, 2, 1];
        this.enableBattleEvents();
        this.spawnEnermyTiles();
    },
    spawnEnermyTiles: function () { //battle screen에 selectable tile 생성
        for (var r = 0; r < this.height; ++r) {
            this.enermyTiles[r] = [];
            for (var c = 0; c < this.width; ++c)
                this.enermyTiles[r][c * 2 + r % 2] = this.spawnTile(r, c * 2 + r % 2, cc.TileType.Selectable);
        }
    },
    attackTarget: function () {     //공격 진행
        if (this.currentScreen != cc.ScreenType.Battle || this.target == null || this.target.type != cc.TileType.Selectable)
            return;
        var R = this.target.R;
        var C = this.target.C;
        this.target.node.destroy();
        if (this.isEnermy(R, C))
            this.attackEnermy(R, C);
        else
            this.attackEmpty(R,C);
        this.deselectTile();
    },
    attackEmpty:function(R,C){  //selectable to selected
        this.enermyTiles[R][C] = this.spawnTile(R, C, cc.TileType.Selected);
    },
    isEnermy: function (R, C) { //enermy checker
        return this.tiles[R][C].ship != null;
    },
    attackEnermy: function (R, C) { //selectable to enermy, 없는게 확실한 타일 selected
        this.enermyTiles[R][C] = this.spawnTile(R, C, cc.TileType.Enermy);

        var enermyship = this.tiles[R][C].ship;
        enermyship.damaged.push(cc.v2(C, R));
        if (enermyship.damaged.length == enermyship.type)   //완파
            this.attackAround(enermyship);
        else if (enermyship.damaged.length > 1)             //두칸 이상 공격받음
            this.attackSide(enermyship);
    },
    attackAround: function (ship) {         //ship 주변 모든 타일 selected
        var direcs = cc.EDirec.getAllDirec();
        this.attackDirec(ship, direcs);
        this.detectShip(ship.type - 2);

    },
    attackSide: function (ship) {           //공격당한 ship 양옆을 selected
        var direcs = [];
        var pdirec = cc.EDirec.getParallelDirec(ship.direc);
        for (var i = 1; i <= 6; ++i)
            if (i != ship.direc && i != pdirec)
                direcs.push(cc.EDirec.getVector(i));
        this.attackDirec(ship, direcs);
    },
    attackDirec: function (ship, direcs) {  // ship의 공격당한 부분 근처 direcs를 모두 selected
        for (var v1 of ship.damaged) {
            for (var v2 of direcs) {
                var R = v1.y + v2.y;
                var C = v1.x + v2.x;
                if (this.inRange(R, C) && this.enermyTiles[R][C].type == cc.TileType.Selectable) {
                    this.enermyTiles[R][C].node.destroy();
                    this.enermyTiles[R][C] = this.spawnTile(R, C, cc.TileType.Selected);
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
    //--------------------------------//
    update(dt) {
    },
});
