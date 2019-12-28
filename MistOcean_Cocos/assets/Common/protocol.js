//==============================================
//common protocol define
//
const protocol = {
    //==============================================
    //lobby protocol
    //
    join_request(nickname) {//client
        return JSON.stringify({ nickname: nickname});
    },
    join_response(type,info="") {//server
        return JSON.stringify({ type:type,info:info });
    },
    //==============================================
    //place protocol
    //
    place_done(shipinfos) {//client
        return JSON.stringify(shipinfos);
    },
    place_response(R,C) {//server
        return JSON.stringify({R:R,C:C});
    },
    enermy_ready(){},//server
    start_event(){},//server
    //==============================================
    //battle protocol
    //
    turn_start(){},//server    
    attack_request(R,C) {//client
        return JSON.stringify({R:R,C:C});
    },
    attack_response(msg) {//server
    },
    update_event(){//server

    }
    //==============================================

}
module.exports.protocol=protocol;
//==============================================