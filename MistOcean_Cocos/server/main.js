//module import----------------------//
const protocol = require("../assets/Common/protocol").protocol;
const types=require("../assets/Common/types");
const logic=require("./logic").logic;
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
var findById=function(id){ 
    return socketio.sockets.connected[id];
}
console.log('socket start');
//-----------------------------------//
//declare variable-------------------//
var users = {};
var wait_queue=[];
//-----------------------------------//
//event handler----------------------//
socketio.on('connection', function (socket) {
    console.log('connect:', socket.id);

    socket.on('join_request', (msg) => {
        let nickname = JSON.parse(msg).nickname;
        console.log(`${nickname} join request`);

        if (users[nickname] != undefined) {
            socket.emit('join_response', protocol.join_response(types.JoinEventType.Failure,"duplicate"));
            console.log(`${nickname} is Duplicate`);
            return;
        }

        users[nickname] = socket.id;
        socket.nickname = nickname;
        socket.ready=false;

        if(wait_queue.length!=0){
            let pairId=wait_queue.shift();
            let pair=findById(pairId);
            socket.pair=pair.nickname;
            pair.pair=nickname;
            console.log(`${nickname}, ${pair.nickname} : start`);
            socket.emit('join_response', protocol.join_response(types.JoinEventType.Start,pair.nickname));
            pair.emit('join_response', protocol.join_response(types.JoinEventType.Start,nickname));
        }
        else{
            wait_queue.push(socket.id);
            console.log(`${nickname} : wait`);
            socket.emit('join_response', protocol.join_response(types.JoinEventType.Wait));
        }
    });
    socket.on('place_done', (msg) => {
        let pair=findById(users[socket.pair]);
        let shipInfos=JSON.parse(msg);

        socket.ready = true;
        console.log(`${socket.nickname} : place done`);
        socket.emit('place_response', protocol.place_response(0,0));
        if(pair.ready){
            socket.emit('start_event');
            pair.emit('start_event');
            pair.emit('turn_event');
            console.log(`${socket.nickname}, ${pair.nickname} : start`);
            console.log(`${pair.nickname} : turn start`);
        }
        else
             pair.emit('enermy_ready');
    });
    socket.on('attack_request', (msg) => {
        //socket.Pair.emit('attack_forward',msg);
        let pair=findById(users[socket.pair]);
        console.log(`${socket.nickname} : attack request`);
        socket.emit('attack_response');
        pair.emit('attack_event','');
        pair.emit('turn_event');
    });

    socket.on('disconnect', function () {
        if (socket.pair != undefined) {
            let pairid=users[socket.pair];
            if (pairid != undefined)
                findById(pairid).emit('pair_missing', '');
        }
        delete users[socket.nickname];
        wait_queue.splice(wait_queue.indexOf(socket.id),1);
        console.log('disconnect:', socket.id);
    })
});
//-----------------------------------//