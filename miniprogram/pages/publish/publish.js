// pages/publish/publish.js
const app = getApp()
Page({

  data: {
    openid: '',
    inputValue: '',//清空输入框
    body: '',//标题、正文、号码
    contactWay: '',//微信、qq、电话
    businessWay: '',//出售、收购、跑腿
    array: ['wechat', 'qq', 'telephone'],
    index: 0
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
        businessWay: res.detail.value['BusinessWay']
      }
    })
  },


  onAdd: function() {
    const db = wx.cloud.database()
    db.collection('Business').add({
      data: {

      }
    })
  },


  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})