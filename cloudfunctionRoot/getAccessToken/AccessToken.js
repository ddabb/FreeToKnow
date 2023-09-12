const cloud = require('wx-server-sdk')
const request = require('request')
class AccessToken {
    constructor({
        appid,
        secret
    }) {
        this.appid = appid
        this.secret = secret
    }
    // 获取公众号access_token

    async getWechatAccessToken(token_url) {
        const rp = options =>
            new Promise((resolve, reject) => {
                request(options, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(response);
                });
            });
        const result = await rp({
            url: token_url,
            method: 'GET'
        });
        return (typeof result.body === 'object') ? result.body : JSON.parse(result.body);;
    }

    // 获取保存在数据库的公众号access_token
    async getCachedWechatAccessToken(token_url) {
        cloud.init();
        let db = cloud.database();
        let _this = this;
        let collection = 'wx-access-token'; //数据库集合名称
        let gapTime = 300000; // 5 分钟
        let result = await db.collection(collection).get();

        // 数据库没有，获取token添加到数据库
        if (!result.data.length) {
            let accessTokenBody = await _this.getWechatAccessToken(token_url);
            let obj = JSON.parse(accessTokenBody)
            let act = obj.access_token;
            let ein = obj.expires_in * 1000;
            await db.collection(collection).add({
                accessToken: act,
                expiresIn: ein,
                createTime: Date.now()
            });
            return act;
        } else {
            // 数据库中存在token
            let data = result.data[0];
            let {
                _id,
                accessToken,
                expiresIn,
                createTime
            } = data;
            // 判断access_token是否有效
            if (Date.now() < createTime + expiresIn - gapTime) {
                return accessToken;
            }
            // 失效，重新获取，更新token数据
            else {
                let accessTokenBody = await _this.getWechatAccessToken(token_url);

                let obj = JSON.parse(accessTokenBody)
                let act = obj.access_token;
                let ein = obj.expires_in * 1000;

                await db.collection(collection).where({
                    '_id': _id
                }).update({
                    data: {
                        accessToken: act,
                        expiresIn: ein,
                        createTime: Date.now()
                    }
                });
                return accessTokenBody.access_token;
            }
        }
    }
}
module.exports = AccessToken