// pages/myBusiness/myBusiness.js

const app = getApp()

Page({

  data: {
    openid: '',
    urls: [],
    goods: [],
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
          goods: arrs
        });
        // console.log(arrs);
      }
    })

  },

  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    this.dBrequest();
  },

  deleteF: function(){
    const db = wx.cloud.database({});
    const cont = db.collection('Business').orderBy('date', 'desc');
  }


})