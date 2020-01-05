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

// Tile 클래스
// Map의 기본 단위를 나타낸다.
class Tile {
    /**
     * Tile 생성자
     * tileType의 기본값은 TileTypes.Normal이다.
     * @param {TileTypes} tileType 타일의 타입 
     */
    constructor(tileType = TileTypes.Normal) {
        this.currentType = currentType;
    }

    /**
     * 현재 타일의 타입을 가져온다.
     * @returns {TileTypes} 현재 타일의 타입
     */
    get currentType() {
        return this.currentType;
    }

    /**
     * 타일의 타입을 변경한다.
     * @param {TileTypes} newType 변경할 타입
     */
    setType(newType) {
        return this.currentType = newType;
    }

    /**
     * 타일이 빈 타일인지 검사
     * @returns {boolean} 결과값
     */
    isNormal() {
        return this.currentType == TileTypes.Normal;
    }

    /**
     * 타일이 공격받았는지 검사
     * @returns {boolean} 결과값
     */
    isAttacked() {
        return this.currentType == TileTypes.Attacked;
    }

    /**
     * 타일이 폭탄을 가지고 있는지 검사
     * @returns {boolean} 결과값
     */
    hasBomb() {
        return this.currentType == TileTypes.HasBomb;
    }

    /**
     * 타일이 배를 가지고 있는지 검사
     * @returns {boolean} 결과값
     */
    hasShip() {
        return this.currentType == TileTypes.HasShip;
    }

    /**
     * 해당 타일에 공격이 가능한지 검사한다.
     * @returns {boolean} 결과값
     */
    canAttack() {
        return this.currentType != TileTypes.Attacked;
    }
    
    toString() {
        return TileTypes.toString(this.currentType);
    }
}

module.exports.Tile = Tile;
module.exports.TileTypes = TileTypes;