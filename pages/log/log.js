// pages/list/list.js
var util = require('../../util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showArea: true,
    logs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.setNavigationBarTitle({
      title: '小程序FreeToKnow的更新日志' //页面标题为路由参数
    })
    wx.showLoading({
      title: '详情加载中...',
    })
    let that = this;
    wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'versionlogs',
        page: 1,
        num: 1,
        condition: {

        }
      },
    }).then(res => {
      if (res.result.data.length) {
        that.setData({
          logs: res.result.data[0].logs
        })
      }
      wx.hideLoading({
        success: (res) => {},
      })
      console.log(that.data.logs)
    })
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
    let jsonObj = this.data.options;
    var input = encodeURIComponent(JSON.stringify(jsonObj))
    return {
      title: '小程序FreeToKnow的更新日志', //此处为标题,
      path: `/pages/log/log`, //此处为路径,

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
})