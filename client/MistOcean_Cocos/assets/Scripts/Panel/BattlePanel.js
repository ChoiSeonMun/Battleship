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
        TurnLabel: {
            default: null,
            type: cc.Label
        },
        FieldLabel: {
            default: null,
            type: cc.Label
        },
    },
    setShipCount: function (value) {
        for (var i = 0; i < 3; ++i)
            this.ShipCountLabel[i].string = value[i];
    },
    setTurn: function (turn) {
        var text = turn ? "내 차례" : "상대 차례";
        this.TurnLabel.string = text;
    },
    onChangeButtonClick: function () {
        this.GameManager.getComponent("GameManager").changeContainer();
        this.FieldLabel.string = (this.FieldLabel.string == "상대 필드") ? "내 필드" : "상대 필드";
    },
    onAttackButtonClick: function () {
        this.GameManager.getComponent("GameManager").attackTarget();
    },
    onTest: function () {
        this.GameManager.getComponent("GameManager").isMyTurn = true;
    },
});