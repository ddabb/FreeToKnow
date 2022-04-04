// pages/hexotag.js
var util = require('../../util.js')
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        result: "",
        postlist: [],
        showLoading: true,
        name: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("options" + options.path);
        let path = options.path;
        let that = this;
        let url = app.globalData.hexosite + "/" + encodeURIComponent(path)
        console.log("url" + url);

        wx.cloud.callFunction({
            name: 'hexohttp',
            data: {
                url
            },
        }).then(res => {
            if (res.result != '失败') {
                let obj = JSON.parse(res.result)
                let name = obj.name;
                let postlist = obj.postlist;
                that.setData({
                    result: obj,
                    postlist: postlist
                });
                that.setData({
                    name: name,

                    showLoading: false,
                })
                console.log("that.data.postlist.length" + that.data.postlist.length)
            }
            wx.setNavigationBarTitle({
                title: that.data.name //页面标题为路由参数
            });
        })
            .catch(console.error)
    },

    handlerGobackClick() {
        util.handlerGobackClick(function (e) { }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) { }, 1000)
    },

    godetail: function (e) {
        let path = e.currentTarget.dataset.path;
        wx.navigateTo({
            url: `/pages/hexoacticle/hexoacticle?path=${path}`,
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () { },

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
    onShareAppMessage: function () {
        util.ShareAppMessage()
    },
    onShareTimeline: function () {
        util.ShareTimeline()
    },
})