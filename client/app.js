//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    globalData: {
      openid:null,
      user: null,
      appid: "wx60ea2b64f3596fdf",
      secret: "b25d9d7f77908356fc1635454876a039",
    },
    onLaunch: function () {
      qcloud.setLoginUrl(config.service.loginUrl)
      // console.log("hahah ");
      // var that = this;
      // wx.login({
      //   success: function (res) {
      //     if (res.code) {
      //       wx.getUserInfo({
      //         success: function (res) {
      //           var objz = {};
      //           objz.avatarUrl = res.userInfo.avatarUrl;
      //           objz.nickName = res.userInfo.nickName;
      //           //console.log(objz);
      //           wx.setStorageSync('userInfo', objz);//存储userInfo
      //           console.log("res: " + res.userInfo.nickName);
      //           that.setData({
      //             postData: true
      //           })
      //         }
      //       });
      //       var d_appid = that.globalData.appid;//这里存储了appid、secret、token串 
      //       var d_secret = that.globalData.secret;
      //       console.log("d : ", d_secret);
      //       var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d_appid + '&secret=' + d_secret + '&js_code=' + res.code + '&grant_type=authorization_code';
      //       wx.request({
      //         url: l,
      //         data: {},
      //         method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
      //         // header: {}, // 设置请求的 header  
      //         success: function (res) {
      //           var obj = {};
      //           obj.openid = res.data.openid;
      //           obj.expires_in = Date.now() + res.data.expires_in;
      //           //console.log(obj);
      //           wx.setStorageSync('user', obj);//存储openid  
      //           console.log("openid : " + res.data.openid);
      //           if (!that.globalData.openid) {
      //             that.globalData.openid = res.data.openid;
      //           }
      //         },
      //         fail: function () {
      //           console.log("error");
      //         }
      //       });
      //     } else {
      //       console.log('获取用户登录态失败！' + res.errMsg)
      //     }
      //   }
      // })
      // console.log(this.globalData.openid);
    }
})