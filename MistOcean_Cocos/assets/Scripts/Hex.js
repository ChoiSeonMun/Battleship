
const DX = 0.8;
const DY = 0.69;
const H_DX = DX / 2;
const R_DX = 1 / 0.8;
const R_DY = 1 / 0.69;

var Hex = cc.Class({
    extends: cc.Component,

    properties: {
        x : 0,
        y : 0,

        EDirec : cc.Enum({
            default : -1,

            RIGHT : 1,
            RIGHTUP : 2,
            LEFTUP : 3,
            LEFT : 4,
            LEFTDOWN : 5,
            RIGHTDOWN : 6
        })
    },

    __ctor__(x,y){
        this.x = x;
        this.y = y;
    },

    __ctor__(Hex){
        x = Hex.x;
        y = Hex.y;
    },

    ToString(){
        return "Hex("+x+","+y+")";
    },

    Equals(other){
        return x == other.x && y == other.y;
    },

    statics :{
        HexToSqr(Hex){
            return HexToSqr(Hex.x, Hex.y);
        },

        HexToSqr(x,y){
            hexX = x * DX + (y % 2 != 0 ? H_DX : 0);
            hexY = y * DY;

            return cc.Vec2(hexX,hexY);
        },

        SqrToHex(pos){
            return SqrToHex(pos.x, pos.y);
        },

        SqrToHex(x,y){
            sqrY = y * R_DY;
            sqrX = sqrY % 2 != 0 ? (x - H_DX) * R_DX : x * R_DX;

            return new Hex(sqrX, sqrY);
        }
    },

    Move(eDIrec){
        switch (eDirec)
        {
            case Hex.EDirec.RIGHT:
                x++;
                break;
            case Hex.EDirec.RIGHTUP:
                y++;
                if (y % 2 == 0) x++;
                break;
            case Hex.EDirec.LEFTUP:
                y++;
                if (y % 2 != 0) x--;
                break;
            case Hex.EDirec.LEFT:
                x--;
                break;
            case Hex.EDirec.LEFTDOWN:
                y--;
                if (y % 2 != 0) x--;
                break;
            case Hex.EDirec.RIGHTDOWN:
                y--;
                if (y % 2 == 0) x++;
                break;
        }
    }

    // update (dt) {},
});
