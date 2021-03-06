// pages/user/user.js
const app = getApp();
var util = require('../../util.js')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},

        openid: "",
        logged: false,
        hasImg: false, //是否有头像信息
        username: "",
        place: "",
        showArea: true,
        showView: false,
        showImg: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("进入用户页检查是否登录:", app.globalData.isLogin);
        console.log("是否已授权：", wx.getStorageSync("isLogin"));
        console.log("是否已有用户openId：", app.globalData.openid);

        wx.showLoading({
            title: "正在加载...",
            mask: true,
        });

        if (app.globalData.isLogin) {
            let imgurl = app.globalData.userInfo.avatarUrl != null && app.globalData.userInfo.avatarUrl.length > 0 ? app.globalData.userInfo.avatarUrl : app.globalData.defaultAvatarUrl
            this.setData({
                logged: true,
                avatarUrl: imgurl,
                username: app.globalData.userInfo.nickName,
            });
        } else {
            this.setData({
                avatarUrl: app.globalData.defaultAvatarUrl,
            });
        }

        wx.hideLoading();
        if (app.globalData.openid) {
            this.setData({
                openid: app.globalData.openid,
            });
        }
        this.setData({
            showView: app.globalData.showView,
        });
    },
    bindMyHistory: function () {
        if (!app.globalData.isLogin) {
            wx.showToast({
                icon: 'warn',
                title: '请您先登录',
            })
        } else {
            let url = '/pages/history/index';
            wx.navigateTo({
                url: url
            })
        }
    },
    bindgopay: function () {
        let url = '/pages/pay/index';
        wx.navigateTo({
            url: url
        })
    },
    bindgonote: function () {
        let url = '/pages/note/note';
        wx.navigateTo({
            url: url
        })
    },

    bindMyStudy: function () {
        if (!app.globalData.isLogin) {
            wx.showToast({
                icon: 'warn',
                title: '请您先登录',
            })
        } else {
            let url = '/pages/study/index';
            wx.navigateTo({
                url: url
            })
        }
    },
    ResetImg(e) {
        wx.navigateTo({
            url: '/pages/auth/auth',
        })

        wx.showToast({
            icon: 'success',
            title: '请重新授权',
        })
    },

    handleContact(e) {
        console.log(e.detail.path)
        console.log(e.detail.query)
    },
    onGetUserInfo: async function (e) {
        if (await app.hasUserInfo()) {
            var temp = app.globalData.userInfo;
            this.setData({
                logged: true,
                avatarUrl: temp.avatarUrl,
                userInfo: temp,
                username: temp.nickName,
            });

            console.log("this.data.avatarUrl" + this.data.avatarUrl)
            console.log("this.data.username" + this.data.username)
            wx.setStorageSync("isLogin", this.data.logged);
            wx.setStorageSync("avatarUrl", this.data.avatarUrl);
            wx.setStorageSync("username", this.data.username);
            app.globalData.isLogin = wx.getStorageSync("isLogin");
            app.globalData.avatarUrl = wx.getStorageSync("avatarUrl");
            app.globalData.username = wx.getStorageSync("username");
        } else return
    },

    goAbout() {
        wx.navigateTo({
            url: `/pages/aboutme/aboutme`
        })
    },

    goMatchGame() {
        if (!app.globalData.isLogin) {
            wx.showToast({
                icon: 'warn',
                title: '请您先登录',
            })
        } else {
            wx.navigateTo({
                url: `/pages/pIndex/pIndex`
            })
        }
    },
    goLog() {
        wx.navigateTo({
            url: `/pages/log/log`
        })
    },

    goWeXin() {
        wx.navigateTo({
            url: `/pages/weixin/weixin`
        })
    },

    goChatWithAi() {
        wx.navigateTo({
            url: `/pages/rewritePluginPage/rewritePluginPage`
        })
    },

    goSuggestList() {
        if (!app.globalData.isLogin) {
            wx.showToast({
                icon: 'warn',
                title: '请您先登录',
            })
        } else {
            wx.navigateTo({
                url: `/pages/suggest/suggest`
            })
        }
    },
    goAddSuggest() {
        if (!app.globalData.isLogin) {
            wx.showToast({
                icon: 'warn',
                title: '请您先登录',
            })
        } else {
            wx.navigateTo({
                url: `/pages/addsuggest/addsuggest`
            })
        }
    },

    gohexotag() {
        wx.navigateTo({
            url: `/pages/hexotags/hexotags`
        })
    },

    gohexocategories() {
        wx.navigateTo({
            url: `/pages/hexocategories/hexocategories`
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            showArea: true
        })
        if (app.globalData.isLogin) {
            let imgurl = '';
            let needReset = false;
            if (app.globalData.userInfo.avatarUrl != null && app.globalData.userInfo.avatarUrl.length > 0) {
                imgurl = app.globalData.userInfo.avatarUrl;
                needReset = false;
            } else {
                imgurl = app.globalData.defaultAvatarUrl;
                needReset = true;
            }
            this.setData({
                logged: true,
                avatarUrl: imgurl,
                needReset: needReset,
                username: app.globalData.userInfo.nickName,
            });
        }
        if (app.globalData.openid) {
            this.setData({
                openid: app.globalData.openid,
            });
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () { },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        this.setData({
            showArea: false
        })
        return {
            title: '让知识触手可及~', //此处为标题,
            path: `/pages/index/index`, //此处为路径,
            // imageUrl: randomImg, //此处就是写的随机分享图片,
        }
    },
    onShareTimeline: function () {
        util.ShareTimeline()
    },
});