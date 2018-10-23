var app = getApp()
var API = require('../../utils/api.js');
Page({
  data: {
      
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  onLoad: function (options) {
    var that = this;
    this.setData({
      newid: options.id,
      newname:options.name
    })
    wx.setNavigationBarTitle({
      title:that.data.newname//页面标题为路由参数
    })
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/get_illnesslist',
      success: res => {
        this.setData({
          details: res.data[that.data.newid]
        })
        // console.log(this.data.details);
      }
    })
    // 使用 Mock
    // API.ajax('', function (res) {
    //   //这里既可以获取模拟的res
    //   that.setData({
    //     details: res.data['ill-class'][that.data.newid-1]
    //   })
    // });
   },
   onReady:function(){
  
   },
  attached: function () { },
  moved: function () { },
  detached: function () { },

})
