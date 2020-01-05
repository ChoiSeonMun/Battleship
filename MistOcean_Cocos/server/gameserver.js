import Queue from '../assets/Common/queue';
import GameRoom from './gameroom';

class GameServer {
    constructor() {
        this.roomList = { };
        this.waitQue = new Queue();
    }

    addToList(player) {
        // 대기 큐에 플레이어를 추가한다.
        this.waitQue.enqueue(player);

        // 클라이언트에게 응답함

        // 사람이 충분하면 매칭 시킨다.
        if (this.isEnoughToPlayGame()) {
            this.match();
        }
    }

    match() {
        player1 = this.waitQue.dequeue();
        player2 = this.waitQue.dequeue();
        gameRoom = new GameRoom(player1, player2);

        // roomList에 추가한다.
        
    }

    isEnoughToPlayGame() {
        return this.waitQue.size === 2;
    }
}