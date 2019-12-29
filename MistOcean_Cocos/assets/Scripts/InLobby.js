var socketio = require('socket.io-client');
cc.Socket = null;
var url = cc.settings.getURL();
cc.Class({
    extends: cc.Component,

    properties: {
        startPanel: {
            default: null,
            type: cc.Layout,
        },
        rankPanel: {
            default: null,
            type: cc.Layout
        },
        waitPanel:{
            default:null,
            type:cc.Layout
        }
    },
    onMenuClick(event, data) {
        if(this.waitting)
            return;
        switch (data) {
            case "start":
                if (this.openedRank)
                    this.closeRankPanel();
                if (this.openedStart)
                    this.closeStartPanel();
                else
                    this.openStartPanel();
                break;
            case "rank":
                if (this.openedStart)
                    this.closeStartPanel();
                if (this.openedRank)
                    this.closeRankPanel();
                else
                    this.openRankPanel();
                break;
            default: break;
        }
    },
    onCloseClick(event, data) {
        if(this.waitting)
            return;
        switch (data) {
            case "start": this.closeStartPanel(); break;
            case "rank": this.closeRankPanel(); break;
            default: break;
        }
    },
    onSubmitClick(event, data) {
        if(this.waitting)
            return;
        switch (data) {
            case 'start': this.join_request(); break;
            case 'rank': this.closeRankPanel();break;
            default: break;
        }
    },
    onCloseWait(){
        this.closeStartPanel();
        this.closeWaitPanel();
    },
    openStartPanel() {
        this.startPanel.node.active = true;
        this.openedStart = true;
        this.create_socket();
    },
    closeStartPanel() {
        this.startPanel.node.active = false;
        this.openedStart = false;
        cc.Socket.disconnect();
    },
    openRankPanel() {
        this.rankPanel.node.active = true;
        this.openedRank = true;
    },
    closeRankPanel() {
        this.rankPanel.node.active = false;
        this.openedRank = false;
    },
    openWaitPanel(){
        this.waitPanel.node.active = true;
        this.openedWait = true;
    },
    closeWaitPanel(){
        this.waitPanel.node.active = false;
        this.openedWait = false;
        this.waitting=false;
    },
    join_request() {
        let nickname = this.startPanel.node.getChildByName("nickname").getChildByName("input").getChildByName("nickname").getComponent(cc.Label).string;
        if (nickname == "") {
            this.startErrorLabel.string = "이름을 입력하세요!";
            return;
        }
        this.startErrorLabel.string = "";
        cc.nickname=nickname;
        cc.Socket.on('join_response',this.join_response_handler);
        cc.Socket.emit("join_request", cc.protocol.join_request(nickname));
        this.waitting=true;
    },
    onLoad() {
        cc.Lobby=this;
        this.openedStart = false;
        this.openedRank = false;
        this.poenedWait=false;
        this.waitting=false;
        this.startPanel.node.active = false;
        this.rankPanel.node.active = false;
        this.waitPanel.node.active = false;
        this.startErrorLabel=this.startPanel.node.getChildByName("error").getComponent(cc.Label);
    },
    create_socket() {
        cc.Socket = socketio.connect(url);
    },
    waitMatching(){
        this.openWaitPanel();
    },
    gameStart(enermyname){
        cc.enermyName=enermyname;
        cc.Socket.off('join_response',this.join_response_handler);
        cc.Socket.on('pair_missing',this.pair_missing_handler);
        cc.director.loadScene("GameScene");
    },
    joinFailure(msg){
        switch(msg){
            case 'duplicate': this.startErrorLabel.string="중복된 이름입니다.";break;
            default:break;
        }
        cc.Socket.off('join_response',this.join_response_handler);
        cc.Lobby.waitting=false;
    },
    join_response_handler(json) {
        let data = JSON.parse(json);
        switch(data.type){
            case cc.JoinEventType.Wait:cc.Lobby.waitMatching();break;
            case cc.JoinEventType.Start:cc.Lobby.gameStart(data.info);break;
            case cc.JoinEventType.Failure:cc.Lobby.joinFailure(data.info);break;
            default:break;
        }
    },
    pair_missing_handler() {
        console.log('pair missing');
        cc.Socket.disconnect();
        cc.director.loadScene("Lobby");
    },
});
