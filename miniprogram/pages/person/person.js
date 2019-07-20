// pages/person/person.js

const app = getApp()

Page({

  data: {
    openid: '',
    token: ''
  },

  per_info: function() {
    wx.navigateTo({
      url: '../per_info/per_info',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  myBusiness: function() {
    wx.navigateTo({
      url: '../myBusiness/myBusiness',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid,
        token: app.globalData.openid.substring(6, 10)
      })
    }
  }

})