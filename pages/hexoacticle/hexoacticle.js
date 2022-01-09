// pages/hexotag.js
var util = require('../../util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    showArea: true,
    path: '',
    articaleTitle: ''
  },


  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log(res.target)
  //   }
  //   return {
  //     title: '自定义转发标题',
  //     path: '/page/user?id=123'
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("acticlepath" + options.path);
    let path = options.path;
    let that = this;
    let url = app.globalData.hexosite + encodeURIComponent(path)
    console.log("url" + url);
    wx.cloud.callFunction({
        name: 'hexohttp',
        data: {
          url
        },
      }).then(res => {

        if (res.result != '失败') {
          let obj = JSON.parse(res.result)
          let result = app.towxml(obj.content, "html", {
            base: "https://www.60points.com",
            events: { //图片放大效果
              tap: bindtap => {
                var current = bindtap.currentTarget.dataset.data.attr.src
                wx.previewImage({
                  current,
                  urls: [current]
                })
              }
            }
          });
          // 更新解析数据
          that.setData({
            article: result,
            showLoading: false,
            articaleTitle: obj.title,
            path: path
          });
          wx.setNavigationBarTitle({
            title: obj.title //页面标题为路由参数
          })

        }

      })
      .catch(console.error)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  handlerGobackClick() {
    util.handlerGobackClick(function (e) {}, 1000)
  },
  handlerGohomeClick() {
    util.handlerGohomeClick(function (e) {

    }, 1000)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      showArea: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({
      showArea: false
    })
    console.log('this.data.articaleTitle' + this.data.articaleTitle);
    return {
      title: this.data.articaleTitle,//此处为标题,
      path: `/pages/hexoacticle/hexoacticle?path=${this.data.path}`, //此处为路径,

      success: function (res) {
        //这里为分享成功后的回调函数,
      },
      fail: function (res) {
        //此处为转发失败后的回调函数
      }
    }
  },
  onShareTimeline: function () {
    util.ShareTimeline()
  },
  showLoading: function () {
    this.setData({
      showLoading: true
    })
  },

  cancelLoading: function () {
    this.setData({
      showLoading: false
    })
  }
})