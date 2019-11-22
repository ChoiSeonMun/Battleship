import protocol from "../Common/protocol.js";

class Session {
    constructor(player) {
        // 플레이어의 id로 room을 만들어 join 시킨다.
        player.socket.join(player.id, () => {
            let rooms = Object.keys(player.socket.rooms);
            console.log(`${ player.id } is in ${ rooms }`);
        });

        // 기본 세팅한다.
        this.players = {};
        this.host = player;
        this.room = hostSocket.rooms[1];

        this.players[player.name] = player;
    }

    // 적군을 추가한다.
    join(opponent) {
        // 적군을 조인시킨다.
        opponent.join(room, () => {
            let rooms = Object.keys(opponent.rooms);
            console.log(`${ opponent.id } is in ${ rooms }`);
        });

        // 정보를 설정한다.
        this.host.oppo = opponent;
        opponent.oppo = host;
        this.players[opponent.nickname] = opponent;
    }

    // 게임을 시작한다.
    start() {
        for (player in this.players) {
            // 게임 시작을 보낸다.
            player.sock.send('game_start', protocol.game_start());
            
            // 배치
            player.sock.on('place_done', (msg) => {
                player.isReady = true;
                console.log(`${player.name} is ready`);

                // 모든 플레이어가 준비 상태인지 검사
                let isAllReady = true;
                for (player in this.players) {
                    isAllReady = isAllReady && player.isReady;
                }
                
                // 모두 준비되면 호스트에게 턴을 넘긴다.
                if (isAllReady) {
                    this.host.sock.emit('turn_start', protocol.turn_start());
                    console.log(`${this.host.name}'s turn start`);
                }
            });

            // 공격
            player.sock.on('attack_request', (msg) => {
                player.oppo.sock.emit('attack_forward', protocol.attack_forward(msg));
                console.log(`${player.name}'s attack start`);
            });
            player.sock.on('attack_result', (msg) => {
                player.oppo.sock.emit('attack_response', protocol.attack_result(msg));
                console.log(`${player.name}'s attack end`);
            });
            
            // 턴 종료
            player.sock.on('turn_end', (msg) => {
                // 게임이 끝났는지 확인한다.
                let json = JSON.parse(msg);
                if (json.isGameOver) {
                    let winner = player.name;
                    for (player in this.players) {
                        player.sock.emit('gameover', protocol.gameover(winner));
                    }

                    console.log(`The winner is ${winner}`);
                }
            });
        }
    }
}