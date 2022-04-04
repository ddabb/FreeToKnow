const util = require('../../util.js')
Page({

  data: {

  },

  onLoad: function (e) {
    this.setData({
      ordernum: e.ordernum,
      rightNum: e.rightNum,
      errNum: e.errNum,
      unAnswerNum: parseInt(e.length) - (parseInt(e.rightNum) + parseInt(e.errNum))
    })
  },
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
  onReady: function () {

  },

  onShow: function () {

  },

  examBack: function () {
    wx.navigateTo({
      url: "../examnote/examnote?ordernum=" + this.data.ordernum
    });
  },

  exam_repeat: function () {
    // this._repeat_examGo(this);
  }
})