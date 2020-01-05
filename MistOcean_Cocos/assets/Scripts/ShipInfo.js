cc.ShipInfo = cc.Class({
    extends: cc.Component,

    properties: {
        row: 0,
        col: 0,
        direction: {
            default: cc.Directions.Right,
            type: cc.Directions
        },
        type: {
            default: cc.ShipTypes.PatrolKiller,
            type: cc.ShipTypes
        }
    },
    init(row, col, direction) {
        this.row = row;
        this.col = col;
        this.direction = direction;
        this.node.zIndex = cc.ZOrder.Ship;
        this.node.angle = cc.Directions.toAngle(direction);
        this.node.setPosition(cc.GameManager.getTilePos(row, col));
    }
});
