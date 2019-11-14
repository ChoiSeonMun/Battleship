cc.Class({
    extends: cc.Component,

    properties: {
        R:0,
        C:0
    },
    setEvent:function(){
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    },
    onTouchStart:function(event){
        console.log("Touch :",this.R,this.C);
    },
    onTouchMove:function(event){
        console.log("Enter :",this.R,this.C);
    },
    onTouchEnd:function(event){
        console.log("End :",this.R,this.C);
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    start() {
    },

    // update (dt) {},
});
