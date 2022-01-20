// pages/hexotag.js
var util = require('../../util.js')
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        result: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this;
        wx.setNavigationBarTitle({
            title: "文章标签" //页面标题为路由参数
        });
        wx.cloud.callFunction({
            name: 'collection_get',
            data: {
                database: 'hexotags',
                page: 1,
                num: 1,
                condition: {}
            },
        }).then(res => {
            if (!res.result.data.length) {
                wx.showToast({
                    icon: 'warn',
                    title: '加载失败',
                })
            } else {
                let obj = JSON.parse(res.result.data[0].tags);
                this.setData({
                    result: obj
                })
                //     let obj = JSON.parse(res.result)
                //     that.setData({result:obj});

                wx.hideLoading()
            }
            that.setData({
                isDown: true
            })
        })
            .catch(err => {
                console.log('失败' + err)
                that.setData({
                    isExist: false
                })
            })
    },

    goDetail: function (e) {
        let path = e.currentTarget.dataset.path;
        wx.navigateTo({
            url: `/pages/hexotag/hexotag?path=${path}`,
        })
    },
    handlerGobackClick() {
        util.handlerGobackClick(function (e) { }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {
        }, 1000)
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
    onShareTimeline: function () {
        util.ShareTimeline()
    },
})