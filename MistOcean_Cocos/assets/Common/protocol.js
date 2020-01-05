// 프로토콜을 위한 Object
const protocols = {
    // Auto-matching
    
    /**
     * 서버에 조인을 요청한다.
     * @param {String} nickname 클라이언트의 닉네임 
     * @returns {String} 생성된 메세지
     */
    joinRequest(nickname) {
        return JSON.stringify({ nickname: nickname });
    },
    
    /**
     * 클라이언트에 조인에 대한 응답을 한다.
     */
    joinResponse() { }
    ,

    /**
     * 매칭 후 클라이언트에서 설정해야 할 정보를 넘긴다.
     * @param {[Number, Number, Number]} shipList [PatrolKiller, Destroyer, Cruiser]
     * @param {String} opponent 상대방 닉네임
     * @param {Number} height 맵 높이
     * @param {Number} width 맵 너비
     * @returns {String} 생성된 메세지
     */
    matchDone(shipList, opponent, height, width) {
        return JSON.stringify({
            numberOfShip: shipList,
            opponent: opponent,
            height: height,
            width: width
        });
    },

    // Place

    /**
     * 서버에 배의 배치를 요청한다.
     * @param {ShipTypes} type 
     * @param {Number} row 
     * @param {Number} col 
     * @param {Directions} direction 
     * @returns {String} 생성된 메세지
     */
    placeResquest(type, row, col, direction) {
        return JSON.stringify({
            type: type,
            row: row,
            col: col,
            direction: direction
        });
    },

    /**
     * 해당 위치의 배치를 취소한다.
     * @param {Number} row 취소할 행번호
     * @param {Number} col 취소할 열번호
     * @returns {String} 생성된 메세지
     */
    placeCancelRequest(row, col) {
        return JSON.stringify({ row: row, col: col });
    },
    
    /**
     * 배치 요청 혹은 취소 요청에 대해 응답한다.
     */
    placeResponse() { },

    /**
     * 배의 배치가 완료되었음을 서버에게 알린다
     */
    placeDone() { },

    /**
     * 상대가 준비되었다는 것을 다른 클라이언트에게 알린다.
     */
    readyEvent() { },

    /**
     * 클라이언트에게 게임 시작을 알린다.
     * @param {Number} row 폭탄의 행번호
     * @param {Number} col 폭탄의 열번호
     * @return {String} 생성된 메시지
     */
    startEvent(row, col) {
        return JSON.stringify({ row: row, col: col });
     },
    
    // Battle

    /**
     * 클라이언트에게 턴의 시작을 알린다.
     */
    turnEvent() { },
    
    /**
     * 서버에게 공격을 요청한다.
     * @param {Number} row 공격할 행 번호 
     * @param {Number} col 공격할 열 번호
     * @returns {String} 생성된 메세지
     */
    attackRequest(row, col) {
        return JSON.stringify({ row: row, col: col });
    },

    /**
     * 공격 받음을 해당 클라이언트에게 알린다.
     * @param {Number} row 공격 당한 행번호
     * @param {Number} col 공격 당한 열번호
     */
    attackEvent(row, col) {
        return JSON.stringify({ row: row, col: col });
    },

    /**
     * 공격 성공 여부를 알린다.
     * @param {Boolean} isSucceeded 공격 성공 여부
     * @param {Boolean} isBomb 폭탄 여부
     * @returns {String} 생성된 메세지
     */
    attackResponse(isSucceeded, isBomb) {
        return JSON.stringify({ success: isSucceeded, bomb: isBomb });
    },
    
    /**
     * 승자를 알림으로써 게임을 끝낸다.
     * @param {String} winner 승자
     * @returns {String} 생성된 메세지
     */
    gameOver(winner) {
        return JSON.stringify({ winner: winner });
    }
    //==============================================

}

module.exports = PROTOCOLS;