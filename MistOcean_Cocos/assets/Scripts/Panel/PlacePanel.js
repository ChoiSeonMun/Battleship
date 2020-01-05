cc.PlacePanel=cc.Class({
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
        let shipType=parseInt(customEventData);
        cc.GameManager.setShipType(shipType);
        switch(shipType){
            case cc.ShipTypes.PatrolKiller:
                this.ModeLabel.string="소형";
                break;
            case cc.ShipTypes.Destroyer:
                this.ModeLabel.string="중형";
                break;
            case cc.ShipTypes.Cruiser:
                this.ModeLabel.string="대형";
                break;
            default:
                this.ModeLabel.string="default";
                break;
        }
    },
    onDeleteButtonClick: function (event) {
        cc.GameManager.deleteTargetShip();
    },
    onStartButtonClick: function () {
        cc.GameManager.buildComplete();
    },
});