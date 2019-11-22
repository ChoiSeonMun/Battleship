const protocol = {
    host_request: function(userName) {
        return JSON.stringify({ UserName: userName });
    },

    host_response: function(result) {
        return JSON.stringify({ Result: result});
    },

    join_request: function(userName, hostName) {
        return JSON.stringify({ UserName: userName, HostName: hostName });
    },

    join_response: function(result) {
        return JSON.stringify({ Result: result });
    },

    game_start: function() {
        return "";
    },

    attack_request: function(pos) {
        return JSON.stringify( { Position: pos });
    },

    attack_forward: function(pos) {
        return pos;
    },

    attack_result: function(changedTile, tileType, bigShip, middleShip, smallShip) {
        return JSON.stringify({
            Tiles: {
                Changed: changedTile,
                Type: tileType
            },
            ShipCount: {
                Big: bigShip,
                Middle: middleShip,
                Small: smallShip
            }
        });
    },

    attack_response: function(msg) {
        return msg;
    },

    turn_end: function(isGameOver) {
        return JSON.stringify({ IsGameOver: isGameOver });
    },

    turn_start: function() {
        return "";
    },

    gameover: function(winner) {
        return JSON.stringify({ Winner: winner });
    },

    place_done: function() {
        return "";
    }

}