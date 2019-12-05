//module import----------------------//
const protocol = require("../assets/Common/protocol").protocol;
var io = require('socket.io');
var http = require('http');
var express = require('express');
var cors = require('cors');
//-----------------------------------//
//create server----------------------//
var app = express();
app.use(cors());
app.set('port', process.env.PORT || 12345);
var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('express start:', app.get('port'));
});
var socketio = io.listen(server);
console.log('socket start');
//-----------------------------------//
//declare variable-------------------//
var user_names = {};
//-----------------------------------//
//event handler----------------------//
socketio.on('connection', function (socket) {
    console.log('connect:', socket.id);

    socket.on('host_request', (msg) => {
        // 메시지를 파싱한다.
        let data = JSON.parse(msg);

        if (user_names[data.UserName] != undefined) {
            socket.emit('host_response', protocol.host_response(false));
            console.log(`${data.UserName} host failed`);
            return;
        }

        user_names[data.UserName] = socket.id;
        socket.UserName = data.UserName;
        socket.Wait = true;
        socket.isHost = true;
        socket.emit('host_response', protocol.host_response(true));
        console.log(`${socket.UserName} host successed`);
    });

    // 조인
    socket.on('join_request', (msg) => {
        // 데이터를 분석한다.
        let data = JSON.parse(msg);
        var hostid = user_names[data.HostName];
        var host = hostid === undefined ? null : socketio.sockets.connected[hostid];
        if (user_names[data.UserName] !== undefined
            || host == null || !host.Wait) {
            socket.emit('join_response', protocol.join_response(false));
            console.log(`${data.UserName} join failed`);
            return;
        }
        user_names[data.UserName] = socket.id;
        socket.UserName = data.UserName;
        socket.PairName = data.HostName;
        socket.wait = false;
        socket.isHost = false;
        host.PairName = data.UserName;
        host.Pair = socket;
        socket.Pair = host;
        host.wait = false;


        socket.emit('join_response', protocol.join_response(true));
        console.log(`${socket.UserName} join successed`);
        // 게임을 시작한다.
        socket.emit('game_start', protocol.game_start());
        host.emit('game_start', protocol.game_start());
        console.log('game start');
    });
    socket.on('place_done', (msg) => {

        socket.isReady = true;
        console.log(`${socket.UserName} is ready`);

        if (socket.Pair.isReady) {
            socket.emit('place_end', protocol.place_end());
            socket.Pair.emit('place_end', protocol.place_end());
            if (socket.Pair.isHost)
                socket.Pair.emit('turn_start', protocol.turn_start());
            else
                socket.emit('turn_start', protocol.turn_start());
            console.log('place end');
        }

    });
    socket.on('attack_request', (msg) => {
        socket.Pair.emit('attack_forward',msg);
        console.log(`${socket.UserName}'s attack start`,msg);
    });
    socket.on('attack_result', (msg) => {
        socket.Pair.emit('attack_response', msg);
        console.log(`${socket.PairName}'s attack end`,msg);
    });
    socket.on('turn_end', (msg) => {
        // 게임이 끝났는지 확인한다.
        let json = JSON.parse(msg);
        if (json.IsGameOver) {
            let winner = socket.PairName;
            socket.Pair.emit('gameover', protocol.gameover(winner));
            console.log(`The winner is ${winner}`);
        } else {
            socket.Pair.emit('turn_start', protocol.turn_start());
            console.log(`${socket.PairName}'s turn started`);
        }

        socket.isGameOver = json.IsGameOver;
    });

    socket.on('disconnect', function () {
        if (socket.PairName != undefined) {
            if (user_names[socket.PairName] != undefined)
                socket.Pair.emit('pair_missing', '');
        }
        delete user_names[socket.UserName];
        console.log('disconnect:', socket.id);
    })


});