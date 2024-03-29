const app = getApp()
var util = require('../../utils/util.js')
Page({

  data: {
    openid: '',
    openGid: '',
    id: '',
    contact_user: '',
    userName: '',
    inputVal: '', //评论输入值
    focus: false, //键盘是否聚焦
    placeholder: '留下你的评论吧！',
    now_reply: 0, //回复对象的id
    now_reply_name: null, //回复对象的名字
    now_reply_type: 0, //0是评论，1是回复评论，2是回复评论的评论
    now_parent_id: 0, //现在准备回复那条评论下的评论的id
    img_url: [],
    area: '', //交易的地区
    price: '', //价格
    record: 1, //手动控制comment_id
    comment_list: [{}],
    comment_list2: [{}],
    good_users: [],
    liked: false,
    numberOfGood: 0,
  },

  onLoad: function(options) {
    //console.log(options)
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid,
        userName: app.globalData.userName
      })
    }

    var that = this

    //获取数据的id
    this.setData({
      id: options._id //！！！命名不统一
    })
    const db = wx.cloud.database({});
    const cont = db.collection('Business');
    cont.doc(options._id).get({
      success: function(res) {
        console.log(res.data)
        that.setData({
          area: res.data.area,
          price: res.data.price,
          business: res.data,
          img_url: res.data.imgs,
          record: res.data.comment['record'],
          comment_list: res.data.comment['clist1'],
          comment_list2: res.data.comment['clist2'],
          good_users: res.data.good_users,
          numberOfGood: res.data.good_users.length,
          userName: app.globalData.userName,
          contact_user: res.data.userName
        })

        var index = res.data.good_users.indexOf(that.data.userName);
        console.log(index);
        if (index < 0) {
          that.setData({
            liked: false
          })
          console.log("没点赞")
        } else {
          that.setData({
            liked: true
          })
          console.log("点赞了")
        }
      }
    })

    
  },

  onShareAppMessage: function() {
    return {
      title: this.data.business.businessWay + ':' + this.data.business.title,
      path: '/pages/detail/detail',
      success: function(res) {
        console.log("转发成功：" + JSON.stringify(res));
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function(res) {
            console.log(res)
            var encryptedData = res.encryptedData;
            var iv = res.iv;
          }
        })
      },
      fail: function(res) {
        console.log("转发失败：" + JSON.stringify(res));
      }
    }
  },
  //键盘聚焦函数
  focus: function(e) {
    this.setData({
      focus: true
    })
  },

  //键盘取消聚焦函数
  blur: function(e) {
    var that = this;
    const text = e.detail.value.trim();
    if (text === '') {
      that.setData({
        now_reply: 0,
        now_reply_name: null,
        now_reply_type: 0,
        now_parent_id: 0,
        placeholder: "留下你的评论吧！",
      });
    }
    this.setData({
      focus: false
    })
  },

  //点击发送函数
  sendClick: function(e) {
    var comment_text = this.data.inputVal
    var comment_user_name = this.data.userName
    var contact_user_name = this.data.contact_user
    var comment_time = util.formatTime(new Date())
    var reply_name = null
    var parent_id = 0
    var reply_id = this.data.now_reply
    if (reply_id != 0) { //回复
      var reply_type = this.data.now_reply_type
      parent_id = this.data.now_parent_id
      if (reply_type == 1) { //回复评论
        parent_id = reply_id
        reply_name = this.data.now_reply_name
        contact_user_name = reply_name
      } else { //回复评论的评论
        reply_name = this.data.now_reply_name
        contact_user_name = reply_name
      }
    } else {
      //评论
    }
    var comment_detail = {
      comment_id: this.data.record,
      comment_user_name: comment_user_name,
      comment_text: comment_text,
      comment_time: comment_time,
      contact_user_name: contact_user_name,
      reply_id: reply_id,
      parent_id: parent_id,
      reply_name: reply_name
    }
    console.log(comment_detail)
    if (comment_detail.parent_id > 0) { //楼中楼
      var clist2 = this.data.comment_list2
      clist2.push(comment_detail)
      this.setData({
        comment_list2: clist2
      })
    } else { //楼
      var clist = this.data.comment_list
      clist.push(comment_detail)
      this.setData({
        comment_list: clist
      })
    }
    var c_record = this.data.record
    this.setData({
      inputVal: '',
      record: c_record + 1
    })
    //更新数据库
    var that = this
    var c_comment = {
      record: that.data.record,
      clist1: that.data.comment_list,
      clist2: that.data.comment_list2
    }
    const db = wx.cloud.database({})
    wx.cloud.callFunction({
      name: 'update_comment',
      data: {
        comment: c_comment,
        id: that.data.id
      },
      success: function(res) {
        console.log(res)
      },
      fail: console.error
    })
  },

  //复制联系方式函数
  copyBtn: function(e) {
    var that = this;
    wx.setClipboardData({
      data: that.data.business.contact,
      success: function(res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },

  //点击评论准备回复其他评论的函数，主要是修改参数
  replyComment: function(e) {
    var cid = e.currentTarget.dataset.cid
    console.log(cid)
    var name = e.currentTarget.dataset.name

    var type = e.currentTarget.dataset.type
    var parent_id = e.currentTarget.dataset.pid
    console.log(parent_id)
    this.setData({
      now_reply: cid,
      now_reply_name: name,
      now_reply_type: type,
      now_parent_id: parent_id,
      focus: true,
      placeholder: '回复' + name + ":"
    })
  },


  //输入评论时绑定函数
  getCommentText: function(e) {
    var val = e.detail.value;
    this.setData({
      inputVal: val
    });
  },

  //预览图片函数
  previewImg: function(e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.source],
    })
  },

  onLikeTap: function(e) {
    var that = this;
    var like = that.data.liked;
    var good_users = that.data.good_users;
    var name = that.data.userName;
    var index = -1;
    if (like) {
      this.setData({
        liked: false
      });
      index = good_users.indexOf(name);
      if (index > -1) {
        good_users.splice(index, 1);
      }
      console.log(index)
      console.log(good_users)
    } else {
      this.setData({
        liked: true
      });
      good_users.push(name);
      console.log(good_users)
    }
    this.setData({
      good_users: good_users,
      numberOfGood: good_users.length,
    })
    wx.cloud.callFunction({
      name: 'update_good_users',
      data: {
        good_users: good_users,
        id: that.data.id
      },
      success: function(res) {
        console.log(res)
        console.log("ok")
      },
      fail: console.error
    })
  },

  onShareAppMessage: function() {
    return {
      title: this.data.business.businessWay + ':' + this.data.business.title
    }
  },
})