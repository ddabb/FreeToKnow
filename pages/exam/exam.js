// miniprogram/pages/study/study.js
const util = require('../../util.js')
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    percent: 0,
    btnText: '下一题',
    rightNum: 0,
    idx: 0,
    length: 0,
    question: {},
    selectedOption: {
      code: '',
      content: '',
      value: -1
    },
    name:"",
    errNum: 0,
    rightNum: 0,
    undoNum: 0,
    score_arr: [],
    do_arr: [],
    options_arr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (input) {
    if (input) {
      var str = decodeURIComponent(decodeURIComponent(input.obj));
      var options = JSON.parse(str)
      console.log(options);
      let {id,name}  = options;
      let do_arr = this.data.do_arr;
      let counts = parseInt(options.counts);
      this.setData({
        id: id,
        name:name
      })
      let items = [];
      for (var i = 1; i < 1 + counts; i++) {
        items.push(this.formatNum(i))
        do_arr.push(false);
      }
      this.setData({
        items: items,
        length: items.length
      })

      this.queryQues('01');
      this.onGetOpenid();
      let ordernum = this.generate();
      this.setData({
        ordernum
      })
    }
  },
  formatNum: function (num) {
    return (num >= 10) ? "" + num : '0' + num;
  },

  queryQues: function (id) {
    let that = this;
    const db = wx.cloud.database();

    db.collection('questions').doc(id)
      .get()
      .then(res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        let question = res.data;
        let options = question.options;
        options.map((option) => {
          option.selected = false;
        })
        that.setData({
          question,
          options
        })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

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
  generate: function () {
    return util.formatTime(new Date());
  },
  selectOption: function (e) {
    console.log(e.currentTarget.dataset);
    let selectedOption = JSON.parse(e.currentTarget.dataset.value);
    let options = this.data.options;
    options.map((option) => {
      if (option.code == selectedOption.code) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    });
    this.setData({
      options,
      selectedOption
    })
  },
  goResult: function () {
    let url = `/pages/examresult/examresult?length=${this.data.length}&errNum=${this.data.errNum}&rightNum=${this.data.rightNum} &ordernum=${this.data.ordernum}&undoNum=${this.data.undoNum}`;
    wx.navigateTo({
      url: url
    })
  },
  generate: function () {
    return util.genguid();
  },
  addNote: function (options) {
    let that = this;
    let ordernum = this.data.ordernum;
    const db = wx.cloud.database()
    db.collection('notes').add({
      data: {
        ordernum: ordernum,
        question: this.data.question,
        options: options
      },
      success: res => {
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        // 在返回结果中会包含新创建的记录的 _id
        // wx.showToast({
        //   title: '新增记录成功',
        // })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },
  addHistory: function () {
    let that = this;
    let time = util.getTime(new Date(Date.now()));
    let ordernum = this.data.ordernum;

    try {
      var subject = wx.getStorageSync('subject')
      if (subject) {
        const db = wx.cloud.database()
        db.collection('historys').add({
          data: {
            _id: ordernum,
            subject: subject,
            items: this.data.items,
            question: this.data.question,
            options_arr: this.data.options_arr,
            score_arr: this.data.score_arr,
            rightNum: this.data.rightNum,
            createTime: db.serverDate()
          },
          success: res => {
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            // 在返回结果中会包含新创建的记录的 _id
            // wx.showToast({
            //   title: '新增记录成功',
            // })
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  doNext: function () {
    let idx = this.data.idx;
    let length = this.data.length;
    idx++;
    let do_arr = this.data.do_arr;
    let options = this.data.options;
    let isRight = false;
    for (const option of options) {
      console.log(option);
      if (option.selected == true) {
        do_arr[idx] = true;
        if (option.value == 1) {
          isRight = true;
          break;
        }
      }
    }
    let rightNum = this.data.rightNum;
    let errNum = this.data.errNum;
    let undoNum = this.data.undoNum;
    if (do_arr[idx] == false) {
      undoNum++;
    }
    if (isRight) {
      rightNum++;
    } else {
      if (do_arr[idx]) //没有做不算错题
      {
        errNum++;
      }
      this.addNote(options);
    }
    let score_arr = this.data.score_arr;
    let options_arr = this.data.options_arr;
    score_arr[this.data.idx] = isRight;
    options_arr[this.data.idx] = options;

    let items = this.data.items;

    let percent = ((idx + 1) / length) * 100;
    if (idx == length) {
      this.setData({
        rightNum,
        errNum,
        undoNum,
        do_arr,
        score_arr,
        options_arr
      }, () => {
        this.addHistory();
        this.goResult();
      })
      return;
    }

    if (length - idx == 1) {
      this.setData({
        btnText: '完成'
      })
      wx.showToast({
        icon: 'none',
        title: '已经是最后一题了'
      })
    }

    let id = items[idx];
    this.queryQues(id);

    this.setData({
      rightNum,
      errNum,
      undoNum,
      do_arr,
      score_arr,
      options_arr,
      idx,
      percent,
      selectedOption: {
        code: '',
        content: '',
        value: -1
      }
    }, () => {})
  },
  onGetOpenid: function () {
    let that = this;
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login]: ', res)
        app.globalData.openid = res.result.OPENID
        that.setData({
          openid: res.result.OPENID
        })
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
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