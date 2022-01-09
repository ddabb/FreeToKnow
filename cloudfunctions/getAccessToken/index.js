// 云函数入口文件
const cloud = require('wx-server-sdk');
const request = require('request');
const access_token = require('AccessToken');

cloud.init()


// 云函数入口函数
exports.main = async (event, context) => {

  let db = cloud.database();
  let globalinfo =   await db.collection('global').get();
  if (globalinfo.data.length) 
  {
    let info = globalinfo.data[0];
    let appid = info.appid; //微信公众号开发者id
    let secret =info.secret; //微信公众号开发者secret_key
    let token_url=info.token_url;
    console.log("appid"+appid )
    console.log("secret"+secret )
    console.log("token_url"+token_url)   //token_url配置方式 https://developers.weixin.qq.com/community/develop/article/doc/0000a673f2ca3040d32971fbe51813
    let at = new access_token({
      appid,
      secret
    });
    var result=at.getCachedWechatAccessToken(token_url);
    console.log("token的值是"+result)
    return result;
  }


}