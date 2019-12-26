cc.BuildPanel=cc.Class({
    extends: cc.Component,

    properties: {
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
        cc.GameManager.shipType = customEventData;
        this.ModeLabel.string=cc.ShipType.toString(parseInt(customEventData));
    },
    onDeleteButtonClick: function (event) {
        var manager = cc.GameManager;
        if (manager.target != null && manager.target.ship != null)
            manager.deleteTargetShip();
    },
    onStartButtonClick: function () {
        cc.GameManager.buildComplete();
    },
});