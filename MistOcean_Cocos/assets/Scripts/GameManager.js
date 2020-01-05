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
     * get client size of tile on (R,C)
     * @param {Number} R tile rows
     * @param {Number} C tile cols
     * @returns {cc.Vec2} client position
     */
    getTilePos(R, C) {
        let x = parseInt(C * this.DX / 2 + this.DX / 2) + this.tileMargin.x;
        let y = parseInt(R * this.DY + this.DY / 1.5) + this.tileMargin.y;
        return cc.v2(x, y);
    },
    /**
     * get client size of point
     * @param {cc.Vec2} pos point on screen
     * @returns {cc.Vec2} client position
     */
    toClientPos(pos) {
        let view = this.tileContainer[0].parent;
        let body = view.parent;
        pos.y -= body.y + view.y - view.height / 2;
        return pos;
    },
    /**
     * get EDirec of origin to forward vector 
     * @param {cc.Vec2} origin start pos
     * @param {cc.Vec2} forward end pos
     * @returns {cc.EDirec} direction
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
            let col = C = v[1];
            if (this.isInRange(row, col) && placeTiles[row][col].hasShip())
                return false;
        }
        return true;
    },
    /**
     * get whether each tiles under ship is valid
     * @param {Number} R rows
     * @param {Number} C cols
     * @param {cc.ShipTypes} type ship type
     * @param {cc.EDirec} direc  ship direction
     * @returns {boolean} the ship is valid
     */
    isValidShip(R, C, type, direc) {
        let step = cc.EDirec.getVector(direc);
        for (let i = 0; i < type; ++i) {
            if (!this.isValidTile(R + step.y * i, C + step.x * i))
                return false;
        }
        return true;
    },
    /**
     * get wehther all ships are placed 
     * @returns {boolean} all ship is placed
     */
    allPlace() {
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
    //
    //event when first tile clicked
    onTouchStart(event) {
        let hex = event.target.getComponent("HexTile");
        if (hex != null)
            cc.GameManager.selectTile(hex);
    },
    //event when tile drag after click
    onTouchMove(event) {
        if (cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.updateCursorDirec(event.touch.getLocation());
    },
    //event when click end in outside of tile
    onTouchCancel(event) {
        if (cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.coverShipPreview();
        cc.GameManager.placeRequest();
    },
    //event when click end in inside of tile
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
        //cc.Socket.on("enermyReady", this.enermyReadyHandler);
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
        this.currentScreen = UserTypes.Player;
        this.currentShipType = cc.ShipTypes.PatrolKiller;
        this.currentDirection = cc.Directions.Right;
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
    //select tile and show preview if place phase
    selectTile(tile) {
        this.target = tile;
        this.showTileHighlight();
        if (this.currentScreen == UserTypes.Player)
            this.showShipPreview();
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
        if (!this.isValidTile(R, C))
            return;
        console.log(this.currentShipType)
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
    placeRequest(){
        
    },
    //spawn ship on target position
    spawnShip() {
        let R = this.target.R;
        let C = this.target.C;
        let direction = this.currentDirection;
        let type = this.currentShipType;
        let step = cc.Directions.toVector(direction);
        let shipPrefab = this.shipPrefabs[type];
        if (!this.isValidShip(R, C, type, direction))
            return;
        let ship = cc.instantiate(shipPrefab).getComponent("Ship");
        this.tileContainer[this.currentScreen - 1].addChild(ship.node);
        ship.init(R, C, type, direc);
        this.buildPanel.setShipCount(shipIndex, --this.shipCount[shipIndex]);
        this.shipInfos.push(ship.info);
        this.log(cc.ShipTypes.toString(type) + "선이 배치되었습니다.");

        for (let i = 0; i < type; ++i)
            this.playerTiles[R + step.y * i][C + step.x * i].ship = ship;
        this.deselectTile();
    },
    deselectTile() {
        if (this.highlight != null)
            this.highlight.destroy();
        this.highlight = null;
        this.target = null;
    },
    deleteTargetShip() {
        if (this.target != null && this.target.ship != null)
            return;
        let ship = this.target.ship;
        let shipIndex = ship.info.type - 2;
        let step = cc.EDirec.getVector(ship.info.direc);
        for (let i = 0; i < ship.info.type; ++i)
            this.playerTiles[ship.info.R + step.y * i][ship.info.C + step.x * i].ship = null;
        this.buildPanel.setShipCount(shipIndex, ++this.shipCount[shipIndex]);
        this.shipInfos.splice(this.shipInfos.indexOf(ship.info), 1);
        this.log(cc.ShipTypes.toString(ship.info.type) + "선이 제거되었습니다.");
        ship.node.destroy();
        this.deselectTile();
    },
    //send 'placeDone' to server and disable build events
    buildComplete() {
        if (!this.allPlace()) {
            this.log("배치가 완료해주세요.");
            return;
        }
        if (this.ready) {
            this.log("이미 준비했습니다.");
            return;
        }
        this.ready = true;
        this.listenEvents();
        cc.Socket.emit('placeDone', cc.protocol.placeDone(this.shipInfos));
        this.deselectTile();
        this.disableBuildEvents();
    },
    listenEvents() {
        cc.Socket.on('placeResponse', this.placeResponseHandler);
        cc.Socket.on('startEvent', this.startEventHandler);
        cc.Socket.on('turnEvent', this.turnEventHandler);
        cc.Socket.on('attackEvent', this.attackEventHandler);
    },
    disableBuildEvents() {
        let target = this.tileContainer[cc.ScreenType.Build - 1];
        target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, target);
        target.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, target);
        target.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, target);
    },
    //set bomb in playerTiles
    setBomb(bombpos) {
        this.log(`폭탄이 설치되었습니다.${bombpos.R},${bombpos.C}`);
        this.changeTile(bombpos.R, bombpos.C, cc.TileType.Bomb);

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
    placeResponseHandler(json) {
        cc.GameManager.setBomb(JSON.parse(json));
        cc.Socket.off("placeResponse", cc.GameManager.placeResponseHandler);
    },
    enermyReadyHandler() {
        cc.GameManager.log("상대가 배치를 완료했습니다.");
        cc.Socket.off("enermyReady", cc.GameManager.enermyReadyHandler);
    },
    startEventHandler() {
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