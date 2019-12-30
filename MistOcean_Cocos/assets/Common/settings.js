//==============================================
//common settings define
//
const settings = {
    PORT: 12345,
    IP: '172.19.88.36',
    WIDTH:10,
    HEIGHT:10,
    SHIP_COUNT:[2,2,1],
    getURL(){
        return this.IP+":"+this.PORT;
    }
};
module.exports=settings;
//==============================================