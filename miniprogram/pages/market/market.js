// pages/market/market.js

const app = getApp()

Page({

  data: {

  },

  onLoad: function(options) {
    //获取用户openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  test: function(event) {
    var id = "13dba11c5d3486200cc7e27b0b38f6e4"
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })

  },

})