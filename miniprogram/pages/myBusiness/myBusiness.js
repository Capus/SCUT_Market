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

  test: function() {
    const db = wx.cloud.database()
    db.collection('Business').where({
      _openid: this.data.openid,
      body: 'test'
    }).get({
        success: res => {
          this.setData({
            urls: res.data[0]['imgs']
          })
          console.log('[数据库] [查询记录] 成功: ', res)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
  },

  test2: function(){
    this.data.urls.forEach((item, i)=>{
      wx.cloud.downloadFile({
        fileID: item
      }).then(res => {
        // get temp file path
        console.log(res.tempFilePath)
      }).catch(error => {
        // handle error
        console.log(error)
      })
    }) 
  }
})