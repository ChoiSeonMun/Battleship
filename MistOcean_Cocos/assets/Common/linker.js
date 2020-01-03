//==============================================
//add common setting in cc
//
cc.protocol=require("protocol");
cc.settings=require("settings");
let types=require("types");
cc.EDirec = cc.Enum(types.EDirec);
cc.ShipType = cc.Enum(types.ShipType);
cc.ScreenType = cc.Enum(types.ScreenType);
cc.TileType = cc.Enum(types.TileType);
cc.ZOrder = cc.Enum(types.ZOrder);
cc.JoinEventType=cc.Enum(types.JoinEventType);
cc.AttackEventType = cc.Enum(types.AttackEventType);
cc.ShipInfo=types.ShipInfo;
cc.ChangedTile=types.ChangedTile;
//==============================================