//module import----------------------//
const protocol = require("../Common/protocol").protocol;
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
        socket.isHost=true;
        socket.emit('host_response', protocol.host_response(true));
        console.log(`${socket.UserName} host successed`);
    });

    // 조인
    socket.on('join_request', (msg) => {
        // 데이터를 분석한다.
        let data = JSON.parse(msg);
        var hostid = user_names[data.HostName];
        var host = hostid === undefined ? null : socketio.sockets.connected[hostid];
        if(user_names[data.UserName]!==undefined
            ||host==null||!host.Wait){
            socket.emit('join_response', protocol.join_response(false));
            console.log(`${data.UserName} join failed`);
            return;
        }
        user_names[data.UserName]=socket.id;
        socket.UserName=data.UserName;
        socket.PairName=data.HostName;
        socket.wait=false;
        socket.isHost=false;
        host.PairName=data.UserName;
        host.wait=false;

        
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

        var pair = socketio.sockets.connected[user_names[socket.PairName]];
        if(pair.isReady){
            socket.emit('place_end', protocol.place_end());
            pair.emit('place_end', protocol.place_end());
            if(pair.isHost)
                pair.emit('turn_start', protocol.turn_start());
            else
                socket.emit('turn_start', protocol.turn_start());
            console.log('place end');
        }
        
    });

    socket.on('disconnect', function () {
        if (socket.pairname != undefined) {
            if (user_names[socket.pairname] != undefined)
                socketio.sockets.connected[user_names[socket.pairname]].emit('pairmissing', '');
        }
        delete user_names[socket.username];
        console.log('disconnect:', socket.id);
    })


});
//-----------------------------------//

/*

const settings = require("../Common/settings").settings;
const protocol = require("../Common/protocol").protocol;
const Player = require('./Player').Player;
const Session = require('./Session').Session;
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io');
var sessions = {};
var players = {};
var a = io.so
http.listen(settings.PORT, () => {
    console.log(`listening on *: ${settings.PORT}`);
});

io.on('connection', (socket) => {
    // 연결 및 해제
    console.log(`${socket.id} is connected`);
    socket.on('disconnected', function () {
        console.log(`${socket.id} is disconnected`);
    });

    // 호스팅
    socket.on('host_request', (msg) => {
        // 메시지를 파싱한다.
        let data = JSON.parse(msg);
        var player = new Player(socket, data.UserName);
        players[socket.id] = player;

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




});
*/