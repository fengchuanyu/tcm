// client/pages/doctororder/doctororder.js
var app = getApp()
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  dataorder: function () {
    wx.navigateTo({
      url: '../dataorder/dataorder'
    })
  },
  introduce: function (event) {
    var newid = event.currentTarget.dataset.id;
    let str = JSON.stringify(newid);
    // console.log(newid);
    wx.navigateTo({
       url: '../introduces/introduces?id=' + str
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // console.log('onLoad')
    // var that = this
    // // 使用 Mock
    // API.ajax('', function (res) {
    //   //这里既可以获取模拟的res
    //   // console.log(res)
    //   that.setData({
    //     doctorlist: res.data['doctor']
    //   })
    // });
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/get_doctor',
      success: res => {
        this.setData({
          doctorlist: res.data
        })
        // console.log(this.data.doctorlist);
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