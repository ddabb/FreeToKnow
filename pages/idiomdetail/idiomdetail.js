// pages/idiomdetail/idiomdetail.js
var util = require('../../util.js')
const app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        id: '',
        currentData: 0,
        detail: {},
        thisIndex: -1,
        page: 1,
        num: 1,
        name: "",
        logged: false,
        openid: '',
        isCollect: false,
        isDown: false,
        loading: false,
        isExist: true,
        qrcodesize: 100,
        canvaswidth: 376,
        canvasheight: 530,
        linespace: 30
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (app.globalData.share) {
            this.setData({
                scene: "分享进入"
            })
            util.getOrCreateUserInfo(this.init, options);
        } else {
            this.init(options);
        }
    },
    init: function (options) {
        let isLogin = app.globalData.isLogin

        console.log('用户是否授权：', app.globalData.isLogin)
        console.log('是否已有用户openId：', app.globalData.openid)

        this.setData({
            id: options.id
        })

        this.setData({
            logged: isLogin ? true : false
        })

        if (app.globalData.openid) {
            this.setData({
                openid: app.globalData.openid
            })
        }
        if (options.name) {
            wx.setNavigationBarTitle({
                title: "成语： " + options.name //页面标题为路由参数
            })
            this.setData({
                name: options.name
            })
        }

        if (options.id) {
            wx.setStorageSync('shareId', options.id)
            this.loadDetail(options.id, options.name)
        }
    },

    loadDetail(id, name) {
        let {
            detail,
            page,
            num
        } = this.data
        let that = this
        wx.showLoading({
            title: '详情加载中...',
        })

        wx.cloud.callFunction({
            name: 'collection_get',
            data: {
                database: 'idiom',
                page,
                num,
                condition: {
                    _id: id
                }
            },
        }).then(res => {
            if (!res.result.data.length) {
                wx.showToast({
                    icon: 'warn',
                    title: '加载失败',
                })
            } else {
                let length1 = res.result.data[0].tags.length;
                console.log('标签长度', length1)
                this.setData({
                    detail: res.result.data[0]
                })

                wx.hideLoading()
            }
            that.setData({
                isDown: true
            })
        })
            .catch(err => {
                console.log('失败' + err)
                that.setData({
                    isExist: false
                })
            })
    },

    goList: util.throttle(function (e) {
        var obj = {
            tags: e.currentTarget.dataset.tags
        };
        var input = encodeURIComponent(JSON.stringify(obj))
        wx.navigateTo({
            url: `/pages/idiomlist/idiomlist?obj=${input}`,
        })
    }, 1000),

    handlerGobackClick() {
        util.handlerGobackClick(function (e) { }, 1000)
    },
    handlerGohomeClick() {
        util.handlerGohomeClick(function (e) { }, 1000)
    },

    onBackhome(e) {
        util.goBackHome(e)
    },
    onCopyData() {
        let result = this.data.detail;
        let str = '';

        str += "成语：" + " \n " + result.t + " \n ";
        if (result.j != undefined) {
            str += "解释：" + " \n " + result.j + " \n ";
        }
        if (result.q != undefined) {
            str += "拼音：" + " \n " + result.q + " \n ";
        }

        if (result.s != undefined) {
            str += "拼音缩写：" + " \n " + result.s + " \n ";
        }

        if (result.c != undefined) {
            str += "出处：" + " \n " + result.c + " \n ";
        }
        if (result.jys.length > 0) {
            str += "近义成语：" + " \n ";
            result.jys.forEach(element => {
                str += element + " \n ";
            });
        }

        if (result.fys.length > 0) {
            str += "反义成语：" + " \n ";
            result.fys.forEach(element => {
                str += element + " \n ";
            });
        }

        if (result.sequence.length > 0) {
            str += "接龙示例：" + " \n ";
            result.sequence.forEach(element => {
                str += element + " \n ";
            });
        }
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

    goOtherIdiom: util.throttle(function (e) {
        let name = e.currentTarget.dataset.name
        let page1 = this.data.page
        let num1 = this.data.num
        wx.cloud.callFunction({
            name: 'collection_get',
            data: {
                database: 'idiom',
                page: page1,
                num: num1,
                condition: {
                    t: name
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
                let gotoid = res_data[0]._id;

                wx.cloud.callFunction({
                    name: 'collection_count_opened',
                    data: {
                        database: 'idiom',
                        id: gotoid
                    },
                }).then(res => {
                    wx.navigateTo({
                        url: `/pages/idiomdetail/idiomdetail?id=${gotoid}&name=${name}`
                    })
                })
                    .catch(console.error)
            }
        })
            .catch(console.error)
    }, 1000),

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
    /**
     *
     * @param {当前页面二维码地址} qrcodeurl
     */
    savecodetofile: function () {
        wx.createSelectorQuery()
            .select('#cvs1')
            .fields({
                node: true,
                size: true,
            })
            .exec(this.MergeImage.bind(this))
    },
    MergeImage: function (res) {
        let qrcodeurl = app.globalData.CloudPathRoot + `/idiomdetail/${this.data.id}.png`
        console.log('select canvas', res);
        let that = this;
        const canvasObj = res[0].node
        const ctx = canvasObj.getContext('2d')

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvasObj.width = res[0].width * dpr
        canvasObj.height = res[0].height * dpr
        ctx.scale(dpr, dpr) //适配分辨率

        let qrcodesize = this.data.qrcodesize;
        let width = this.data.canvaswidth;
        let height = this.data.canvasheight;
        let space = 10; //距离底部和右侧的距离
        let padding = 30; //左侧和右侧编剧
        let qrX = (width - qrcodesize - space); //二维码的起始X坐标
        let qrY = (height - qrcodesize - space); //二维码的起始Y坐标
        let texrwidth = width - 2 * padding;
        let qrpath = '';
        let fontpx = 16;
        let normalFont = `normal ${fontpx}px 楷体`;
        let boldFont = `bold ${fontpx}px 楷体`;
        wx.cloud.downloadFile({
            fileID: qrcodeurl
        }).then(res => {
            qrpath = res.tempFilePath;
            that.setData({
                qrpath: qrpath
            })
            //背景色
            let result = this.data.detail;
            ctx.fillStyle = '#D3C4A3';
            ctx.fillRect(0, 0, width, height);
            //字体
            ctx.font = boldFont;
            ctx.fillStyle = 'black';
            let tempHeigh = 25;
            var tempHeight = this.drawText(ctx, '成语：', padding, tempHeigh, tempHeigh, texrwidth);
            console.log(`写完成语的高度${tempHeight}`);
            ctx.font = normalFont;
            let nameAndPinyin = result.t;

            if (result.q != undefined && result.q.length > 0) {
                nameAndPinyin += " " + result.q;
            }
            let titleFont = `normal ${fontpx}px Times New Roman`;
            ctx.font = titleFont;
            ctx.fillStyle = "SteelBlue";
            tempHeight = this.drawText(ctx, nameAndPinyin, padding, tempHeight, tempHeight, texrwidth);
            if (result.j != undefined && result.j.length > 0) {
                //绘制解释
                ctx.font = boldFont;
                ctx.fillStyle = 'black';
                tempHeight = this.drawText(ctx, '解释：', padding, tempHeight, tempHeight, texrwidth);
                ctx.font = normalFont;
                ctx.fillStyle = "SteelBlue";
                tempHeight = this.drawText(ctx, result.j, padding, tempHeight, tempHeight, texrwidth);
                console.log(`写完解释的高度${tempHeight}`);
            }

            if (result.c != undefined && result.c.length > 0) {
                //绘制解释
                ctx.font = boldFont;
                ctx.fillStyle = 'black';
                tempHeight = this.drawText(ctx, '出处：', padding, tempHeight, tempHeight, texrwidth);
                ctx.font = normalFont;
                ctx.fillStyle = "SteelBlue";
                tempHeight = this.drawText(ctx, result.c, padding, tempHeight, tempHeight, texrwidth);
                console.log(`写完出处的高度${tempHeight}`);
            }

            if (result.jys.length > 0) {
                var content = '';
                result.jys.forEach(element => {
                    content += element + " ";
                });
                //绘制解释
                ctx.font = boldFont;
                ctx.fillStyle = 'black';
                tempHeight = this.drawText(ctx, '近义成语：', padding, tempHeight, tempHeight, texrwidth);
                ctx.font = normalFont;
                ctx.fillStyle = "SteelBlue";
                tempHeight = this.drawText(ctx, content, padding, tempHeight, tempHeight, texrwidth);
                console.log(`写完出处的高度${tempHeight}`);
            }
            if (result.fys.length > 0) {
                //绘制解释
                var content = '';
                result.fys.forEach(element => {
                    content += element + " ";
                });
                ctx.font = boldFont;
                ctx.fillStyle = 'black';
                tempHeight = this.drawText(ctx, '反义成语：', padding, tempHeight, tempHeight, texrwidth);
                ctx.font = normalFont;
                ctx.fillStyle = "SteelBlue";
                tempHeight = this.drawText(ctx, content, padding, tempHeight, tempHeight, texrwidth);
                console.log(`写完出处的高度${tempHeight}`);
            }

            if (result.sequence.length > 0) {
                var content = '';
                result.sequence.forEach(element => {
                    content += element + " ";
                });
                //绘制解释
                ctx.font = boldFont;
                ctx.fillStyle = 'black';
                tempHeight = this.drawText(ctx, '接龙示例：', padding, tempHeight, tempHeight, texrwidth);
                ctx.font = normalFont;
                ctx.fillStyle = "SteelBlue";
                tempHeight = this.drawText(ctx, content, padding, tempHeight, tempHeight, texrwidth);
                console.log(`写完出处的高度${tempHeight}`);
            }

            ctx.font = boldFont;
            ctx.fillStyle = "SteelBlue";
            this.drawText(ctx, "扫一扫获取更多成语知识→→", padding, qrcodesize + qrY - 10, qrcodesize + qrY - 10, texrwidth);

            let img = canvasObj.createImage(); //创建img对象
            //如果需要向canvas里载入多张图片，则需要分别创建多个img对象
            //let img2=this.data.canvas.createImage()；
            //    img2.οnlοad=()=>{};
            //    img2.src="";
            img.onload = () => {
                //img.complete表示图片是否加载完成，结果返回true和false;
                console.log("img.complete" + img.complete); //true
                ctx.drawImage(img, qrX, qrY, qrcodesize, qrcodesize);
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    quality: 1,
                    canvas: canvasObj, //现在的写法
                    destWidth: width * (wx.getSystemInfoSync().pixelRatio / 2), //设备像素比修正
                    destHeight: height * (wx.getSystemInfoSync().pixelRatio / 2), //设备像素比修正
                    success: (res) => {
                        wx.hideLoading();
                        var drawurl = res.tempFilePath;
                        wx.saveImageToPhotosAlbum({
                            filePath: drawurl,
                            success(res) {
                                console.log("保存相册成功" + res);
                                wx.showToast({
                                    'title': '保存相册成功'
                                });
                            },
                            fail: function (err) {
                                if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
                                    // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                                    wx.showModal({
                                        title: '提示',
                                        content: '需要您授权保存相册',
                                        showCancel: false,
                                        success: modalSuccess => {
                                            wx.openSetting({
                                                success(settingdata) {
                                                    console.log("settingdata", settingdata);
                                                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '获取权限成功,再次点击图片即可保存',
                                                            showCancel: false,
                                                        });
                                                    } else {
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '获取权限失败，将无法保存到相册哦~',
                                                            showCancel: false,
                                                        });
                                                    }
                                                },
                                                fail(failData) {
                                                    console.log("failData", failData);
                                                },
                                                complete(finishData) {
                                                    console.log("finishData", finishData);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    console.log("保存到相册失败" + res);
                                }
                            },
                        });
                    },
                    fail: function (error) {
                        console.log("canvasToTempFilePath" + error)
                    }
                }, that);
            };
            img.src = res.tempFilePath;
        });
    },
    /**
     *
     * @param {*} ctx 画布上下文环境
     * @param {string} str 描述的字符串
     * @param {number} leftWidth 距离左边的大小
     * @param {number} initHeight 初始的高度
     * @param {number} titleHeight 标题高度
     * @param {number} canvasWidth 画布的宽度
     */
    drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
        var lineWidth = 0;
        var linespace = this.data.linespace; //设置成30
        var lastSubStrIndex = 0; //每次开始截取的字符串的索引
        for (let i = 0; i < str.length; i++) {
            lineWidth += ctx.measureText(str[i]).width;
            if (lineWidth > canvasWidth) {
                ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
                initHeight += 25; //字体的高度
                lineWidth = 0;
                lastSubStrIndex = i;
                titleHeight += linespace;
            }
            if (i == str.length - 1) { //绘制剩余部分
                ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
            }
        }
        // 标题border-bottom 线距顶部距离
        titleHeight = titleHeight + linespace;
        return titleHeight
    },
    /**
     * 分享海报
     */
    MakePosters: async function () {
        try {
            let that = this;
            let record = this.data.detail;
            if (!record.madeposter) {
                wx.showToast({
                    'title': '生成中，请稍候',
                    icon: 'loading',
                    duration: 5000,
                })
                let url = `/pages/idiomdetail/idiomdetail?id=${this.data.id}&name=${this.data.name}`;
                let size = this.data.qrcodesize;
                //生成一个大小为55的小程序码
                util.GenQrCode('idiomdetail', url, this.data.id, size).then(res => {
                    wx.cloud.callFunction({
                        name: 'collection_update',
                        data: {
                            database: "idiom",
                            id: this.data.id,
                            values: {
                                madeposter: true
                            }
                        }
                    }).then(res => {
                        setTimeout(function () {
                            that.savecodetofile()
                        }, 4000);
                    })
                        .catch(console.error)
                })
            } else {
                wx.showToast({
                    'title': '制作中，请稍候',
                    icon: 'loading',
                    duration: 2000,
                })
                this.savecodetofile()
            }
        } catch (ex) {
            console.log("绘图出现了错误" + ex)
            wx.showToast({
                'title': '请重试'
            })
        }
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '一起来学习成语吧~', //此处为标题,
            path: `/pages/idiomdetail/idiomdetail?id=${this.data.id}&name=${this.data.name}`, //此处为路径,
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
})