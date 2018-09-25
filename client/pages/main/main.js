// pages/main/main.js
var app = getApp()
var API = require('../../utils/api.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isshow:'hidden',
    isdisplay:"-webkit-box",
    isheight:"220rpx",
    howshow:"显示全部",
    showtime:true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showall: function () {
      if(this.data.showtime){
        console.log('more');
        this.setData({
          isshow: "",
          isdisplay: "",
          isheight: "",
          howshow: "收起",
          showtime:false
        })
      }
      else{
        this.setData({
          isshow: 'hidden',
          isdisplay: "-webkit-box",
          isheight: "220rpx",
          howshow: "显示全部",
          showtime:true
        })
      }
    },
    appointment:function(){
       wx.navigateTo({
         url: '../dataorder/dataorder'
      })
    },
    onLoad: function () {
      console.log('onLoad')
      var that = this
      // 使用 Mock
      API.ajax('', function (res) {
        //这里既可以获取模拟的res
        console.log(res)
        that.setData({
          doctorlist: res.data['doctordata'].slice(0, 3),
          articlelist:res.data['articledata'][0]
        })
      });

      // console.log(this.data.doctorlist)
      console.log(this.data.articlelist)
    }
  }
})
