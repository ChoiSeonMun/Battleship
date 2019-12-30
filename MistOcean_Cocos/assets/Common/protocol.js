// 프로토콜을 위한 Object
const PROTOCOLS = {
    // Auto-matching
    
    /**
     * 서버에 조인을 요청한다.
     * @param {string} nickname 클라이언트의 닉네임 
     * @returns {JSON} 생성된 메세지
     */
    joinRequest(nickname) {
        return JSON.stringify({ nickname: nickname });
    },
    
    /**
     * 클라이언트에 조인에 대한 응답을 한다.
     * @param {int} type 응답의 타입
     * @param {*} info 응답에 따른 추가 정보
     * @returns {string} 생성된 메세지
     */
    joinResponse(type, info = "") {
        return JSON.stringify({ type: type, info: info });
    },

    // Place

    /**
     * 배의 배치가 완료되었음을 서버에게 알린다.
     * @param {ShipInfo} shipInfos 클라이언트가 배치한 배의 정보
     * @returns {string} 생성된 메세지
     */
    placeDone(shipInfos) {
        return JSON.stringify({ shipinfos: shipInfos});
    },

    /**
     * 배치가 완료된 클라이언트에게 폭탄의 번호를 알려준다.
     * @param {int} R 폭탄의 행 번호
     * @param {int} C 폭탄의 열 번호
     * @returns {string} 생성된 메세지
     */
    placeResponse(R, C) {
        return JSON.stringify({ R: R, C: C});
    },

    /**
     * 상대가 준비되었다는 것을 다른 클라이언트에게 알린다.
     * @param {string} nickname 상대방의 닉네임
     * @returns {string} 생성된 메세지
     */
    readyEvent(nickname) {
        return JSON.stringify({ nickname: nickname })
    },

    /**
     * 클라이언트에게 게임 시작을 알린다.
     */
    startEvent() { },
    
    // Battle

    /**
     * 클라이언트에게 턴의 시작을 알린다.
     */
    turnEvent() { },
    
    /**
     * 서버에게 공격을 요청한다.
     * @param {int} R 공격할 행 번호 
     * @param {int} C 공격할 열 번호
     * @returns {string} 생성된 메세지
     */
    attackRequest(R, C) {
        return JSON.stringify({ R: R, C: C});
    },

    /**
     * 공격 성공 여부를 알린다.
     * @param {int} result 0이면 성공. 1이면 실패다.
     * @returns {string} 생성된 메세지
     */
    attackResponse(result) {
        return JSON.stringify({type:type,remain_enermy:remain_enermy,changed_tiles:changed_tiles});
    },
    
    /**
     * 승자를 알림으로써 게임을 끝낸다.
     * @param {string} winner 승자
     */
    gameOver(winner) {
        return JSON.stringify({ winner: winner });
    }
    //==============================================

}

module.exports = PROTOCOLS;