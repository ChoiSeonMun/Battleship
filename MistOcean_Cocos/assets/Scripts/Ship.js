var Ship = cc.Class({
    extends: cc.Component,

    properties: {
    },

    init: function (R, C, type, direc) {
        this.info=new cc.ShipInfo(R,C,type,direc);
        this.damaged = [];
        this.node.zIndex=cc.ZOrder.Ship;
        this.node.angle = cc.EDirec.getAngle(direc);
        this.node.setPosition(cc.GameManager.getTilePos(R, C));
    },

    isSunken:function(){
        return this.damaged.length == this.info.type;
    },
});