// pages/list/list.js
var util = require('../../util.js')
const app = getApp()
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
        num: 20,
        loading: false,
        isOver: false,
        scrollHeight: 0,
        showArea: true,
        color: 'red',
        othercolor: 'gray',
        field: 'opened',
        order: 'desc'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (input) {
        var str = decodeURIComponent(decodeURIComponent(input.obj));
        var options = JSON.parse(str)
        wx.setNavigationBarTitle({
            title: options.tags //页面标题为路由参数
        })

        this.setData({
            options: options,
            scrollHeight: app.globalData.windowHeight - 50
        })
        this.setData({
            tags: options.tags,
            parenttags: options.parenttags
        })
        wx.setNavigationBarTitle({
            title: '搜索“' + this.data.tags + '”找到了以下公众号文章' //页面标题为路由参数
        })
        this.loadList(options.tags)
    },
    handlerGobackClick() {
        util.handlerGobackClick(function (e) {}, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {

        }, 1000)
    },
    lower() {
        this.loadList(this.data.tags)
    },


    resort: function () {
        if (!this.data.loading) {
            var tempOrder = this.data.order;
            var temp1 = this.data.color;
            var temp2 = this.data.othercolor;

            this.setData({
                order: tempOrder == 'desc' ? 'asc' : 'desc',
                color: temp2,
                othercolor: temp1,
                list: [],
                isOver: false,
                page: 1,
            })
            this.loadList(this.data.tags)
        }
    },
    loadList(tags) {
        if (!this.data.isOver) {
            let {
                list,
                page,
                num,
                field,
                order,
            } = this.data
            let condition = {
                tags: tags
            }
            this.setData({
                loading: true
            })
            let that = this
            wx.cloud.callFunction({
                    name: 'collection_get_orderby',
                    data: {
                        database: 'article',
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

    goDetail(e) {
        let _id = e.currentTarget.dataset.id
        wx.cloud.callFunction({
                name: 'collection_count_opened',
                data: {
                    database: 'article',
                    id: _id
                },
            }).then(res => {
                var obj = {
                    articleurl: e.currentTarget.dataset.articleurl,
                    articletitle: e.currentTarget.dataset.articletitle,
                    imageurl: e.currentTarget.dataset.imageurl,
                    useimage: e.currentTarget.dataset.useimage
                };
                var input = encodeURIComponent(JSON.stringify(obj))
                wx.navigateTo({
                    url: `/pages/weixinlink/weixinlink?obj=${input}`
                    //  url: '../logs/logs'
                })
            })
            .catch(console.error)
    },

    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {
            util.goback(e)
        }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {

        }, 1000)
    },
    confirmSearch(e) {
        util.goSearch(e)
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
        this.loadList(this.data.tags)
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
            title: '搜索“' + this.data.tags + '”找到了以下优质内容~', //此处为标题,
            path: `/pages/acticlelist/acticlelist?obj=${input}`, //此处为路径,

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