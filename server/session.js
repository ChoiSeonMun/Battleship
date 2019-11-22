const protocol = require('../Common/protocol.js').protocol;

class Session {
    constructor(player) {
        this.ID = player.ID;
        this.players = {};
        this.players[player.ID] = player;
        this.host = player;
        this.isOver = false;

        // 플레이어를 조인시킨다.
        player.join(this.roomID);
    }

    join(player) {
        // 유저를 해당 세션에 조인시킨다.
        player.join(this.ID);
        
        // 정보를 설정한다.
        this.host.oppo = player;
        player.oppo = this.host;
        this.players.push(player);

        // 상대방에게 조인이 완료되었다는 메시지를 보낸다.
        player.emit('join_response', protocol.join_response(true));
        console.log(`${player.name} join successed`);
    }

    start() {
        for (var id in this.players) {
            // 게임 시작을 보낸다.
            this.players[id].emit('game_start', protocol.game_start());
            console.log(`Game Started`);
        }

        // 모든 플레이어가 준비 상태인지 검사한다.
        while (this.isAllReady() == false) {
            // 준비가 안되었다면 대기한다.
            sleep(10);   
        }
        
        // 모두 준비되면 호스트에게 턴을 넘긴다.
        for (var id in this.players) {
            this.players[id].emit('place_end', protocol.place_end());
        }
        console.log('Place End');
        this.host.emit('turn_start', protocol.turn_start());
        console.log(`${this.host.name}'s turn start`);
        
        // 게임이 끝날 때까지 대기한다.
        while (this.isOver == false) {
            sleep(10);
        }

        // 게임이 끝났다면 종료한다.
        for (var id in this.players ) {
            this.players[id].close();
        }
        console.log('Game Over');
    }

    checkGameOver(isOver, player) {
        // 게임이 끝났는지 확인한다.
        if (isOver) {
            let winner = player.name;
            for (var p of this.players) {
                p.emit('gameover', protocol.gameover(winner));
            }
            console.log(`The winner is ${winner}`);
        } else {
            player.oppo.emit('turn_start', protocol.turn_start());
            console.log(`${ player.oppo.name }'s turn start`);
        }

        this.isOver = isOver;
    }

    isAllReady() {
        return this.host.isReady && this.host.oppo.isReady;
    }

    sleep(ms) {
        let start = new Date().getTime();
        while (new Date().getTime() < start + ms);
    }
}
module.exports.Session=Session;