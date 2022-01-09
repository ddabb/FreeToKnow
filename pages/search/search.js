// pages/search/search.js
var util = require('../../util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchType: '',
        inputValue: '',
        list: [],
        page: 1,
        num: 20,
        title: '',
        loading: false,
        isOver: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (input) {
        var str = decodeURIComponent(decodeURIComponent(input.obj));
        var options = JSON.parse(str)
        var types = ["冷知识", "天文地理", "博古通今", "信息技术", "数理化"];
        var title = ''
        if (options.type == "undefined" || types.indexOf(options.type) > -1) {
            title = "让知识触手可及"
        } else {
            title = "搜索" + options.type
        }
        this.setData({
            title: title,
            searchType: options.type == "undefined" ? "知识" : options.type,
            inputValue: options.inputvalue == "undefined" ? "" : options.inputvalue
        })

        if (this.data.inputValue) {
            this.getList()
        }
    },

    bindKeyInput(e) {

        this.setData({
            inputValue: e.detail.value,
            isOver: false,
            list: [],
            page: 1,
        })
    },
    lower(e) {
        if (!this.data.loading) {
            this.getList()
        }
    },
    handlerGobackClick() {
        util.handlerGobackClick(function (e) {}, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) {

        }, 1000)
    },
    /**
     * 根据不同的searchType 返回不同的所搜结果，并在页面上展示不同的结果效果。
     */
    getList() {

        let {
            list,
            inputValue,
            page,
            searchType
        } = this.data
        if (!inputValue) {
            return
        }

        let that = this
        if (searchType == "邮编或地址") {

            var isNum = new RegExp(/[0-9]\d{0,5}(?!\d)/).test(inputValue)
            var isCode = new RegExp(/[1-9]\d{5}(?!\d)/).test(inputValue)

            if (isNum && !isCode) {
                wx.showToast({
                    icon: 'error',
                    title: '输入邮编或地址'
                })
                return
            }
        }

        let database = ''
        let condition = {}
        let classify = ''

        let methodName = 'collection_get'
        switch (searchType) {
            case '成语':
                database = 'idiom'
                condition = {
                    t: {
                        $regex: '.*' + inputValue,
                        $options: 'i'
                    }
                }
                break;
            case '姓氏':
                database = 'baijiaxing'
                condition = {
                    name: {
                        $regex: '.*' + inputValue,
                        $options: 'i'
                    }
                }
                break;
            case '古诗词':
                database = 'gushici'
                condition = {
                    name: {
                        $regex: '.*' + inputValue,
                        $options: 'i'
                    }
                }
                break;
            case '作者':
                database = 'gushici'
                condition = {
                    poet: {
                        $regex: '.*' + inputValue,
                        $options: 'i'
                    }
                }
                break;
            case '学习资料':
                database = 'pdffiles'
                condition = {
                    title: {
                        $regex: '.*' + inputValue,
                        $options: 'i'
                    }
                }
                break;
            case '邮编或地址':
                methodName = "collection_get_post_or"
                database = 'post'
                condition = {
                    poet: {
                        $regex: '.*' + inputValue,
                        $options: 'i'
                    }
                }
                break;
            case '冷知识':
                methodName = "collection_get_knowledge_or"
                database = 'knowledge'
                classify = 'cold'
                break;
            case '数理化':
                methodName = "collection_get_knowledge_or"
                database = 'knowledge'
                classify = 'conceptual'
                break;
            case '天文地理':
                methodName = "collection_get_knowledge_or"
                database = 'knowledge'
                classify = 'reflective'
                break;
            case '博古通今':
                methodName = "collection_get_knowledge_or"
                database = 'knowledge'
                classify = 'factual'
                break;
            case '信息技术':
                methodName = "collection_get_knowledge_or"
                database = 'knowledge'
                classify = 'procedure'
                break;
            case '对联':
                methodName = "collection_get_couplet_or"
                database = 'couplet'
                break;
            case '诗词':
                methodName = "collection_get_poem_or"
                database = 'poem'
                break;
            case '公众号文章':
                methodName = "collection_get_acticle_or"
                database = 'article'
                break;
            default:
                database = 'knowledge'
                condition = {
                    content: {
                        $regex: '.*' + inputValue,
                        $options: 'i'
                    }
                }
                break;
        }


        if (!this.data.isOver) {
            let {
                list,
                page,
                num
            } = this.data
            let that = this
            this.setData({
                loading: true
            })
            wx.cloud.callFunction({
                    name: methodName,
                    data: {
                        database,
                        page,
                        num,
                        condition,
                        inputValue,
                        classify
                    },
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

    /**
     * 根据搜索的结果信息，跳转到不同的详情页
     */
    goDetail: util.throttle(function (e) {
        let _id = e.currentTarget.dataset.id
        let {
            searchType,
            inputValue
        } = this.data
        let database = ''
        let postType = ''
        let item = e.currentTarget.dataset.item
        let subject = ''
        switch (searchType) {
            case '姓氏':
                database = 'baijiaxing-detail'
                break;
            case '古诗词':
                database = 'detail'
                break;
            case '作者':
                database = 'detail'
                break;
            case '冷知识':
            case '数理化':
            case '天文地理':
            case '博古通今':
            case '信息技术':
                database = 'knowledgedetail'
                subject = item.subject
                break;
            case '对联':
                database = 'couplet'
                break;
            case '公众号文章':
                database = 'article'
                break;
            case '诗词':
                database = 'poemdetail'
                break;
            case '学习资料':
                database = 'pdfpreview'
                break;
            default:
                break;
        }

        if (searchType == '成语') {
            database = 'idiomdetail'
            wx.navigateTo({
                url: `/pages/${database}/${database}?id=${_id}&name=${item.t}`,
            })
        } else if (searchType == '对联') {
            database = 'coupletdetail'
            wx.navigateTo({
                url: `/pages/${database}/${database}?id=${_id}`,
            })
        } else if (searchType == '诗词') {
            database = 'poemdetail'
            wx.navigateTo({
                url: `/pages/${database}/${database}?id=${_id}`,
            })
        } else if (searchType == '学习资料') {

            var obj = {
                id: _id,
                title: item.title,
                before: item.before,
                from: item.from,
                to: item.to,
                end: item.end,
                fileurl: item.fileurl
            };
            var input = encodeURIComponent(JSON.stringify(obj))
            wx.navigateTo({
                url: `/pages/pdfpreview/pdfpreview?obj=${input}`
            })

        } else if (searchType == '公众号文章') {

            var obj = {
                articleurl: item.articleurl,
                articletitle: item.title,
                imageurl: item.imageurl,
                useimage: item.useimage
            };
            var input = encodeURIComponent(JSON.stringify(obj))
            wx.navigateTo({
                url: `/pages/weixinlink/weixinlink?obj=${input}`
                //  url: '../logs/logs'
            })


        } else if (searchType == '邮编或地址') {
            var temp = '[0-9]\d{0,5}(?!\d)'
            if (new RegExp(temp).test(inputValue)) {
                database = 'postdetailcodeview'
                postType = 'code'
            } else {
                database = 'postdetailaddrsview'
                postType = 'addr'
            }
            var list = ''
            var infos = item.addrInfos
            if (postType == 'code') {
                for (let index = 0; index < infos.length; index++) {
                    const element = infos[index];
                    if (inputValue == element.code) {
                        list = JSON.stringify(element.addrs)
                    }
                }
                var obj = {
                    id: _id,
                    list: list,
                    province: item.province,
                    city: item.city,
                    district: item.district,
                    inputValue: inputValue
                };
                var input = encodeURIComponent(JSON.stringify(obj))
                wx.navigateTo({
                    url: `/pages/${database}/${database}?obj=${input}`
                })

            } else {
                var lists = []
                var addrPre = item.province + item.city + item.city + item.district
                for (let index = 0; index < infos.length; index++) {
                    const element = infos[index];
                    for (let index = 0; index < element['addrs'].length; index++) {
                        const addraft = element['addrs'][index]; /*地址后缀*/
                        const addr = addrPre + addraft
                        if (addr.indexOf(inputValue) != -1) {
                            lists.push(element)
                            break;
                        }
                    }
                }
                list = JSON.stringify(lists)
                console.log("邮编地址结果" + list)

                var obj = {
                    id: _id,
                    list: list,
                    province: item.province,
                    city: item.city,
                    district: item.district,
                    inputValue: inputValue
                };
                var input = encodeURIComponent(JSON.stringify(obj))
                wx.navigateTo({
                    url: `/pages/${database}/${database}?obj=${input}`
                })
            }

        } else {
            wx.navigateTo({
                url: `/pages/${database}/${database}?id=${_id}&subject=${subject}`,
                /*subject暂适用于知识类的设置标题*/
            })
        }
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