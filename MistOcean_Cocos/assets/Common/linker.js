//==============================================
//공통 설정과 타입을 cc에 바인딩한다.
//
cc.protocol = require("protocol");
cc.settings = require("settings");
cc.Player = require('./class/Player');
let tile = require('./class/Tile');
cc.Map = require('./class/Map');
cc.Tile = tile.Tile;
cc.TileTypes = cc.Enum(tile.TileTypes);
let enums = require("enums");
cc.Directions = cc.Enum(enums.Directions);

//==============================================