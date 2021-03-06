// pages/health/health.js
var app = getApp()
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isshow: 'hidden',
    isdisplay: "-webkit-box",
    isheight: "220rpx",
    howshow: "显示全部",
    showtime: true
  },
  showall: function () {
    if (this.data.showtime) {
      console.log('more');
      this.setData({
        isshow: "",
        isdisplay: "",
        isheight: "",
        howshow: "收起",
        showtime: false
      })
    }
    else {
      this.setData({
        isshow: 'hidden',
        isdisplay: "-webkit-box",
        isheight: "220rpx",
        howshow: "显示全部",
        showtime: true
      })
    }
  },
  toDetail: function (event) {
  
    var newid = event.currentTarget.dataset.id;

    let str = JSON.stringify(newid);
    getApp().globalData.lin = newid;
    getApp().globalData.isSave = "false";
    // console.log(newid,str);
    wx.navigateTo({
      url: '/pages/hdetail/hdetail?id=' + str + '&isSave=' + false,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(getApp().globalData.user);
    // var that = this
    // // 使用 Mock
    // API.ajax('', function (res) {
    //   //这里既可以获取模拟的res
    //   // console.log(res)
    //   that.setData({
    //     infolist:res.data['article']
    //   })
    // });
    // wx.request({
    //   url: 'https://us5qsybm.qcloud.la/infor/get_article_only',
    //   success: res => {
    //     this.setData({
    //       hah: res.data
    //     })
    //     console.log(this.data.hah)
    //   }
    // });
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/get_article_ill',
      success: res => {
        this.setData({
          infolist: res.data
        })
        // console.log(this.data.infolist)
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})