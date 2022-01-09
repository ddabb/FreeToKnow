//logs.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
var util = require('../../util.js')
const app = getApp()
var plugin = requirePlugin("myPlugin");
Page({
  data: {

    scrollHeight: 0
  },

  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        let isIOS = res.system.indexOf("iOS") > -1;
        let navHeight = 0;
        if (!isIOS) {
          navHeight = 48;
        } else {
          navHeight = 44;
        }
        this.setData({
          status: res.statusBarHeight,
          navHeight: navHeight,
          statusBarHeight: res.statusBarHeight + navHeight
        })
      }
    })
    this.setData({
      scrollHeight: app.globalData.windowHeight
    })

    plugin.init({
      appid: "4sl4rk8i7vgUSQsXatXqcW6vivoVbd",
      openid: app.globalData.openid, // 小程序的openid，必填项
      guideList: ['这个小程序能干嘛？',
        '吃饭了吗？',
        '现在上海天气怎么样？'
      ],
      welcome: '来跟我唠唠嗑吧~',
      // background: "#eee",
      guideCardHeight: 50,
      operateCardHeight: 120,
      // history: true,
      // historySize: 60,
      navHeight: this.data.statusBarHeight,
      success: () => {
        this.setData({
          flag: true
        })
      },
      fail: error => {}
    });
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    return {
      title: '来和我聊聊天吧~', //此处为标题,
      path: `/pages/rewritePluginPage/rewritePluginPage`, //此处为路径,
      // imageUrl: randomImg, //此处就是写的随机分享图片,
    }

  },
  onShareTimeline: function () {
    util.ShareTimeline()
  },
  getQueryCallback: function (e) {

  },
  handlerGobackClick() {
    util.handlerGobackClick(function (e) {}, 1000)
  },
  handlerGohomeClick() {
    util.handlerGohomeClick(function (e) {

    }, 1000)
  },
 
  handlerbackHomeClick() {
    util.handlerGohomeClick(function (e) {

    }, 1000)
  },
  goBackHome: function () {
    util.handlerGohomeClick(function (e) {

    }, 1000)
  },
  backHome: function () {
    this.goBackHome()
  },
  back: function () {
    this.goBackHome()
  },
  goBackHomeClick() {
    util.handlerGobackClick(function (e) {}, 1000)
  }


})