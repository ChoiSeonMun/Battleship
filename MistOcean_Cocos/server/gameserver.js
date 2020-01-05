let Queue = require('../assets/Common/queue');
let GameRoom = require('./gameroom');
let Player = require('../assets/Common/class/player');
let PROTOCOLS = require('../assets/Common/protocol');

class GameServer {
    constructor() {
        this.roomList;
        this.waitQue;
        this.http;
        this.io;
    }

    /**
     * 서버를 초기화한다.
     */
    initialize() {
        this.roomList = { };
        this.waitQue = new Queue();

        let app = require('express')();
        this.http = require('http').createServer(app);
        this.io = require('socket.io')(this.http);

        console.log('Server Initialized');
    }

    /**
     * 서버를 시작한다.
     * @param {Number} port 포트 번호
     */
    start(port) {
        console.log('Server Started');

        // 대기한다.
        this.http.listen(port, function() {
            console.log(`Listening on *: ${port}`);
        });

        this.io.on('connection', function(socket) {
            console.log(`A user connected : ${socket.id}`);
            
            socket.on('disconnect', function() {
                console.log(`A user diconnected : ${socket.id}`);
            });

            socket.on('joinRequest', function(message) {
                console.log(`${socket.id} requested to join`);

                // 메세지를 분석한다.
                let parsedMessage = JSON.parse(message);
                
                // 플레이어 객체를 생성한다.
                let player = new Player(socket, parsedMessage.nickname);

                // 플레이어를 대기 큐에 넣는다.
                this.addToList(player);
            })
        });
    }

    addToList(player) {
        // 대기 큐에 플레이어를 추가한다.
        this.waitQue.enqueue(player);
        console.log(`${player.socket.id} is added to waitQue`);

        // 클라이언트에게 응답함
        player.socket.emit('joinResponse', protocols.joinResponse());
        console.log(`Responded to ${socket.id} for join`);

        // 사람이 충분하면 매칭 시킨다.
        if (this.isEnoughToPlayGame()) {
            this.match();
        }
    }

    match() {
        // GameRoom을 만든다.
        let player1 = this.waitQue.dequeue();
        let player2 = this.waitQue.dequeue();
        let gameRoom = new GameRoom(player1, player2);

        // roomList에 추가한다.
        this.roomList[`${player1.socket.id}`] = gameRoom;
        this.roomList[`${player2.socket.id}`] = gameRoom;

        // 게임을 시작한다.
        gameRoom.start();
    }

    isEnoughToPlayGame() {
        return this.waitQue.size === 2;
    }
}

module.exports = GameServer;
