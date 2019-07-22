//app.js
App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
  },


  globalData: {
    //地区信息
    area: [{
        "local": "全校范围",
        "id": "0"
      },
      {
        "local": "华工北校",
        "id": "1"
      },
      {
        "local": "华工南校",
        "id": "2"
      },
    ],
    //当前地区 默认值为
    currentArea: [{
      "local": "全校范围",
      "id": "0"
    }, ]
  }



})