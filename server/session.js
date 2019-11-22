const protocol = require('../Common/protocol.js').protocol;

class Session {
    constructor(player) {
        // 플레이어의 id로 room을 만들어 join 시킨다.
        player.socket.join(player.id, () => {
            let rooms = Object.keys(player.socket.rooms);
            console.log(`${ player.id } is in ${ rooms }`);
        });

        // 기본 세팅한다.
        this.players = [];
        this.host = player;
        this.room = player.id;

        this.players.push(player);
    }

    // 적군을 추가한다.
    join(player) {
        // 적군을 조인시킨다.
        player.socket.join(this.room, () => {
            let rooms = Object.keys(player.socket.rooms);
            console.log(`${ player.id } is in ${ rooms }`);
        });

        // 정보를 설정한다.
        this.host.oppo = player;
        player.oppo = this.host;
        this.players.push(player);

        player.socket.emit('join_response', protocol.join_response(true));
        console.log(`${player.name} join successed`);
    }

    // 게임을 시작한다.
    start() {
        for (var player of this.players) {
            // 게임 시작을 보낸다.
            player.socket.emit('game_start', protocol.game_start());
            console.log(`Game Started`);
        }
        
        for (var player of this.players) {
            // 배치
            player.socket.on('place_done', (msg) => {
                player.isReady = true;
                console.log(`${player.name} is ready`);

                // 모든 플레이어가 준비 상태인지 검사
                let isAllReady = true;
                for (var player of this.players) {
                    isAllReady = isAllReady && player.isReady;
                }
                
                // 모두 준비되면 호스트에게 턴을 넘긴다.
                if (isAllReady) {
                    this.host.socket.emit('turn_start', protocol.turn_start());
                    console.log(`${this.host.name}'s turn start`);
                }
            });

            // 공격
            player.socket.on('attack_request', (msg) => {
                player.oppo.socket.emit('attack_forward', protocol.attack_forward(msg));
                console.log(`${player.name}'s attack start`);
            });
            player.socket.on('attack_result', (msg) => {
                player.oppo.socket.emit('attack_response', protocol.attack_result(msg));
                console.log(`${player.name}'s attack end`);
            });
            
            // 턴 종료
            player.socket.on('turn_end', (msg) => {
                // 게임이 끝났는지 확인한다.
                let json = JSON.parse(msg);
                if (json.isGameOver) {
                    let winner = player.name;
                    for (var player of this.players) {
                        player.socket.emit('gameover', protocol.gameover(winner));
                    }

                    console.log(`The winner is ${winner}`);
                }
            });
        }
    }
}
module.exports.Session=Session;