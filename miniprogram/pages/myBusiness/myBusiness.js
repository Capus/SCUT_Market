// pages/myBusiness/myBusiness.js

const app = getApp()

Page({

  data: {
    openid: '',
    queryResult: ''
  },

  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

})