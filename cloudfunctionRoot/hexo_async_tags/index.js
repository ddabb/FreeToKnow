// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
//引入request-promise用于做网络请求
var rp = require('request-promise');

// 云函数入口函数
exports.main = async (event, context) => {
    let result = ''
    await rp("https://www.60points.com/api/tags.json")
        .then(function (res) {
            console.log("tags " + res);
            db.collection("hexotags").where({
                '_id': 'fa4fe87261a315850082e64e7d58dfd1'
            }).update({
                data: {
                    tags: res
                }
            });
            result += '更新hexo tags 成功';
        })
        .catch(function (err) {
            console.log("err" + err)
            result += '更新hexo tags 失败';
        });
    console.log("result" + result);
    return result;
}