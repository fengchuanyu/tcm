// client/pages/dataorder/dataorder.js
var app = getApp()
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  docotrorder:function(){
    wx.navigateTo({
      url: '../doctororder/doctororder'
      
    })
  },
  introduce: function (event) {
    var newid = event.currentTarget.dataset.id;
    let str = JSON.stringify(newid)
    wx.navigateTo({
      url: '../introduce/introduce?id='+str
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nowdate = new Date();
    var nowyear = nowdate.getFullYear();
    var nowmonth = nowdate.getMonth()+1;
    var nowdate = nowdate.getDate();
    var nowday = new Date().getDay();
    if(nowday == 0){
      nowday = 7;
    }
  
    // var nowyear = 2018;
    // var nowmonth = 10;
    // var nowdate = 14;
    // var nowday = 7;
    var now = nowdate - (nowday - 1);
    var colorlist = ['#000000', '#000000', '#000000', '#000000', '#000000', '#000000', '#000000'];
    var bglist = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'];
    var date = [now, now + 1, now + 2, now + 3, now + 4, now + 5, now + 6];
    var show = [true,true,true,true,true,true,true];
    var monthday = [31,28,31,30,31,30,31,31,30,31,30,31];
    if(nowyear%400 == 0 ||(nowyear%4 == 0 && nowyear%100 != 0)){
      monthday[2] = 29;
    }
    if(nowday > nowdate){
      for(var i = 0 ; i < 8 ; i++){
        if(date[i]<1){
          date[i] += monthday[nowmonth-1];
        }
      }
    }
    bglist[nowday - 1] = '#fed5d5';
    colorlist[nowday-1] = '#ffffff';
    for(var i = 0 ; i < 8 ; i++){
      if(i<nowday-1){
        show[i] = false;
        colorlist[i] = '#bcbcbc';
      }
    }

    
    this.setData({
      datelist:date,
      color:colorlist,
      bg:bglist,
      isshow:show
    })
    var week = nowdate.g
    this.setData({
      date: nowyear+'-'+nowmonth+'-'+nowdate
    })
    // var that = this;
    // // 使用 Mock
    // API.ajax('', function (res) {
    //   //这里既可以获取模拟的res
    //   // console.log(res)
    //   that.setData({
    //     doctorlist: res.data['doctor']
    //   })
    // })
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