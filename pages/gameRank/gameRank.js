// pages/game/gameRank/gameRank.js
const app = getApp()
var util = require('../../util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        parenttags: '',
        tags: '',
        list: [],
        page: 1,
        options: '',
        num: 100,
        loading: false,
        isOver: false,
        scrollHeight: 0,
        showArea: true,
        color: 'red',
        othercolor: 'gray',
        field: 'pscore',
        order: 'desc'
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let {
            list,
            page,
            num,
            field,
            order,
        } = this.data
        let that = this;
        let condition = {}
        wx.cloud.callFunction({
            name: 'collection_get_orderby',
            data: {
                database: 'user',
                page,
                num,
                field,
                order,
                condition
            }
        }).then(res => {
            if (!res.result.data.length) {
                that.setData({
                    loading: false,
                    isOver: true
                })
            } else {
                let res_data = res.result.data
                let over = res.result.data.length < num
                let result = [];
                res_data.forEach(element => {
                    if (element.pscore > 0) {
                        element.avatarUrl = element.avatarUrl > "" ? element.avatarUrl : '../../images/game.png'; //处理用于从来没有授权过头像
                        var reg = /1(\d{2})\d{4}(\d{4})/g;
                        element.nickName = element.nickName > "" ? element.nickName : '无名氏';
                        element.nickName = element.nickName.replace(reg, "1$1****$2"); //屏蔽昵称中的手机号码
                        result.push(element);
                    }
                });
                that.setData({
                    list: result,
                    page: page + 1,
                    loading: false,
                    isOver: over
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
    handlerGobackClick() {
        util.handlerGobackClick(function (e) {
            util.goSearch(e)
        }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {
            util.goSearch(e)
        }, 1000)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () { }
})