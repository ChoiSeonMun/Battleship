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
        panel: {
            default: null,
            type: cc.Layout,
        },
    },

    onLoad () {
        // 패널
        this.panelState = false;
        this.isHost = false;
        this.isJoin = false;
        this.panelName = this.panel.node.getChildByName("PanelName Label").getComponent(cc.Label);
        this.editBox = this.panel.node.getChildByName("Input EditBox").getComponent(cc.EditBox);
        this.okButton = this.panel.node.getChildByName("Ok Button").getComponent(cc.Button);
        this.okButton.node.on("click", this.okClick, this);
        this.inputLabel = this.panel.node.getChildByName("Input Label").getComponent(cc.Label);
        this.panel.node.getChildByName("Close Button").on("click", this.closePanel, this);

        // 메인 버튼
        this.hostButton.node.on("click", this.setHost, this);
        this.joinButton.node.on("click", this.setJoin, this);
    },

    setHost: function () {
        this.panelName.string = "Host";
        this.isHost ^= true;
        this.isJoin = false;
        this.setPanel();
    },
    setJoin: function () {
        this.panelName.string = "Join";
        this.isJoin ^= true;
        this.isHost = false;
        this.setPanel();
    },
    setPanel: function(){
        console.log("set");
        if (this.isHost || this.isJoin) this.onPanel();
        else this.offPanel();
    },
    onPanel: function () {
        console.log("on");
        if (!this.panelState) {
            this.panelState = true;
            this.panel.node.active = true;
        }
    },
    offPanel: function () {
        console.log("off");
        this.panelState = false;
        this.panel.node.active = false;
    },
    okClick: function() {
        console.log("click");
        if (this.editBox.string != "")
            this.inputLabel.string = "Input : " + this.editBox.string;
        else
            this.inputLabel.string = "";
    },
    closePanel: function(){
        this.isHost = false;
        this.isJoin = false;
        this.offPanel();
    },


    TestFunc: function(){
        console.log("TestFunc()");
    }
});
