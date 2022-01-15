var util = require('../../util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        disabled: false
    },
    handlerGobackClick() {
        util.handlerGobackClick(function (e) {
        }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {
        }, 1000)
    },
    /**
     * 表单提交
     * @param {*} e
     */
    bindFormSubmit: function (e) {
        let suggest = e.detail.value.textarea
        if (util.isEmpty(suggest)) {
            wx.showToast({
                icon: 'warn',
                title: '内容不能为空',
            })
        } else {
            this.setData({
                disabled: !this.data.disabled
            })
            var TIME = util.formatTime(new Date());
            let record = {
                content: suggest,
                createdon: TIME,
                reply: "暂无回复"
            }
            wx.cloud.callFunction({
                name: 'collection_add',
                data: {
                    database: 'suggestion',
                    record: record
                },
            }).then(res => {
                console.log(res.result)
                wx.navigateTo({
                    url: '/pages/suggest/suggest',
                })
            })
                .catch(console.error)
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
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
    onShareAppMessage: function () {
        util.ShareAppMessage()
    },
    onBackhome() {
        wx.switchTab({
            url: `/pages/index/index`,
        })
    },

    onShareTimeline: function () {
        util.ShareTimeline()
    },
})