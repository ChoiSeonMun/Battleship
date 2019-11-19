cc.Class({
    extends: cc.Component,

    properties: {
        GameManager:{
            default:null,
            type:cc.Node
        },
        ShipCountLabel: {
            default: [],
            type: [cc.Node],
        }
    },
    setShipCount:function(index,cnt){
        this.ShipCountLabel[index].getComponent(cc.Label).string=cnt;
    },
    onSettingButtonClick: function (event, customEventData) {
        this.GameManager.getComponent("GameManager").shipType = customEventData;
        console.log(customEventData);
    },
    onDeleteButtonClick: function (event) {
        var manager=this.GameManager.getComponent("GameManager");
        if (manager.target != null && manager.target.ship != null)
            manager.deleteTargetShip();
    },
    onCompleteButtonClick: function (event) {
        this.GameManager.getComponent("GameManager").buildComplete();
    },
    onStartButtonClick:function(){
        this.GameManager.getComponent("GameManager").changeBattlePhase();
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});