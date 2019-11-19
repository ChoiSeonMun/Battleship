cc.Class({
    extends: cc.Component,

    properties: {
        GameManager:{
            default:null,
            type:cc.Node
        },
        ShipCountLabel: {
            default: [],
            type: [cc.Node],
        },
        Page1:{
            default: null,
            type : cc.Node,
        },
        Page2:{
            default: null,
            type : cc.Node,
        },

        btnTrigger : true,
    },
    setShipCount:function(index,cnt){
        this.ShipCountLabel[index].getComponent(cc.Label).string=cnt;
    },
    onChangeButtonClick : function(){
        this.GameManager.getComponent("GameManager").changeContainer();
        // var anim1 = this.Page1.getComponent("page1Animation")
        // var anim2 = this.Page2.getComponent("page2Animation")

        // if(this.btnTrigger){
        //     this.GameManager.getComponent("GameManager").;
        //     this.Page1.setPosition(-884,0,0);
        //     this.Page2.setPosition(0,0,0);
        //     //anim1.ScreenOff();
        //     //anim2.ScreenOn();
        // }
        // else{
        //     this.Page1.setPosition(0,0,0);
        //     this.Page2.setPosition(884,0,0);
        //     //anim1.ScreenOn();
        //     //anim2.ScreenOff();
        // }
        // this.btnTrigger = !this.btnTrigger;
    },
    onAttackButtonClick: function () {
        this.GameManager.getComponent("GameManager").attackTarget();
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});