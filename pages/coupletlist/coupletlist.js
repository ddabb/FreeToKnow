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
        options: '',
        num: 20,
        loading: false,
        jumping: false,
        isOver: false,
        showArea: true,
        inputValue: '',
        scrollHeight: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (input) {
        var str = decodeURIComponent(decodeURIComponent(input.obj));
        var options = JSON.parse(str)
        this.setData({
            options: options,
            scrollHeight: app.globalData.windowHeight - 50
        })

        if (options) {
            this.data.fitler = {
                tags: options.tags
            }
            wx.setNavigationBarTitle({
                title: '包含"' + options.tags + '"的对联有这些~~~' //页面标题为路由参数
            })
        }
        if (options.tags) {
            this.setData({
                inputValue: options.tags
            })
        }
        this.getList(this.data.fitler)

    },
    confirmSearch(e) {
        util.goSearch(e)
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
                    name: 'collection_get_couplet_or',
                    data: {
                        database: 'couplet',
                        page,
                        num,
                        inputValue: this.data.inputValue
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
        util.handlerGobackClick(function (e) {}, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {

        }, 1000)
    },


    goSearch: util.throttle(function (e) {
        util.goSearch(e)
    }, 1000),

    goDetail: util.throttle(function (e) {
        util.goCoupletDetail(e)
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
        this.setData({
            showArea: true
        })
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
        this.setData({
            showArea: false
        })
        let jsonObj = this.data.options;
        var input = encodeURIComponent(JSON.stringify(jsonObj))
        return {
            title: '包含"' + this.data.inputValue + '"的对联有这些~~~', //此处为标题,
            path: `/pages/coupletlist/coupletlist?obj=${input}`, //此处为路径,

            success: function (res) {
                //这里为分享成功后的回调函数,
            },
            fail: function (res) {
                //此处为转发失败后的回调函数
            }
        }
    },
    onShareTimeline: function () {
        util.ShareTimeline()
    },
})