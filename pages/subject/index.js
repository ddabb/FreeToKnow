// pages/mode/index.js
const util = require('../../util.js');
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        subjects: [],
        items: [{
            name: '0',
            value: '单题模式',
            checked: 'true'
        },
        {
            name: '1',
            value: '列表模式'
        }
        ],
        examcode: '',
        _id: '0000'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        let examid = options.id;
        this.setData({
            examid
        });
        this.onQuery(examid);
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
        util.throttle(function (e) {
            wx.switchTab({
                url: '/pages/home/index'
            });
        }, 1000)
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
    examGo: function (e) {
        console.log(e.currentTarget.dataset.id);
        let id = e.currentTarget.dataset.id;
        let examid = e.currentTarget.dataset.examid;
        let counts = e.currentTarget.dataset.counts;
        let name = e.currentTarget.dataset.name;
        if (id == '0000') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '请先选择一个科目',
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
            return;
        }
        var obj = {
            subject: id,
            counts: counts,
            examid: examid,
            name: name,
        };
        var input = encodeURIComponent(JSON.stringify(obj))
        let url = `/pages/exam/exam?obj=${input}`;
        wx.navigateTo({
            url: url
        })
    },
    toEntryPage: function (e) {
        console.log(e.currentTarget.dataset.id);
        let id = e.currentTarget.dataset.id;
        if (id == '0000') {
            wx.showModal({
                showCancel: false,
                title: '提示',
                content: '请先选择一个科目',
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
            return;
        }
        let url = '/pages/entry/index?id=' + id;
        wx.navigateTo({
            url: url
        })
    },
    onQuery: function (examid) {
        const db = wx.cloud.database()
        db.collection('subject').where({
            examid: examid
        }).get({
            success: res => {
                wx.setStorageSync('subjects', res.data);
                let subjects = res.data;
                let _id;
                let code;
                console.log("subjects.length" + subjects.length);
                if (subjects.length == 1) {
                    subjects.map(function (obj) {
                        wx.setStorageSync('subject', obj);
                        _id = obj['_id'];
                        code = obj['code'];
                        obj.checked = 'true';
                        return obj;
                    });
                }
                this.setData({
                    subjects,
                    _id,
                    code
                })
                console.log('[数据库] [查询记录] 成功: ', res)
            },
            fail: err => {
                wx.showToast({
                    icon: 'none',
                    title: '查询记录失败'
                })
                console.error('[数据库] [查询记录] 失败：', err)
            }
        })
    }
})