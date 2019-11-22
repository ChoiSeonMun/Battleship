var socketio=require('socket.io-client');
var url='http://127.0.0.1:12345';
cc.Socket=socketio.connect(url);
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

    onLoad () {
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
        this.hostInputLabel = this.hostPanel.node.getChildByName("Host").getChildByName("Name Label").getComponent(cc.Label);
        this.joinInputLabel = this.joinPanel.node.getChildByName("Client").getChildByName("Name Label").getComponent(cc.Label);
        this.hostPanel.node.getChildByName("Close Button").on("click", this.closePanel, this);
        this.joinPanel.node.getChildByName("Close Button").on("click", this.closePanel, this);
        //socket event
        cc.Socket.on('host_response',this.host_response_handler);
        cc.Socket.on("game_start", cc.protocol.join_response);
        cc.Socket.on("game_start", cc.protocol.join_response);
        // Main
        this.hostButton.node.on("click", this.setHost, this);
        this.joinButton.node.on("click", this.setJoin, this);
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
    setPanel: function(){
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
    okClick: function() {
        if(this.isHost)
        {
            if (this.hostEditBox.string != "") {
            var text = "Input : " + this.hostEditBox.string;
            this.hostInputLabel.string = text;
            cc.Socket.emit("host_request", cc.protocol.host_request(this.hostEditBox.string));
            }
        }
        else if(this.isJoin)
        {
            if(this.joinClientEditBox != "" && this.joinHostEditBox != "")
            {
                // this.hostInputLabel.string = text;    
                // this.joinInputLabel.string = text;
                cc.Socket.emit("join_request", cc.protocol.join_request(this.joinClientEditBox.string, this.joinHostEditBox.string));
            }
        }
        
        else {
            if (this.isHost) this.hostInputLabel.string = "";
            else if (this.isJoin) this.joinInputLabel.string = "";
        }
    },
    host_response_handler (Res_data)
    {
        console.log('host_response');
        if(Res_data.Result)
        {
        }
    },
    join_response_handler (Res_data)
    {
        if(Res_data.Result)
        {
        }
    },
    game_start_handler()
    {
        cc.director.loadScene("attacktest");
    },
    closePanel: function(){
        this.isHost = false;
        this.isJoin = false;
        this.offPanel();
    },
});
