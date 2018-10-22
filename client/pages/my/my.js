// pages/my/my.js
var API = require('../../utils/api.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: false,
    appid: "wx60ea2b64f3596fdf",
    secret: "b25d9d7f77908356fc1635454876a039",
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  yuyue: function () {
    wx.navigateTo({
      url: '../my_yuyue/my_yuyue'
    })
  },
  inf: function () {
    wx.navigateTo({
      url: '../my_information/my_information?from=my'
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
    // 查看是否授权
    this.setData({
      openid: getApp().globalData.openid,
      user: getApp().globalData.user
    })
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
            }
          })
        }
      }
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
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
