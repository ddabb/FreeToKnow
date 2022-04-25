//app.js
import page from './utils/page';


var plugin = requirePlugin("myPlugin");
App({
    towxml: require('/towxml/index'),
    globalData: {
        userInfo: {},
        navBarHeight: 0,
        menuRight: 0,
        menuBotton: 0,
        menuHeight: 0,
        windowHeight: 0,
        windowWidth: 0,
        height: 0,
        isLogin: false,
        menuPlaceholder: "内容",
        CloudPathRoot: '', //云空间存储的地址
        defaultAvatarUrl: '',
        hexosite: '', //hexosite的地址
    },
    onLaunch: async function (options) {
        Page = page;
        var specialWay = [1007, 1008,1010, 1037, 1035];
        // 判断是否由分享进入小程序
        if (specialWay.indexOf(options.scene) > -1) {
            this.globalData.share = true
        } else {
            this.globalData.share = false
        };
        //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
        //这个最初我是在组件中获取，但是出现了一个问题，当第一次进入小程序时导航栏会把
        //页面内容盖住一部分,当打开调试重新进入时就没有问题，这个问题弄得我是莫名其妙
        //虽然最后解决了，但是花费了不少时间
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.height = res.statusBarHeight
                this.globalData.windowHeight = res.windowHeight
                this.globalData.windowWidth = res.windowWidth
            }
        })

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'stonecloud-base',
                traceUser: true,
            })
        }
        await wx.cloud.callFunction({
            name: 'collection_get',
            data: {
                database: 'global',
                page: 1,
                num: 1,
                condition: {

                }
            },
        }).then(res => {
            if (res.result.data.length) {
                let res_data = res.result.data[0]
                this.globalData.CloudPathRoot = res_data.CloudPathRoot;
                this.globalData.levelA = res_data.levelA;
                this.globalData.levelB = res_data.levelB;
                this.globalData.levelC = res_data.levelC;
                this.globalData.showView = res_data.showView;
                this.globalData.hexosite = res_data.hexosite;
                this.globalData.historyCount = res_data.historyCount;
                this.globalData.defaultAvatarUrl = this.globalData.CloudPathRoot + "/game.png"
            }


        })

        await wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                if (res.result) {
                    console.log('[云函数] [login] user openid: ', res.result.OPENID)
                    this.globalData.openid = res.result.OPENID
                    wx.cloud.callFunction({
                            name: 'collection_get',
                            data: {
                                database: 'user',
                                page: 1,
                                num: 1,
                                condition: {
                                    openid: this.globalData.openid
                                }
                            },
                        }).then(res => {
                            if (!res.result.data.length) {

                            } else {
                                let res_data = res.result.data[0]
                                this.globalData.userInfo = res_data
                                this.globalData.isLogin = true

                            }
                        })
                        .catch(console.error)

                }

            },
            fail: err => {
                console.error('[云函数] [login] 调用失败', err)
            }
        })
    },

    //判断用户是否已经登录
    hasUserInfo: function () {
        if (this.globalData.isLogin) {
            return true
        } else {
            wx.cloud.callFunction({
                    name: 'collection_get',
                    data: {
                        database: 'user',
                        page: 1,
                        num: 1,
                        condition: {
                            openid: this.globalData.openid
                        }
                    },
                }).then(res => {
                    if (!res.result.data.length) {
                        wx.navigateTo({
                            url: '/pages/auth/auth',
                        })
                        return true
                    } else {
                        let res_data = res.result.data[0]
                        this.globalData.userInfo = res_data
                        this.globalData.isLogin = true
                        return true

                    }
                })
                .catch(console.error)
        }

    }

})
