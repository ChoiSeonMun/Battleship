cc.Class({
    extends: cc.Component,

    properties: {
        R:0,
        C:0,
        TileHilightPrefab:{
            default:null,
            type:cc.Prefab,
        }
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        this.hilight=null
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
    beginSelectEffect:function(){
        if(this.hilight!=null)
            this.hilight.destroy();
        this.hilight=cc.instantiate(this.TileHilightPrefab);
        this.node.addChild(this.hilight);
    },
    endSelectEffect:function(){
        if(this.hilight==null)
            return;
        this.hilight.destroy();
        this.hilight=null;

    },
});
