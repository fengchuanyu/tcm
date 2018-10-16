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
   * 组件的初始数据https:/
   * 
   * 
   *8555 fdg 
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
    doctor:function(event){
      var newid = event.currentTarget.dataset.id;
      console.log(newid);
      wx.navigateTo({
        url: '../introduces/introduces?id=' + newid
      })
    },
    health: function () {
      wx.switchTab({
        url: '../health/health'
      })
    },
    map: function () {
      wx.navigateTo({
        url: '../map/map'
      })
    },
    brif:function(){
      wx.navigateTo({
        url: '../brif/brif'
      })
    },
    localdoc:function(){
      wx.navigateTo({
        url: '../localdoc/localdoc'
      })
    },
    appointment:function(){
       wx.navigateTo({
         url: '../dataorder/dataorder'
      })
    },
    onLoad: function () {
      // var that = this
      // // 使用 Mock
      // API.ajax('/infor/get_doctor_list',{}, function (res) {
      //   //这里既可以获取模拟的res
      //   that.setData({
      //     // doctorlist: res.data['doctor'].slice(0, 3),
      //     // articlelist:res.data['article'][0]
      //   })
      // });
      wx.request({
        url: 'https://us5qsybm.qcloud.la/infor/get_doctor_list',
        success: res => {
          console.log(res.data);
          this.setData({
            logoList: res.data
          })
          console.log(this.data.logoList);
        }
      })
    }
  }
})
