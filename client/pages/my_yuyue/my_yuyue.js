// pages/my_yuyue/my_yuyue.js
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isbegin:true
  },
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    this.setData({
      isbegin:false
    })
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  quxiao: function(event){
    var newid = event.currentTarget.dataset.id;
    // console.log(newid);
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/del_reg',
      data:{
        rid:newid
      },
      success: res => {
        // console.log("this.data.doctorlist");
        this.onLoad();
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var that = this;
    // // 使用 Mock
    // API.ajax('', function (res) {
    //   //这里既可以获取模拟的res
    //   // console.log(res)
    //   that.setData({
    //     doctorlist: res.data['doctor'],
    //     postData: true
    //   })
    // })
    // // console.log(this.data.doctorlist[0].img)
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/get_reg',
      data:{
        uid: getApp().globalData.user.uid
      },
      success: res => {
        var listone = new Array();
        var listtwo = new Array();
        for(var i = 0 ; i < res.data.length ; i++){
          if(res.data[i].r_tag == 1){
            listone.push(res.data[i]);
          }
          else if (res.data[i].r_tag == 2){ 
            listtwo.push(res.data[i]);
          }
        }
        // console.log(this.data.flielist);
        this.setData({
          flieone: listone,
          flietwo: listtwo
        })
        // console.log(this.data.flieone);
        // console.log(this.data.flietwo);
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