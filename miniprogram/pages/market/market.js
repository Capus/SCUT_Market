// pages/market/market.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAll:false,//用于判断是否全部显示完了
    _openid: '',
    currentType: "出售", //当前选中的服务类型
    tradeType: "1", //用于显示选中的服务active类型
    // 市场页面的数据
    navList: [{
      "type": "收购"
    },
    {
      "type": "出售"
    },
    {
      "type": "代跑腿"
    }
    ],
    area: app.globalData.area, //用全局变量赋一遍值 
    currentArea: app.globalData.currentArea, //当前选中的地区
    goods: [],
    turn:1 //用于表示第几次上拉
  },
  /* 调用数据库函数 尚未完成条件筛选功能 */
  dBrequest() {
    const db = wx.cloud.database({});
    const cont = db.collection('Business').orderBy('date', 'desc');

    if (this.data.currentArea[0] == "全校范围") { //如果是全校范围则显示南校北校和全校
      cont.where({
        businessWay: this.data.currentType, //选择服务类型 
      }).limit(10).get({
        success: res => {
          console.log("数据库获取成功", res)
          var b = Object.keys(res.data);
          var i = b.length
          console.log("记录数有" + i)
          var arrs = [];
          for (var a = 0; a < i; a++) {
            //console.log(res.data[a])
            var objs = {};
            objs.area = res.data[a].area;
            objs.body = res.data[a].body;
            objs.businessWay = res.data[a].businessWay;
            objs.comments = res.data[a].comments;
            objs.contact = res.data[a].contact;
            objs.contactWay = res.data[a].contactWay;
            objs.date = res.data[a].date;
            objs.imgs = res.data[a].imgs;
            objs.price = res.data[a].price;
            objs.title = res.data[a].title;
            objs.userName = res.data[a].userName;
            objs._id = res.data[a]._id;
            // console.log("第"+a+"记录为"+JSON.stringify(objs))
            arrs.push(objs);
          }
          this.setData({
            goods: arrs
          });
          // console.log(arrs);
        }
      })
    } else { //如果选择的不是全校范围则再判断
      cont.where({
        businessWay: this.data.currentType, //选择服务类型
        area: this.data.currentArea[0] //选择服务地区
      }).limit(10).get({
        success: res => {
          console.log("数据库获取成功", res)
          var b = Object.keys(res.data);
          var i = b.length
          console.log("记录数有" + i)
          var arrs = [];
          for (var a = 0; a < i; a++) {
            //console.log(res.data[a])
            var objs = {};
            objs.area = res.data[a].area;
            objs.body = res.data[a].body;
            objs.businessWay = res.data[a].businessWay;
            objs.comments = res.data[a].comments;
            objs.contact = res.data[a].contact;
            objs.contactWay = res.data[a].contactWay;
            objs.date = res.data[a].date;
            objs.imgs = res.data[a].imgs;
            objs.price = res.data[a].price;
            objs.title = res.data[a].title;
            objs._id = res.data[a]._id;
            objs.userName = res.data[a].userName;
            // console.log("第"+a+"记录为"+JSON.stringify(objs))
            arrs.push(objs);
          }
          this.setData({
            goods: arrs
          });
          // console.log(arrs);
        }
      })
    }
  },

  /* 
  点击市场页面的服务类型
  
   */
  activeType: function (res) {

    var that = this;
    var type = res.target.dataset.index;

    if (type == 0) {
      this.setData({
        currentType: "收购",
        tradeType: "0",
        turn:1,
        isAll:false
      })
    } else if (type == 1) {
      this.setData({
        currentType: "出售",
        tradeType: "1",
        turn:1,
        isAll:false
      })
    } else {
      this.setData({
        currentType: "代跑腿",
        tradeType: "2",
        turn:1,
        isAll:false
      })
    }
    this.dBrequest();
    // console.log(this.data.currentType)
  },


  //卡片点击后进入详情页
  cardTouch: function (e) {
    //console.log("该条目_id为"+e.detail); //即该记录的_id，传到detail界面再进行查询渲染
    wx.navigateTo({
      url: '../detail/detail?_id=' + e.detail, //此处再添加传递的数据
    })
  },

  onLoad: function (options) {
    //获取用户openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        app.globalData.userName = 'user-' + res.result.openid.substring(6, 10)
        this.setData({
          _openid: res.result.openid
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

    //获取数据库
    this.dBrequest();

  },


  activeArea() { //当前选中的地区
    this.setData({
      currentArea: app.globalData.currentArea,
      turn:1,
      isAll:false
    })
    // console.log("选中地区"+this.data.currentArea)
    //获取数据库
    this.dBrequest();
  },

  onShow: function () {
    this.activeArea();
   

  },


  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    this.dBrequest();
    setTimeout(function () {

      // complete

      wx.hideNavigationBarLoading() //完成停止加载

      wx.stopPullDownRefresh() //停止下拉刷新

    }, 1500);
   
  },
  onReachBottom: function () {
    var that = this;
    if(that.data.isAll==false){ //判断是否全部信息加载完
      var turn = this.data.turn;
    console.log("第"+turn+"次上拉")
    wx.showLoading({
             title: '加载中',
         })  
    const db = wx.cloud.database({});
    const cont = db.collection('Business').orderBy('date', 'desc');

    if (this.data.currentArea[0] == "全校范围") { //如果是全校范围则显示南校北校和全校
      cont.where({
        businessWay: this.data.currentType, //选择服务类型 
      }).skip(turn*10).limit(10).get({
        success: res => {
          console.log("上拉数据获取成功", res)
          var b = Object.keys(res.data);
          var i = b.length
          console.log("记录数有" + i)
          var arrs = [];
          for (var a = 0; a < i; a++) {
            //console.log(res.data[a])
            var objs = {};
            objs.area = res.data[a].area;
            objs.body = res.data[a].body;
            objs.businessWay = res.data[a].businessWay;
            objs.comments = res.data[a].comments;
            objs.contact = res.data[a].contact;
            objs.contactWay = res.data[a].contactWay;
            objs.date = res.data[a].date;
            objs.imgs = res.data[a].imgs;
            objs.price = res.data[a].price;
            objs.title = res.data[a].title;
            objs.userName = res.data[a].userName;
            objs._id = res.data[a]._id;
            //console.log("第"+a+"记录为"+JSON.stringify(objs))
            arrs.push(objs);
          }
          if(arrs.length==0){
            this.setData({
              isAll:true
            })
          }
          let arrs2=that.data.goods.concat(arrs)
          this.setData({
            goods: arrs2,
            turn:turn+1
          });
          wx.hideLoading();
          // console.log(arrs);
        }
      })
    } else { //如果选择的不是全校范围则再判断
      cont.where({
        businessWay: this.data.currentType, //选择服务类型
        area: this.data.currentArea[0] //选择服务地区
      }).skip(turn * 10).limit(10).get({
        success: res => {
          console.log("上拉数据获取成功", res)
          var b = Object.keys(res.data);
          var i = b.length
          console.log("记录数有" + i)
          var arrs = [];
          for (var a = 0; a < i; a++) {
            //console.log(res.data[a])
            var objs = {};
            objs.area = res.data[a].area;
            objs.body = res.data[a].body;
            objs.businessWay = res.data[a].businessWay;
            objs.comments = res.data[a].comments;
            objs.contact = res.data[a].contact;
            objs.contactWay = res.data[a].contactWay;
            objs.date = res.data[a].date;
            objs.imgs = res.data[a].imgs;
            objs.price = res.data[a].price;
            objs.title = res.data[a].title;
            objs._id = res.data[a]._id;
            objs.userName = res.data[a].userName;
            // console.log("第"+a+"记录为"+JSON.stringify(objs))
            arrs.push(objs);
          }
          if (arrs.length == 0) {
            this.setData({
              isAll: true
            })}
          let arrs2 = that.data.goods.concat(arrs)
          this.setData({
            goods: arrs2,
            turn: turn + 1
          });
          wx.hideLoading();
          // console.log(arrs);
        }
      })
    }
    }else{ //如果已经加载完则
      wx.showToast({
        title: '没有更多啦！',
        duration:1000
      })
    }
  },
})