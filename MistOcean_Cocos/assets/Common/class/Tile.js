const TileTypes = {
    Normal: 0,
    Attacked: 1,
    HasBomb: 2,
    HasShip: 3,
    toString(tileType) {
        str = "";
        switch (tileType) {
            case this.Normal:
                str = "Normal";
                break;
            case this.Attacked:
                str = "Attacked";
                break;
            case this.HasBomb:
                str = "HasBomb";
                break;
            case this.HasShip:
                str = "HasShip";
                break;
        }
        return str;
    }
}
class Tile {
    /**
     * Tile 생성자
     * currentType의 기본값은 Normal
     * @param {TileTypes} currentType 
     */
    constructor(currentType = TileTypes.Normal) {
        this.currentType = currentType;
    }
    /**
     * currentType getter
     * @returns {TileTypes}
     */
    getType() {
        return this.currentType;
    }
    /**
     * currentType setter
     * @param {TileTypes}
     */
    setType(currentType) {
        return this.currentType = currentType;
    }
    /**
     * 타일이 빈 타일인지 검사
     * @returns {boolean}
     */
    isNormal() {
        return this.currentType == TileTypes.Normal;
    }
    /**
     * 타일이 공격받았는지 검사
     * @returns {boolean}
     */
    isAttacked() {
        return this.currentType == TileTypes.Attacked;
    }
    /**
     * 타일이 폭탄을 가지고 있는지 검사
     * @returns {boolean}
     */
    hasBomb() {
        return this.currentType == TileTypes.HasBomb;
    }
    /**
     * 타일이 배를 가지고 있는지 검사
     * @returns {boolean}
     */
    hasShip() {
        return this.currentType == TileTypes.HasShip;
    }
    toString() {
        return TileTypes.toString(this.currentType);
    }
}
module.exports.Tile = Tile;
module.exports.TileTypes = TileTypes;