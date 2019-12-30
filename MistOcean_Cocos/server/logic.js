const settings=require("../assets/Common/settings").settings;
const types = require("../assets/Common/types");
const logic={
    height:settings.HEIGHT,
    width:settings.WIDTH,
    getTileInfos(shipinfos){
        var tiles=[];
        for(let r=0;r<this.height;++r){
            tiles[r]=[];
            for(let c=0;c<this.width;++c)
                tiles[r][c * 2 + r % 2]=new types.TileInfo(r,c * 2 + r % 2,types.TileType.Selectable);
        }
        for(let ship of shipinfos){
            let step=types.EDirec.getVector(ship.direc);
            for(let i=0 ;i<ship.type;++i){
                let r=ship.R+step.y*i;
                let c=ship.C+step.x*i;
                tiles[r][c].ship=ship;
            }
        }      
        return tiles;
    },
    getBombPos(tiles){
        var pos=new types.Vector();
        while (true) {
            pos.y = Math.floor(Math.random() * this.height);
            pos.x = Math.floor(Math.random() * this.width);
            pos.x = pos.x * 2 + pos.y % 2;
            if (!tiles[pos.y][pos.x].ship!=null)
                break;
        }
        return pos;
    },
}
module.exports.logic=logic;