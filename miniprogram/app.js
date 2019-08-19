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
    openid: '',
    openGid: '',
    shareTicket: '',
    //地区信息
    area: ["全校范围", "华工北校", "华工南校",
    ],
    //当前地区 默认值为
    currentArea: ["全校范围",
    ]
  }



})