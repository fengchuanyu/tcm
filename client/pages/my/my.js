// pages/my/my.js
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData:false
  },
  yuyue:function(){
    wx.navigateTo({
      url: '../my_yuyue/my_yuyue'
    })
  },
  inf: function () {
    wx.navigateTo({
      url: '../my_information/my_information'
    })
  },
  store: function () {
    wx.navigateTo({
      url: '../my_store/my_store'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 使用 Mock
    API.ajax('', function (res) {
      //这里既可以获取模拟的res
      // console.log(res)
      that.setData({
        doctorlist: res.data['doctordata'],
        postData:true
      })
    })
    // console.log(this.data.doctorlist[0].img)
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