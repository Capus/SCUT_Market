// pages/search/search.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputFocus:false, 
    btnState:true,
    key:"",//搜索关键词
   inputValue:'',//输入栏的默认字
   currentArea: app.globalData.currentArea//当前选中的地区用id表示 0全校 1北校 2南校 

  },
  /* 输入框聚焦时搜索按钮 */
  bindinput(e){
this.setData({
  key:e.detail.value
});
var key=this.data.key;
//console.log(key);
if(key!=''){
this.setData({
  btnState:false
})
}else{
  this.setData({
    btnState: true
  })
}
  },
  //输入框聚焦函数
  bindFocus(){
//console.log("getFocus")
this.setData({
  inputFocus:true
})
  },

loseFocus(){
  //console.log("loseFocus")
  this.setData({
    inputFocus: false,
    buttonFocus:true
  })
},

/* 点击搜索栏函数 */
submit(e){  //搜索按钮确定
  if (e.detail.value.input!=0){
    //console.log(e.detail.value.input);
    this.setData({
      key: e.detail.value.input,
      buttonFocus:false,
    })
    this.search();
  };

},

  searchConfirm(e){ //键盘的右下确定
  if(e.detail.value!=0){
    console.log(e);
    this.setData({
      key: e.detail.value,
      buttonFocus: false,
    })
   
    var that=this;
    that.search();
  };

},
/* 搜索接口 */
search(){
  var key=this.data.key;
  console.log(key)
  wx.request({ //请求服务器
    url: '',
    data: '',
    header: {},
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {},//成功则在此返回要显示的商品
    fail: function(res) {},
    complete: function(res) {},
  })
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
    this.setData({
      currentArea: app.globalData.currentArea
    })
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