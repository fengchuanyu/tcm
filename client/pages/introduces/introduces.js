// client/pages/introduces/introduces.js
var app = getApp()
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  introduce:function(event){
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/select_user',
      data: {
        openid: getApp().globalData.openid
      },
      success: res => {
        this.setData({
          user: res.data[0]
        })
        // console.log(this.data.user[0].user_name);
        if (this.data.user.user_name) {
          // var newid = event.currentTarget.dataset.id;
          var newid = this.data.detail;
          let str = JSON.stringify(newid);
          wx.navigateTo({
            url: '../introduce/introduce?id=' + str
          })
        } else {
          wx.navigateTo({
            url: '../my_information/my_information?from=reg'
          })
        }
      }
    });
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let item = JSON.parse(options.id);
    // console.log(item);
    this.setData({
      detail:item 
    })
    // var that = this;
    // // 使用 Mock
    // API.ajax('', function (res) {
    //   //这里既可以获取模拟的res
    //   that.setData({
    //     detail: res.data['doctor'][newid-1]
    //   })
    // });

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