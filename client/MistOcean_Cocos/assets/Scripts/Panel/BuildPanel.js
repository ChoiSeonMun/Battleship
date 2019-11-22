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
        }
    },
    setShipCount:function(index,cnt){
        this.ShipCountLabel[index].string=cnt;
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
    onStartButtonClick:function(){
        this.GameManager.getComponent("GameManager").buildComplete();
        this.GameManager.getComponent("GameManager").changeBattlePhase();
    },
});