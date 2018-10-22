// pages/main/main.js
var app = getApp();
var API = require('../../utils/api.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据https:/
   * 
   * 
   *8555 fdg 
   */
  data: {
    isshow:'hidden',
    isdisplay:"-webkit-box",
    isheight:"220rpx",
    howshow:"显示全部",
    showtime:true,
    isbegin:true,
    appid: "wx60ea2b64f3596fdf",
    secret: "b25d9d7f77908356fc1635454876a039"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showall: function () {
      if(this.data.showtime){
        console.log('more');
        this.setData({
          isshow: "",
          isdisplay: "",
          isheight: "",
          howshow: "收起",
          showtime:false
        })
      }
      else{
        this.setData({
          isshow: 'hidden',
          isdisplay: "-webkit-box",
          isheight: "220rpx",
          howshow: "显示全部",
          showtime:true
        })
      }
    },
    doctor:function(event){
      var newid = event.currentTarget.dataset.id;
      let str = JSON.stringify(newid);
      // console.log(newid);
      wx.navigateTo({
        url: '../introduces/introduces?id=' + str
      })
    },
    health: function () {
      wx.switchTab({
        url: '../health/health'
      })
    },
    map: function () {
      wx.navigateTo({
        url: '../map/map'
      })
    },
    brif:function(){
      wx.navigateTo({
        url: '../brif/brif'
      })
    },
    localdoc:function(){
      wx.navigateTo({
        url: '../localdoc/localdoc'
      })
    },
    appointment:function(){
      wx.request({
        url: 'https://us5qsybm.qcloud.la/infor/select_user',
        data: {
          openid: getApp().globalData.openid
        },
        success: res => {
          this.setData({
            user: res.data[0]
          })
          //  console.log(this.data.user);
          if (this.data.user.user_name) {
            wx.navigateTo({
              url: '../dataorder/dataorder'
            })
          } else {
            wx.navigateTo({
              url: '../my_information/my_information?from=reg'
            })
          }

         
        }
      });
      // console.log(this.data.user);
      

    },
    onLoad: function () {
      // var that = this
      // // 使用 Mock
      // API.ajax('/infor/get_doctor_list',{}, function (res) {
      //   //这里既可以获取模拟的res
      //   that.setData({
      //     // doctorlist: res.data['doctor'].slice(0, 3),
      //     // articlelist:res.data['article'][0]
      //   })
      // });
      // console.log(this.data.userId);
      var that = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: function (res) {
                var objz = {};
                objz.avatarUrl = res.userInfo.avatarUrl;
                objz.nickName = res.userInfo.nickName;
                //console.log(objz);
                wx.setStorageSync('userInfo', objz);//存储userInfo
                console.log("res: " + res.userInfo.nickName);
                that.setData({
                  postData: true
                })
              }
            });
            var d_appid = that.data.appid;//这里存储了appid、secret、token串 
            var d_secret = that.data.secret;
            // console.log("d : ", d_secret);
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d_appid + '&secret=' + d_secret + '&js_code=' + res.code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              data: {},
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
              // header: {}, // 设置请求的 header  
              success: function (res) {
                var obj = {};
                obj.openid = res.data.openid;
                obj.expires_in = Date.now() + res.data.expires_in;
                //console.log(obj);
                wx.setStorageSync('user', obj);//存储openid  
                console.log("openid : " + res.data.openid);
                var id = res.data.openid;
                wx.request({
                  url: 'https://us5qsybm.qcloud.la/infor/select_user',
                  data: {
                     openid:id
                   },
                  success: res => {
                    if(!res.data){
                      console.log('wu')
                      wx.request({
                        url: 'https://us5qsybm.qcloud.la/infor/insert_user',
                        data: {
                          openid: id
                        },
                        success: res => {
                          console.log(res.data);
                        }
                      });
                    }else{
                      console.log('you');
                      that.setData({
                        user:res.data[0]
                      })
                      app.globalData.user = res.data[0]
                    }
                  }
                });
                

                if (!app.globalData.openid) {
                  app.globalData.openid = res.data.openid;
                }
              },
              fail: function () {
                console.log("error");
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      }),
      wx.request({
        url: 'https://us5qsybm.qcloud.la/infor/get_doctor',
        success: res => {
          this.setData({
            doctorlist: res.data.slice(0,3),
          })
          // console.log(this.data.doctorlist);
        }
      });
      wx.request({
        url: 'https://us5qsybm.qcloud.la/infor/get_article',
        success: res => {
          this.setData({
            articlelist: res.data[0]
          })
          // console.log(this.data.articlelist);
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
      });
      this.setData({
        openid: getApp().globalData.openid
      })
      // console.log(this.data.openid);
    }
  }
})
