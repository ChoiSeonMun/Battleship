cc.Class({
    extends: cc.Component,

    properties: {
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
    },
    start() {
    },
    init:function(R,C,manager){
        this.R=R;
        this.C=C;
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
    onTouchStart:function(event){
    },
    onTouchCancel:function(event){
    },
    onTouchMove:function(event){
    },
    onTouchEnd:function(event){
    },
});
