// pages/publish/publish.js
const app = getApp()
var util = require('../../utils/util.js')
Page({

  data: {
    openid: '',
    area: [], //发布的校区
    inputValue: '', //清空输入框
    body: '', //标题、正文、号码
    contactWay: '', //微信、qq、电话
    price: '', //价格
    businessWay: ['收购', '出售', '代跑腿'],
    businessIndex: 1,
    array: ['微信', 'qq', '手机号'],
    index: 0,
    currentLength: 0,
    files: [],
    fileIDs: [],
    good_users: [],
    userName: '',
    comment: {
      record: 1,
      clist1: [ //楼
      ],
      clist2: [ //楼中楼
      ]
    }
  },
  bindAreaChange(e) { //选择地区改变时

  },

  bindBusinessChange(e) { //选择交易类型改变时
    //console.log(e)
    this.setData({
      //businessIndex:e.target.dataset.index
    })
  },

  bodyInput(e) {
    //console.log(e.detail.cursor) //当前字数
    this.setData({
      currentLength: e.detail.cursor
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },


  formSubmit: function(res) {
    if (res.detail.value['Contact'] == '') {
      wx.showToast({
        title: '请输入联系方式',
      })
      return;
    }
    if (res.detail.value['Title'] == '') {
      wx.showToast({
        title: '请输入标题',
      })
      return;
    }
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(res.detail.value['price']) || regNeg.test(res.detail.value['price'])) {
      //continue
    } else {
      wx.showToast({
        title: '请输入价格',
      })
      return;
    }
    console.log(res.detail.value)
    this.setData({
      body: '', //res.detail.value,
      contactWay: '', // this.data.array[this.data.index],
      price: '',
      currentLength: 0,
      fileIDs: [],
    })
    const db = wx.cloud.database()
    db.collection('Business').add({
      data: {
        price: res.detail.value['price'],
        area: res.detail.value['Area'],
        title: res.detail.value['Title'],
        body: res.detail.value['Body'],
        contact: res.detail.value['Contact'],
        contactWay: this.data.array[this.data.index],
        businessWay: res.detail.value['businessWay'],
        imgs: this.data.fileIDs,
        date: util.formatTime(new Date()),
        comment: this.data.comment,
        good_users: this.data.good_users,
        userName: this.data.userName
      }
    })
  },

  chooseImage: function() {
    var that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        wx.showLoading({
          title: '上传中',
        })
        that.setData({
          files: that.data.files.concat(res.tempFilePaths),
        })
        const filePath = res.tempFilePaths
        const cloudPath = []
        const fileIDs = that.data.fileIDs
        filePath.forEach((item, i) => {
          cloudPath.push(that.data.userName + '-' + filePath[i].substring(filePath[i].length - 12, filePath[i].length - 4) + filePath[i].match(/\.[^.]+?$/)[0])
        })
        if (filePath.length > 1) {
          filePath.reverse()
        }
        //此处有潜藏的bug，因为上传的任务会因为网络延时而造成排序错误，
        //导致后续的id检索不对应，仅针对一次性选中多张图片而言
        filePath.forEach((item, i) => {
          wx.cloud.uploadFile({
            cloudPath: cloudPath[i],
            filePath: filePath[i],
            success: res => {
              console.log('[上传文件] 成功：', res)
              fileIDs.push(res.fileID)
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
              that.setData({
                fileIDs: unique(fileIDs)
              })
            }
          })
        })
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  previewImage: function(e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.files
    })
  },

  clearImg: function(params) {
    var that = this;
    let imgList = that.data.files;
    let id = params.currentTarget.dataset.id // 图片索引
    console.log(params.currentTarget.dataset)
    const fileList = new Array()
    let clone_IDs = this.data.fileIDs
    fileList[0] = that.data.fileIDs[id]
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('点击确定了');
          imgList.splice(id, 1);
          clone_IDs.splice(id, 1)
          that.setData({
            files: imgList
          })
          wx.cloud.deleteFile({
            fileList: fileList,
            success: res => {
              console.log(res.fileList)
            },
            fail: console.error,

            complete: () => {
              that.setData({
                fileIDs: clone_IDs
              })
            }
          })
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
    })
  },

  openToast: function(params) {
    var that = this;
    if (1) {
      wx.showToast({
        title: '已完成',
        icon: 'success',
        duration: 3000
      });
      var that = this;
      let imgList = that.data.files;
      let id = params.currentTarget.dataset.id;
      let len = imgList.length;
      imgList.splice(id, len);
      that.setData({
        files: imgList,
        inputValue: ""
      })
    }

  },


  onLoad: function(options) {
    this.setData({
      area: app.globalData.area
    })
    //console.log(this.data.area)
    //TODO
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid,
        userName: 'user-' + app.globalData.openid.substring(6, 10)
      })
    }
  }

})

function unique(arr) {
  return Array.from(new Set(arr))
}