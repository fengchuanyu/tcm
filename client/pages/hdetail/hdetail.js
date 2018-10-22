// pages/hdetail/hdetail.js
var app = getApp()
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  add:function(){
    var nowdate = new Date();
    var nowyear = nowdate.getFullYear();
    var nowmonth = nowdate.getMonth() + 1;
    var nowdate = nowdate.getDate();
    var nowhours = new Date().getHours();
    var nowminutes = new Date().getMinutes();
    var nowseconds = new Date().getSeconds();
    var nowmiliseconds = new Date().getMilliseconds();
    var nowday = new Date().getDay();
    var time = nowyear + '/' + nowmonth + '/' + nowdate + '/' + nowhours + '/' + nowminutes + '/' + nowseconds;
    console.log("add");
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/add_collect',
      data:{
        uid: getApp().globalData.user.uid,
        aid: this.data.details.aid,
        time:time
      },
      success: res => {
        this.setData({
          doctorlist: res.data,
        })
        // console.log(this.data.doctorlist);
      }
    });
  },
  notadd:function(){
    console.log("notadd")
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    var newid = options.id;
    this.setData({
      newid: options.id,
      isSave:options.isSave
    })
    console.log(this.data.newid);
    // console.log(this.data.newid);
    // var that = this;
    // // 使用 Mock
    // API.ajax('', function (res) {
    //   //这里既可以获取模拟的res
    //   that.setData({
    //     details: res.data['article'][newid-1]
    //   })
    // });
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/get_doctor',
      success: res => {
        this.setData({
          doctorlist: res.data,
        })
        // console.log(this.data.doctorlist);
      }
    });
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/get_illnesslist',
      success: res => {
        this.setData({
          illnesslist: res.data
        })
        // console.log(this.data.illnesslist);
      }
    })
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/get_article',
      success: res => {
        this.setData({
          details: res.data[newid]
        })
        // console.log(this.data.details);
        wx.setNavigationBarTitle({
          title: this.data.details.article_title//页面标题为路由参数
        })
      }
    });
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/get_article_only',
      success: res => {
        this.setData({
          hah: res.data
        })
        console.log(this.data.hah)
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