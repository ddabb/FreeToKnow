// pages/aboutme/aboutme.js
var util = require('../../util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        wx.setNavigationBarTitle({
            title: "关于小程序"
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
     * 保存文件
     * @param {*} e
     */
    baocun: function (e) {
        let url = '../../images/' + e.currentTarget.dataset.pic;
        wx.showModal({
            title: '提示',
            content: '确定要保存这张图片吗？',
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.getImageInfo({
                        src: url,
                        success: function (res) {
                            console.log(res);
                            var path = res.path;
                            wx.saveImageToPhotosAlbum({
                                filePath: path,
                                success: function (res) {
                                    console.log('图片已保存');
                                },
                                fail: function (res) {
                                    console.log('保存失败');
                                }
                            })
                        }
                    });
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
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