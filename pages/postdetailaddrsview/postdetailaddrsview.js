const app = getApp()
var util = require('../../util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        province: "",
        city: "",
        district: "",
        inputValue: "",
        dbcity: "",
        addr: ""
    },
    goSearch: util.throttle(function (e) {
        util.goSearch(e)
    }, 1000),
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
        var str = decodeURIComponent(decodeURIComponent(input.obj));
        var options = JSON.parse(str)

        if (options && options.list) {
            this.setData({
                id: options.id,
                list: JSON.parse(options.list),
                province: options.province,
                city: options.city == '辖区' || options.city == '辖县' ? "" : options.city,
                dbcity: options.city,
                district: options.district,
                inputValue: options.inputValue,
                addr: options.province + (options.city == '辖区' || options.city == '辖县' ? "" : options.city) + options.district
            })

            wx.setNavigationBarTitle({
                title: '地址  ' + this.data.inputValue + '  的搜索结果' //页面标题为路由参数
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

    goCodeView: util.throttle(function (e) {
        let id = e.currentTarget.dataset.id
        let code = e.currentTarget.dataset.code
        wx.cloud.callFunction({
            name: 'collection_get',
            data: {
                database: 'post',
                page: 1,
                num: 1,
                condition: {
                    _id: id
                }
            },
        }).then(res => {
            if (!res.result.data.length) {
                wx.showToast({
                    icon: 'warn',
                    title: '跳转失败',
                })
            } else {
                let data = res.result.data[0];
                let list = ''
                let arr = data.addrInfos
                let province = data.province
                let district = data.district

                let city = data.city
                for (let index = 0; index < arr.length; index++) {
                    const element = arr[index];
                    if (code == element.code) {
                        list = JSON.stringify(element.addrs)
                    }
                }
                var obj = {
                    id: id,
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
            }
        })
            .catch(err => {
                console.log('失败' + err)
            })
    }, 1000),

    /**
     * 根据记录的id跳转到总览页，不统计打开次数
     */
    goPostDetailByAddr: util.throttle(function (e) {
        util.goPostDetailByAddr(e)
    }, 1000),

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