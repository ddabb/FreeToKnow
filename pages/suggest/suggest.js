var util = require('../../util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        page: 1,
        num: 20,
        field: 'createdon',
        order: 'desc',
        loading: false,
        isOver: false,
    },
    lower() {
        this.setData({
            isOver: false
        })
        this.getList()
    },
    handlerGobackClick() {
        util.handlerGobackClick(function (e) { }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {
        }, 1000)
    },
    getList() {
        if (!this.data.isOver) {
            let {
                list,
                page,
                num,
                field,
                order
            } = this.data
            let that = this
            this.setData({
                loading: true
            })
            wx.cloud.callFunction({
                name: 'collection_get_orderby',
                data: {
                    database: 'suggestion',
                    page,
                    num,
                    field,
                    order,
                    condition: {}
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList()
    },

    goAddsuggest: util.throttle(function (e) {
        wx.navigateTo({
            url: `/pages/addsuggest/addsuggest`
        })
    }, 1000),
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
    onShareTimeline: function () {
        util.ShareTimeline()
    },
    onBackhome() {
        wx.switchTab({
            url: `/pages/index/index`,
        })
    },
})