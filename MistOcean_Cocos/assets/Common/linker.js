//==============================================
//공통 설정과 타입을 cc에 바인딩한다.
//
cc.protocol = require("protocol");
cc.settings = require("settings");
cc.Map = require('./Map');
cc.Tile = require('./Tile');
let enums = require("enums");
cc.Directions = cc.Enum(enums.Directions);
cc.TileTypes = cc.Enum(enums.TileTypes);

//==============================================