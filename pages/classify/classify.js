//index.js
const app = getApp()
var util = require('../../util.js')
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime.js')

Page({
    data: {
        isClose: true, //判断当前页面是打开还是返回页
        userInfo: {},
        logged: false,
        list: [],
        sentence: {},
        page: 1,
        num: 20,
        fields: {
            id: true,
            classify: true,
            subject: true,
            like: true,
            noted: true,
            opened: true
        },
        loading: false,
        isOver: false,
        field: 'opened',
        order: 'asc',
        imagemode: 'widthFix'
    },

    onLoad: function () {
        this.getList()
    },
    lower(e) {
        if (!this.data.loading) {
            this.getList()
        }
    },

    /**
     * 获取知识的数据库的列表信息
     */
    getList() {
        if (!this.data.isOver) {
            let {
                list,
                page,
                fields,
                field,
                order,
                num
            } = this.data
            let that = this
            this.setData({
                loading: true
            })
            wx.cloud.callFunction({
                name: 'collection_get_field_orderby',
                data: {
                    database: 'knowledge',
                    page,
                    num,
                    fields,
                    field,
                    order,
                    condition: {
                    }
                },
            }).then(res => {
                if (!res.result.data.length) {
                    that.setData({
                        loading: false,
                        isOver: true
                    })
                } else {
                    let res_data = res.result.data
                    list.push(...res_data)
                    that.setData({
                        list,
                        page: page + 1,
                        loading: false
                    })
                }
            })
                .catch(console.error)
        }
    },

    /**
     * 跳转到详情页
     */
    goDetail: util.throttle(function (e) {
        let _id = e.currentTarget.dataset.id
        wx.cloud.callFunction({
            name: 'collection_count_opened',
            data: {
                database: 'knowledge',
                id: _id
            },
        }).then(res => {
            this.setData({
                isClose: false
            })
            wx.navigateTo({
                url: `/pages/knowledgedetail/knowledgedetail?id=${e.currentTarget.dataset.id}`,
            })
        })
            .catch(console.error)
    }, 1000),

    onShareAppMessage(res) {
        return {
            title: '让知识触手可及',
            path: `pages/index/index`
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log('onHide')
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log('onUnload')
    },
    onShareAppMessage: function () {
        util.ShareAppMessage()
    },
    onShareTimeline: function () {
        util.ShareTimeline()
    },
})