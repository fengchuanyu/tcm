// client/pages/introduce/introduce.js
var app = getApp()
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  introduces: function (event) {
    var newid = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../introduces/introduces?id='+newid
    })
  },
  registered:function(event){
    var newid = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../registered/registered?id=' + newid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var newid = options.id;
    this.setData({
      newid: options.id
    })
    // var that = this;
    // // 使用 Mock
    // API.ajax('', function (res) {
    //   //这里既可以获取模拟的res
    //   that.setData({
    //     detail: res.data['doctor'][newid-1]
    //   })
    // });
      wx.request({
        url: 'https://us5qsybm.qcloud.la/infor/get_doctor',
        success: res => {
          this.setData({
            detail: res.data[newid]
          })
          // console.log(this.data.detail);
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