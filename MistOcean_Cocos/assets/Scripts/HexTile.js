cc.Class({
    extends: cc.Component,

    properties: {
        R:0,
        C:0,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
    },
    start() {
    },

    // update (dt) {},
    setEvent:function(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },
    onTouchStart:function(event){
        //this.beginSelectEffect();
    },
    onTouchCancel:function(event){
        //this.endSelectEffect();
    },
    onTouchMove:function(event){
    },
    onTouchEnd:function(event){
        //this.endSelectEffect();
    },
});
