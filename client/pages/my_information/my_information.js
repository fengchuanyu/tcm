// pages/my_information/my_information.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectPerson: true,
    firstPerson: '女',
    selectArea: false,
    userName:'',
    phone:'',
    id:'',
    date: ''
  },
  clickPerson: function () {
    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectArea: true,
        selectPerson: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },
  //点击切换
  mySelect: function (e) {
    this.setData({
      firstPerson: e.target.dataset.me,
      selectPerson: true,
      selectArea: false,
    })
  },
  listenerDatePickerSelected: function (e) {
    // console.log(e.detail.value)
    var that = this
    that.setData({
      date: e.detail.value
    })
  },
  betrue:function(){
    // console.log(this.data.userName, this.data.id, this.data.phone, this.data.firstPerson, this.data.date);
    if (this.data.userName != undefined && this.data.id != undefined && this.data.phone != undefined && this.data.firstPerson != undefined && this.data.date != undefined && this.data.userName != '' && this.data.id != '' && this.data.phone != '' && this.data.firstPerson != '' && this.data.date != ''){
      // console.log('11')
      // console.log(getApp().globalData.user.uid);
      // console.log(this.data.userName, this.data.id, this.data.phone, this.data.firstPerson, this.data.date);
      wx.request({
        url: 'https://us5qsybm.qcloud.la/infor/update_user',
        data:{
          uid: getApp().globalData.user.uid,
          name:this.data.userName,
          ID:this.data.id,
          phone:this.data.phone,
          sex:this.data.firstPerson,
          bir:this.data.date
        },
        success: res => {
          if (this.data.sign == "reg") {
            wx.navigateTo({
              url: '../dataorder/dataorder'
            })
          }
          else if (this.data.sign == "my") {
            wx.switchTab({
              url: '../my/my'
            })
          }
        }
      });
      
    }
    
    
  }, 
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  idInput: function (e) {
    this.setData({
      id: e.detail.value
    })
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var s = options.from;
    this.setData({
      sign: s
    })
    wx.request({
      url: 'https://us5qsybm.qcloud.la/infor/select_user',
      data: {
        openid: getApp().globalData.openid
      },
      success: res => {
        if(res.data[0].user_sex != null){
          this.setData({
            firstPerson: res.data[0].user_sex
          })
        }
        if(res.data[0].user_birth != null){
          this.setData({
            date: res.data[0].user_birth
          })
        }
        if(res.data[0].user_phone != null){
          this.setData({
            phone: res.data[0].user_phone
          })
        }
        this.setData({
          user: res.data[0],
          userName: res.data[0].user_name,
          id: res.data[0].user_idnumber
        })
        // console.log(this.data.user);
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