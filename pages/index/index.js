const order = ['green', 'red', 'blue']
var util = require('../../util.js')

Page({
    onShareAppMessage: function () {
        return {
            title: '让知识触手可及~', //此处为标题,
            path: `/pages/index/index`, //此处为路径,
            // imageUrl: randomImg, //此处就是写的随机分享图片,
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

    data: {
        toView: 'green',
        list: [],
        selectedid: "001"
    },

    onLoad: function (options) {
        let that = this;
        wx.showLoading({
            title: '详情加载中...',
        })

        wx.cloud.callFunction({
            name: 'collection_get',
            data: {
                database: 'menu',
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
                let result = res.result.data[0];
                console.log('result.items', result.items)
                let array = result.items;
                let visibelSection = {
                    indexTags: []
                };
                var firstid = '';
                array.indexTags.forEach(element => {
                    console.log("element.visible" + element.visible);
                    if (element.visible) {
                        visibelSection.indexTags.push(element);
                        if (firstid == '') {
                            firstid = element.id
                        }
                    }
                });
                this.setData({
                    list: visibelSection,
                    selectedid: firstid
                })
                wx.hideLoading()
            }
        })
            .catch(err => {
                console.log('失败' + err)
                that.setData({
                    isExist: false
                })
            })
    },

    SwitchMain(e) {
        console.log("e.target.dataset.cellid:", e.target.dataset.cellid);
        if (this.data.selectedid === e.target.dataset.cellid) {
            return false
        } else {
            this.data.scrollTop = 0;
            this.setData({
                selectedid: e.target.dataset.cellid
            })
        }
    },
    upper(e) {
        console.log(e)
    },

    lower(e) {
        console.log(e)
    },

    scroll(e) {
        console.log(e)
    },

    scrollToTop() {
        this.setAction({
            scrollTop: 0
        })
    },

    goidiomTags(e) {
        var obj = {
            tags: e.currentTarget.dataset.tags
        };
        var input = encodeURIComponent(JSON.stringify(obj))
        wx.navigateTo({
            url: `/pages/idiomlist/idiomlist?obj=${input}`,
        })
    },

    gopoetTags(e) {
        var obj = {
            tags: e.currentTarget.dataset.tags
        };
        var input = encodeURIComponent(JSON.stringify(obj))
        wx.navigateTo({
            url: `/pages/poetlist/poetlist?obj=${input}`,
        })
    },

    gocoupletKeyword(e) {
        var obj = {
            tags: e.currentTarget.dataset.tags
        };
        var input = encodeURIComponent(JSON.stringify(obj))
        wx.navigateTo({
            url: `/pages/coupletlist/coupletlist?obj=${input}`,
        })
    },
    goviewpdf(e) {
        var obj = {
            tags: e.currentTarget.dataset.tags
        };
        var input = encodeURIComponent(JSON.stringify(obj))
        wx.navigateTo({
            url: `/pages/pdflist/pdflist?obj=${input}`,
        })
    },
    goKnowledge(e) {
        var obj = {
            tags: e.currentTarget.dataset.tags
        };
        var input = encodeURIComponent(JSON.stringify(obj))
        wx.navigateTo({
            url: `/pages/knowledgelist/knowledgelist?obj=${input}`,
        })
    },

    goviewacticle(e) {
        var obj = {
            tags: e.currentTarget.dataset.tags
        };
        var input = encodeURIComponent(JSON.stringify(obj))
        wx.navigateTo({
            url: `/pages/acticlelist/acticlelist?obj=${input}`,
        })
    },
    goWaiting(e) {
        wx.showToast({
            icon: 'warn',
            title: '敬请期待',
        })
    },
    goPostList(e) {
        let p = e.currentTarget.dataset.classifyname;
        let c = e.currentTarget.dataset.tags;
        console.log("province" + p);
        console.log("city" + c);

        var obj = {
            province: p,
            city: c
        };
        var input = encodeURIComponent(JSON.stringify(obj))
        wx.navigateTo({
            url: `/pages/postlist/postlist?obj=${input}`
        })
    },

    tap() {
        for (let i = 0; i < order.length; ++i) {
            if (order[i] === this.data.toView) {
                this.setData({
                    toView: order[i + 1],
                    scrollTop: (i + 1) * 200
                })
                break
            }
        }
    },

    tapMove() {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    }
})