const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const goKnowledgeDetail = e => {
  let _id = e.currentTarget.dataset.id
  wx.cloud.callFunction({
      name: 'collection_count_opened',
      data: {
        database: e.currentTarget.dataset.db,
        id: _id
      },
    }).then(res => {
      wx.navigateTo({
        url: `/pages/knowledgedetail/knowledgedetail?id=${e.currentTarget.dataset.id}`
      })
    })
    .catch(console.error)
}

function getOrCreateUserInfo(callback,e) {
  wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      if (res.result) {
        console.log('[云函数] [login] user openid: ', res.result.OPENID)
        app.globalData.openid = res.result.OPENID
        wx.cloud.callFunction({
            name: 'collection_get',
            data: {
              database: 'user',
              page: 1,
              num: 1,
              condition: {
                openid: app.globalData.openid
              }
            },
          }).then(res => {
            if (!res.result.data.length) {
              wx.cloud.callFunction({
                name: 'collection_add',
                data: {
                  database: 'user',
                  record: {
                    openid: app.globalData.openid,
                    avatarUrl: '../../images/game.png'
                  }
                },
              }).then(res => {
                app.globalData.userInfo._id = res.result._id; //给内存中的用户id赋值。
                app.globalData.userInfo.openid = app.globalData.openid;
                app.globalData.userInfo.avatarUrl = '../../images/game.png';
                console.log("新增用户" + res)
                callback(e);
              })
            } else {
              let res_data = res.result.data[0]
              app.globalData.userInfo = res_data
              app.globalData.isLogin = true
              callback(e);
            }
          })
          .catch(console.error)
      }
    },
    fail: err => {
      console.error('[云函数] [login] 调用失败', err)
    }
  })
}

const goPostDetailByAddr = e => {
  let id = e.currentTarget.dataset.id
  wx.cloud.callFunction({
      name: 'collection_get',
      data: {
        database: 'post',
        page: 1,
        num: 1,
        condition: {
          _id: id
        }
      },
    }).then(res => {
      if (!res.result.data.length) {
        wx.showToast({
          icon: 'warn',
          title: '跳转失败',
        })
      } else {
        let data = res.result.data[0];
        let infos = JSON.stringify(data.addrInfos)

        var obj = {
          id: id,
          list: infos,
          province: data.province,
          city: data.city,
          district: data.district
        };
        var input = encodeURIComponent(JSON.stringify(obj))
        wx.navigateTo({
          url: `/pages/postdetail/postdetail?obj=${input}`
        })
      }
    })
    .catch(err => {
      console.log('失败' + err)
    })
}

const goPostDetail = e => {
  let _id = e.currentTarget.dataset.id
  let city = e.currentTarget.dataset.city
  let district = e.currentTarget.dataset.district
  let province = e.currentTarget.dataset.province
  console.log("addrInfos" + e.currentTarget.dataset.addrinfos)
  let infos = JSON.stringify(e.currentTarget.dataset.addrinfos)
  wx.cloud.callFunction({
      name: 'collection_count_opened',
      data: {
        database: e.currentTarget.dataset.db,
        id: _id
      },
    }).then(res => {
      var obj = {
        id: _id,
        list: infos,
        province: province,
        city: city,
        district: district
      };
      var input = encodeURIComponent(JSON.stringify(obj))
      wx.navigateTo({
        url: `/pages/postdetail/postdetail?obj=${input}`
      })
    })
    .catch(console.error)
}

const goSearch = e => {
  let type = e.currentTarget.dataset.type
  let inputvalue = e.detail.value
  var obj = {
    type: type,
    inputvalue: inputvalue
  };
  var input = encodeURIComponent(JSON.stringify(obj))

  wx.navigateTo({
    url: `/pages/search/search?obj=${input}`,
  })
}

