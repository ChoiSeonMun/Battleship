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
    place_response(pos) {//server
        return JSON.stringify({R:pos.y,C:pos.x});
    },
    enermy_ready(){},//server
    start_event(){},//server
    //==============================================
    //battle protocol
    //
    turn_event(){},//server    
    attack_request(R,C) {//client
        return JSON.stringify({R:R,C:C});
    },
    attack_response(type,remain_enermy,changed_tiles) {//server
        return JSON.stringify({type:type,remain_enermy:remain_enermy,changed_tiles:changed_tiles});
    },
    attack_event(type,remain_ship,changed_tiles){//server
        return JSON.stringify({type:type,remain_ship:remain_ship,changed_tiles:changed_tiles});
    },
    game_over(winner){//server
        return JSON.stringify({winner:winner});
    }
    //==============================================

}
module.exports=protocol;
//==============================================