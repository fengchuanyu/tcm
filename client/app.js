//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    globalData: {
      openid:null,
      user: null,
      appid: "wx60ea2b64f3596fdf",
      secret: "b25d9d7f77908356fc1635454876a039",
      lin:null,
      isSave:null
    },
    onLaunch: function () {
      qcloud.setLoginUrl(config.service.loginUrl)
    }
})