var util = require('../../util.js')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        sentence: {},
        fitler: {},
        sentencePage: 50,
        page: 1,
        num: 20,
        loading: false,
        jumping: false,
        isOver: false,
        tags: null
    },
    handlerGobackClick() {
        util.handlerGobackClick(function (e) { }, 1000)
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
                province: options.province,
                city: options.city,
            }
            wx.setNavigationBarTitle({
                title: "" + options.province + "" + options.city //页面标题为路由参数
            })
            this.setData({
                tags: "" + options.province + "" + options.city
            })
        }
        app.globalData.menuPlaceholder = "邮编或地址"
        this.getList(this.data.fitler)
    },

    lower(e) {
        if (!this.data.loading) {
            this.getList(this.data.fitler)
        }
    },

    getList(filter) {
        if (!this.data.isOver) {
            let {
                list,
                page,
                num
            } = this.data
            let that = this

            this.setData({
                loading: true
            })
            wx.cloud.callFunction({
                name: 'collection_get',
                data: {
                    database: 'post',
                    page,
                    num,
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

    goSearch: util.throttle(function (e) {
        util.goSearch(e)
    }, 1000),

    goDetail: util.throttle(function (e) {
        util.goPostDetail(e)
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
})