require('./Panel');
cc.BattlePanel = cc.Class({
    extends: cc.Panel,
    properties: {
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
    setShipCount(value) {
        for (var i = 0; i < 3; ++i)
            this.ShipCountLabel[i].string = value[i];
    },
    setTurn(turn) {
        var text = turn ? "당신의 차례입니다." : "상대의 차례입니다.";
        this.TurnLabel.string = text;
    },
    onChangeButtonClick() {
        cc.GameManager.changeContainer();
        this.FieldLabel.string = (this.FieldLabel.string == "상대 필드") ? "내 필드" : "상대 필드";
    },
    onAttackButtonClick() {
        cc.GameManager.attackTarget();
    },
});