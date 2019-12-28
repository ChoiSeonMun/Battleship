//module import----------------------//
const protocol = require("../assets/Common/protocol").protocol;
const types=require("../assets/Common/types");
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
var user_names = {};
var wait_queue=[];
//-----------------------------------//
//event handler----------------------//
socketio.on('connection', function (socket) {
    console.log('connect:', socket.id);

    socket.on('join_request', (msg) => {
        let nickname = JSON.parse(msg).nickname;
        console.log(`${nickname} join request`);

        if (user_names[nickname] != undefined) {
            socket.emit('join_response', protocol.join_response(types.JoinEventType.Failure,"duplicate"));
            console.log(`${nickname} is Duplicate`);
            return;
        }

        user_names[nickname] = socket.id;
        socket.nickname = nickname;
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

        let shipInfos=JSON.parse(msg);
        socket.isReady = true;
        console.log(`${socket.UserName} is ready`);

        console.log(`${socket.UserName} : place_response`);
        socket.emit('enermy_ready');//
        socket.emit('place_response', protocol.place_response(0,0));//
        console.log(`${socket.UserName} : start_event`);
        socket.emit('start_event');//
        console.log(`${socket.UserName} : turn_start`);
        socket.emit('turn_start');//
    });
    socket.on('attack_request', (msg) => {
        //socket.Pair.emit('attack_forward',msg);
        console.log(`${socket.UserName}'s attack start`,msg);
        socket.emit('attack_response');
    });

    socket.on('disconnect', function () {
        if (socket.pair != undefined) {
            let pairid=user_names[socket.pair];
            if (pairid != undefined)
                findById(pairid).emit('pair_missing', '');
        }
        delete user_names[socket.nickname];
        wait_queue.splice(wait_queue.indexOf(socket.id),1);
        console.log('disconnect:', socket.id);
    })


});