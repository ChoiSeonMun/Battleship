cc.Class({
    extends: cc.Component,

    properties: {
        GameManager:{
            default:null,
            type:cc.Node
        },
        ShipCountLabel: {
            default: [],
            type: [cc.Label],
        },
        TurnLabel:{
            default:null,
            type:cc.Label
        }
    },
    setShipCount:function(value){
        for(var i=0;i<3;++i)
            this.ShipCountLabel[i].string=value[i];
    },
    setTurn:function(turn){
        var text= turn? "TRUE":"FALSE";
        this.TurnLabel.string=text;
    },
    onChangeButtonClick : function(){
        this.GameManager.getComponent("GameManager").changeContainer();
    },
    onAttackButtonClick: function () {
        this.GameManager.getComponent("GameManager").attackTarget();
    },
    onTest:function(){
        this.GameManager.getComponent("GameManager").isMyTurn=true;
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});