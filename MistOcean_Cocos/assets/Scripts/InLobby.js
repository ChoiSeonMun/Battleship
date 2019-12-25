var socketio = require('socket.io-client');
cc.Socket=null;
var url = cc.settings.getURL();
cc.Class({
    extends: cc.Component,

    properties: {
        hostButton: {
            default: null,
            type: cc.Button,
        },
        joinButton: {
            default: null,
            type: cc.Button,
        },
        hostPanel: {
            default: null,
            type: cc.Layout,
        },
        joinPanel: {
            default: null,
            type: cc.Layout
        },
    },

    onLoad() {
        // Panel
        this.panelState = false;
        this.isHost = false;
        this.isJoin = false;
        this.hostEditBox = this.hostPanel.node.getChildByName("Host").getChildByName("Input EditBox").getComponent(cc.EditBox);
        this.joinClientEditBox = this.joinPanel.node.getChildByName("Client").getChildByName("Input EditBox").getComponent(cc.EditBox);
        this.joinHostEditBox = this.joinPanel.node.getChildByName("Host").getChildByName("Input EditBox").getComponent(cc.EditBox);
        this.hostOkButton = this.hostPanel.node.getChildByName("Ok Button").getComponent(cc.Button);
        this.hostOkButton.node.on("click", this.okClick, this);
        this.joinOkButton = this.joinPanel.node.getChildByName("Ok Button").getComponent(cc.Button);
        this.joinOkButton.node.on("click", this.okClick, this); 
        console.log(this.hostPanel.node);
        this.hostErrorLabel = this.hostPanel.node.getChildByName("Error Label").getComponent(cc.Label);
        this.joinErrorLabel = this.joinPanel.node.getChildByName("Error Label").getComponent(cc.Label);
        this.hostPanel.node.getChildByName("Close Button").on("click", this.closePanel, this);
        this.joinPanel.node.getChildByName("Close Button").on("click", this.closePanel, this);
        // Main
        this.hostButton.node.on("click", this.setHost, this);
        this.joinButton.node.on("click", this.setJoin, this);

        this.hostPanel.node.active = false;
        this.joinPanel.node.active = false;
        this.hostErrorLabel.string = "";
        this.joinErrorLabel.string = "";
    },

    setHost: function () {
        this.isHost ^= true;
        this.isJoin = false;
        this.setPanel();
    },
    setJoin: function () {
        this.isJoin ^= true;
        this.isHost = false;
        this.setPanel();
    },
    setPanel: function () {
        if (this.isHost || this.isJoin) this.onPanel();
        else this.offPanel();
    },
    onPanel: function () {
        this.panelState = true;
        if (this.isHost) {
            this.hostPanel.node.active = true;
            this.joinPanel.node.active = false;
            this.isJoin = false;
        }
        if (this.isJoin) {
            this.joinPanel.node.active = true;
            this.hostPanel.node.active = false;
            this.isHost = false;
        }
    },
    offPanel: function () {
        this.panelState = false;
        this.hostPanel.node.active = false;
        this.joinPanel.node.active = false;
    },
    okClick: function () {
        if(cc.Socket!=null&&cc.Socket.connected) return;
        this.create_socket();
        if (this.isHost) {
            if (this.hostEditBox.string == "") {
                this.hostErrorLabel.string = "이름을 입력하세요!";
                cc.Socket.disconnect();
            }
            else {
                this.hostErrorLabel.string = "";
                cc.userName=this.hostEditBox.string;
                cc.Socket.emit("host_request", cc.protocol.host_request(cc.userName));
            }
        }
        else if (this.isJoin) {
            if (this.joinHostEditBox.string == "") {
                this.joinErrorLabel.string = "상대 이름을 입력하세요!"
                cc.Socket.disconnect();
            }
            else if (this.joinClientEditBox.string == "") {
                this.joinErrorLabel.string = "이름을 입력하세요!"
                cc.Socket.disconnect();
            }
            else {
                this.joinErrorLabel.string = "";
                cc.userName=this.joinClientEditBox.string;
                cc.Socket.emit("join_request", cc.protocol.join_request(cc.userName, this.joinHostEditBox.string));
            }
        }
    },
    create_socket(){
        cc.Socket = socketio.connect(url);
        cc.Socket.on('host_response',this.host_response_handler);
        cc.Socket.on("game_start", this.game_start_handler);
        cc.Socket.on("join_response",this.join_response_handler);
        cc.Socket.on('pair_missing',this.pair_missing_handler);
    },
    host_response_handler (json)
    {
        let data=JSON.parse(json);
        console.log('host_response',data);
        if(!data.Result)
        {
            cc.Socket.disconnect();
        }
    },
    join_response_handler (json)
    {
        let data=JSON.parse(json);
        console.log('join_response',data);
        if(!data.Result)
        {
            cc.Socket.disconnect();
        }
    },
    game_start_handler()
    {
        console.log('gamestart');
        cc.director.loadScene("attacktest");
    },
    pair_missing_handler(){
        cc.Socket.disconnect();
    },
    closePanel: function () {
        this.isHost = false;
        this.isJoin = false;
        this.offPanel();
    },
});
