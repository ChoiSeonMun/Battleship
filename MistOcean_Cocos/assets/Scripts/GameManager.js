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
    //----------------------------------------//
    //game utility
    //
    //show message in console box
    log(msg,sender="System") {
        let d = new Date();
        let timestamp = "[" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "] ";
        let logbox = this.logBox.node.children[1].children[0];
        let logs = logbox.children[0]._components[0];
        let log = timestamp + sender + " : " + msg + "\n";
        logs.string = log + logs.string;
        logbox.height = logs.node.height + 160;
    },
    //get client size of tile on (R,C)
    getTilePos(R, C) {
        let x = parseInt(C * this.DX / 2 + this.DX / 2) + this.tileMargin.x;
        let y = parseInt(R * this.DY + this.DY / 1.5) + this.tileMargin.y;
        return cc.v2(x, y);
    },
    //get client size of point
    toClientPos(pos) {
        let view = this.tileContainer[0].parent;
        let body = view.parent;
        pos.y -= body.y + view.y - view.height / 2;
        return pos;
    },
    //get EDirec of origin to forward vector
    getDirect(origin, forward) {
        let angle = Math.atan2(forward.y - origin.y, forward.x - origin.x) * 180 / Math.PI;
        return cc.EDirec.getDirec(angle);
    },
    //get whether (R,C) in valid range
    inRange(R, C) {
        return R >= 0 && C >= 0 && R < this.height && C < this.width * 2 + R % 2 - 1;
    },
    //get whether mytile of (R,C) is blank ,isolation and in range
    isValidTile(R, C) {
        if (!this.inRange(R, C) || this.myTiles[R][C].ship != null)   // 위치가 유효하지 않으면 false
            return false;
        for (let v of cc.EDirec.getAllDirec())
            if (this.inRange(R + v.y, C + v.x) && this.myTiles[R + v.y][C + v.x].ship != null)    //근처에 배가 있으면 false
                return false;
        return true;
    },
    //get whether each tiles under ship is valid
    isValidShip(R, C, type, direc) {
        let step = cc.EDirec.getVector(direc);
        for (let i = 0; i < type; ++i) {
            if (!this.isValidTile(R + step.y * i, C + step.x * i))
                return false;
        }
        return true;
    },
    //get wehther all ships are placed
    allPlace() {                              
        return this.shipCount[0] + this.shipCount[1] + this.shipCount[2] == 0;
    },
    //change mytile or enermytile of (R,C) to 'type' tile
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
    //swap tile container
    changeContainer() {
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
        cc.GameManager.spawnShip();
        cc.GameManager.coverShipPreview();
    },
    //event when click end in inside of tile
    onTouchEnd(event) {
        if (cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.coverShipPreview();
    },
    //----------------------------------------//
    //game logic
    //
    onLoad() {
        cc.GameManager = this;
        this.declareVariable();
        this.enableBuildEvents();
        this.setShipPrefabs();
        this.initTiles();
        this.log("게임이 시작되었습니다.");
        cc.Socket.on("enermy_ready",this.enermy_ready_handler);
    },
    //initialize variable used by game logic
    declareVariable() {
        let tile = this.hexTilePrefabs[0].data;
        this.DX = parseInt(tile._contentSize.width * tile._scale.x - 2);           
        this.DY = parseInt(tile._contentSize.height * tile._scale.y * 0.75 - 2);   
        this.shipPrefabs = [];                     
        this.ShipPreviewPrefabs = [];            
        this.myTiles = [];
        this.enermyTiles = [];
        this.shipInfos = [];
        this.target = null;                      
        this.highlight = null;                   
        this.shipPreview = null;                 
        this.currentScreen = cc.ScreenType.Build;
        this.shipType = cc.ShipType.Small;       
        this.cursorDirec = cc.EDirec.default;    
        this.ready=false;
        this.turn=false;
    },
    //enable tile events at mytile
    enableBuildEvents() {
        let target = this.tileContainer[cc.ScreenType.Build - 1];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, target);
        target.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, target);
        target.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, target);
    },
    //create all types ship and preview prefabs
    setShipPrefabs() {
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
    //initialize mytile and enermytile
    initTiles() {
        for (let r = 0; r < this.height; ++r) {
            this.myTiles[r] = [];
            this.enermyTiles[r] = [];
            for (let c = 0; c < this.width; ++c) {
                this.changeTile(r, c * 2 + r % 2, cc.TileType.Build);
                this.changeTile(r, c * 2 + r % 2, cc.TileType.Selectable, false);
            }
        }
    },
    //select tile and show preview if place phase
    selectTile(tile) {
        this.target = tile;
        this.showTileHighlight();
        if (this.currentScreen == cc.ScreenType.Build)
            this.showShipPreview();
    },
    showTileHighlight() {
        if (this.highlight == null) {
            this.highlight = cc.instantiate(this.TileHighlightPrefab);
            this.highlight.zIndex = cc.ZOrder.Highlight;
            this.tileContainer[this.currentScreen - 1].addChild(this.highlight);
        }
        this.highlight.setPosition(this.target.getPos());
    },
    showShipPreview() {
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
    //redirect ship for the cursor
    updateCursorDirec(cursorpos) {
        let origin = this.target.getPos();
        let forward = this.toClientPos(cursorpos);
        this.cursorDirec = this.getDirect(origin, forward);
        this.shipPreview.angle = cc.EDirec.getAngle(this.cursorDirec);
    },
    coverShipPreview() {
        if (this.shipPreview != null)
            this.shipPreview.destroy();
        this.shipPreview = null;
    },
    //spawn ship on target position
    spawnShip() {
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
    deselectTile() {
        if (this.highlight != null)
            this.highlight.destroy();
        this.highlight = null;
        this.target = null;
    },
    deleteTargetShip() {
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
    //send 'place_done' to server and disable build events
    buildComplete() {
        if (!this.allPlace()) {
            this.log("배치가 완료해주세요.");
            return;
        }
        if(this.ready){
            this.log("이미 준비했습니다.");
            return;
        }
        this.ready=true;
        this.listenEvents();
        cc.Socket.emit('place_done',cc.protocol.place_done(this.shipInfos));
        this.deselectTile();
        this.disableBuildEvents();
    },
    listenEvents(){
        cc.Socket.on('place_response',this.place_response_handler);
        cc.Socket.on('start_event',this.start_event_handler);
        cc.Socket.on('turn_event',this.turn_event_handler);
        cc.Socket.on('attack_event',this.attack_event_handler);
    },
    disableBuildEvents() {
        let target = this.tileContainer[cc.ScreenType.Build - 1];
        target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, target);
        target.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, target);
        target.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, target);
    },
    //set bomb in mytiles
    setBomb(bombpos){
        this.log("폭탄이 설치되었습니다.");
        this.changeTile(bombpos.R, bombpos.C, cc.TileType.Bomb);

    },
    changeBattlePhase() {
        this.log("전투가 시작됩니다.");
        this.buildPanel.node.setPosition(cc.v2(-884, 0));
        this.battlePanel.node.setPosition(cc.v2(0, 0));
        this.changeContainer();
        this.shipCount = [2, 2, 1];
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
    turnStart(){
        this.log("당신의 차례입니다.");
        this.turn=true;
        this.battlePanel.setTurn(true);
    },
    attackTarget(){
        if(!this.turn){
            this.log("당신의 차례가 아닙니다.");
            return;
        }
        this.turn=false;
        this.battlePanel.setTurn(false);
        cc.Socket.on('attack_response',this.attack_response_handler);
        cc.Socket.emit('attack_request',cc.protocol.attack_request(0,0));
    },
    printAttackLog(type,myturn){
        switch(type){
            case cc.AttackEventType.None:
                this.log(myturn?"공격을 실패했습니다.":"공격을 회피했습니다.");return;
            case cc.AttackEventType.Bomb:
                this.log(myturn?"폭탄을 공격했습니다.":"폭탄이 폭발했습니다.");return;
            case cc.AttackEventType.Ship:
                this.log(myturn?"배를 찾았습니다, 연속 공격!":"배를 공격당했습니다!");return;
            case cc.AttackEventType.SunkenShip:
                this.log(myturn?"배를 침몰시켰습니다! 연속 공격!":"배가 침몰했습니다!");return;
            default:
        }
    },
    updateTiles(changed,mytile){
        for(let tile of changed)
            this.changeTile(tile.R,tile.C,tile.type,mytile);
    },
    gameover(winner){},
    //----------------------------------------//
    //place event handler
    //
    place_response_handler(json){
        cc.GameManager.setBomb(JSON.parse(json));
        cc.Socket.off("place_response",cc.GameManager.place_response_handler);
    },
    enermy_ready_handler(){
        cc.GameManager.log("상대가 배치를 완료했습니다.");
        cc.Socket.off("enermy_ready",cc.GameManager.enermy_ready_handler);
    },
    start_event_handler(){
        cc.GameManager.changeBattlePhase();
        cc.Socket.off("start_event",cc.GameManager.start_event_handler);
    },
    //----------------------------------------//
    //battle event handler
    //
    turn_event_handler(){
        cc.GameManager.turnStart();
    },
    attack_response_handler(json){
        let data=JSON.parse(json);
        cc.GameManager.printAttackLog(data.type,true);
        cc.GameManager.battlePanel.setShipCount(data.remain_enermy);
        cc.GameManager.updateTiles(data.changed_tiles,false);
        cc.Socket.off('attack_response',cc.GameManager.attack_response_handler);
        
    },
    attack_event_handler(json){
        let data=JSON.parse(json);
        cc.GameManager.printAttackLog(data.type,false);
        cc.GameManager.battlePanel.setShipCount(data.remain_ship);
        cc.GameManager.updateTiles(data.changed_tiles,true);
    },
    game_over_handler(json){
        let winner=JSON.parse(json).winner;
        cc.GameManager.gameover(winner);
    },
    //----------------------------------------//
})