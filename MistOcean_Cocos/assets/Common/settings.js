//==============================================
//공통 설정 정의
//
const settings = {
    PORT: 12345,
    IP: '211.57.241.220',//'172.19.88.42',
    WIDTH: 10,
    HEIGHT: 20,
    SHIP_COUNT: [2, 2, 1],
    getURL() {
        return this.IP + ":" + this.PORT;
    }
};
module.exports = settings;
//==============================================