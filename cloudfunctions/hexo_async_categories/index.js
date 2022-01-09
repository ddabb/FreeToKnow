// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
//引入request-promise用于做网络请求
var rp = require('request-promise');

// 云函数入口函数
exports.main = async (event, context) => {
  let result = '';
  await rp("https://www.60points.com/api/categories.json")
    .then(function (res) {
      console.log("categories " + res);
      db.collection("hexocategories").where({
        '_id': 'fa4fe87261a316260082fd5414ceb4a7'
      }).update({
        data: {
          categories: res
        }
      });
      result += '更新hexo categories 成功';

    })
    .catch(function (err) {
      console.log("err" + err)
      result += '更新hexo categories 失败';
    });
  console.log("result" + result);
  return result;
}