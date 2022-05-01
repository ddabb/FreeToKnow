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
        name: "",
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
            let {
                subject: subject,
                examid: examid,
                name
            } = options;
            let do_arr = this.data.do_arr;
            let counts = parseInt(options.counts);
            this.setData({
                subject: subject,
                examid: examid,
                name: name
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

            this.queryQues(examid, subject, '01');
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

    queryQues: function (examid, subjectid, id) {
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
    //错题笔记
    addNote: function (options) {
        let that = this;
        let ordernum = this.data.ordernum;

        wx.cloud.callFunction({
            name: 'collection_add',
            data: {
                database: 'note',
                record: {
                    ordernum: ordernum,
                    question: this.data.question,
                    options: options
                }
            },
            success: res => {
                console.log('错题记录 [数据库] [新增记录] 记录  ', res)
            },
            fail: err => {
                console.error('[云函数] [addNote collection_add] 调用失败', err)
            }
        })
    },
    addHistory: function () {
        let that = this;
        let ordernum = this.data.ordernum;
        console.log("addHistory in")
        try {
            var subject = wx.getStorageSync('subject')

            console.log("addHistory" + subject)
            const db = wx.cloud.database();
            wx.cloud.callFunction({
                name: 'collection_add',
                data: {
                    database: 'history',
                    record: {
                        _id: ordernum,
                        subject: subject,
                        examid: this.data.examid,
                        _openid: this.data.openid,
                        items: this.data.items,
                        question: this.data.question,
                        options_arr: this.data.options_arr,
                        score_arr: this.data.score_arr,
                        rightNum: this.data.rightNum,
                        createTime: util.formatTime(new Date())
                    }
                },
                success: res => {
                    console.log('[云函数] [login]: ', res)
                    console.log('答题历史 [数据库] [新增记录] 记录  ', res)
                    console.log("新增完结果再跳转页面");
                    that.goResult();
                },
                fail: err => {
                    console.error('[云函数] [collection_add_byid] 调用失败', err)
                }
            })
        } catch (e) {
            console.log("添加历史数据失败" + e)
        }
    },
    doNext: function () {
        let idx = this.data.idx;
        let length = this.data.length;
        let that = this;
        idx++;
        let do_arr = this.data.do_arr;
        let options = this.data.options;
        let examid = this.data.examid;
        let subject = this.data.subject;

        let isRight = false;
        for (const option of options) {
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
        console.log("idx" + idx);
        if (idx == length) {
            this.setData({
                rightNum,
                errNum,
                undoNum,
                do_arr,
                score_arr,
                options_arr
            });
            this.addHistory();
        } else {
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
            this.queryQues(examid, subject, id);

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
            }, () => { })
        }
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