cc.Class({
    extends: cc.Component,

    properties: {
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

    onLoad: function(){
        
    },

    onButtonClick : function(){
        var anim1 = this.Page1.getComponent("page1Animation")
        var anim2 = this.Page2.getComponent("page2Animation")

        if(this.btnTrigger){
            anim1.ScreenOff();
            anim2.ScreenOn();
        }
        else{
            anim1.ScreenOn();
            anim2.ScreenOff();
        }
        this.btnTrigger = !this.btnTrigger;
    },
    // update (dt) {},
});
