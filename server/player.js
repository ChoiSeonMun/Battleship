class Player {
    constructor(sock, name) {
        this.id = sock.id;
        this.name = name;
        this.isReady = false;
        this.socket = sock;
        this.oppo = undefined;
    }
}
module.exports.Player=Player;