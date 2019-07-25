// pages/market/market.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前选中的服务类型
    currentType: 0,
    // 市场页面的数据
    navList: [
      { "type": "收" },
      { "type": "出" },
      { "type": "代跑腿" }
    ],
    area: app.globalData.area, //用全局变量赋一遍值 
    currentArea: app.globalData.currentArea,//当前选中的地区用id表示 0全校 1北校 2南校
    goods: [
      {
        title: "出挪鸡鸭一只",
        description: "诺基亚公司(Nokia Corporation)是一家总部位于芬兰埃斯波 ，主要从事移动通信设备生产和相关服务的跨国公司。诺基亚成立于1865年，以伐木、造纸为主业，逐步向胶鞋、轮胎、电缆等领域扩展。",
        pictureUrl: ["/imagefortest/goods101.jpg", "/imagefortest/goods101.jpg", "/imagefortest/goods101.jpg"],
        price: "100元",
        date: "2019/01/01",
        comments: [{
          name: "锦饭",
          comment: "我想要！"
        }, {
          name: "茨木童子",
          comment: "不，你不想"
        },]
      },
      {
        title: "出挪鸡鸭两只",
        description: "喵喵喵喵喵喵喵喵喵",
        pictureUrl: ["/imagefortest/goods101.jpg"],
        price: "100元",
        date: "2019/01/01",
        comments: [{
          name: "锦饭",
          comment: "我想要！"
        },]
      },
      {
        title: "出挪鸡鸭三只",
        description: "喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵喵",
        pictureUrl: [],
        price: "100元",
        date: "2019/01/01",
        comments: [{
          name: "锦饭",
          comment: "我想要！"
        }, {
          name: "茨木童子",
          comment: "不，你不想"
        }]
      }]
  },
  /* 
  点击市场页面的服务类型
  
   */
  activeType: function (res) {
    //console.log(res)
    var that = this;
    this.setData({
      currentType: res.target.dataset.index
    })
  },


  //卡片点击后进入详情页
  cardTouch: function(event) {

  },
  onLoad: function(options) {
    //获取用户openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        app.globalData.userName = 'user-' + res.result.openid.substring(6, 10)
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