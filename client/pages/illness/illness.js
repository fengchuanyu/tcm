// client/pages/illness/illness.js
var app = getApp()
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  detail: function (event) {
   var newid=event.target.dataset.id;
    var newname = event.target.dataset.name;
    wx.navigateTo({
      url: '/pages/illdetail/illdetail?id='+newid+'&name='+newname,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 使用 Mock
    API.ajax('', function (res) {
      //这里既可以获取模拟的res
      // console.log(res)
      that.setData({
        illnesslist:res.data['illdata'] 
      })
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