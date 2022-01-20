const app = getApp()
var util = require('../../util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        url: "",
        title: "",
        str: "",
        imglist: [],
        options: "",
        downloading: false,
        showArea: true,
        scrollHeight: 0,
        id: "",
        from: 0,
        to: 0,
        actualPage: 1,
        inputPage: null,
        toView: '',
        before: '',
        end: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (input) {
        if (app.globalData.share) {
            this.setData({
                scene: "分享进入"
            })
            util.getOrCreateUserInfo(this.init, input);
        } else {
            this.init(input);
        }
    },
    init: function (input) {
        wx.showLoading({
            title: '详情加载中...',
        });
        var str = decodeURIComponent(decodeURIComponent(input.obj));
        var options = JSON.parse(str);

        var from = options.from;
        var to = options.to;
        var before = options.before;
        var end = options.end;

        this.setData({
            options: options,
            scrollHeight: app.globalData.windowHeight - 140,
            from: from,
            to: to,
            before: before,
            end: end
        });
        let newlist = [];
        for (let index = from; index <= to; index++) {
            newlist.push(app.globalData.CloudPathRoot + (before + index + end));
        }

        this.setData({
            imglist: newlist,
            title: options.title,
            url: options.fileurl,
            id: options.id
        });
        wx.hideLoading({
            success: (res) => { },
        });
        wx.setNavigationBarTitle({
            title: this.data.title //页面标题为路由参数
        });
        app.globalData.menuPlaceholder = "学习资料";
    },
    getIntegral: function (e) {
        var actualPage = e.detail.value;
        let {
            to
        } = this.data;
        if (actualPage != '') {
            if (actualPage > to) {
                actualPage = to + 1;
            }

            this.setData({
                toView: ("id" + (actualPage - 1)),
                inputPage: actualPage
            })
        }
    },
    imgbindtap: function (e) {
        var current = e.currentTarget.dataset.url
        wx.previewImage({
            current,
            urls: this.data.imglist
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },
    handlerGobackClick() {
        util.handlerGobackClick(function (e) { }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) { }, 1000)
    },

    Preview: util.throttle(function () {
        wx.showToast({
            'title': '加载中，请等待',
            icon: 'loading',
            duration: 2000,
        })
        var fileID = app.globalData.CloudPathRoot + this.data.url;
        console.log('fileID' + fileID);
        wx.cloud.downloadFile({
            fileID: fileID
        }).then(res => {
            console.log(res.tempFilePath)

            var Path = res.tempFilePath
            //返回的文件临时地址，用于后面打开本地预览所用
            wx.openDocument({
                filePath: Path,
                //要打开的文件路径
                success: function (res) {
                    console.log('打开PDF成功');
                }
            })
        })
    }, 1000),
    getFileType: function (filePath) {
        var startIndex = filePath.lastIndexOf(".");
        if (startIndex != -1)
            return filePath.substring(startIndex + 1, filePath.length).toLowerCase();
        else return "";
    },

    /**
     * 下载文件并打开文件
     */
    downloadfile: util.throttle(function () {
        if (this.data.downloading)
            return;
        wx.showToast({
            'title': '下载中，请等待',
            icon: 'loading',
            duration: 2000,
        })
        this.setData({
            downloading: true
        })
        var fileID = app.globalData.CloudPathRoot + this.data.url;
        var fileTpye = this.getFileType(fileID);
        console.log('fileID' + fileID);
        wx.cloud.downloadFile({
            fileID: fileID
        }).then(res => {
            console.log(res.tempFilePath)
            var Path = res.tempFilePath
            wx.saveFile({
                tempFilePath: Path, // 传入一个本地临时文件路径, http://tmp/开头的
                filePath: wx.env.USER_DATA_PATH + "/" + this.data.title, //保存到用户目录/abc文件中，此处文件名自定义，因为tempFilePath对应的是一大长串字符
                success(res) {
                    const savedFilePath = res.savedFilePath

                    wx.openDocument({
                        filePath: savedFilePath,
                        fileType: fileTpye,
                        success: function (response) {
                            wx.showToast({
                                icon: 'success',
                                title: '下载成功',
                            })
                        },
                        fail: function (res) {
                            wx.showToast({
                                icon: 'error',
                                title: '文件下载失败',
                            })
                        }
                    })
                },
                fail(err) {
                    wx.showToast({
                        icon: 'error',
                        title: '文件保存失败',
                    })
                }
            })
        })
        this.setData({
            downloading: false
        })
    }, 1000),
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

    /**
     * 用户点击右上角分享
     */
    //此为微信小程序分享
    onShareAppMessage: function (options) {
        this.setData({
            showArea: false
        })

        var input = encodeURIComponent(JSON.stringify(this.data.options))
        //     //先写一个数组,
        //     var shareimg = [
        //       "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/01/01/ChMkJ1mhRcaISLHUAAaIAQtVJyoAAf_UAJK9e8ABogZ224.jpg",
        //       "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/01/01/ChMkJ1mhRciIK04QAAPSUiTmb7UAAf_UAJRfggAA9Jq257.jpg",
        //       "https://desk-fd.zol-img.com.cn/t_s960x600c5/g5/M00/01/01/ChMkJ1mhRciIGHuyAAIISdSwzIYAAf_UAJ1MKkAAghh731.jpg"
        //     ]
        // //在写随机数
        // var randomImg = shareimg[Math.floor(Math.random() * shareimg.length)];
        //最后就直接可以在分享中调用
        let that = this
        return {
            title: that.data.title, //此处为标题,
            path: `/pages/pdfpreview/pdfpreview?obj=${input}`, //此处为路径,
            // imageUrl: randomImg, //此处就是写的随机分享图片,
        }
    },
    onShareTimeline: function () {
        util.ShareTimeline()
    },
    onShow: function () {
        this.setData({
            showArea: true
        })
    }
})