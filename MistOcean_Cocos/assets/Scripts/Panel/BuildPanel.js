cc.Class({
    extends: cc.Component,

    properties: {
        GameManager: {
            default: null,
            type: cc.Node
        },
        ShipCountLabel: {
            default: [],
            type: [cc.Label],
        },
        ModeLabel: {
            default: null,
            type: cc.Label
        },
        WaitingPanel: {
            default: null,
            type: cc.Node
        },
    },
    setShipCount: function (index, cnt) {
        this.ShipCountLabel[index].string = cnt;
    },
    onSettingButtonClick: function (event, customEventData) {
        this.GameManager.getComponent("GameManager").shipType = customEventData;
        console.log(customEventData);
        this.ModeLabel.string = "배치: " + customEventData + "칸";
    },
    onDeleteButtonClick: function (event) {
        var manager = this.GameManager.getComponent("GameManager");
        if (manager.target != null && manager.target.ship != null)
            manager.deleteTargetShip();
    },
    onStartButtonClick: function () {
        this.ModeLabel.string = "";
        this.GameManager.getComponent("GameManager").buildComplete();
    },
});