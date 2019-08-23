// pages/search/search.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputFocus: false,
    btnState: true,
    key: "", //搜索关键词
    inputValue: '', //输入栏的默认字
    currentArea: app.globalData.currentArea,//当前选中的地区
        turn: 1 ,//用于表示第几次上拉
        isAll:false //是否全部已经加载

  },
  /* 输入框聚焦时搜索按钮 */
  bindinput(e) {
    this.setData({
      key: e.detail.value
    });
    var key = this.data.key;
    //console.log(key);
    if (key != '') {
      this.setData({
        btnState: false
      })
    } else {
      this.setData({
        btnState: true
      })
    }
  },
  //输入框聚焦函数
  bindFocus() {
    //console.log("getFocus")
    this.setData({
      inputFocus: true
    })
  },

  loseFocus() {
    //console.log("loseFocus")
    this.setData({
      inputFocus: false,
      buttonFocus: true
    })
  },

  /* 点击搜索栏函数 */
  submit(e) { //搜索按钮确定
    if (e.detail.value.input != 0) {
      //console.log(e.detail.value.input);
      this.setData({
        key: e.detail.value.input,
        buttonFocus: false,
        isAll:false,
        turn:1
      })
      this.search();
    };

  },

  searchConfirm(e) { //键盘的右下确定
    if (e.detail.value != 0) {
      console.log(e);
      this.setData({
        key: e.detail.value,
        buttonFocus: false,
        isAll: false,
        turn:1
      })

      var that = this;
      that.search();
    };

  },
  /* 搜索接口 */
  search() {
    var key = this.data.key;
    //console.log(key)
    this.dBrequest(key);
  },

  dBrequest(e) { //查询用的数据库函数调用接口

    var key = String(e);
    console.log(key);

    const db = wx.cloud.database({});
    const _ = db.command;
    const cont = db.collection('Business').orderBy('date', 'desc');
    if (this.data.currentArea[0] == "全校范围") { //如果是全校范围则显示南校北校和全校
      cont.where(_.or([{
        title: db.RegExp({
          regexp: key, //从搜索栏中获取的key作为规则进行匹配。
          options: 'i', //大小写不区分
        })
      }, {
        body: db.RegExp({
          regexp: key, //从搜索栏中获取的key作为规则进行匹配。
          options: 'i', //大小写不区分
        })
      }])).limit(10).get({
        success: res => {
          console.log("数据库获取成功", res)
          var b = Object.keys(res.data);
          var i = b.length
          console.log("记录数有" + i)
          if(i==0){
            console.log("!!")
            wx.showToast({
              title: '没有相关记录',
              duration:1000,
              icon:"fail"
            })
          }
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
      cont.where(_.or([{
        title: db.RegExp({
          regexp: key, //从搜索栏中获取的key作为规则进行匹配。
          options: 'i', //大小写不区分
        })
      }, {
        body: db.RegExp({
          regexp: key, //从搜索栏中获取的key作为规则进行匹配。
          options: 'i', //大小写不区分
        })
      }])).limit(10).where({
        area: this.data.currentArea[0]
      }).get({
        success: res => {
          console.log("数据库获取成功", res)
          var b = Object.keys(res.data);
          var i = b.length
          console.log("记录数有" + i)
          if (i == 0) {
            console.log("!!")
            wx.showToast({
              title: '没有相关记录',
              duration: 1000,
              icon: "fail"
            })
          }
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
  //卡片点击后进入详情页
  cardTouch: function(e) {
    //console.log("该条目_id为"+e.detail); //即该记录的_id，传到detail界面再进行查询渲染
    wx.navigateTo({
      url: '../detail/detail?_id=' + e.detail, //此处再添加传递的数据
    })
  },
  /* 
  点击市场页面的服务类型
  
   */
  activeType: function(res) {

    var that = this;
    var type = res.target.dataset.index;

    if (type == 0) {
      this.setData({
        currentType: "收购",
        tradeType: "0"
      })
    } else if (type == 1) {
      this.setData({
        currentType: "出售",
        tradeType: "1"
      })
    } else {
      this.setData({
        currentType: "代跑腿",
        tradeType: "2"
      })
    }
    this.dBrequest();
    // console.log(this.data.currentType)
  },
  activeArea() { //当前选中的地区
    this.setData({
      currentArea: app.globalData.currentArea
    })
    // console.log("选中地区"+this.data.currentArea)
    //获取数据库
    // this.dBrequest();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.activeArea();
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
    var that=this;
    var key = that.data.key;
    //console.log("搜索的关键词为："+key);
if(this.data.isAll==false){
  var turn = this.data.turn;
  console.log("第" + turn + "次上拉")
  wx.showLoading({
    title: '加载中',
  })  
    const db = wx.cloud.database({});
    const _ = db.command;
    const cont = db.collection('Business').orderBy('date', 'desc');
    if (this.data.currentArea[0] == "全校范围") { //如果是全校范围则显示南校北校和全校
      cont.skip(turn * 10).limit(10).where(_.or([{
        title: db.RegExp({
          regexp: key, //从搜索栏中获取的key作为规则进行匹配。
          options: 'i', //大小写不区分
        })
      }, {
        body: db.RegExp({
          regexp: key, //从搜索栏中获取的key作为规则进行匹配。
          options: 'i', //大小写不区分
        })
      }])).get({
        success: res => {
          console.log("数据库获取成功", res)
          var b = Object.keys(res.data);
          var i = b.length
          console.log("记录数有" + i)
          if (i == 0) {
            wx.showToast({
              title: '没有相关记录',
              duration: 1000,
              icon: "fail"
            })
          }
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
          if (arrs.length == 0) {
            this.setData({
              isAll: true
            })
          }
          let arrs2 = that.data.goods.concat(arrs)
          this.setData({
            goods: arrs2,
            turn:turn+1
          });
          // console.log(arrs);
          wx.hideLoading()
        }
      })
    } else { //如果选择的不是全校范围则再判断
      cont.where(_.or([{
        title: db.RegExp({
          regexp: key, //从搜索栏中获取的key作为规则进行匹配。
          options: 'i', //大小写不区分
        })
      }, {
        body: db.RegExp({
          regexp: key, //从搜索栏中获取的key作为规则进行匹配。
          options: 'i', //大小写不区分
        })
        }])).skip(turn * 10).limit(10).where({
        area: this.data.currentArea[0]
      }).get({
        success: res => {
          console.log("数据库获取成功", res)
          var b = Object.keys(res.data);
          var i = b.length
          console.log("记录数有" + i)
          if (i == 0) {
            console.log("!!")
            wx.showToast({
              title: '没有相关记录',
              duration: 1000,
              icon: "fail"
            })
          }
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
            })
          }
          let arrs2 = that.data.goods.concat(arrs)
          this.setData({
            goods: arrs2,
            turn: turn + 1
          });
          // console.log(arrs);
          
        }
      })
    }}
    else{
      wx.showToast({
        title: '没有更多啦！',
        duration:1000
      })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})