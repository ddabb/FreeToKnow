const app = getApp()
var util = require('../../util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: null,
        province: "",
        city: "",
        dbcity: "",
        district: "",
        addr: "",
        id: ""
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
        let str = this.data.addr + " \n ";
        let list = this.data.list;
        list.forEach(element => {
            str += element.code + " \n "
            element.addrs.forEach(e2 => {
                str += e2 + " \n "
            });

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

        if (input) {
            var str = decodeURIComponent(decodeURIComponent(input.obj));
            var options = JSON.parse(str)
            this.setData({
                list: JSON.parse(options.list),
                id: options.id,
                province: options.province,
                city: options.city == '辖区' || options.city == '辖县' ? "" : options.city,
                dbcity: options.city,
                district: options.district,
                addr: options.province + (options.city == '辖区' || options.city == '辖县' ? "" : options.city) + options.district
            })
            let city = options.city
            if (options.city == '辖区' || options.city == '辖县') {
                city = ''
            }
            wx.setNavigationBarTitle({
                title: "邮政编码：" + this.data.province + this.data.city + this.data.district //页面标题为路由参数
            })
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

    goCodeView: util.throttle(function (e) {
        let code = e.currentTarget.dataset.code
        let _id = e.currentTarget.dataset.id
        let province = e.currentTarget.dataset.province
        let city = e.currentTarget.dataset.city
        let district = e.currentTarget.dataset.district
        var arr = e.currentTarget.dataset.list
        let list = ''
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (code == element.code) {
                list = JSON.stringify(element.addrs)
            }
        }

        var obj = {
            id: _id,
            list: list,
            province: province,
            city: city,
            district: district,
            inputValue: code
        };
        var input = encodeURIComponent(JSON.stringify(obj))
        wx.navigateTo({
            url: `/pages/postdetailcodeview/postdetailcodeview?obj=${input}`
        })

    }, 1000),

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