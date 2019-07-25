// pages/myBusiness/myBusiness.js

const app = getApp()

Page({

  data: {
    openid: '',
    urls: []
  },

  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  test: function(event) {
    var id = "face13585d3955330238040f337b5434";
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
  }
})