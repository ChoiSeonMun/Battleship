let GameServer = require('./gameserver');
let settings = require('../assets/Common/settings');

server = new GameServer();

server.initialize();
server.start(settings.PORT);