var Board = require("./grid.js");
var Main = require("./main.js");
//获取应用实例
const app = getApp()
var util = require('../../../util.js')
Page({
  data: {
    hidden: false,
    start: "开始游戏",
    num: [],
    score: 0,
    bestScore: 0, // 最高分
    endMsg: '',
    showArea: true,
    over: false // 游戏是否结束 
  },
  // 页面渲染完成
  onReady: function () {
    if (app.globalData.userInfo && app.globalData.userInfo.p2028score) {
      this.setData({
        bestScore: app.globalData.userInfo.p2028score
      });
    }

    this.gameStart();
  },
  gameStart: function () { // 游戏开始
    this.updateDbScore();
    var main = new Main(4);
    this.setData({
      endMsg: '',
      main: main
    });
    this.data.main.__proto__ = main.__proto__;

    this.setData({
      hidden: true,
      over: false,
      score: 0,
      num: this.data.main.board.grid
    });
  },
  gameOver: function () { // 游戏结束
    this.setData({
      over: true
    });

    if (this.data.score >= 2048) {
      this.setData({
        endMsg: '恭喜达到2048！'
      });
      wx.setStorageSync('highScore', this.data.score);
    } else if (this.data.score > this.data.bestScore) {
      this.setData({
        endMsg: '创造新纪录！',
        bestScore: this.data.score
      });
      wx.setStorageSync('highScore', this.data.score);
    } else {
      this.setData({
        endMsg: '游戏结束！'
      });
    }
  },
  // 触摸
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function (ev) { // 触摸开始坐标
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

  },
  updateDbScore: function (e) {
    if (app.globalData.userInfo) {
      let historyScore = app.globalData.userInfo.p2028score; //历史最高的2048的分数
      if (this.data.bestScore != 0 && (typeof historyScore == "undefined" || this.data.bestScore > historyScore)) {
        let bestScore = this.data.bestScore;
        app.globalData.userInfo.p2028score = this.data.bestScore;
        wx.cloud.callFunction({
          name: 'collection_update',
          data: {
            database: "user",
            id: app.globalData.userInfo._id,
            values: {
              p2028score: bestScore
            }
          }
        })
      }
    }
  },
  touchMove: function (ev) { // 触摸最后移动时的坐标
    var touch = ev.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  },
  touchEnd: function () {
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);

    if (this.data.main.isOver()) { // 游戏是否结束
      this.gameOver();
    } else {
      if (Math.max(absdisX, absdisY) > 3) { // 减少触屏失效的错句
        this.setData({
          start: "重新开始",
        });
        var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0); // 确定移动方向
        var data = this.data.main.move(direction);
        this.updateView(data);
      }
    }
  },

  /** 
   * 更新最大分数 
   * score 是页面上所有分数之和
   */
  updateView(data) {
    var max = 0;
    for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++)
        if (data[i][j] != "")
          max += data[i][j];
    this.setData({
      num: data,
      score: max
    });
    if (max > this.data.bestScore) {
      this.setData({
        endMsg: '创造新纪录！',
        bestScore: max
      });
    }
  },
  onShareAppMessage: function () {
    this.setData({
      showArea: false
    })
    return {
      title: `2048,我最好的成绩是${this.data.bestScore}分~`, //此处为标题,
      path: `/pages/game/index/index`, //此处为路径,
      // imageUrl: randomImg, //此处就是写的随机分享图片,
      success: function (res) {
        //这里为分享成功后的回调函数,
      },
      fail: function (res) {
        //此处为转发失败后的回调函数
      }
    }
  },
  onShow: function () {
    this.setData({
      showArea: true
    })
  },
  onShareTimeline: function () {
    util.ShareTimeline()
  },
  handlerGobackClick() {
    this.updateDbScore();
    util.handlerGobackClick(function (e) {
      util.goSearch(e)
    }, 1000)
  },
  handlerGohomeClick() {
    this.updateDbScore();
    util.handlerGohomeClick(function (e) {
      util.goSearch(e)
    }, 1000)
  },
})