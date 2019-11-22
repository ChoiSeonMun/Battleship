const settings = require("../Common/settings").settings;
const protocol = require("../Common/protocol").protocol;

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var sessions = {};

http.listen(settings.PORT, () => {
  console.log(`listening on *: ${ settings.PORT }`);
});

io.on('connection', (socket) =>{
    // 연결 및 해제
    console.log(`${socket.id} is connected`);
    socket.on('disconnected', function() {
        console.log(`${socket.id} is disconnected`);
    });

    // 호스팅
    socket.on('host_request', (msg) => {
        // 플레이어를 생성한다.
        let data = JSON.parse(msg);
        var player = new Player(socket, data.UserName);
        
        // 세션의 유무를 체크한다.
        if (sessions[player.nickname] === undefined) {
            socket.emit('host_response', protocol.host_response(false));
            console.log(`${player.name} host failed`);
            return;
        }

        sessions[player.nickname] = new Session(player);
        socket.emit('host_response', protocol.host_response(true));
        console.log(`${player.name} host successed`);
    });

    // 조인
    socket.on('join_request', (msg) => {
        // 데이터를 분석한다.
        let data = JSON.parse(msg);
        var player = new Player(socket, data.UserName);
        let hostName = data.HostName;

        // 해당 세션이 있는지 검사한다.
        if (sessions[hostName] === undefined) {
            socket.emit('join_response', protocol.join_response(false));
            console.log(`${player.name} join failed`);
            return;
        }

        // 해당 세션에 클라이언트를 추가한다.
        let session = sessions[hostName];
        session.join(player);
        socket.emit('join_response', protocol.join_response(true));
        console.log(`${player.name} join successed`);
        
        // 게임을 시작한다.
        session.start();
    });
});
