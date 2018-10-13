// pages/hdetail/hdetail.js
var app = getApp()
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var newid = options.id;
    this.setData({
      newid: options.id
    })
    // console.log(this.data.newid);
    var that = this;
    // 使用 Mock
    API.ajax('', function (res) {
      //这里既可以获取模拟的res
      that.setData({
        details: res.data['article'][newid]
      })
    });
    wx.setNavigationBarTitle({
      title: that.data.details.article_title//页面标题为路由参数
    })

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