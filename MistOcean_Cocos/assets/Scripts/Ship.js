var Ship = cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init: function (R, C, type, direc, manager) {
        this.info=new cc.ShipInfo(R,C,type,direc);
        this.damaged = [];
        this.manager = manager;
    },
    isSunken:function(){
        return this.damaged.length == this.info.type;
    },
    start() {

    },

    // update (dt) {},
});