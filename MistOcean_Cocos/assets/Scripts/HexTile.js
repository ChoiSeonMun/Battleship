cc.Class({
    extends: cc.Component,

    properties: {
        R:0,
        C:0
    },
    setEvent:function(){
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){}, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function(event){}, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event){}, this);
    },
    onTouchStart:function(event){
        console.log(event);
        console.log("Start :",this.R,this.C);
    },
    onTouchMove:function(event){
        console.log("Move :",this.R,this.C);
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
