// pages/myBusiness/myBusiness.js

const app = getApp()

Page({

  data: {
    openid: '',
    urls: [],
    goods: [],
    turn:1 //第几次上拉
  },

  dBrequest() {
    const db = wx.cloud.database({});
    const cont = db.collection('Business').orderBy('date', 'desc');

    cont.where({
      _openid: this.data.openid, //选择服务类型 
    }).get({
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
          goods: arrs,
        });
        // console.log(arrs);
      }
    })

  },
onShow(){
  this.setData({
    turn:1
  })
},
  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid,
      })
    }
    this.dBrequest();
  },

  deleteF: function(e){
    var that = this 
    var _id = e.currentTarget.dataset.index;
    var goodarr = this.data.goods;
   
    wx.showModal({
      title: '提示',
      content: '确定要删除此帖吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          goodarr.splice(_id,1);
          that.setData({
            goods: goodarr
          })
          wx.cloud.callFunction({
            name: 'remove',
            data: {
              id: _id
            },
            success: function (res) {
              console.log(res)
              console.log("ok")
            },
            fail: console.error
          })
        }else if(res.cancel){
          console.log('点击取消了');
          return false;
        }
      }
    })
  },

  cardTouch: function (e) {
    //console.log("该条目_id为"+e.detail); //即该记录的_id，传到detail界面再进行查询渲染
    wx.navigateTo({
      url: '../detail/detail?_id=' + e.detail, //此处再添加传递的数据
    })
  },
  onReachBottom(){
    var that=this
    var turn=this.data.turn
    const db = wx.cloud.database({});
    const cont = db.collection('Business').orderBy('date', 'desc');

    cont.where({
      _openid: this.data.openid, //选择id
    }).skip(turn*20).get({
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
        let arrs2=that.data.goods.concat(arrs)
        this.setData({
          goods: arrs2,
          turn:turn+1
        });
        // console.log(arrs);
      }
    })
  }


})