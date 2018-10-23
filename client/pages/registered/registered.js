// client/pages/registered/registered.js
var app = getApp()
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    id:''
  },
  regtrue:function(){
    if(this.data.userName != '' && this.data.id != '')
    {
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

      wx.request({
        url: 'https://us5qsybm.qcloud.la/infor/add_reg',
        data:{
          name:this.data.userName,
          ID:this.data.id,
          did: this.data.detail.did,
          uid: getApp().globalData.user.uid,
          nowtime:time
        },
        success: res => {
          // console.log(res.data);
        }
      });
      // console.log(this.data.id + this.data.userName);
      wx.navigateTo({
        url: '../regtrue/regtrue'
      })
    }else{
      
    }
  },
  userNameInput:function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  idInput: function (e) {
    this.setData({
      id: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var newid = options.id;
    let item = JSON.parse(options.id);
    this.setData({
      detail: item
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