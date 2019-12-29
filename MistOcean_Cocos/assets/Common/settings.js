//==============================================
//common settings define
//
const settings = {
    PORT: 12345,
    IP: '211.57.241.220',
    getURL(){
        return this.IP+":"+this.PORT;
    }
};
module.exports.settings=settings;
//==============================================