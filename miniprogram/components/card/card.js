//components/card/card
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type:String,
      value:''
    },
    description:{
      type:String,
      value:'',
    },
    pictureUrl:{
      type:Array,
      value:[],
    },
    price:{
      type:String,
      value:'',
    },
    date:{
      type:String,
      value:'',
    },
    comments:{
      type: Array,
      value: [],
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

  }
})
