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
        buildPanel: {
            default: null,
            type: cc.BuildPanel
        },
        battlePanel: {
            default: null,
            type: cc.BattlePanel
        },
        tileContainer: {
            default: [],
            type: [cc.Node],
        },
        logBox: {
            default: null,
            type: cc.ScrollView
        },
        hexTilePrefabs: {
            default: [],
            type: [cc.Prefab],
        },
        TileHighlightPrefab: {
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
    },
    log(msg,sender="System") {
        let d = new Date();
        let timestamp = "[" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "] ";
        let logbox = this.logBox.node.children[1].children[0];
        let logs = logbox.children[0]._components[0];
        let log = timestamp + sender + " : " + msg + "\n";
        logs.string = log + logs.string;
        logbox.height = logs.node.height + 160;
    },
    getTilePos(R, C) {                       //R,C 타일의 position 반환
        let x = parseInt(C * this.DX / 2 + this.DX / 2) + this.tileMargin.x;
        let y = parseInt(R * this.DY + this.DY / 1.5) + this.tileMargin.y;
        return cc.v2(x, y);
    },
    toClientPos(pos) {                   //R,C 타일의 실제 pos를 반환
        let view = this.tileContainer[0].parent;
        let body = view.parent;
        pos.y -= body.y + view.y - view.height / 2;
        return pos;
    },
    getDirect(origin, forward) {             //v2 to v2의 방향을 계산
        let angle = Math.atan2(forward.y - origin.y, forward.x - origin.x) * 180 / Math.PI;
        return cc.EDirec.getDirec(angle);
    },
    inRange(R, C) {                          //위치 유효성 검사
        return R >= 0 && C >= 0 && R < this.height && C < this.width * 2 + R % 2 - 1;
    },
    isValidTile(R, C) {                      //타일의 유효성 검사
        if (!this.inRange(R, C) || this.myTiles[R][C].ship != null)   // 위치가 유효하지 않으면 false
            return false;
        for (let v of cc.EDirec.getAllDirec())
            if (this.inRange(R + v.y, C + v.x) && this.myTiles[R + v.y][C + v.x].ship != null)    //근처에 배가 있으면 false
                return false;
        return true;
    },
    isValidShip(R, C, type, direc) {         //배의 유효성 검사
        let step = cc.EDirec.getVector(direc);
        for (let i = 0; i < type; ++i) {
            if (!this.isValidTile(R + step.y * i, C + step.x * i))
                return false;
        }
        return true;
    },
    allPlace() {                              
        return this.shipCount[0] + this.shipCount[1] + this.shipCount[2] == 0;
    },

    onTouchStart(event) {
        let hex = event.target.getComponent("HexTile");
        if (hex != null)
            cc.GameManager.selectTile(hex);
    },
    onTouchMove(event) {
        if (cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.updateCursorDirec(event.touch.getLocation());
    },
    onTouchCancel(event) {
        if (cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.spawnShip();
        cc.GameManager.coverShipPreview();
    },
    onTouchEnd(event) {
        if (cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.coverShipPreview();
    },

    onLoad() {
        cc.GameManager = this;
        this.declareVariable();
        this.enableBuildEvents();
        this.setShipPrefabs();
        this.initTiles();
        this.log("게임이 시작되었습니다.");
    },
    declareVariable() {
        let tile = this.hexTilePrefabs[0].data;
        this.DX = parseInt(tile._contentSize.width * tile._scale.x - 2);            //type:Number, 다음 타일과의 X축 거리
        this.DY = parseInt(tile._contentSize.height * tile._scale.y * 0.75 - 2);    //type:Number, 다음 타일과의 Y축 거리
        this.shipPrefabs = [];                      //type:[cc.Node], index:ShipType -2, ship 원형들이 저장
        this.ShipPreviewPrefabs = [];               //type:[cc.Node], index:ShipType -2, ship preview 원형들이 저장
        this.myTiles = [];
        this.enermyTiles = [];
        this.shipInfos = [];
        this.target = null;                         //type:HexTile, 현재 선택된 타일이 저장
        this.highlight = null;                      //type:cc.Node, 현재 화면에 표시된 highlight가 저장
        this.shipPreview = null;                    //type:cc.Node, 현재 화면에 표시된 ship preview가 저장
        this.currentScreen = cc.ScreenType.Build;   //type:cc.ScreenType, 현재 표시하고있는 화면의 종류를 저장
        this.shipType = cc.ShipType.Small;          //type:cc.ShipType, 선택된 배의 종류가 저장
        this.cursorDirec = cc.EDirec.default;       //type:cc.EDirec, 선택된 타일과 커서의 방향을 저장
    },
    enableBuildEvents() {
        let target = this.tileContainer[cc.ScreenType.Build - 1];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, target);
        target.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, target);
        target.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, target);
    },
    setShipPrefabs() {                       //모든 종류 배의 prefab과 preview생성
        for (let t of cc.ShipType.getAllTypes()) {
            let s = new cc.Node("ShipPrefab" + cc.ShipType.toString(t));
            s.addComponent("Ship");
            let sp = new cc.Node("ShipPreviewPrefab" + cc.ShipType.toString(t));
            for (let j = 0; j < t; ++j) {
                let b = cc.instantiate(this.ShipBlockPrefab);
                b.setPosition(cc.v2(this.DX * j, 0));
                s.addChild(b);

                let spb = cc.instantiate(this.ShipPreviewPrefab);
                spb.setPosition(cc.v2(this.DX * j, 0));
                sp.addChild(spb);
            }
            this.shipPrefabs[t - 2] = s;
            this.ShipPreviewPrefabs[t - 2] = sp;
        }
    },
    initTiles() {                      //width x hegiht 갯수만큼 build타일 생성
        for (let r = 0; r < this.height; ++r) {
            this.myTiles[r] = [];
            this.enermyTiles[r] = [];
            for (let c = 0; c < this.width; ++c) {
                this.changeTile(r, c * 2 + r % 2, cc.TileType.Build);
                this.changeTile(r, c * 2 + r % 2, cc.TileType.Selectable, false);
            }
        }
    },
    changeTile(R, C, type, mytile = true) {
        let tiles = mytile ? this.myTiles : this.enermyTiles;
        if (tiles[R][C] != null)
            tiles[R][C].destroy();
        let screenIndex = mytile ? cc.ScreenType.Build - 1 : cc.ScreenType.Battle - 1;
        let tilePrefab = this.hexTilePrefabs[type - 1];
        let tile = cc.instantiate(tilePrefab).getComponent("HexTile");
        this.tileContainer[screenIndex].addChild(tile.node);
        tile.init(R, C, type);
        tiles[R][C] = tile;

    },
    selectTile(hex) {                        //target을 지정하고 highlight와 preview 생성
        this.target = hex;
        this.showTileHighlight();
        if (this.currentScreen == cc.ScreenType.Build)
            this.showShipPreview();
    },
    showTileHighlight() {                  //현재 화면 R,C위치에 highlight 생성
        if (this.highlight == null) {
            this.highlight = cc.instantiate(this.TileHighlightPrefab);
            this.highlight.zIndex = cc.ZOrder.Highlight;
            this.tileContainer[this.currentScreen - 1].addChild(this.highlight);
        }
        this.highlight.setPosition(this.target.getPos());
    },
    showShipPreview() {                      //ship preview 표시
        let R = this.target.R;
        let C = this.target.C;
        let shipIndex = this.shipType - 2;
        if (this.shipCount[shipIndex] <= 0 || !this.isValidTile(R, C))
            return;
        this.shipPreview = cc.instantiate(this.ShipPreviewPrefabs[shipIndex]);
        this.shipPreview.zIndex = cc.ZOrder.Preview;
        this.shipPreview.setPosition(this.target.getPos());
        this.tileContainer[cc.ScreenType.Build - 1].addChild(this.shipPreview);
    },
    updateCursorDirec(cursorpos) {             //커서방향 갱신
        let origin = this.target.getPos();
        let forward = this.toClientPos(cursorpos);
        this.cursorDirec = this.getDirect(origin, forward);
        this.shipPreview.angle = cc.EDirec.getAngle(this.cursorDirec);
    },
    coverShipPreview() {                     //ship preview 제거
        if (this.shipPreview != null)
            this.shipPreview.destroy();
        this.shipPreview = null;
    },
    spawnShip() {                            //target위치 cursor 방향에 배 생성
        let R = this.target.R;
        let C = this.target.C;
        let direc = this.cursorDirec;
        let type = this.shipType;
        let step = cc.EDirec.getVector(direc);
        let shipIndex = type - 2;
        let shipPrefab = this.shipPrefabs[shipIndex];

        if (!this.isValidShip(R, C, type, direc))
            return;

        let ship = cc.instantiate(shipPrefab).getComponent("Ship");
        this.tileContainer[this.currentScreen - 1].addChild(ship.node);
        ship.init(R, C, type, direc);
        this.buildPanel.setShipCount(shipIndex, --this.shipCount[shipIndex]);
        this.shipInfos.push(ship.info);
        this.log(cc.ShipType.toString(type)+"선이 배치되었습니다.");

        for (let i = 0; i < type; ++i)
            this.myTiles[R + step.y * i][C + step.x * i].ship = ship;
        this.deselectTile();
    },
    deselectTile() {                         //target 해제
        if (this.highlight != null)
            this.highlight.destroy();
        this.highlight = null;
        this.target = null;
    },
    deleteTargetShip() {                     //target 위의 ship 제거
        let ship = this.target.ship;
        let shipIndex=ship.info.type-2;
        let step = cc.EDirec.getVector(ship.info.direc);
        for (let i = 0; i < ship.info.type; ++i)
            this.myTiles[ship.info.R + step.y * i][ship.info.C + step.x * i].ship = null;
            this.buildPanel.setShipCount(shipIndex, ++this.shipCount[shipIndex]);
        this.shipInfos.splice(this.shipInfos.indexOf(ship.info), 1);
        this.log(cc.ShipType.toString(ship.info.type)+"선이 제거되었습니다.");
        ship.node.destroy();
        this.deselectTile();
    },
    buildComplete() {                        //배치가 완료되면 build event를 비활성화하고 대기
        if (!this.allPlace()) {
            this.log("배치가 완료되지 않았습니다.");
            return;
        }
        this.log("배치가 완료되었습니다.");
        this.deselectTile();
        this.disableBuildEvents();
        this.changeBattlePhase();
    },
    disableBuildEvents() {
        let target = this.tileContainer[cc.ScreenType.Build - 1];
        target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, target);
        target.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, target);
        target.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, target);
    },
    changeBattlePhase() {                    //battle phase로 전환
        this.log("전투가 시작됩니다.");
        this.buildPanel.node.setPosition(cc.v2(-884, 0));
        this.battlePanel.node.setPosition(cc.v2(0, 0));
        this.changeContainer();
        this.shipCount = [2, 2, 1];
        this.enableBattleEvents();
    },
    enableBattleEvents() {
        let target = this.tileContainer[cc.ScreenType.Battle - 1];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
    },
    disableBattleEvents() {
        let target = this.tileContainer[cc.ScreenType.Battle - 1];
        target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
    },
    changeContainer() {                      //표시되는 화면 변경
        this.log("화면을 전환합니다.");
        switch (this.currentScreen) {
            case cc.ScreenType.Build:
                this.currentScreen = cc.ScreenType.Battle;
                this.tileContainer[cc.ScreenType.Build - 1].x=-884;
                this.tileContainer[cc.ScreenType.Battle - 1].x=0;
                break;
            case cc.ScreenType.Battle:
                this.currentScreen = cc.ScreenType.Build;
                this.tileContainer[cc.ScreenType.Build - 1].x=0;
                this.tileContainer[cc.ScreenType.Battle - 1].x=884;
                break;
            default: break;
        }
    },
})