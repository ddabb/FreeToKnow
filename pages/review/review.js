// miniprogram/pages/study/study.js
const util = require('../../util.js');
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
        errNum: 0,
        rightNum: 0,
        score_arr: [],
        options_arr: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        let id = options.id;

        this.onQuery(id);
        this.onGetOpenid();
    },
    onQuery: function (ordernum) {
        let that = this;
        wx.cloud.callFunction({
            name: 'collection_get',
            data: {
                database: 'history',
                page: 1,
                num: 1,
                condition: {
                    _id: ordernum
                }
            },
        }).then(res => {
            console.log("res.result.data.length" + res.result.data.length);

            if (!res.result.data.length) {
                wx.showToast({
                    icon: 'warn',
                    title: '加载失败',
                })
            } else {
                let history = res.result.data[0];
                that.setData({
                    history,
                    items: history.items,
                    examid: history.examid,
                    subject: history.subject._id,
                    length: history.items.length
                }, () => {
                    that.queryQues(this.data.examid, this.data.subject, history.items[0]);
                })
            }
        })
    },
    queryQues: function (examid, subjectid, id) {
        console.log("review queryQues" + examid)
        console.log("review subjectid" + subjectid)
        console.log("review id" + id)
        let that = this;

        wx.cloud.callFunction({
            name: 'collection_get',
            data: {
                database: 'question',
                page: 1,
                num: 1,
                condition: {
                    examid: examid,
                    order: id, //问题序号
                    subjectid: subjectid
                }
            },
        }).then(res => {
            console.log("queryQues res.result.data.length" + res.result.data.length);
            if (res.result.data.length) {
                let question = res.result.data[0]
                let options = question.options;
                options.map((option) => {
                    option.selected = false;
                })
                that.setData({
                    question,
                    options
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            showArea: true
        })
    },

    handlerGobackClick() {
        util.handlerGobackClick(function (e) { }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) { }, 1000)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () { },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () { },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () { },
    generate: function () {
        return util.formatTime(new Date());
    },
    selectOption: function (e) {
        console.log(e.currentTarget.dataset);
        let selectedOption = JSON.parse(e.currentTarget.dataset.value);
    },
    goHome: function () {
        let url = '/pages/home/index';
        wx.switchTab({
            url: url
        })
    },
    generate: function () {
        return util.formatTime(new Date());
    },
    doNext: function () {
        console.log('doNext')

        let idx = this.data.idx;
        let length = this.data.length;
        idx++;

        let options = this.data.options;
        let isRight = true;
        for (const option of options) {
            if (option.selected == true && option.value == 0) {
                isRight = false;
                break;
            }
        }
        let rightNum = this.data.rightNum;
        let errNum = this.data.errNum;
        if (isRight) {
            rightNum++;
        } else {
            errNum++;
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
                score_arr,
                options_arr
            }, () => {
                this.goHome();
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
        this.queryQues(this.data.examid, this.data.subject, id);

        this.setData({
            rightNum,
            errNum,
            score_arr,
            options_arr,
            idx,
            percent,
            selectedOption: {
                code: '',
                content: '',
                value: -1
            }
        }, () => { })
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