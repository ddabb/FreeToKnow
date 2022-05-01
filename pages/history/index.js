// pages/home/index.js
const app = getApp();
const util = require('../../util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    historyCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loading: true,
      historyCount: app.globalData.historyCount
    })
    this.onGetOpenid();
  },
  query: function (openid) {
    let that = this;
    let historyCount = this.data.historyCount;
    wx.cloud.callFunction({
        name: 'collection_get_orderby',
        data: {
          database: 'history',
          page: 1,
          num: historyCount,
          field: 'createTime',
          order: 'desc',
          condition: {
            "_openid": openid
          }
        },
      }).then(res => {
        let items = [];
        if (!res.result.data.length) {
          that.setData({
            loading: false,
            isOver: true
          })
        } else {
          let res_data = res.result.data
          let over = res.result.data.length < historyCount
          items.push(...res_data)
          items.map((item) => {
            var str = item.createTime.toLocaleString();
            console.log(str);
            item.createTime = util.formatTime(new Date(str))
          })
          that.setData({
            items,
            loading: false,
            isOver: over
          })
        }
      })
      .catch(console.error)
  },
  toReviewPage: function (e) {
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let url = '/pages/review/review?id=' + id;
    wx.navigateTo({
      url: url
    })
  },
  toModePage: function (e) {
    console.log(e.currentTarget.dataset.questions);
    wx.setStorageSync('arr', JSON.parse(e.currentTarget.dataset.questions));
    let url = '/pages/look/index';
    wx.redirectTo({
      url: url
    })
  },
  toAttendPage: function (e) {
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id;
    let title = e.currentTarget.dataset.title;
    let url;
    url = '/pages/question/index?id=' + id + '&title=' + title;
    wx.navigateTo({
      url: url
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 1];
    console.log('开始输出');
    console.log(pages);
    console.log(prevPage);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      showArea: true
    })
  },

  handlerGobackClick() {
    util.handlerGobackClick(function (e) {}, 1000)
  },
  handlerGohomeClick() {
    util.handlerGohomeClick(function (e) {}, 1000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  onGetOpenid: function () {

    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.OPENID)
        app.globalData.openid = res.result.OPENID
        this.query(res.result.OPENID)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  }
})