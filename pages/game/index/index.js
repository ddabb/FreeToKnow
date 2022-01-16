//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    current: 0,
    showArea: true
  },
  onReady: function () {
    this.load();
  },

  onShow: function () {
    this.setData({
      showArea: true
    })
  },
  load: function () {
    var n = 1;
    var timer = setInterval(() => {
      if (n == 6) {
        clearInterval(timer);
        wx.redirectTo({
          url: '../p2048/p2048'
        })
      }
      this.setData({
        current: this.data.current + 1
      });
      if (this.data.current > 3)
        this.setData({
          current: 0
        });
      n++;
    }, 400);
  }
})