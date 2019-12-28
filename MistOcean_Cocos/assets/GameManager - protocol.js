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
        enemyCount: {
            get() {
                return this._enemyCount;
            },
            set(value) {
                this._enemyCount = value;
                this.battlePanel.setShipCount(value);
            }
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
        TileHighlightPrefab: {
            default: null,
            type: cc.Prefab,
        },
        buildPanel: {
            default: null,
            type: cc.BuildPanel
        },
        battlePanel: {
            default: null,
            type: cc.BattlePanel
        },
        isMyTurn: {
            get: function () {
                return this._isMyTurn;
            },
            set: function (value) {
                this._isMyTurn = value;
                this.battlePanel.setTurn(value);
            }
        },
        winPanel: {
            default: null,
            type: cc.Node
        },
        winText: {
            default: null,
            type: cc.Label
        },
        logBox:{
            default:null,
            type:cc.ScrollView
        }
    },
    log(sender,msg){
        let d=new Date();
        let timestamp="["+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+"] ";
        let logbox=this.logBox.node.children[1].children[0];
        let logs=logbox.children[0]._components[0];
        let log=timestamp+sender+" : "+msg+"\n";
        logs.string=log+logs.string;
        logbox.height=logs.node.height+160;
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        cc.GameManager = this;
        this.declareVariable();
        this.enableBuildEvents();
        this.setShipPrefabs();
        this.spawnBuildTiles();
        this.log("System","게임이 시작되었습니다.");
    },
    enableBuildEvents: function () {
        let target = this.tileContainer[cc.ScreenType.Build - 1];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, target);
        target.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, target);
        target.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, target);
    },
    disableBuildEvents: function () {
        let target = this.tileContainer[cc.ScreenType.Build - 1];
        target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
        target.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, target);
        target.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, target);
        target.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, target);
    },
    enableBattleEvents: function () {
        let target = this.tileContainer[cc.ScreenType.Battle - 1];
        target.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
    },
    disableBattleEvents: function () {
        let target = this.tileContainer[cc.ScreenType.Battle - 1];
        target.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, target);
    },
    declareVariable: function () {                      //내부변수 선언
        let tile = this.hexTilePrefabs[0].data;
        this.tiles = [];                            //type:[HexTile], default:Build 내 타일정보들이 저장
        this.enemyTiles = [];                      //type:[HexTile], default:Selectable 상대 타일 정보들이 저장
        this.ships = [];                            //type:[Ship],  내 배 정보들이 저장
        this.shipPrefabs = [];                      //type:[cc.Node], index:ShipType -2, ship 원형들이 저장
        this.ShipPreviewPrefabs = [];               //type:[cc.Node], index:ShipType -2, ship preview 원형들이 저장
        this.shipPreview = null;                    //type:cc.Node, 현재 화면에 표시된 ship preview가 저장
        this.target = null;                         //type:HexTile, 현재 선택된 타일이 저장
        this.highlight = null;                        //type:cc.Node, 현재 화면에 표시된 highlight가 저장
        this.enemyCount = [2, 2, 1];               //type:[Num],   남은 enemy 숫자를 저장
        this.shipType = cc.ShipType.Small;          //type:cc.ShipType, 선택된 배의 종류가 저장
        this.cursorDirec = cc.EDirec.default;       //type:cc.EDirec, 선택된 타일과 커서의 방향을 저장
        this.currentScreen = cc.ScreenType.Build;   //type:cc.ScreenType, 현재 표시하고있는 화면의 종류를 저장
        this.buildCompleted = false;                //type:bool, 배치 완료 여부를 저장
        this.isMyTurn = true;                       //type:bool, 현재 나의 차례인가?
        this.DX = parseInt(tile._contentSize.width * tile._scale.x - 2);            //type:Number, 다음 타일과의 X축 거리
        this.DY = parseInt(tile._contentSize.height * tile._scale.y * 0.75 - 2);    //type:Number, 다음 타일과의 Y축 거리
        //cc.Socket.on('place_end', this.place_end_handle);
    },//
    place_end_handle() {
        console.log('place_end');
        console.log(cc.GameManager);
        cc.GameManager.changeBattlePhase();
    },//
    spawnBuildTiles: function () {                      //width x hegiht 갯수만큼 build타일 생성
        for (let r = 0; r < this.height; ++r) {
            this.tiles[r] = [];
            for (let c = 0; c < this.width; ++c)
                this.tiles[r][c * 2 + r % 2] = this.spawnTile(r, c * 2 + r % 2, cc.TileType.Build);
        }
    },
    spawnTile: function (R, C, type, ismytile = true) { //R,C 위치에 type형 tile을 생성
        let tile = cc.instantiate(this.hexTilePrefabs[type - 1]);
        let typeindex = (ismytile ? cc.ScreenType.Build : cc.ScreenType.Battle) - 1;
        tile.zIndex = cc.ZOrder.Tile;
        tile.setPosition(this.getTilePos(R, C));
        this.tileContainer[typeindex].addChild(tile);

        let hex = tile.getComponent("HexTile");
        hex.init(R, C, type, this);

        return hex;
    },
    getTilePos: function (R, C) {                       //R,C 타일의 position 반환
        let x = parseInt(C * this.DX / 2 + this.DX / 2) + this.tileMargin.x;
        let y = parseInt(R * this.DY + this.DY / 1.5) + this.tileMargin.y;
        return cc.v2(x, y);
    },
    setShipPrefabs: function () {                       //모든 종류 배의 prefab과 preview생성
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
    getRealTilePos: function (R, C) {                   //R,C 타일의 실제 pos를 반환
        let pos = this.getTilePos(R, C);
        pos.y += this.tileContainer[0].parent.position.y;
        return pos;
    },
    getDirect: function (origin, forward) {             //v2 to v2의 방향을 계산
        let angle = Math.atan2(forward.y - origin.y, forward.x - origin.x) * 180 / Math.PI;
        return cc.EDirec.getDirec(angle);
    },
    selectTile: function (hex) {                        //target을 지정하고 highlight와 preview 생성
        this.target = hex;
        this.showTileHighlight(hex.R, hex.C);
        if (this.currentScreen == cc.ScreenType.Build)
            this.showShipPreview();
    },
    showTileHighlight: function (R, C) {                  //현재 화면 R,C위치에 highlight 생성
        if (this.highlight == null) {
            this.highlight = cc.instantiate(this.TileHighlightPrefab);
            this.highlight.zIndex = cc.ZOrder.Highlight;
            this.tileContainer[this.currentScreen - 1].addChild(this.highlight);
        }
        this.highlight.setPosition(this.getTilePos(R, C));
    },
    deselectTile: function () {                         //target 해제
        if (this.highlight != null)
            this.highlight.destroy();
        this.highlight = null;
        this.target = null;
    },
    showShipPreview: function () {                      //ship preview 표시
        let R = this.target.R;
        let C = this.target.C;
        let typeindex = this.shipType - 2;
        if (this.shipCount[typeindex] <= 0 || !this.isValidTile(R, C))
            return;
        this.shipPreview = cc.instantiate(this.ShipPreviewPrefabs[typeindex]);
        this.shipPreview.zIndex = cc.ZOrder.Preview;
        this.shipPreview.setPosition(this.getTilePos(R, C));
        this.tileContainer[this.currentScreen - 1].addChild(this.shipPreview);
    },
    coverShipPreview: function () {                     //ship preview 제거
        if (this.shipPreview != null)
            this.shipPreview.destroy();
        this.shipPreview = null;
    },
    updateCursorDirec: function (forward) {             //커서방향 갱신
        let origin = this.getRealTilePos(this.target.R, this.target.C);
        this.cursorDirec = this.getDirect(origin, forward);
        this.shipPreview.angle = cc.EDirec.getAngle(this.cursorDirec);
    },
    spwanShip: function () {                            //target위치 cursor 방향에 배 생성
        let R = this.target.R;
        let C = this.target.C;
        let direc = this.cursorDirec;
        let type = this.shipType;
        let step = cc.EDirec.getVector(direc);
        let typeindex = type - 2;

        if (!this.isValidShip(R, C, type, direc))
            return;

        let ship = cc.instantiate(this.shipPrefabs[typeindex]);
        ship.zIndex = cc.ZOrder.Ship;
        ship.angle = cc.EDirec.getAngle(direc);
        ship.setPosition(this.getTilePos(R, C));
        this.tileContainer[this.currentScreen - 1].addChild(ship);
        this.ships.push(ship);

        let sc = ship.getComponent("Ship");
        sc.init(R, C, type, direc, this);
        for (let i = 0; i < type; ++i)
            this.tiles[R + step.y * i][C + step.x * i].ship = sc;
        this.buildShip(typeindex);
        this.deselectTile();
    },
    buildShip: function (typeindex, built = true) {     //배 건설,삭제 후 갯수 변동
        this.shipCount[typeindex] -= built ? 1 : -1;
        this.buildPanel.setShipCount(typeindex, this.shipCount[typeindex]);
    },
    isValidShip: function (R, C, type, direc) {         //배의 유효성 검사
        let step = cc.EDirec.getVector(direc);
        for (let i = 0; i < type; ++i) {
            if (!this.isValidTile(R + step.y * i, C + step.x * i))
                return false;
        }
        return true;
    },
    inRange: function (R, C) {                          //위치 유효성 검사
        return R >= 0 && C >= 0 && R < this.height && C < this.width * 2 + R % 2 - 1;
    },
    isValidTile: function (R, C) {                      //타일의 유효성 검사
        if (!this.inRange(R, C) || this.tiles[R][C].ship != null)   // 위치가 유효하지 않으면 false
            return false;
        for (let v of cc.EDirec.getAllDirec())
            if (this.inRange(R + v.y, C + v.x) && this.tiles[R + v.y][C + v.x].ship != null)    //근처에 배가 있으면 false
                return false;
        return true;
    },
    deleteTargetShip: function () {                     //target 위의 ship 제거
        let ship = this.target.ship;
        let step = cc.EDirec.getVector(ship.direc);
        for (let i = 0; i < ship.type; ++i)
            this.tiles[ship.R + step.y * i][ship.C + step.x * i].ship = null;
        this.buildShip(ship.type - 2, false);
        this.ships.splice(this.ships.indexOf(ship), 1);
        ship.node.destroy();
        this.deselectTile();
    },
    buildComplete: function () {                        //배치가 완료되면 build event를 비활성화하고 대기
        this.log("System","FuUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUck");
        if (!this.isLose()) {
            console.log("배치가 끝나지 않음");
            return;
        }
        if (this.buildCompleted)
            return;
        this.deselectTile();
        this.assignItems();
        this.disableBuildEvents();
        this.buildCompleted = true;
        console.log("배치 완료");
        //cc.Socket.emit('place_done', cc.protocol.place_done());
        this.changeBattlePhase();//
    },
    assignItems: function () {                          //아이템 랜덤 배치
        console.log("폭탄 배치");
        let bombY;
        let bombX;
        while (true) {
            bombY = Math.floor(Math.random() * this.height);
            bombX = Math.floor(Math.random() * this.width);
            bombX = bombX * 2 + bombY % 2;
            if (!this.tiles[bombY][bombX].isShip())
                break;
        }

        console.log("폭탄위치:" + bombY + "," + bombX);

        this.changeTile(bombY, bombX, cc.TileType.Bomb);
    },
    changeBattlePhase() {                    //battle phase로 전환
        console.log("전투 시작");
        this.isMyTurn = false;             //방장이 먼저 턴을 갖게//
        this.buildPanel.node.setPosition(cc.v2(-884, 0));
        this.battlePanel.node.setPosition(cc.v2(0, 0));
        this.changeContainer();
        this.shipCount = [2, 2, 1];
        this.enableBattleEvents();
        this.spawnEnermyTiles();
        //cc.Socket.on('attack_response', this.attack_res_handle);         //공격 후 판정
        //cc.Socket.on('attack_forward', this.attack_forward_handle);      //공격 받을 때
        //cc.Socket.on('turn_start', function () {
        //    console.log('turn start');
        //    cc.GameManager.isMyTurn = true;
        //});
        //cc.Socket.on('gameover', function () {
        //    console.log('gameover');
        //    cc.GameManager.gameEnd(true);
        //});
    },
    returnlobby(){
        cc.Socket.disconnect();
        cc.director.loadScene("Lobby");
    },
    attack_res_handle(res_data) {
        console.log('공격 완료');
        let data = JSON.parse(res_data);
        console.log(data);
        for (let i = 0; i < data.Tiles.Changed.length; ++i) {
            let t = data.Tiles.Changed[i];
            cc.GameManager.changeTile(t[0], t[1], data.Tiles.Type[i], false);
        }
        let count=[data.ShipCount.Small,data.ShipCount.Middle,data.ShipCount.Big];
        cc.GameManager.enemyCount= count;
        cc.GameManager.battlePanel.setShipCount(count);
    },
    attack_forward_handle(forward_data) {
        console.log(forward_data);
        let data = JSON.parse(forward_data);
        let R = data.Position[0];
        let C = data.Position[1];
        console.log('공격 수신', R, C);
        let res_data = cc.GameManager.DamageStep(R, C);
        cc.Socket.emit('attack_result', JSON.stringify(res_data));
        if (cc.GameManager.isLose()){
            cc.Socket.emit('turn_end', cc.protocol.turn_end(true));
            cc.GameManager.gameEnd(false);
        }
        else if (cc.GameManager.tiles[R][C].isShip())
            cc.Socket.emit('turn_end', cc.protocol.turn_end(false));
        else
            cc.GameManager.isMyTurn = true;

    },
    isLose: function () {                               //
        return this.shipCount[0] + this.shipCount[1] + this.shipCount[2] == 0;
    },
    changeContainer: function () {                      //표시되는 화면 변경
        console.log("화면 변경");
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
    spawnEnermyTiles: function () {                     //battle screen에 selectable tile 생성
        for (let r = 0; r < this.height; ++r) {
            this.enemyTiles[r] = [];
            for (let c = 0; c < this.width; ++c)
                this.enemyTiles[r][c * 2 + r % 2] = this.spawnTile(r, c * 2 + r % 2, cc.TileType.Selectable, false);
        }
    },
    attackTarget: function () {                         //공격 진행
        if (!this.isMyTurn ||                                //내 차례가 아니거나
            this.currentScreen != cc.ScreenType.Battle ||   //battle screen이 아니거나
            this.target == null ||                          //선택된 타일이 없거나
            this.target.isNotSelectable())     //선택 가능한 타일이 아니면
            return;
        let attackData = cc.protocol.attack_request([this.target.R, this.target.C]);
        console.log("공격 송신", attackData);
        cc.Socket.emit('attack_request', attackData);
        this.deselectTile();
        this.isMyTurn = false;
    },
    DamageStep: function (R, C) {                       //공격 받은 후 판정 결과 전달
        let tiles = this.tileAttacked(R, C);
        let res_data = {
            ShipCount: {
                Small: this.shipCount[cc.ShipType.Small - 2],
                Middle: this.shipCount[cc.ShipType.Middle - 2],
                Big: this.shipCount[cc.ShipType.Big - 2],
            },
            Tiles: tiles
        };
        console.log(res_data);
        //if(attackData.win)
        //    this.gameEnd(false);
        return res_data;
    },
    CheckTile: function (R, C) {                        //타일의 이벤트 타입  판정
        let tile = this.tiles[R][C];
        switch (tile.type) {
            case cc.TileType.Build:
                return tile.isShip() ? cc.AttackEventType.Ship : cc.AttackEventType.None;
            case cc.TileType.Bomb:
                return cc.AttackEventType.Bomb;
            default:
                return 0;
        }
    },
    tileAttacked: function (R, C) {                     //R,C 공격 판정 후 바뀐 타일들 반환
        switch (this.CheckTile(R, C)) {
            case cc.AttackEventType.None:
                return this.emptyTileAttacked(R, C);
            case cc.AttackEventType.Bomb:
                return this.bombExplosion(R, C);
            case cc.AttackEventType.Ship:
                return this.shipAttacked(R, C);
            default: return { Changed: [], Type: [] };
        }
    },
    getTiles: function (ismytile) {                     //내 타일 또는 적 타일들 반환
        return ismytile ? this.tiles : this.enemyTiles;
    },
    destroyTile: function (R, C, tiles) {               //R,C 타일 파괴
        tiles[R][C].node.destroy();
        tiles[R][C] = null;
    },
    changeTile: function (R, C, type, ismytile = true) {//기존 R,C 타일 파괴 후 type형 타일 새로 생성
        let tiles = this.getTiles(ismytile);
        this.destroyTile(R, C, tiles);
        tiles[R][C] = this.spawnTile(R, C, type, ismytile);
    },
    emptyTileAttacked: function (R, C) {                //빈 타일 공격 판정 후 결과 반환
        console.log("attacked", R, C);
        this.changeTile(R, C, cc.TileType.Damaged);
        return { Changed: [[R, C]], Type: [cc.TileType.Selected] };
    },
    bombExplosion: function (R, C) {                    //폭탄 타일 공격 판정 후 결과 반환
        let ct = { Changed: [], Type: [] };
        this.changeTile(R, C, cc.TileType.Damaged);
        for (let v of cc.EDirec.getAllDirec())
            if (this.inRange(R + v.y, C + v.x))
                this.concatChangeTiles(ct, this.tileAttacked(R + v.y, C + v.x));
        console.log("explosion", R, C);
        ct.Changed.push([R, C]);
        ct.Type.push(cc.TileType.Bomb);
        return ct;
    },
    shipAttacked: function (R, C) {                     //배 타일 공격 판정 후 결과 반환
        let ct;
        let ship = this.tiles[R][C].ship;
        console.log("attacked ship", R, C);
        this.changeTile(R, C, cc.TileType.Damaged);
        this.tiles[R][C].ship = ship;
        ship.damaged.push(cc.v2(C, R));

        if (ship.isSunken())
            ct = this.sinkingShip(ship);
        else
            ct = this.attackSide(R, C);

        ct.Changed.push([R, C]);
        ct.Type.push(cc.TileType.Enermy);
        return ct;
    },
    findBomb: function (ships, direcs) {                //ships 주변 direcs의 폭탄 위치 반환
        for (let v1 of ships) {
            for (let v2 of direcs) {
                let R = v1.y + v2.y;
                let C = v1.x + v2.x;
                if (this.inRange(R, C) && this.tiles[R][C].isBomb())
                    return cc.v2(C, R);
            }
        }
        return null;
    },
    concatChangeTiles: function (ct1, ct2) {            //바뀐 타일 결과 두개를 연결
        for (let c of ct2.Changed)
            ct1.Changed.push(c);
        for (let c of ct2.Type)
            ct1.Type.push(c);
        return ct1;
    },
    sinkingShip: function (ship) {                      //배 타일 판정 결과 침몰이면 주변 모든 타일 확인
        let ships = ship.damaged;
        let direcs = cc.EDirec.getAllDirec();
        console.log("sinking ship", ship.R, ship.C);
        let bomb = this.findBomb(ships, direcs);
        let ct = { Changed: [], Type: [] };
        if (bomb != null)
            ct = this.bombExplosion(bomb.y, bomb.x);
        this.concatChangeTiles(ct, this.attackDirec(ships, direcs));
        --this.shipCount[ship.type - 2];
        return ct;
    },
    attackSide: function (R, C) {                       //배 타일이 판정 결과 두 칸 이상 공격받았으면 양 옆 타일 확인
        let ct = { Changed: [], Type: [] };
        let ships = this.getConnections(R, C);
        if (ships.length == 1)
            return ct;
        console.log("attacked side", R, C);
        let step = ships[1].sub(ships[0]);
        let rstep = step.neg();
        let direcs = [];
        for (let v of cc.EDirec.getAllDirec())
            if (!v.equals(step) && !v.equals(rstep))
                direcs.push(v);

        let bomb = this.findBomb(ships, direcs);
        if (bomb != null)
            ct = this.bombExplosion(bomb.y, bomb.x);
        this.concatChangeTiles(ct, this.attackDirec(ships, direcs));
        return ct;
    },
    attackDirec: function (ships, direcs) {             // ships 근처 direcs를 모두 확인
        let tiles = this.tiles;
        let ct = { Changed: [], Type: [] };
        for (let v1 of ships) {
            for (let v2 of direcs) {
                let R = v1.y + v2.y;
                let C = v1.x + v2.x;
                if (this.inRange(R, C) && tiles[R][C].isBuild())
                    this.concatChangeTiles(ct, this.emptyTileAttacked(R, C));
            }
        }
        return ct;
    },
    findConnection: function (R, C) {                   //R,C 주위 ships의 방향벡터 반환
        let vecs = [];
        for (let v of cc.EDirec.getAllDirec()) {
            if (!this.inRange(R + v.y, C + v.x))
                continue;
            let tile = this.tiles[R + v.y][C + v.x];
            if (tile.isEnermy() || tile.isDamagedShip())
                vecs.push(v);
        }
        return vecs;
    },
    getConnections: function (R, C) {                   //R,C와 연결된 ships[vector] 반환
        let center = cc.v2(C, R);
        let ships = [center];
        let con = this.findConnection(R, C);
        for (let c of con)
            ships.push(center.add(c));
        if (con.length == 1 &&
            this.findConnection(ships[1].y, ships[1].x).length == 2)
            ships.push(ships[1].add(con[0]));
        return ships;
    },
    gameEnd(win) {
        this.winText.string = win ? "YOU WIN!" : "YOU LOSE!";
        this.winPanel.active = true;
        this.disableBattleEvents();
    },
    // EventHandler - - - - - - - - - - - - - - - - - - - - //
    onTouchStart: function (event) {
        let hex = event.target.getComponent("HexTile");
        if (hex != null)
            cc.GameManager.selectTile(hex);
    },
    onTouchMove: function (event) {
        let hex = event.target.getComponent("HexTile");
        if (hex == null || cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.updateCursorDirec(event.touch.getLocation());
    },
    onTouchCancel: function (event) {
        let hex = event.target.getComponent("HexTile");
        if (hex == null || cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.spwanShip();
        cc.GameManager.coverShipPreview();
    },
    onTouchEnd: function (event) {
        let hex = event.target.getComponent("HexTile");
        if (hex == null || cc.GameManager.shipPreview == null)
            return;
        cc.GameManager.coverShipPreview();
    },
    // End of EventHandler - - - - - - - - - - - - - - - - - - - - //

    update(dt) {
    },
});
