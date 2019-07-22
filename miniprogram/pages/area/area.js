// pages/area/area.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  area:app.globalData.area, //用全局变量赋一遍值
 
  },

/* 选中的地区 */
currentArea(e){
  //console.log(e);
  var a = e.target.dataset.index;
    app.globalData.currentArea[0]=app.globalData.area[a]
  //console.log(app.globalData.currentArea);
  wx.navigateBack({
  });
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})