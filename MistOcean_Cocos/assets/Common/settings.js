const settings = {
    PORT: 12345,
    IP: '172.19.82.24',
    getURL(){
        return this.IP+":"+this.PORT;
    }
};
module.exports.settings=settings;