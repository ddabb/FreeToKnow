var Board = require("./grid.js");
var Main = require("./main.js");
//获取应用实例
const app = getApp()
var util = require('../../util.js')
Page({
    data: {
        hidden: false,
        start: "开始",
        num: [], //二维正方形
        score: 0,
        bestScore: 0, // 最高分
        endMsg: '',
        cacheGrid: null, //缓存信息
        showArea: true,
        showForm: false,
        letters1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        letters2: ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',],
        letters3: ['Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'],
        scene: "",
        empty: '\t',
        newLine: '\n',
        showFont: false,
        over: false // 游戏是否结束
    },

    // 页面渲染完成
    onLoad: function (e) {
        if (app.globalData.showView) {
            if (app.globalData.share) {
                this.setData({
                    scene: "分享进入",
                    showForm: true
                })
                util.getOrCreateUserInfo(this.InitMethod);
            } else {
                this.setData({
                    showForm: true
                })
                this.InitMethod();
            }
        } else {
            wx.switchTab({
                url: '/pages/index/index'
            });
        }
    },

    InitMethod: function () {
        if (app.globalData.userInfo && app.globalData.userInfo.pscore) {
            this.setData({
                bestScore: app.globalData.userInfo.pscore,
                showFont: app.globalData.userInfo.pscore > 0
            });
        }
        this.gameStart();
        if (app.globalData.userInfo && app.globalData.userInfo.psharp) {
            this.setData({
                start: "重玩",
                hidden: true,
            });
            this.data.main.board.grid = app.globalData.userInfo.psharp;
            this.updateView(app.globalData.userInfo.psharp);
        }
    },

    gameStart: function () { // 游戏开始
        this.updateDbScore();
        var main = new Main(4);
        this.setData({
            endMsg: '',
            main: main
        });
        this.data.main.__proto__ = main.__proto__;

        this.setData({
            hidden: true,
            over: false,
            score: 0,
            num: this.data.main.board.grid
        });
    },
    gameOver: function () { // 游戏结束
        this.setData({
            over: true
        });

        if (this.data.score > this.data.bestScore) {
            this.setData({
                endMsg: '创造新纪录！',
                bestScore: this.data.score
            });
            wx.setStorageSync('highScore', this.data.score);
        } else {
            this.updateDbScore(); //游戏结束，保存历史最高分
            this.setData({
                start: "开始",
                endMsg: '游戏结束！'
            });
        }
    },
    // 触摸
    touchStartX: 0,
    touchStartY: 0,
    touchEndX: 0,
    touchEndY: 0,
    //点击撤销按钮
    clickReDoOnce: false,
    /*
    撤销功能
    */
    redo() {
        let {
            cacheGrid
        } = this.data;
        if (cacheGrid != null) {
            app.globalData.userInfo.psharp = cacheGrid;
            this.data.main.board.grid = cacheGrid;
            this.updateView(cacheGrid)

            this.clickReDoOnce = true;
        }
    },
    touchStart: function (ev) { // 触摸开始坐标
        if (this.clickReDoOnce) {
            this.setData({
                start: "重置"
            });
            this.clickReDoOnce = false;
        } {
            let cacheGrid = this.data.main.board.grid;
            this.setData({
                start: "重置",
                cacheGrid: cacheGrid
            });
        }

        var touch = ev.touches[0];
        this.touchStartX = touch.clientX;
        console.log("  this.touchStartX" + this.touchStartX)
        this.touchStartY = touch.clientY;
        console.log("  this.touchStartY" + this.touchStartY)
    },

    touchEnd: function (ev) {
        var touch = ev.changedTouches[0];
        this.touchEndX = touch.clientX;
        console.log("  this.touchEndX" + this.touchEndX)
        this.touchEndY = touch.clientY;
        console.log("  this.touchEndY" + this.touchEndY)
        console.log("touchEnd")
        var disX = this.touchStartX - this.touchEndX;
        var absdisX = Math.abs(disX);
        console.log(" disX" + disX)
        var disY = this.touchStartY - this.touchEndY;
        var absdisY = Math.abs(disY);
        console.log(" disY" + disY)
        if (this.data.main.isOver()) { // 游戏是否结束
            this.gameOver();
        } else {
            let dis = Math.max(absdisX, absdisY);
            console.log("dis" + dis)
            if (dis > 3) { // 减少触屏失效的错句
                var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0); // 确定移动方向

                var data = this.data.main.move(direction);
                this.updateView(data);
                app.globalData.userInfo.psharp = this.data.main.board.grid; //保存最新的棋盘信息
            }
        }
    },

    updateDbScore: function (callback, e) {
        let {
            cacheGrid
        } = this.data;
        if (app.globalData.userInfo && cacheGrid != null) {
            let historyScore = app.globalData.userInfo.pscore; //历史最高的2048的分数
            if (this.data.bestScore != 0 && (typeof historyScore == "undefined" || this.data.bestScore > historyScore)) {
                let bestScore = this.data.bestScore;
                app.globalData.userInfo.pscore = this.data.bestScore;
                wx.cloud.callFunction({
                    name: 'collection_update',
                    data: {
                        database: "user",
                        id: app.globalData.userInfo._id,
                        values: {
                            pscore: bestScore,
                            psharp: this.data.main.board.grid
                        }
                    }
                }).then(() => {
                    if (callback != undefined) {
                        callback(e);
                    }
                })
            } else {
                if (callback != undefined) {
                    callback(e);
                }
            }
        } else {
            if (callback != undefined) {
                callback(e);
            }
        }
    },

    //将形状缓存起来
    save() {
        let {
            cacheGrid
        } = this.data;
        if (cacheGrid != null) {
            wx.cloud.callFunction({
                name: 'collection_update',
                data: {
                    database: "user",
                    id: app.globalData.userInfo._id,
                    values: {
                        psharp: this.data.main.board.grid
                    }
                }
            }).then(wx.showToast({
                icon: 'success',
                title: '保存成功',
            }))
        }
    },

    /**
     * 更新最大分数
     * score 是页面上所有分数之和
     */
    updateView(data) {
        var max = 0;

        for (var i = 0; i < 4; i++)
            for (var j = 0; j < 4; j++) {
                if (data[i][j] != "") {
                    max += this.GetCellScore(data[i][j]);
                }
            }
        this.setData({
            num: data,
            score: max
        });
        if (max > this.data.bestScore) {
            this.setData({
                endMsg: '创造新纪录！',
                bestScore: max,
                showFont: max > 1000
            });
        }
    },
    GetCellScore: function (value) {
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

        var index = letters.indexOf(value);
        return 3 * (2 ** index);
    },
    onShareAppMessage: function () {
        let title = `ABC合成记,我最好的成绩是${this.data.bestScore}分~`;
        wx.setNavigationBarTitle({
            title: title //页面标题为路由参数
        });
        this.setData({
            showArea: false,
            title: title
        })
        return {
            title: title, //此处为标题,
            path: `/pages/pIndex/pIndex`, //此处为路径,
            // imageUrl: randomImg, //此处就是写的随机分享图片,
            success: function (res) {
                //这里为分享成功后的回调函数,
            },
            fail: function (res) {
                //此处为转发失败后的回调函数
            }
        }
    },

    gameRank: function () {
        this.updateDbScore(this.goGameRank);
    },
    goGameRank: function () {
        wx.navigateTo({
            url: `/pages/gameRank/gameRank`
            //  url: '../logs/logs'
        })
    },
    onShow: function () {
        this.setData({
            showArea: true,
            title: 'ABC合成记'
        })
    },
    onShareTimeline: function () {
        let title = `ABC合成记,我最好的成绩是${this.data.bestScore}分~`;
        this.setData({
            showArea: false,
            title: title
        })
        wx.setNavigationBarTitle({
            title: title //页面标题为路由参数
        });
        return {
            title,
            query: {},
            imageUrl: ''
        }
    },
    handlerGobackClick() {
        this.updateDbScore(this.callbackGobackClick);
    },
    callbackGobackClick: function () {
        util.handlerGobackClick(function (e) {
            util.goSearch(e)
        }, 1000)
    },
    callbacGohomeClick: function () {
        util.handlerGohomeClick(function (e) {
            util.goSearch(e)
        }, 1000)
    },

    handlerGohomeClick() {
        this.updateDbScore(this.callbacGohomeClick);
    },
})