class Session {
    constructor(hostSocket) {
        hostSocket.join(hostSocket.id, () => {
            let rooms = Object.keys(hostSocket.rooms);
            console.log(`${ hostSocket.id } is in ${ rooms }`);
        });

        this.isGameOver = false;
        this.players = {
            host: hostSocket,
            opponent: undefined
        };
        this.room = hostSocket.rooms[1];
    }

    join(opponent) {
        opponent.join(room, () => {
            let rooms = Object.keys(opponent.rooms);
            console.log(`${ opponent.id } is in ${ rooms }`);
        });

        players.opponent = opponent;
    }
}