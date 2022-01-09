const app = getApp()
var util = require('../../util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        list: null,
        province: "",
        city: "",
        dbcity: "",
        district: "",
        addr: "",
        code: ''
    },
    goSearch: util.throttle(function (e) {
        util.goSearch(e)
    }, 1000),
    handlerGobackClick() {
        util.handlerGobackClick(function (e) {}, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {

        }, 1000)
    },
    confirmSearch(e) {
        util.goSearch(e)
    },
    onCopyData() {
        let str = '';
        let list = this.data.list;
        if (this.data.addr != undefined) {
            str += "省市区：" + " \n " + this.data.addr + " \n ";
        }
        if (this.data.code != undefined) {
            str += "邮政编码：" + " \n " + this.data.code + " \n ";
        }
        str += "详细地址：" + " \n ";
        list.forEach(e2 => {
            str += e2 + " \n "
        });
        console.log('设置的剪切板的内容' + str) // data
        wx.setClipboardData({
            //准备复制的数据内容
            data: str,
            success: function (res) {
                wx.showToast({
                    icon: 'success',
                    title: '复制成功',
                })
            },
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (input) {
        var str = decodeURIComponent(decodeURIComponent(input.obj));
        var options = JSON.parse(str)


        if (options && options.list) {
            this.setData({
                list: JSON.parse(options.list),
                province: options.province,
                id: options.id,
                city: options.city == '辖区' || options.city == '辖县' ? "" : options.city,
                dbcity: options.city,
                district: options.district,
                addr: options.province + (options.city == '辖区' || options.city == '辖县' ? "" : options.city) + options.district,
                code: options.inputValue
            })

            // wx.setNavigationBarTitle({
            //     title: "邮政编码:" + options.inputValue + "  " //页面标题为路由参数
            // })
        }
    },
    onBackhome(e) {
        util.goBackHome(e)
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

    goPostDetailByAddr: util.throttle(function (e) {
        util.goPostDetailByAddr(e)
    }, 1000),


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