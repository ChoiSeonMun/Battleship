cc.HexTile=cc.Class({
    extends: cc.Component,

    init:function(R,C,type){
        this.R=R;
        this.C=C;
        this.type=type;
        this.ship=null;
        this.node.zIndex=cc.ZOrder.Tile;
        this.node.setPosition(cc.GameManager.getTilePos(R, C));
        this.setEvents();
    },
    getPos(){
        return this.node.position;
    },
    isShip: function () {
        return this.ship != null;
    },

    setEvents:function(){
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
