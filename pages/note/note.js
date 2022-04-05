// pages/note/note.js
const app = getApp();
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
        num: 20,
        loading: false,
        isOver: false,
        scrollHeight: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            tags: options.tags,
            parenttags: options.parenttags,
            scrollHeight: app.globalData.windowHeight - 50
        })
        this.loadList(options.tags)
    },

    lower() {
        console.log("this.lower in")
        this.loadList(this.data.tags)
    },
    handlerGobackClick() {
        util.handlerGobackClick(function (e) { }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) { }, 1000)
    },
    loadList(tags) {
        if (!this.data.isOver) {
            let {
                list,
                page,
                num
            } = this.data
            let that = this
            list = []

            this.setData({
                loading: true
            })

            wx.cloud.callFunction({
                name: 'collection_leftjoin_replaceroot',
                data: {
                    database: 'knowledgenote',
                    fromdb: 'knowledge',
                    condition: {
                        noted: true,
                        openid: app.globalData.openid
                    },
                    localField: 'knowledgeid',
                    foreignField: '_id',
                    asfield: 'know',
                    root: {
                        newRoot: {
                            know: '$know'
                        }
                    }
                }
            }).then(res => {
                if (!res.result.list.length) {
                    that.setData({
                        loading: false,
                        isOver: true
                    })
                } else {
                    let res_data = res.result.list

                    for (let index = 0; index < res_data.length; index++) {
                        const knows = res_data[index];
                        var arr = knows["know"];
                        for (let index = 0; index < arr.length; index++) {
                            const element = arr[index];
                            list.push(element);
                        }
                    }

                    that.setData({
                        list,
                        page: page + 1,
                        loading: false,
                    })
                }
            })
                .catch(console.error)
        }
    },

    goClassify: util.throttle(function (e) {
        wx.switchTab({
            url: `/pages/classify/classify`
        })
    }, 1000),

    goDetail: util.throttle(function (e) {
        let _id = e.currentTarget.dataset.id
        wx.cloud.callFunction({
            name: 'collection_count_opened',
            data: {
                database: 'knowledge',
                id: _id
            },
        }).then(res => {
            wx.navigateTo({
                url: `/pages/knowledgedetail/knowledgedetail?id=${e.currentTarget.dataset.id}`,
            })
        })
            .catch(console.error)
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
        console.log("onPullDownRefresh in")
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