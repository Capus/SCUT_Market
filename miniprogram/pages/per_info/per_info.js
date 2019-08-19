// pages/myBusiness/myBusiness.js

const app = getApp()

Page({

  data: {
    userName: '',
    comments:[],
  },

  dBrequest() {
    const db = wx.cloud.database({});
    const cont = db.collection('Business').orderBy('date', 'desc');

    cont.get({
      success: res => {
        console.log("数据库获取成功", res)
        var b = Object.keys(res.data);
        var i = b.length;
        var userName = this.data.userName;
        console.log("记录数有" + i)
        var arrs = [];


        for (var a = 0; a < i; a++) {
          var temp_comment = res.data[a].comment;

          for(var c=0; c<temp_comment.clist1.length; c++){

            if (temp_comment.clist1[c].contact_user_name == userName){
              var comment_temp = {};
              comment_temp.comment_text = temp_comment.clist1[c].comment_text;
              comment_temp.comment_user_name = temp_comment.clist1[c].comment_user_name;

              comment_temp.time = temp_comment.clist1[c].comment_time;
              comment_temp._id = res.data[a]._id;
              arrs.push(comment_temp);
            }
            else{}
          }

          for (var c = 0; c < temp_comment.clist2.length; c++) {

            if (temp_comment.clist2[c].contact_user_name == userName) {

              var comment_temp = {};
              comment_temp.comment_text = temp_comment.clist2[c].comment_text;
              comment_temp.comment_user_name = temp_comment.clist2[c].comment_user_name;
              comment_temp.time=temp_comment.clist2[c].comment_time;

              comment_temp._id = res.data[a]._id;
              arrs.push(comment_temp);
            }
            else{}

          }
        }


for(var c=0;c<arrs.length-1;c++){
  for(var d=c;d>=0;d--){
    let value = new Date(arrs[d].time) - new Date(arrs[d+1].time);
    if(value<0){
      var temp=arrs[d];
      arrs[d]=arrs[d+1];
      arrs[d+1]=temp;
    }
  }
}


        this.setData({
          comments: arrs
        });

      }
    })

  },


  cardTouch: function (e) {
    //console.log("该条目_id为"+e.detail); //即该记录的_id，传到detail界面再进行查询渲染
    wx.navigateTo({
      url: '../detail/detail?_id=' + e.detail, //此处再添加传递的数据
    })
  },


  onLoad: function (options) {
    if (app.globalData.userName) {
      this.setData({
        userName: app.globalData.userName
      })
    }
    this.dBrequest();
  },

  deleteF: function () {
    const db = wx.cloud.database({});
    const cont = db.collection('Business').orderBy('date', 'desc');
  }

}
)