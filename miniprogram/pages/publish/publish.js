// pages/publish/publish.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  data: {
    openid: '',
    inputValue: '', //清空输入框
    body: '', //标题、正文、号码
    contactWay: '', //微信、qq、电话
    businessWay: '', //出售、收购、跑腿
    array: ['wechat', 'qq', 'telephone'],
    index: 0,
    files: [],
    fileIDs: []
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  formSubmit: function(res) {
    console.log(res)
    this.setData({
      body: res.detail.value,
      contactWay: this.data.array[this.data.index],
    })
    const db = wx.cloud.database()
    db.collection('Business').add({
      data: {
        title: res.detail.value['Title'],
        body: res.detail.value['Body'],
        contact: res.detail.value['Contact'],
        contactWay: this.data.array[this.data.index],
        businessWay: res.detail.value['BusinessWay'],
        imgs: this.data.fileIDs,
        date: util.formatTime(new Date())
      }
    })
  },

  chooseImage: function() {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        })
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
        })
        const filePath = res.tempFilePaths
        const cloudPath = []
        const fileIDs = that.data.fileIDs
        filePath.forEach((item, i) => {
          cloudPath.push('user' + that.data.token + filePath[i].substring(filePath[i].length-12, filePath[i].length-4) + filePath[i].match(/\.[^.]+?$/)[0])
        })
        filePath.forEach((item, i) => {
          wx.cloud.uploadFile({
            cloudPath: cloudPath[i],
            filePath: filePath[i],
            success: res => {
              console.log('[上传文件] 成功：', res)
              fileIDs.push(res.fileID)
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
              that.setData({
                fileIDs: unique(fileIDs)
              })
            }
          })
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.files
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

function unique(arr) {
  return Array.from(new Set(arr))
}