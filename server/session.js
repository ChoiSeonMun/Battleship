import protocol from "../Common/protocol.js";

class Session {
    constructor(player) {
        // 플레이어의 id로 room을 만들어 join 시킨다.
        player.socket.join(player.id, () => {
            let rooms = Object.keys(player.socket.rooms);
            console.log(`${ player.id } is in ${ rooms }`);
        });

        // 기본 세팅한다.
        this.isGameOver = false;
        this.players = {};
        players[player.name] = player;
        this.room = hostSocket.rooms[1];
    }

    // 적군을 추가한다.
    join(opponent) {
        opponent.join(room, () => {
            let rooms = Object.keys(opponent.rooms);
            console.log(`${ opponent.id } is in ${ rooms }`);
        });

        players[opponent.nickname] = opponent;
    }

    // 게임을 시작한다.
    start() {
        for (player in players) {
            player.send('game_start', protocol.game_start());
        }
    }
}