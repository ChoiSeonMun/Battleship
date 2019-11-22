const settings = require("../Common/settings").settings;
const protocol = require("../Common/protocol").protocol;
const Player=require('./Player').Player;
const Session=require('./Session').Session;
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var sessions = {};

http.listen(settings.PORT, () => {
  console.log(`listening on *: ${ settings.PORT }`);
});

io.on('connection', (socket) =>{
    // 플레이어 객체를 생성한다.
    player = new Player(socket);

    // 연결 및 해제
    console.log(`${socket.id} is connected`);
    player.on('disconnected', function() {
        console.log(`${socket.id} is disconnected`);
    });

    // 호스팅
    player.on('host_request', (msg) => {
        // 메시지를 파싱한다.
        let data = JSON.parse(msg);
        player.name = data.UserName;
        
        // 세션이 있다면 호스팅을 할 수 없다.
        if (sessions[player.name] !== undefined) {
            player.emit('host_response', protocol.host_response(false));
            console.log(`${player.name} host failed`);
            return;
        }

        // 세션을 생성한다.
        sessions[player.name] = new Session(player);
        player.emit('host_response', protocol.host_response(true));
        console.log(`${player.name} host successed`);
    });

    // 조인
    player.on('join_request', (msg) => {
        // 데이터를 분석한다.
        let data = JSON.parse(msg);
        player.name = data.UserName;
        let hostName = data.HostName;

        // 해당 세션이 있는지 검사한다.
        if (sessions[hostName] === undefined) {
            player.emit('join_response', protocol.join_response(false));
            console.log(`${player.name} join failed`);
            return;
        }

        // 해당 세션에 클라이언트를 추가한다.
        let session = sessions[hostName];
        session.join(player);
        
        // 게임을 시작한다.
        session.start();
    });

    // 배치
    player.on('place_done', (msg) => {
        player.isReady = true;
        player.session.setReady(player);
        console.log(`${player.name} is ready`);
    });

    // 공격
    player.on('attack_request', (msg) => {
        player.oppo.emit('attack_forward', protocol.attack_forward(msg));
        console.log(`${player.name}'s attack start`);
    });
    player.on('attack_result', (msg) => {
        player.oppo.emit('attack_response', protocol.attack_result(msg));
        console.log(`${player.name}'s attack end`);
    });
    
    // 턴 종료
    player.on('turn_end', (msg) => {
        // 게임이 끝났는지 확인한다.
        let json = JSON.parse(msg);
        player.session.checkGameOver(json.IsGameOver, player);
    });
});
