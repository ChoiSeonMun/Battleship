//==============================================
//공통 설정값 정의
//
const settings = {
    PORT: 12345,
    IP: '172.19.82.24',
    getURL(){
        return this.IP+":"+this.PORT;
    }
};
cc.settings=settings;
module.exports.settings=settings;
//==============================================