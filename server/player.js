class Player {
    constructor(sock, name) {
        this.id = sock.id;
        this.name = sock.nickname;
        this.isReady = false;
        this.socket = sock;
    }
}