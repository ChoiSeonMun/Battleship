class Player {
    constructor(sock, name) {
        this.ID = sock.id;
        this.name = name;
        this.isReady = false;
        this.socket = sock;
        this.oppo = undefined;
        this.session = undefined;

        sock.player = this;
    }

    on(event, callback) {
        this.socket.on(event, callback);
    }

    emit(event, msg) {
        this.socket.emit(event, msg);
    }

    join(sessonID) {
        this.socket.join(sessionID, () => {
            this.session = sessionID;
            console.log(`${ player.sessionID } is in ${ sessionID }`);
        });
    }

    close() {
        setTimeout(() => this.socket.disconnect(true), 5000);
    }
}
module.exports.Player=Player;