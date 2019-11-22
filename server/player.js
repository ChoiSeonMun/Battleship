class Player {
    constructor(sock) {
        this.ID = sock.id;
        this.name = name;
        this.isReady = false;
        this.socket = sock;
        this.oppo = undefined;
        this.session = undefined;
    }

    on(event, callback) {
        this.socket.on(event, callback);
    }

    emit(event, msg) {
        this.socket.emit(event, msg);
    }

    join(session) {
        this.socket.join(session.ID, () => {
            this.session = session.ID;
            console.log(`${ player.ID } is in ${ session.ID }`);
        });
    }

    close() {
        setTimeout(() => this.socket.disconnect(true), 5000);
    }
}
module.exports.Player=Player;