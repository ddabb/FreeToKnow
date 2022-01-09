var util = require('../../util.js')
const app = getApp()
// pages/pdflist/pdflist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    fitler: {},
    sentencePage: 50,
    page: 1,
    options: '',
    num: 20,
    inputValue: '',
    tags: null,
    scrollHeight: 0,
    showArea:true,
    color: 'red',
    othercolor: 'gray',
    field: 'opened',
    order: 'desc'
  },


  lower(e) {
    if (!this.data.loading) {
      this.getList(this.data.fitler)
    }
  },

  handlerGobackClick() {
    util.handlerGobackClick(function (e) {}, 1000)
  },
  handlerGohomeClick() {
    util.handlerGohomeClick(function (e) {

    }, 1000)
  },
  confirmSearch(e) {
    util.goSearch(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (input) {
    var str = decodeURIComponent(decodeURIComponent(input.obj));

    var options = JSON.parse(str)
    if (options) {
      this.data.fitler = {
        tags: options.tags
      }
      wx.setNavigationBarTitle({
        title: '搜索"' + options.tags + '"，找到了这些免费资料~' //页面标题为路由参数
      })
    }
    this.setData({
      options: options,
      scrollHeight: app.globalData.windowHeight - 50
    })
    if (options.tags) {
      this.setData({
        inputValue: options.tags
      })
    }
    app.globalData.menuPlaceholder = "学习资料"
    this.getList(this.data.fitler)
  },
  resort: function () {
    if (!this.data.loading) {
      var tempOrder = this.data.order;
      var temp1 = this.data.color;
      var temp2 = this.data.othercolor;

      this.setData({
        order: tempOrder == 'desc' ? 'asc' : 'desc',
        color: temp2,
        othercolor: temp1,
        list: [],
        isOver: false,
        page: 1,
      })
      this.getList(this.data.fitler)
    }
  },


  getList(filter) {
    if (!this.data.isOver) {
      let {
        list,
        page,
        num,
        field,
        order,
      } = this.data
      let that = this

      this.setData({
        loading: true
      })
      wx.cloud.callFunction({
          name: 'collection_get_orderby',
          data: {
            database: 'pdffiles',
            page,
            num,
            field,
            order,
            condition: filter
          },
        }).then(res => {
          if (!res.result.data.length) {
            that.setData({
              loading: false,
              isOver: true
            })
          } else {
            let res_data = res.result.data
            let over = res.result.data.length < num
            list.push(...res_data)
            that.setData({
              list,
              page: page + 1,
              loading: false,
              isOver: over
            })
          }
        })
        .catch(console.error)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  goDetail: util.throttle(function (e) {
    util.goPdfDetail(e)
  }, 1000),
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({showArea:true})
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


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({showArea:false})
    let jsonObj = this.data.options;
    var input = encodeURIComponent(JSON.stringify(jsonObj))
    return {
      title: '搜索"' + this.data.inputValue + '"，找到了这些免费资料~', //此处为标题,
      path: `/pages/pdflist/pdflist?obj=${input}`, //此处为路径,

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