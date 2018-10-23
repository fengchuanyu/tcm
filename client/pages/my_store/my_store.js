// pages/my_store/my_store.js
var API = require('../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: false,
    isshow: 'hidden',
    isdisplay: "-webkit-box",
    isheight: "220rpx",
    howshow: "显示全部",
    showtime: true,
    ishave:false
  },
  showall: function () {
    if (this.data.showtime) {
      console.log('more');
      this.setData({
        isshow: "",
        isdisplay: "",
        isheight: "",
        howshow: "收起",
        showtime: false
      })
    }
    else {
      this.setData({
        isshow: 'hidden',
        isdisplay: "-webkit-box",
        isheight: "220rpx",
        howshow: "显示全部",
        showtime: true
      })
    }
  },
  hdetail:function(event){
    var newid = event.currentTarget.dataset.id;
    let str = JSON.stringify(newid);
    getApp().globalData.lin = newid;
    getApp().globalData.isSave = "true";
    // console.log(str);
    wx.navigateTo({
      url: '/pages/hdetail/hdetail?id=' + str + '&isSave=' + true,
    })
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
    //     infolist: res.data['article'],
    //     postData: true
    //   })
    // })
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/get_col',
      data: {
        uid: getApp().globalData.user.uid
      },
      success: res => {
        this.setData({
          infolist:res.data
        })
        if(res.data.length == 0){
          this.setData({
            ishave: true
          })
        }
        // console.log(this.data.infolist);
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
    this.onLoad();
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