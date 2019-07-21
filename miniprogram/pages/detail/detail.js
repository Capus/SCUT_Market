const app = getApp()
var util = require('../../utils/util.js')
Page({

  data: {
    openid: '',
    id: '',
    inputVal: '', //评论输入值
    focus: false, //键盘是否聚焦
    placeholder: '留下你的评论吧！',
    now_reply: 0, //回复对象的id
    now_reply_name: null, //回复对象的名字
    now_reply_type: 0, //0是评论，1是回复评论，2是回复评论的评论
    now_parent_id: 0, //现在准备回复那条评论下的评论的id
    img_url: [],

    record: 1, //手动控制comment_id
    comment_list: [{}],
    comment_list2: [{}],

  },

  onLoad: function(options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }

    var that = this

    //获取数据的id
    this.setData({
      id: options.id
    })

    const db = wx.cloud.database({});
    const cont = db.collection('Business');
    cont.doc(options.id).get({
      success: function(res) {
        console.log(res.data)
        that.setData({
          business: res.data,
          img_url: res.data.imgs,
          record: res.data.comment['record'],
          comment_list: res.data.comment['clist1'],
          comment_list2: res.data.comment['clist2']
        })
      }
    })
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
    //获取username
    //TODO
    this.setData({
      inputVal: ''
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

  onShareAppMessage: function() {
    return {
      title: this.data.business.businessWay + ':' + this.data.business.title
    }
  },
})