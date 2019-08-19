//components/card/card
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    user: {
      type: String,
      value: ''
    },
    description: {
      type: String,
      value: '',
    },
    pictureUrl: {
      type: Array,
      value: [],
    },
    price: {
      type: String,
      value: '',
    },
    date: {
      type: String,
      value: '',
    },
    comment: {
      type: String,
      value:"",
    },
    time: {
      type: String,
      value: ''
    },
    _id: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _tapDetail(e) {
      //console.log(e);
      var _id = this.properties._id;
      //console.log(_id);
      this.triggerEvent('catchtap', _id)
    }
  }
})
