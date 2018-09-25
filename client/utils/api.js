let API_HOST = "http://xxx.com/xxx";
let DEBUG = true;//�л��������
var Mock = require('mock.js')
function ajax(data = '', fn, method = "get", header = {}) {
  if (!DEBUG) {
    wx.request({
      url: config.API_HOST + data,
      method: method ? method : 'get',
      data: {},
      header: header ? header : { "Content-Type": "application/json" },
      success: function (res) {
        fn(res);
      }
    });
  } else {
    var res = Mock.mock({
      'error_code': '',
      'error_msg': '',
      // 'data': [{
      //   'id|+1': 1,
      //   'img': "../../image/main.jpg",
      //   'title': '@ctitle(3,8)',
      //   'city': "@county(true)",
      //   'zip':"@zip(6)",
      //   'stock_num': '@integer(0,10)',
      //   'marketing_start': '@datetime()',
      //   'marketing_stop': '@now()',
      //   'price': '@integer(100,2000)', 
      //   'original_price': '@integer(100,3000)'
      // }]
      'data':{
        'doctordata':[{
          'id|+1': 1,
          'img':'doctor.jpg',
          'name':'马天宇',
          'post':'主治医师'
        },{
          'id|+1': 1,
          'img': 'doctor.jpg',
          'name': '马天宇',
          'post': '教授'
        },{
          'id|+1': 1,
          'img': 'doctor.jpg',
          'name': '马天宇',
          'post': '副主任'
          },{
          'id|+1': 1,
          'img': 'doctor.jpg',
          'name': '马天宇',
          'post': '教授'
        },{
          'id|+1': 1,
          'img': 'doctor.jpg',
          'name': '马天宇',
          'post': '教授' 
        },{
          'id|+1': 1,
          'img': 'doctor.jpg',
          'name': '马天宇',
          'post': '教授'
        }],
        'articledata':[{
          'title':'凉生我们可不可以不忧伤',
          'writer':'马天宇',
          'lable':'悲伤',
          'content':'凉生，我们可不可以不忧伤是2014年新世界出版社、二十一世纪出版社出版的图书，作者是乐小米。凉生与姜生是一对伦理意义上的兄妹。惨淡的家境和生存的压力让妹妹姜生彻底的依赖与信任哥哥凉生，并不知不觉堕入了违背伦理道德的情感漩涡中。面对这样的爱情，作者的笔触是那么清丽、淡然，还夹着自嘲与绝望，甚至姜生觉得自己的感情是这个世界上最好笑的笑话。这是人世间所有人都渴望的爱情，纯粹、无悔、纤尘不染。',
          'commit':'581',
          'visitcount':'4596'
        },
          {
            'title': '凉生我们可不可以不忧伤',
            'writer': '马天宇',
            'lable': '悲伤',
            'content': '凉生，我们可不可以不忧伤是2014年新世界出版社、二十一世纪出版社出版的图书，作者是乐小米。凉生与姜生是一对伦理意义上的兄妹。惨淡的家境和生存的压力让妹妹姜生彻底的依赖与信任哥哥凉生，并不知不觉堕入了违背伦理道德的情感漩涡中。面对这样的爱情，作者的笔触是那么清丽、淡然，还夹着自嘲与绝望，甚至姜生觉得自己的感情是这个世界上最好笑的笑话。这是人世间所有人都渴望的爱情，纯粹、无悔、纤尘不染。',
            'commit': '581',
            'visitcount': '4596'
          },
          {
            'title': '凉生我们可不可以不忧伤',
            'writer': '马天宇',
            'lable': '悲伤',
            'content': '凉生，我们可不可以不忧伤是2014年新世界出版社、二十一世纪出版社出版的图书，作者是乐小米。凉生与姜生是一对伦理意义上的兄妹。惨淡的家境和生存的压力让妹妹姜生彻底的依赖与信任哥哥凉生，并不知不觉堕入了违背伦理道德的情感漩涡中。面对这样的爱情，作者的笔触是那么清丽、淡然，还夹着自嘲与绝望，甚至姜生觉得自己的感情是这个世界上最好笑的笑话。这是人世间所有人都渴望的爱情，纯粹、无悔、纤尘不染。',
            'commit': '581',
            'visitcount': '4596'
          },
          {
            'title': '凉生我们可不可以不忧伤',
            'writer': '马天宇',
            'lable': '悲伤',
            'content': '凉生，我们可不可以不忧伤是2014年新世界出版社、二十一世纪出版社出版的图书，作者是乐小米。凉生与姜生是一对伦理意义上的兄妹。惨淡的家境和生存的压力让妹妹姜生彻底的依赖与信任哥哥凉生，并不知不觉堕入了违背伦理道德的情感漩涡中。面对这样的爱情，作者的笔触是那么清丽、淡然，还夹着自嘲与绝望，甚至姜生觉得自己的感情是这个世界上最好笑的笑话。这是人世间所有人都渴望的爱情，纯粹、无悔、纤尘不染。',
            'commit': '581',
            'visitcount': '4596'
          }]
      }
    })
    fn(res);
  }
}
module.exports = {
  ajax: ajax
}
