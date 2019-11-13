cc.Class({
    extends: cc.Component,

    properties: {
        C:0,
        R:0,
        DX:{
            default:0,
            tooltip:"width"
        },
        DY:{
            default:0,
            tooltip:"height*0.75"
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    toSqr(){
        var hexX = this.C * this.DX + (this.R % 2 != 0 ? this.DX/2 : 0);
        var hexY = this.R * this.DY;

        return cc.v2(hexX,hexY);
    },
    start () {

    },

    // update (dt) {},
});
