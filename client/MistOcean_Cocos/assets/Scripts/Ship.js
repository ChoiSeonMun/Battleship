var Ship = cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    init: function (R, C, type, direc, manager) {
        this.R = R;
        this.C = C;
        this.type = type;
        this.damaged = [];
        this.direc = direc;
        this.manager = manager;
    },
    isSunken:function(){
        return this.damaged.length == this.type;
    },
    start() {

    },

    // update (dt) {},
});