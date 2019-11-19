cc.Class({
    extends: cc.Component,

    properties: {
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
    },
    start() {
    },
    init:function(R,C,type,manager){
        this.R=R;
        this.C=C;
        this.type=type;
        this.manager=manager;
        this.ship=null;
        this.setEvent();
    },
    // update (dt) {},
    setEvent:function(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },
    isShip: function () {
        return this.ship != null;
    },
    isNotSelectable:function(){
        return this.type!=cc.TileType.Selectable;
    },
    isDamagedShip:function(){
        return this.isShip()&&this.type==cc.TileType.Damaged;
    },
    isEnermy:function(){
        return this.type==cc.TileType.Enermy;
    },
    onTouchStart:function(event){
    },

    onTouchCancel:function(event){
    },

    onTouchMove:function(event){
    },

    onTouchEnd:function(event){
    },
});
