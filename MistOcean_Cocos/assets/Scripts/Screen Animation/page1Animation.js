cc.Class({
    extends: cc.Component,

    properties: {
        animation :{
            default : null,
            type : cc.Animation
        }
    },

    onLoad: function(){
        var animation = this.animation;

        animation.on('Off',  this.ScreenOff,  this);
        animation.on('On', this.ScreenOn, this);
    },

    ScreenOff:function(){
        this.animation.play('PlayerScreen_Off');
    },

    ScreenOn: function(){
        this.animation.play('PlayerScreen_On');
    }
});
