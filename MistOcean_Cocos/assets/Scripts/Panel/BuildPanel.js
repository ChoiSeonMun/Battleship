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
        switch(parseInt(customEventData)){
            case 2: this.ModeLabel.string="소형";break;
            case 3: this.ModeLabel.string="중형";break;
            case 4: this.ModeLabel.string="대형";break;
            default: break;
        }
    },
    onDeleteButtonClick: function (event) {
        var manager = this.GameManager.getComponent("GameManager");
        if (manager.target != null && manager.target.ship != null)
            manager.deleteTargetShip();
    },
    onStartButtonClick: function () {
        this.GameManager.getComponent("GameManager").buildComplete();
    },
});