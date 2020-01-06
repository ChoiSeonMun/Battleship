const UserTypes = {
    Player: 0,
    Enermy: 1
}
const PanelTypes = {
    Place: 0,
    Battle: 1
}
const TilePrefabTypes = {
    PlayerNormal: 0,
    PlayerAttacked: 1,
    Bomb: 2,
    EnermyNormal: 3,
    EnermyAttacked: 4,
    EnermyShip: 5
}
cc.ZOrder = {
    Tile: 0,
    Ship: 1,
    Preview: 2,
    Highlight: 3
}
cc.Class({
    extends: cc.Component,
    properties: {
        tileMargin: cc.v2(0, 0),
        userName: {
            default: [],
            type: [cc.Label]
        },
        panel: {
            default: [],
            type: [cc.Panel]
        },
        tileContainer: {
            default: [],
            type: [cc.Node],
        },
        logBox: {
            default: null,
            type: cc.ScrollView
        },
        highlightPrefab: {
            default: null,
            type: cc.Prefab,
        },
        tilePrefabs: {
            default: [],
            type: [cc.Prefab],
        },
        shipPrefabs: {
            default: [],
            type: [cc.Prefab],
        },
        previewPrefabs: {
            default: [],
            type: [cc.Prefab],
        },
    },
    //----------------------------------------//
    //유틸리티 함수
    //
    /** 
     * logbox에 sender : msg 로그를 출력한다.
     * @param {string} msg 
     * @param {string} sender 기본 System
     */
    log(msg, sender = "System") {
        let d = new Date();
        let timestamp = "[" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "] ";
        let logbox = this.logBox.node.children[1].children[0];
        let logs = logbox.children[0]._components[0];
        let log = timestamp + sender + " : " + msg + "\n";
        logs.string = log + logs.string;
        logbox.height = logs.node.height + 160;
    },
    /**
     * R,C 위치의 타일의 position을 반환한다.
     * @param {Number} R
     * @param {Number} C
     * @returns {cc.Vec2}
     */
    getTilePos(R, C) {
        let x = parseInt(C * this.DX / 2 + this.DX / 2) + this.tileMargin.x;
        let y = parseInt(R * this.DY + this.DY / 1.5) + this.tileMargin.y;
        return cc.v2(x, y);
    },
    /**
     * 절대위치를 tileContainer의 상대위치로 변환한다.
     * @param {cc.Vec2} pos
     * @returns {cc.Vec2}
     */
    toClientPos(pos) {
        let view = this.tileContainer[0].parent;
        let body = view.parent;
        pos.y -= body.y + view.y - view.height / 2;
        return pos;
    },
    /**
     * shiptype을 받아 크기를 텍스트로 반환
     * @param {cc.ShipTypes} shipType 
     */
    getShipSize(shipType) {
        switch (shipType) {
            case cc.ShipTypes.PatrolKiller:
                return "소형";
            case cc.ShipTypes.Destroyer:
                return "중형";
            case cc.ShipTypes.Cruiser:
                return "대형";
            default:
                return "default"
        }
    },
    /**
     * origin->forward 벡터의 방향을 Directions 중 하나로 반환한다.
     * @param {cc.Vec2} origin
     * @param {cc.Vec2} forward
     * @returns {cc.Directions} cc.Directions
     */
    getDirection(origin, forward) {
        let angle = Math.atan2(forward.y - origin.y, forward.x - origin.x) * 180 / Math.PI;
        if (angle <= -150 || angle >= 150)
            return cc.Directions.Left;
        if (angle > 90)
            return cc.Directions.LeftUp;
        if (angle > 30)
            return cc.Directions.RightUp;
        if (angle < -90)
            return cc.Directions.LeftDown;
        if (angle < -30)
            return cc.Directions.RightDown;
        return cc.Directions.Right;
    },
    /**
     * 배치할 배의 종류를 설정한다.
     * @param {*} shipType ShipType
     */
    setShipType(shipType) {
        this.currentShipType = shipType;
    },
    /**
     * R,C가 유효한 위치인지 확인한다.
     * @param {Number} R rows 
     * @param {Number} C cols
     * @returns {boolean}
     */
    isInRange(R, C) {
        return R >= 0 && C >= 0 && R < this.height && C < this.width * 2 + R % 2 - 1;
    },
    /**
     * R,C 타일이 배를 설치할 수 있는 타일인지 검사한다.
     * @param {Number} R
     * @param {Number} C
     * @returns {boolean}
     */
    isValidTile(R, C) {
        let placeTiles = this.tiles[UserTypes.Player];
        if (!this.isInRange(R, C) || placeTiles[R][C].hasShip())
            return false;
        for (let direction of cc.Directions.getAllDirections()) {
            let v = cc.Directions.toVector(direction);
            let row = R + v[0];
            let col = C + v[1];
            if (this.isInRange(row, col) && placeTiles[row][col].hasShip())
                return false;
        }
        return true;
    },
    /**
     * R,C 위치에 type형 배를 direction 방향으로 놓을 수 있는지 검사한다.
     * @param {Number} R 
     * @param {Number} C 
     * @param {cc.ShipTypes} type 
     * @param {cc.EDirec} direction  
     * @returns {boolean} 
     */
    canPlaceShip(R, C, type, direction) {
        let step = cc.Directions.toVector(direction);
        for (let i = 0; i < type + 2; ++i) {
            if (!this.isValidTile(R + step[0] * i, C + step[1] * i))
                return false;
        }
        return true;
    },
    /**
     * 모든 배가 배치되었는지 검사한다. 
     * @returns {boolean}
     */
    isCompleted() {
        return this.shipCount[0] + this.shipCount[1] + this.shipCount[2] == 0;
    },
    /**
     * player 또는 enermy의 R,C 타일을 type으로 바꿈 
     * @param {Number} R
     * @param {Number} C
     * @param {*} type TilePrefabTypes
     * @param {*} playerType PlayerType
     */
    changeTile(R, C, type, playerType) {
        let tiles = this.tiles[playerType];
        if (tiles[R][C] != null)
            tiles[R][C].destroy();
        let tile = cc.instantiate(this.tilePrefabs[type]).getComponent(cc.HexTile);
        this.tileContainer[playerType].addChild(tile.node);
        tile.init(R, C, type);
        tiles[R][C] = tile;

    },
    /**
     * 화면에 표시되는 컨테이너 변경
     */
    changeContainer() {
        switch (this.currentScreen) {
            case UserTypes.Player:
                this.currentScreen = UserTypes.Player;
                this.tileContainer[UserTypes.Player].x = -884;
                this.tileContainer[UserTypes.Enermy].x = 0;
                break;
            case UserTypes.Enermy:
                this.currentScreen = UserTypes.Enermy;
                this.tileContainer[UserTypes.Player].x = 0;
                this.tileContainer[UserTypes.Enermy].x = 884;
                break;
            default: break;
        }
    },
    //----------------------------------------//
    //game event handler
    /**
     * 터치된 타일을 선택한다.
     * @param {*} event touchEvent
     */
    onTouchStart(event) {
        let hex = event.target.getComponent("HexTile");
        if (hex != null)
            cc.GameManager.selectTile(hex);
    },
    //Place Phase에서 커서 방향으로 방향을 갱신한다.
    onTouchMove(event) {
        if (cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.updateCursorDirec(event.touch.getLocation());
    },
    //Place Phase에서 한칸 이상 떨어진 타일에서 터치를 종료할 때 PlaceRequest를 요청한다.
    onTouchCancel(event) {
        if (cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.coverShipPreview();
        cc.GameManager.placeRequest();
    },
    //Place Phase에서 터치가 타일을 벗어나지 않고 종료될 때 preview를 가린다.
    onTouchEnd(event) {
        if (cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.coverShipPreview();
    },
    //----------------------------------------//
    //게임 로직
    //
    onLoad() {
        cc.GameManager = this;
        this.declareVariable();
        this.enablePlaceEvents();
        this.initTiles();
        //
        cc.nickname = "a";
        cc.enermyName = "b";
        //
        this.userName[UserTypes.Player].string = cc.nickname;
        this.userName[UserTypes.Enermy].string = cc.enermyName;
        this.log("게임이 시작되었습니다.");
        //cc.Socket.on("readyEvent", this.readyEventHandler);
    },
    /**
     * 변수 선언
     */
    declareVariable() {
        let tile = this.tilePrefabs[TilePrefabTypes.PlayerNormal].data;
        this.width = cc.settings.WIDTH;
        this.height = cc.settings.HEIGHT;
        this.DX = parseInt(tile._contentSize.width * tile._scale.x - 2);
        this.DY = parseInt(tile._contentSize.height * tile._scale.y * 0.75 - 2);
        this.shipCount = cc.settings.SHIP_COUNT.slice();
        this.tiles = [[], []];
        this.target = null;
        this.highlight = null;
        this.shipPreview = null;
        this.temporaryShip = null;
        this.currentScreen = UserTypes.Player;
        this.currentShipType = cc.ShipTypes.PatrolKiller;
        this.currentDirection = cc.Directions.Right;
        this.wait = false;
        this.ready = false;
        this.turn = false;
    },
    //player tile containner에 터치 이벤트를 연결한다.
    enablePlaceEvents() {
        let target = this.tileContainer[UserTypes.Player];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, target);
        target.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, target);
        target.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, target);
    },
    //타일 초기화
    initTiles() {
        for (let r = 0; r < this.height; ++r) {
            this.tiles[UserTypes.Player][r] = [];
            this.tiles[UserTypes.Enermy][r] = [];
            for (let c = 0; c < this.width; ++c) {
                this.changeTile(r, c * 2 + r % 2, TilePrefabTypes.PlayerNormal, UserTypes.Player);
                this.changeTile(r, c * 2 + r % 2, TilePrefabTypes.EnermyNormal, UserTypes.Enermy);
            }
        }
    },
    selectTile(tile) {
        this.target = tile;
        this.showTileHighlight();
        if (this.currentScreen == UserTypes.Player)
            this.showShipPreview();
    },
    deselectTile() {
        if (this.highlight != null)
            this.highlight.destroy();
        this.highlight = null;
        this.target = null;
    },
    showTileHighlight() {
        if (this.highlight == null) {
            this.highlight = cc.instantiate(this.highlightPrefab);
            this.highlight.zIndex = cc.ZOrder.Highlight;
            this.tileContainer[this.currentScreen].addChild(this.highlight);
        }
        this.highlight.setPosition(this.target.getPos());
    },
    showShipPreview() {
        let R = this.target.R;
        let C = this.target.C;
        if (!this.isValidTile(R, C) || this.shipCount[this.currentShipType] <= 0)
            return;
        this.shipPreview = cc.instantiate(this.previewPrefabs[this.currentShipType]);
        this.shipPreview.zIndex = cc.ZOrder.Preview;
        this.shipPreview.setPosition(this.target.getPos());
        this.tileContainer[UserTypes.Player].addChild(this.shipPreview);
    },
    /**
     * 커서 방향으로 배를 회전시킨다.
     * @param {cc.Vec2} cursorpos 
     */
    updateCursorDirec(cursorpos) {
        let origin = this.target.getPos();
        let forward = this.toClientPos(cursorpos);
        this.currentDirection = this.getDirection(origin, forward);
        this.shipPreview.angle = cc.Directions.toAngle(this.currentDirection);
    },
    coverShipPreview() {
        if (this.shipPreview != null)
            this.shipPreview.destroy();
        this.shipPreview = null;
    },
    /**
     * 배를 배치하고 서버에 배의 정보를 보낸다.
     */
    placeRequest() {
        let row = this.target.R;
        let col = this.target.C;
        let shipType = this.currentShipType;
        let direction = this.currentDirection;
        if (this.wait ||
            !this.canPlaceShip(row, col, shipType, direction) ||
            this.shipCount[this.shipType] <= 0)
            return;
        let shipInfo = cc.instantiate(this.shipPrefabs[shipType]).getComponent(cc.ShipInfo);
        shipInfo.init(row, col, direction);
        this.tileContainer[UserTypes.Player].addChild(shipInfo.node);
        this.panel[PanelTypes.Place].setShipCount(shipType, --this.shipCount[shipType]);
        let step = cc.Directions.toVector(direction);
        for (let i = 0; i < shipType + 2; ++i)
            this.tiles[UserTypes.Player][row + step[0] * i][col + step[1] * i].ship = shipInfo;
        this.log(this.getShipSize(shipType) + "선이 배치되었습니다.");
        //this.wait=true;
        //cc.Socket.on("placeResponse",this.placeResponseHandler);
        //cc.Socket.emit('placeRequest', cc.protocol.placeRequest(shipType, row, col, direction));
    },
    /**
     * 배를 배치를 취소하고 서버에 취소한 위치를 보낸다.
     */
    placeCancelRequest() {
        if (this.wait || this.target == null || !this.target.hasShip())
            return;
        let ship = this.target.ship;
        let step = cc.Directions.toVector(ship.direction);
        for (let i = 0; i < ship.type + 2; ++i)
            this.tiles[UserTypes.Player][ship.row + step[0] * i][ship.col + step[1] * i].ship = null;
        this.panel[PanelTypes.Place].setShipCount(ship.type, ++this.shipCount[ship.type]);
        this.log(this.getShipSize(ship.type) + "선이 제거되었습니다.");
        ship.node.destroy();
        this.deselectTile();
        //this.wait=true;
        //cc.Socket.on("placeResponse",this.placeResponseHandler);
        //cc.Socket.emit('placeCancelRequest', cc.protocol.placeCancelRequest(ship.row, ship.col));
    },
    /**
     * 배치를 완료하고 서버에 알린다.
     */
    placeDone() {
        if (this.wait)
            return;
        if (!this.isCompleted()) {
            this.log("배치가 완료해주세요.");
            return;
        }
        if (this.ready) {
            this.log("이미 준비했습니다.");
            return;
        }
        this.ready = true;
        this.deselectTile();
        //this.listenEvents();
        //cc.Socket.emit('placeDone', cc.protocol.placeDone(this.shipInfos));
        this.setBomb(0,0);
        this.disableBuildEvents();
    },
    listenEvents() {
        cc.Socket.on('startEvent', this.startEventHandler);
        cc.Socket.on('turnEvent', this.turnEventHandler);
        cc.Socket.on('attackEvent', this.attackEventHandler);
    },
    disableBuildEvents() {
        let target = this.tileContainer[UserTypes.Player];
        target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, target);
        target.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, target);
        target.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, target);
    },
    /**
     * row, col 위치에 폭탄을 배치한다.
     * @param {Number} row 
     * @param {Number} col 
     */
    setBomb(row, col) {
        this.log(`폭탄이 설치되었습니다.`);
        this.changeTile(row, col, TilePrefabTypes.Bomb, UserTypes.Player);

    },
    changeBattlePhase() {
        this.log("전투가 시작됩니다.");
        this.buildPanel.node.setPosition(cc.v2(-884, 0));
        this.battlePanel.node.setPosition(cc.v2(0, 0));
        this.changeContainer();
        this.shipCount = cc.settings.SHIP_COUNT.slice();
        this.enableBattleEvents();
        this.battlePanel.setTurn(false);
    },
    enableBattleEvents() {
        let target = this.tileContainer[cc.ScreenType.Battle - 1];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
    },
    disableBattleEvents() {
        let target = this.tileContainer[cc.ScreenType.Battle - 1];
        target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
    },
    turnStart() {
        this.log("당신의 차례입니다.");
        this.turn = true;
        this.battlePanel.setTurn(true);
    },
    attackTarget() {
        if (!this.turn) {
            this.log("당신의 차례가 아닙니다.");
            return;
        }
        if (this.target.type != cc.TileType.Selectable)
            return;
        this.turn = false;
        this.battlePanel.setTurn(false);
        cc.Socket.on('attackResponse', this.attackResponseHandler);
        cc.Socket.emit('attackRequest', cc.protocol.attackRequest(this.target.R, this.target.C));
        this.deselectTile();
    },
    printAttackLog(type, myturn) {
        switch (type) {
            case cc.AttackEventType.None:
                this.log(myturn ? "공격을 실패했습니다." : "공격을 회피했습니다."); return;
            case cc.AttackEventType.Bomb:
                this.log(myturn ? "폭탄을 공격했습니다." : "폭탄이 폭발했습니다."); return;
            case cc.AttackEventType.Ship:
                this.log(myturn ? "배를 공격했습니다!" : "배를 공격당했습니다!"); return;
            case cc.AttackEventType.SunkenShip:
                this.log(myturn ? "배를 침몰시켰습니다!" : "배가 침몰했습니다!"); return;
            default:
        }
    },
    updateTiles(changed, mytile) {
        for (let tile of changed)
            this.changeTile(tile.R, tile.C, tile.mytile ? cc.types.TileType.Enermy : tile.type, mytile);
    },
    gameover(winner) { },
    //----------------------------------------//
    //place event handler
    //
    placeResponseHandler() {
        cc.GameManager.wait = false;
        cc.Socket.off("placeResponse", cc.GameManager.placeResponseHandler);
    },
    readyEventHandler() {
        cc.GameManager.log("상대가 배치를 완료했습니다.");
        cc.Socket.off("enermyReady", cc.GameManager.enermyReadyHandler);
    },
    startEventHandler(json) {
        pos=JSON.parse(json);
        cc.GameManager.setBomb(pos.row,pos.col);
        cc.GameManager.changeBattlePhase();
        cc.Socket.off("startEvent", cc.GameManager.startEventHandler);
    },
    //----------------------------------------//
    //battle event handler
    //
    turnEventHandler() {
        cc.GameManager.turnStart();
    },
    attackResponseHandler(json) {
        let data = JSON.parse(json);
        cc.GameManager.printAttackLog(data.type, true);
        cc.GameManager.battlePanel.setShipCount(data.remainEnermy);
        cc.GameManager.updateTiles(data.changed_tiles, false);
        cc.Socket.off('attackResponse', cc.GameManager.attackResponseHandler);

    },
    attackEventHandler(json) {
        let data = JSON.parse(json);
        cc.GameManager.printAttackLog(data.type, false);
        cc.GameManager.battlePanel.setShipCount(data.remain_ship);
        cc.GameManager.updateTiles(data.changed_tiles, true);
    },
    gameOverHandler(json) {
        let winner = JSON.parse(json).winner;
        cc.GameManager.gameover(winner);
    },
    //----------------------------------------//
})