const goBackHome = e => {
  wx.switchTab({
    url: `/pages/index/index`,
  })
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isEmpty = obj => {
  if (typeof obj == "undefined" || obj == null || obj == "") {
    return true;
  } else {
    return false;
  }
}

/**
 * 生成路径下面的二维码
 * @param {当前图片分类} type
 * @param {小程序二维码的路径信息} url
 * @param {记录id，唯一标识} recordid
 * @param {小程序码尺寸大小} size
 */
const GenQrCode = async (type, url, recordid, size) => {
  let path = '';
  wx.cloud.callFunction({
    name: 'createqrcode',
    data: {
      path: url,
      size: size
    },
    success(res) {
      console.log(res);
      const filePath = `${wx.env.USER_DATA_PATH}/test.png`;
      wx.getFileSystemManager().writeFile({
        filePath,
        data: res.result.buffer,
        encoding: 'binary',
        success: () => {
          wx.cloud.uploadFile({
            cloudPath: `${type}/${recordid}.png`,
            filePath,
            success(Res) {
              console.log('success', Res);
            },
            fail(Res) {
              console.log('fail', Res);
            }
          })
        }
      })
    },
    fail(res) {
      console.log(res);
    }
  })
  return await path;
}

const handlerGohomeClick = e => {
  wx.switchTab({
    url: '/pages/index/index'
  });
}

const handlerGobackClick = e => {
  const pages = getCurrentPages();
  if (pages.length >= 2) {
    wx.navigateBack({
      delta: 1
    });
  } else {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
}

const goIdiomDetail = e => {
  let _id = e.currentTarget.dataset.id
  wx.cloud.callFunction({
      name: 'collection_count_opened',
      data: {
        database: e.currentTarget.dataset.db,
        id: _id
      },
    }).then(res => {
      wx.navigateTo({
        url: `/pages/idiomdetail/idiomdetail?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.name}`
      })
    })
    .catch(console.error)
}

const goPoemDetail = e => {
  let _id = e.currentTarget.dataset.id
  wx.cloud.callFunction({
      name: 'collection_count_opened',
      data: {
        database: e.currentTarget.dataset.db,
        id: _id
      },
    }).then(res => {
      wx.navigateTo({
        url: `/pages/poemdetail/poemdetail?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.name}`
      })
    })
    .catch(console.error)
}

const goPdfDetail = e => {
  let _id = e.currentTarget.dataset.id;
  let fileurl = e.currentTarget.dataset.fileurl;

  wx.cloud.callFunction({
      name: 'collection_count_opened',
      data: {
        database: e.currentTarget.dataset.db,
        id: _id
      },
    }).then(res => {
      var obj = {
        id: e.currentTarget.dataset.id,
        title: e.currentTarget.dataset.title,
        before: e.currentTarget.dataset.before,
        from: e.currentTarget.dataset.from,
        to: e.currentTarget.dataset.to,
        end: e.currentTarget.dataset.end,
        fileurl: fileurl
      };
      var input = encodeURIComponent(JSON.stringify(obj))
      wx.navigateTo({
        url: `/pages/pdfpreview/pdfpreview?obj=${input}`
      })
    })
    .catch(console.error)
}

const goCoupletDetail = e => {
  let _id = e.currentTarget.dataset.id
  wx.cloud.callFunction({
      name: 'collection_count_opened',
      data: {
        database: e.currentTarget.dataset.db,
        id: _id
      },
    }).then(res => {
      wx.navigateTo({
        url: `/pages/coupletdetail/coupletdetail?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.name}`
      })
    })
    .catch(console.error)
}

//避免页面重复跳转
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }
  let _lastTime = null // 返回新的函数
  return function () {
    let _nowTime = +new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments) //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

function ShareAppMessage() {
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
  return {
    title: '让知识触手可及',
    path: 'pages/index/index'
  }
}

function ShareTimeline() {
  return {
    title: '让知识触手可及',
    query: {},
    imageUrl: ''
  }
}

module.exports = {
  ShareAppMessage: ShareAppMessage,
  ShareTimeline: ShareTimeline,
  formatTime: formatTime,
  goKnowledgeDetail: goKnowledgeDetail,
  isEmpty: isEmpty,
  goSearch: goSearch,
  goIdiomDetail: goIdiomDetail,
  goPoemDetail: goPoemDetail,
  goCoupletDetail: goCoupletDetail,
  goPostDetail: goPostDetail,
  goPostDetailByAddr: goPostDetailByAddr,
  throttle: throttle,
  GenQrCode: GenQrCode,
  goPdfDetail: goPdfDetail,
  goBackHome: goBackHome,
  handlerGohomeClick: handlerGohomeClick,
  handlerGobackClick: handlerGobackClick,
  getOrCreateUserInfo: getOrCreateUserInfo
}