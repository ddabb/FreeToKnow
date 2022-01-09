var util = require('../../util.js')
var app = getApp();
Page({
  data: {
    articleSrc: "",
    options: "",
    articletitle: "",
    shareTempimageUrl: ""
  },
  onLoad: function (input) {
    var str = decodeURIComponent(decodeURIComponent(input.obj));
    var jsonObj = JSON.parse(str)
    this.setData({
      options: jsonObj
    })

    if (jsonObj.useimage && jsonObj.imageurl != undefined && jsonObj.imageurl.length > 0) {
      let cloudimageurl = app.globalData.CloudPathRoot + "/" + jsonObj.imageurl;
      console.log("cloudimageurl" + cloudimageurl)
      wx.cloud.downloadFile({
        fileID: cloudimageurl
      }).then(res => {
        console.log("设置的分享公众号文章图片路径" + res.tempFilePath)
        this.setData({
          shareTempimageUrl: res.tempFilePath
        })
      });
    }


    let articleurl = this.data.options.articleurl;
    let articletitle = this.data.options.articletitle;


    wx.setNavigationBarTitle({
      title: articletitle,
    })
    this.setData({
      articleSrc: articleurl,
      articletitle: articletitle
    })


  },
  handlerGobackClick() {
    util.handlerGobackClick(function (e) {}, 1000)
  },
  handlerGohomeClick() {
    util.handlerGohomeClick(function (e) {

    }, 1000)
  },

  onShareAppMessage: function (options) {

    let jsonObj = this.data.options;
    var input = encodeURIComponent(JSON.stringify(jsonObj))

    let shareTempimageUrl = this.data.shareTempimageUrl;
    if (jsonObj.useimage && shareTempimageUrl.length > 0) {

      console.log("获取到的图片路径" + shareTempimageUrl);
      //最后就直接可以在分享中调用
      return {
        title: this.data.articletitle, //此处为标题,
        path: `/pages/weixinlink/weixinlink?obj=${input}`, //此处为路径,
        imageUrl: shareTempimageUrl,
        success: function (res) {
          //这里为分享成功后的回调函数,
        },
        fail: function (res) {
          //此处为转发失败后的回调函数
        }
      }

    } else {
      //最后就直接可以在分享中调用
      return {
        title: this.data.articletitle, //此处为标题,
        path: `/pages/weixinlink/weixinlink?obj=${input}`, //此处为路径,

        success: function (res) {
          //这里为分享成功后的回调函数,
        },
        fail: function (res) {
          //此处为转发失败后的回调函数
        }
      }
    }


  },
  onShareTimeline: function () {
    util.ShareTimeline()
  },

})