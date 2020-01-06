require('./Panel');
cc.PlacePanel = cc.Class({
    extends: cc.Panel,

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
        let shipType = parseInt(customEventData);
        this.ModeLabel.string = cc.GameManager.getShipSize(shipType);
        cc.GameManager.setShipType(shipType);
    },
    onDeleteButtonClick: function (event) {
        cc.GameManager.placeCancelRequest();
    },
    onStartButtonClick: function () {
        cc.GameManager.placeDone();
    },
});