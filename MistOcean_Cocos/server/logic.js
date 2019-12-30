const settings = require("../assets/Common/settings");
const types = require("../assets/Common/types");
const protocol = require("../assets/Common/protocol");
const logic = {
    height: settings.HEIGHT,
    width: settings.WIDTH,
    /**
     * get whether (R,C) in valid range
     * @param {Number} R rows 
     * @param {Number} C cols
     * @returns {boolean} R,C is valid
     */
    inRange: function (R, C) {
        return R >= 0 && C >= 0 && R < this.height && C < this.width * 2 + R % 2 - 1;
    },
    /**
     * create tileinfos with shipinfos
     * @param {types.ShipInfo[]} shipinfos ship infomations
     * @returns {types.TileInfo[][]} tileinfos
     */
    getTileInfos(shipinfos) {
        var tiles = [];
        for (let r = 0; r < this.height; ++r) {
            tiles[r] = [];
            for (let c = 0; c < this.width; ++c)
                tiles[r][c * 2 + r % 2] = new types.TileInfo(r, c * 2 + r % 2, types.TileType.Selectable);
        }
        for (let ship of shipinfos) {
            let step = types.EDirec.getVector(ship.direc);
            for (let i = 0; i < ship.type; ++i) {
                let r = ship.R + step.y * i;
                let c = ship.C + step.x * i;
                tiles[r][c].ship = ship;
            }
        }
        return tiles;
    },
    /**
     * calculate bomb pos in tiles
     * @param {types.TileInfo[][]} tiles base tiles
     * @returns {types.Vector} bomb pos
     */
    getBombPos(tiles) {
        var pos = new types.Vector();
        while (true) {
            pos.y = Math.floor(Math.random() * this.height);
            pos.x = Math.floor(Math.random() * this.width);
            pos.x = pos.x * 2 + pos.y % 2;
            if (!tiles[pos.y][pos.x].ship != null)
                break;
        }
        return pos;
    },
    /**
     * get attack event type of R,C tile in tiles 
     * @param {Number} R 
     * @param {Number} C 
     * @param {types.TileInfo[][]} tiles
     * @returns {*} attack event type 
     */
    CheckTile: function (R, C, tiles) {
        let tile = tiles[R][C];
        switch (tile.type) {
            case types.TileType.Selectable:
                return tile.ship != null ? 
                    tile.ship.isSunken()?types.AttackEventType.SunkenShip:types.AttackEventType.Ship
                    : types.AttackEventType.None;
            case types.TileType.Bomb:
                return types.AttackEventType.Bomb;
            default:
                return 0;
        }
    },
    /**
     * apply attack and return changed tile
     * @param {Number} R 
     * @param {Number} C 
     * @param {types.TileInfo[][]} tiles 
     * @param {Number[]} shipCount 
     * @returns {types.ChangedTile[]} attack result
     */
    getChangedTiles: function (R, C, tiles, shipCount) {
        switch (this.CheckTile(R, C, tiles)) {
            case types.AttackEventType.None:
                return this.attackEmpty(R, C, tiles);
            case types.AttackEventType.Bomb:
                return this.attackBomb(R, C, tiles, shipCount);
            case types.AttackEventType.SunkenShip:
            case types.AttackEventType.Ship:
                return this.attackShip(R, C, tiles, shipCount);
            default: return [];
        }
    },
    attackEmpty: function (R, C, tiles) {
        tiles.type = types.TileType.Selected;
        return [new types.ChangedTile(R, C, types.TileType.Selected)];
    },
    attackBomb: function (R, C, tiles, shipCount) {
        let ct = [];
        tiles.type = types.TileType.Selected;
        for (let v of types.EDirec.getAllDirec())
            if (this.inRange(R + v.y, C + v.x))
                ct.concat(this.getChangedTiles(R + v.y, C + v.x, tiles, shipCount));
        ct.push(new ChangedTile(R, C, types.TileType.Bomb));
        return ct;
    },
    attackShip: function (R, C, tiles, shipCount) {
        let ct;
        let ship = tiles[R][C].ship;
        ship.damaged.push(new types.Vector(C, R));

        if (ship.isSunken())
            ct = this.attackSunkenShip(ship, tiles, shipCount);
        else
            ct = this.attackSide(R, C, tiles);

        ct.push(new types.ChangedTile(R, C, types.TileType.Enermy));
        return ct;
    },
    attackSunkenShip: function (ship, tiles, shipCount) {
        let ships = ship.damaged;
        let direcs = types.EDirec.getAllDirec();
        let bomb = this.findBomb(ships, direcs, tiles);
        let ct = bomb != null ? this.attackBomb(bomb.y, bomb.x, tiles, shipCount) : [];
        ct.concat(this.attackDirec(ships, direcs, tiles));
        --shipCount[ship.type - 2];
        return ct;
    },
    findBomb: function (ships, direcs, tiles) {
        for (let ship of ships) {
            for (let v of direcs) {
                let R = ship.R + v.y;
                let C = ship.C + v.x;
                if (this.inRange(R, C) && tiles[R][C].type == types.TileType.Bomb);
                return new types.Vector(C, R);
            }
        }
        return null;
    },
    attackDirec: function (ships, direcs, tiles) {
        let ct = [];
        for (let ship of ships) {
            for (let v of direcs) {
                let R = ship.R + v.y;
                let C = ship.C + v.x;
                if (this.inRange(R, C) && tiles[R][C].type == types.TileType.Selectable)
                    ct.concat(this.attackEmpty(R, C, tiles));
            }
        }
        return ct;
    },
    attackSide: function (R, C, tiles) {
        let shipPositions = this.getConnections(R, C, tiles);
        if (shipPositions.length == 1)
            return ct;
        let step = types.EDirec.getVector(tiles[R][C].ship.type);
        let rstep = types.EDirec.getParallelDirec(types.EDirec.toDirec(step));
        let direcs = [];
        for (let v of types.EDirec.getAllDirec())
            if (!v.equals(step) && !v.equals(rstep))
                direcs.push(v);

        let bomb = this.findBomb(ships, direcs, tiles);

        let ct = bomb != null ? this.attackBomb(bomb.y, bomb.x, bomb.x, tiles, shipCount) : [];
        ct.concat(this.attackDirec(ships, direcs,tiles));
        return ct;
    },
    getConnections: function (R, C, tiles) {
        let center = new types.Vector(C, R);
        let shipPositions = [center];
        let conections = this.findConnection(R, C, tiles);
        for (let c of conections)
            shipPositions.push(center.add(c));
        if (conections.length == 1 &&
            this.findConnection(shipPositions[1].y, shipPositions[1].x, tiles).length == 2)
            shipPositions.push(shipPositions[1].add(conections[0]));
        return shipPositions;
    },
    findConnection: function (R, C, tiles) {
        let vecs = [];
        for (let v of types.EDirec.getAllDirec()) {
            if (!this.inRange(R + v.y, C + v.x))
                continue;
            let tile = tiles[R + v.y][C + v.x];
            if (tile.ship != null)
                vecs.push(v);
        }
        return vecs;
    },
}
module.exports.logic = logic;