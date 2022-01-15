var util = require('../../util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        sentence: {},
        sentencePage: 50,
        page: 1,
        num: 20,
        loading: false,
        isOver: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '博古通今' //页面标题为路由参数
        })
        this.getList()
    },

    lower(e) {
        if (!this.data.loading) {
            this.getList()
        }
    },

    getList() {
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
                    database: 'knowledge',
                    page,
                    num,
                    condition: { classify: "factual" }
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
    handlerGobackClick() {
        util.handlerGobackClick(function (e) {
        }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {
        }, 1000)
    },
    confirmSearch(e) {
        util.goSearch(e)
    },

    goSearch: util.throttle(function (e) {
        util.goSearch(e)
    }, 1000),

    goDetail: util.throttle(function (e) {
        util.goKnowledgeDetail(e)
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
        this.getList()
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