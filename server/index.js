import SERVER_PORT from "../Common/settings.js";
import protocol from "../Common/protocol.js";

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var sessions = {};

http.listen(SERVER_PORT, () => {
  console.log(`listening on *: ${ SERVER_PORT }`);
});

io.on('connection', (socket) =>{
    // 연결 및 해제
    console.log(`${socket.id} is connected`);
    socket.on('disconnected', function() {
        console.log(`${socket.id} is disconnected`);
    });

    // 호스팅
    socket.on('host_request', (msg) => {
        // 소켓에 닉네임을 매칭한다.
        let data = JSON.parse(msg);
        socket.nickname = data.UserName;
        
        // 닉네임이 중복되는지 검사한다.
        if (sessions[socket.nickname] === undefined) {
            socket.emit('host_response', protocol.host_response(false));
            return;
        }

        sessions[socket.nickname] = new Session(socket);
        socket.emit('host_response', protocol.host_response(true));
    });

    // 조인
    socket.on('join_request', (msg) => {
        // 데이터를 분석한다.
        let data = JSON.parse(msg);
        socket.nickname = data.UserName;
        let hostName = data.HostName;

        // 해당 세션이 있는지 검사한다.
        if (sessions[hostName] === undefined) {
            socket.emit('join_response', protocol.join_response(false));
            return;
        }

        let session = sessions[hostName];
        session.join(socket);
        socket.emit('join_response', protocol.join_response(true));
    });
});
