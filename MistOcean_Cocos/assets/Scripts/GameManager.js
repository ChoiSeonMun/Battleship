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
        var target = this.tileContainer[cc.ScreenType.Battle - 1];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
    },
    declareVariable: function () { //declare iner variable
        var tile = this.hexTilePrefabs[0].data;
        this.tiles = [];        //type:[HexTile], default:Build 내 타일정보들이 저장
        this.enermyTiles = [];  //type:[HexTile], default:Selectable 상대 타일 정보들이 저장
        this.ships = [];        //type:[Ship], 내 배 정보들이 저장
        this.shipPrefabs = [];  //type:[cc.Node], index:ShipType -2, ship 원형들이 저장
        this.ShipPreviewPrefabs = [];   //type:[cc.Node], index:ShipType -2, ship preview 원형들이 저장
        this.shipPreview = null;    //type:cc.Node, 현재 화면에 표시된 ship preview가 저장
        this.target = null;         //type:HexTile, 현재 선택된 타일이 저장
        this.hilight = null;        //type:cc.Node, 현재 화면에 표시된 hilight가 저장
        this.enermyCount = [2, 2, 1];   //type:[Num],   남은 enermy 숫자를 저장
        this.shipType = cc.ShipType.Small;          //type:cc.ShipType, 선택된 배의 종류가 저장
        this.cursorDirec = cc.EDirec.default;       //type:cc.EDirec, 선택된 타일과 커서의 방향을 저장
        this.currentScreen = cc.ScreenType.Build;   //type:cc.ScreenType, 현재 표시하고있는 화면의 종류를 저장
        this.buildCompleted = false;                  //type:bool, 배치 완료 여부를 저장
        this.isMyTurn = true;         //type:bool, 현재 나의 차례인가?
        this.DX = parseInt(tile._contentSize.width * tile._scale.x - 2);            //type:Number, 다음 타일과의 X축 거리
        this.DY = parseInt(tile._contentSize.height * tile._scale.y * 0.75 - 2);    //type:Number, 다음 타일과의 Y축 거리
    },
    spawnBuildTiles: function () {      //width x hegiht 갯수만큼 build타일 생성
        for (var r = 0; r < this.height; ++r) {
            this.tiles[r] = [];
            for (var c = 0; c < this.width; ++c)
                this.tiles[r][c * 2 + r % 2] = this.spawnTile(r, c * 2 + r % 2, cc.TileType.Build);
        }
    },
    spawnTile: function (R, C, type, ismytile = true) {    //현재 screen R,C위치에 type형 tile을 생성
        var tile = cc.instantiate(this.hexTilePrefabs[type - 1]);
        var typeindex = (ismytile ? cc.ScreenType.Build : cc.ScreenType.Battle) - 1;
        tile.zIndex = cc.ZOrder.Tile;
        tile.setPosition(this.getTilePos(R, C));
        this.tileContainer[typeindex].addChild(tile);

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
        this.showTileHilight(hex.R, hex.C);
        if (this.currentScreen == cc.ScreenType.Build)
            this.showShipPreview();
    },
    showTileHilight: function (R, C) {  //현재 화면 R,C위치에 hilight 생성
        if (this.hilight == null) {
            this.hilight = cc.instantiate(this.TileHilightPrefab);
            this.hilight.zIndex = cc.ZOrder.Hilight;
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
        this.shipPreview.zIndex = cc.ZOrder.Preview;
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
        var direc = this.cursorDirec;
        var type = this.shipType;
        var step = cc.EDirec.getVector(direc);
        var typeindex = type - 2;

        if (!this.isValidShip(R, C, type, direc))
            return;

        var ship = cc.instantiate(this.shipPrefabs[typeindex]);
        ship.zIndex = cc.ZOrder.Ship;
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
        this.battlePanel.getComponent("BattlePanel").setShipCount(typeindex, --this.enermyCount[typeindex]);
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
        this.buildShip(ship.type - 2, false);
        this.ships.splice(this.ships.indexOf(ship), 1);
        ship.node.destroy();
        this.deselectTile();
    },
    buildComplete: function () {    //배치가 완료되면 build event를 비활성화하고 대기
        if (!this.isLose()) {
            console.log("배치가 끝나지 않음");
            return;
        }
        this.deselectTile();
        this.assignItems();
        this.disableBuildEvents();
        this.buildCompleted = true;
        //서버에 완료 알리기
    },
    assignItems: function () {
        //빈 타일에 아이템 배치
    },
    changeBattlePhase: function () {   //battle phase로 전환
        if (!this.buildCompleted)
            return;
        this.buildPanel.setPosition(cc.v2(-884, 0));
        this.battlePanel.setPosition(cc.v2(0, 0));
        this.changeContainer();
        this.shipCount = [2, 2, 1];
        this.enableBattleEvents();
        this.spawnEnermyTiles();
    },
    isWin: function () {
        return this.enermyCount[0] + this.enermyCount[1] + this.enermyCount[2] == 0;
    },
    isLose: function () {
        return this.shipCount[0] + this.shipCount[1] + this.shipCount[2] == 0;
    },
    changeContainer: function () {         //표시되는 화면 변경
        switch (this.currentScreen) {
            case cc.ScreenType.Build:
                this.currentScreen = cc.ScreenType.Battle;
                this.tileContainer[cc.ScreenType.Build - 1].setPosition(-884, 0, 0);
                this.tileContainer[cc.ScreenType.Battle - 1].setPosition(0, 0, 0);
                break;
            case cc.ScreenType.Battle:
                this.currentScreen = cc.ScreenType.Build;
                this.tileContainer[cc.ScreenType.Build - 1].setPosition(0, 0, 0);
                this.tileContainer[cc.ScreenType.Battle - 1].setPosition(884, 0, 0);
                break;
            default: break;
        }
    },
    spawnEnermyTiles: function () { //battle screen에 selectable tile 생성
        for (var r = 0; r < this.height; ++r) {
            this.enermyTiles[r] = [];
            for (var c = 0; c < this.width; ++c)
                this.enermyTiles[r][c * 2 + r % 2] = this.spawnTile(r, c * 2 + r % 2, cc.TileType.Selectable, false);
        }
    },
    attackTarget: function () {     //공격 진행
        if (!this.isMyTurn ||                                //내 차례가 아니거나
            this.currentScreen != cc.ScreenType.Battle ||   //battle screen이 아니거나
            this.target == null ||                          //선택된 타일이 없거나
            this.target.isNotSelectable())     //선택 가능한 타일이 아니면
            return;
        var R = this.target.R;
        var C = this.target.C;
        var attackType = this.DamageStep(R, C);
        this.deselectTile();
    },
    DamageStep: function (R, C) {
        var attackType = this.CheckTile(R, C);
        switch (attackType) {
            case cc.AttackEventType.None:
                this.attackEmpty(R, C, true);
                this.attackEmpty(R, C, false);
                break;
            case cc.AttackEventType.Bomb:
                this.bombExplosion(R, C, true);
                break;
            case cc.AttackEventType.Ship:
                if (this.attackMyShip(R, C))
                    attackType = cc.AttackEventType.SunkenShip;
                break;
            default: break;
        }
        return attackType;
    },
    CheckTile: function (R, C) {    //타일 R,C의  판정
        var tile = this.tiles[R][C];
        switch (tile.type) {
            case cc.TileType.Build:
                return tile.isShip() ? cc.AttackEventType.Ship : cc.AttackEventType.None;
            case cc.TileType.Bomb:
                return cc.AttackEventType.Bomb;
            default:
                return 0;
        }
    },
    getSelected: function (ismytile) {
        return ismytile ? cc.TileType.Damaged : cc.TileType.Selected;
    },
    getTiles: function (ismytile) {
        return ismytile ? this.tiles : this.enermyTiles;
    },
    attackEmpty: function (R, C, ismytile) {  //selectable to selected
        var tiles = this.getTiles(ismytile);
        this.destroyTile(R, C, tiles);
        tiles[R][C] = this.spawnTile(R, C, this.getSelected(ismytile), ismytile);
    },
    destroyTile: function (R, C, tiles) {     //R,C 타일을 파괴한다.
        tiles[R][C].node.destroy();
        tiles[R][C] = null;
    },
    bombExplosion: function (R, C, ismytile) {
        if (ismytile) {

        }
    },
    attackMyShip: function (R, C) { //selectable to enermy, 없는게 확실한 타일 selected,끝나고 완파여부 리턴
        var ship = this.tiles[R][C].ship;
        this.destroyTile(R, C, this.tiles);
        this.tiles[R][C] = this.spawnTile(R, C, cc.TileType.Damaged);
        this.tiles[R][C].ship = ship;
        ship.damaged.push(cc.v2(C, R));
        var sunken = ship.isSunken();
        if (sunken) {
            this.sinkingShip(ship);
            this.attackIsSunkenShip(R, C);
        } else {
            this.attackSide(R, C, true);
            this.attackIsShip(R, C);
        }
        return sunken;
    },
    attackIsShip: function (R, C) {
        this.destroyTile(R, C, this.enermyTiles);
        this.enermyTiles[R][C] = this.spawnTile(R, C, cc.TileType.Enermy, false);
        this.attackSide(R, C, false);
    },
    attackIsSunkenShip: function (R, C) {
        this.destroyTile(R, C, this.enermyTiles);
        this.enermyTiles[R][C] = this.spawnTile(R, C, cc.TileType.Enermy, false);
        var ships = this.getConnections(R, C, this.enermyTiles);
        this.attackDirec(ships, cc.EDirec.getAllDirec(), false);
    },
    sinkingShip: function (ship) {         //ship 주변 모든 타일 selected
        this.attackDirec(ship.damaged, cc.EDirec.getAllDirec(), true);
    },
    attackDirec: function (ships, direcs, ismytile) {  // ships 근처 direcs를 모두 selected
        var tiles = ismytile ? this.tiles : this.enermyTiles;
        for (var v1 of ships) {
            for (var v2 of direcs) {
                var R = v1.y + v2.y;
                var C = v1.x + v2.x;
                if (this.inRange(R, C) &&
                    (tiles[R][C].type == cc.TileType.Selectable ||
                        tiles[R][C].type == cc.TileType.Build))
                    this.attackEmpty(R, C, ismytile);
            }
        }
    },
    findConnection: function (R, C, tiles) {        //R,C 주위 ship들의 방향벡터 반환
        var vecs = [];
        for (var v of cc.EDirec.getAllDirec()) {
            if (!this.inRange(R + v.y, C + v.x))
                continue;
            var tile = tiles[R + v.y][C + v.x];
            if (tile.isEnermy() || tile.isDamagedShip())
                vecs.push(v);
        }
        return vecs;
    },
    getConnections: function (R, C, tiles) {         //R,C와 연결된 ships[vector] 반환
        var center = cc.v2(C, R);
        var ships = [center];
        var con = this.findConnection(R, C, tiles);
        for (var c of con)
            ships.push(center.add(c));
        if (con.length == 1 &&
            this.findConnection(ships[1].y, ships[1].x, tiles).length == 2)
            ships.push(ships[1].add(con[0]));
        return ships;
    },
    attackSide: function (R, C, ismytile) {           //공격당한 ship 양옆을 selected
        var tiles = this.getTiles(ismytile);
        var ships = this.getConnections(R, C, tiles);
        if (ships.length == 1)
            return;
        var step = ships[1].sub(ships[0]);
        var rstep = step.neg();
        var direcs = [];
        for (var v of cc.EDirec.getAllDirec())
            if (!v.equals(step) && !v.equals(rstep))
                direcs.push(v);
        this.attackDirec(ships, direcs, ismytile);
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
