let API_HOST = "http://xxx.com/xxx";
let DEBUG = false;//�л��������
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
      'data': {
        'doctor': [{
          'did': 1,
          'doctor_image': 'doctor.jpg',
          'doctor_name': '董广璐1',
          'doctor_job': '主治医师',
          'doctor_message':'暂无',
          'doctor_price':20,
          'doctor_place':'妇科',
          'doctor_special':'肿瘤',
          'doctor_number':20
        }, {
          'did': 2,
          'doctor_image': 'doctor.jpg',
          'doctor_name': '董广璐2',
          'doctor_job': '主治医师',
          'doctor_message':'暂无',
          'doctor_price':20,
          'doctor_place':'妇科',
          'doctor_special':'肿瘤',
          'doctor_number': 20
        },{
          'did': 3,
          'doctor_image': 'doctor.jpg',
          'doctor_name': '董广璐3',
          'doctor_job': '主治医师',
          'doctor_message':'暂无',
          'doctor_price':20,
          'doctor_place':'妇科',
          'doctor_special':'肿瘤',
          'doctor_number': 20
        },{
          'did': 4,
          'doctor_image': 'doctor.jpg',
          'doctor_name': '董广璐4',
          'doctor_job': '主治医师',
          'doctor_message':'暂无',
          'doctor_price':20,
          'doctor_place':'妇科',
          'doctor_special':'肿瘤',
          'doctor_number': 20
        },{
          'did': 5,
          'doctor_image': 'doctor.jpg',
          'doctor_name': '董广璐5',
          'doctor_job': '主治医师',
          'doctor_message':'暂无',
          'doctor_price':20,
          'doctor_place':'妇科',
          'doctor_special':'肿瘤',
          'doctor_number': 20
        },{
          'did': 6,
          'doctor_image': 'doctor.jpg',
          'doctor_name': '董广璐6',
          'doctor_job': '主治医师',
          'doctor_message':'暂无',
          'doctor_price':20,
          'doctor_place':'妇科',
          'doctor_special':'肿瘤',
          'doctor_number': 20
        }
        // {
        //   'id|+1': 6,
        //   'img': 'doctor.jpg',
        //   'name': '董广璐',
        //   'post': '教授'
        // }
        ],
        'article': [{
          'aid': 1,
          'article_id':10,
          'article_title': '凉生我们可不可以不忧伤',
          'writer': '马天宇1',
          'article_class': '悲伤',
          'article_content': '凉生，我们可不可以不忧伤是2014年新世界出版社、二十一世纪出版社出版的图书，作者是乐小米。凉生与姜生是一对伦理意义上的兄妹。惨淡的家境和生存的压力让妹妹姜生彻底的依赖与信任哥哥凉生，并不知不觉堕入了违背伦理道德的情感漩涡中。面对这样的爱情，作者的笔触是那么清丽、淡然，还夹着自嘲与绝望，甚至姜生觉得自己的感情是这个世界上最好笑的笑话。这是人世间所有人都渴望的爱情，纯粹、无悔、纤尘不染。'
        },
        {
          'aid': 2,
          'article_id':10,
          'article_title': '凉生我们可不可以不忧伤',
          'writer': '马天宇2',
          'article_class': '悲伤',
          'article_content': '凉生，我们可不可以不忧伤是2014年新世界出版社、二十一世纪出版社出版的图书，作者是乐小米。凉生与姜生是一对伦理意义上的兄妹。惨淡的家境和生存的压力让妹妹姜生彻底的依赖与信任哥哥凉生，并不知不觉堕入了违背伦理道德的情感漩涡中。面对这样的爱情，作者的笔触是那么清丽、淡然，还夹着自嘲与绝望，甚至姜生觉得自己的感情是这个世界上最好笑的笑话。这是人世间所有人都渴望的爱情，纯粹、无悔、纤尘不染。'
        },
        {
          'aid': 3,
          'article_id':10,
          'article_title': '凉生我们可不可以不忧伤',
          'writer': '马天宇3',
          'article_class': '悲伤',
          'article_content': '凉生，我们可不可以不忧伤是2014年新世界出版社、二十一世纪出版社出版的图书，作者是乐小米。凉生与姜生是一对伦理意义上的兄妹。惨淡的家境和生存的压力让妹妹姜生彻底的依赖与信任哥哥凉生，并不知不觉堕入了违背伦理道德的情感漩涡中。面对这样的爱情，作者的笔触是那么清丽、淡然，还夹着自嘲与绝望，甚至姜生觉得自己的感情是这个世界上最好笑的笑话。这是人世间所有人都渴望的爱情，纯粹、无悔、纤尘不染。'
        },
        {
          'aid': 4,
          'article_id':10,
          'article_title': '凉生我们可不可以不忧伤',
          'writer': '马天宇4',
          'article_class': '悲伤',
          'article_content': '凉生，我们可不可以不忧伤是2014年新世界出版社、二十一世纪出版社出版的图书，作者是乐小米。凉生与姜生是一对伦理意义上的兄妹。惨淡的家境和生存的压力让妹妹姜生彻底的依赖与信任哥哥凉生，并不知不觉堕入了违背伦理道德的情感漩涡中。面对这样的爱情，作者的笔触是那么清丽、淡然，还夹着自嘲与绝望，甚至姜生觉得自己的感情是这个世界上最好笑的笑话。这是人世间所有人都渴望的爱情，纯粹、无悔、纤尘不染。'
        },
        {
          'aid': 5,
          'article_id':10,
          'article_title': '凉生我们可不可以不忧伤',
          'writer': '马天宇5',
          'article_class': '悲伤',
          'article_content': '凉生，我们可不可以不忧伤是2014年新世界出版社、二十一世纪出版社出版的图书，作者是乐小米。凉生与姜生是一对伦理意义上的兄妹。惨淡的家境和生存的压力让妹妹姜生彻底的依赖与信任哥哥凉生，并不知不觉堕入了违背伦理道德的情感漩涡中。面对这样的爱情，作者的笔触是那么清丽、淡然，还夹着自嘲与绝望，甚至姜生觉得自己的感情是这个世界上最好笑的笑话。这是人世间所有人都渴望的爱情，纯粹、无悔、纤尘不染。'
        }
        ],
        'ill-class': [{
          'iid|+1': 1,
          'ill_title': '多囊卵巢综合征',
          'ill_content': '多囊卵巢综合征（PCOS）是生育年龄妇女常见的一种复杂的内分泌及代谢异常所致的疾病，以慢性无排卵（排卵功能紊乱或丧失）和高雄激素血症（妇女体内男性激素产生过剩）为特征，主要临床表现为月经周期不规律、不孕、多毛和/或痤疮，是最常见的女性内分泌疾病。',
          'contentSec': '1935年Stein和Leventhal归纳为闭经、多毛、肥胖及不孕四大病症，称之为Stein-Leventhal综合征（S-L综合征）。PCOS患者的卵巢增大、白膜增厚、多个不同发育阶段的卵泡，并伴有颗粒细胞黄素化。PCOS是II型糖尿病、心血管疾病、妊娠期糖尿病、妊娠高血压综合征以及子宫内膜癌的重要危险因素。PCOS的临床表型多样，目前病因不清，PCOS常表现家族群聚现象，提示有遗传因素的作用。患者常有同样月经不规律的母亲或者早秃的父亲；早秃是PCOS的男性表型，女性PCOS和男性早秃可能是由同一等位基因决定的；高雄激素血症和/或高胰岛素血症可能是多囊卵巢综合征患者家系成员同样患病的遗传特征；在不同诊断标准下作的家系分析研究经常提示PCOS遗传方式为常染色体显性遗传；而应用“单基因-变异表达模型”的研究却显示PCOS是由主基因变异并50%可遗传给后代。'
        },
        {
          'iid|+1': 2,
          'ill_title': '不孕症',
          'ill_content': '不孕的医学定义为一年未采取任何避孕措施，性生活正常（每周两次及以上）而没有怀孕。主要分为原发不孕及继发不孕。原发不孕为从未受孕；继发不孕为曾经怀过孕。根据这种严格的定义，不孕是一种常见的问题，大约影响到至少10%～15%的育龄夫妇。引起不孕的发病原因分为男性不孕和女性不孕。',
          'contentSec': ""
        },
        {
          'iid|+1': 3,
          'ill_title': '月经不调',
          'ill_content': '月经失调也称月经不调，是妇科常见疾病，表现为月经周期或出血量的异常，可伴月经前、月经时的腹痛及其他的全身症状。病因可能是器质性病变或是功能失常。',
          'contentSec': ""
        },
        {
          'iid|+1': 4,
          'ill_title': '盆腔炎性疾病',
          'ill_content': '盆腔炎性疾病（pelvicinflammatorydisease，PID）指一组女性上生殖道的感染性疾病，主要包括子宫内膜炎、输卵管炎、输卵管卵巢脓肿（TOA）、盆腔腹膜炎。炎症可局限于一个部位，也可同时累及几个部位，最常见的是输卵管炎。',
          'contentSec': ""
        },
        {
          'iid|+1': 5,
          'ill_title': '痛经',
          'ill_content': '痛经(dysmenorrhea)为最常见的妇科症状之一，指行经前后或月经期出现下腹部疼痛、坠胀，伴有腰酸或其他不适，症状严重影响生活质量者。痛经分为原发性痛经和继发性两类，原发性痛经指生殖器官无器质性病变的痛经；继发性痛经指由盆腔器质性疾病，如子宫内膜异位症、子宫腺肌病等引起的痛经。',
          'contentSec': "",
        },
        {
          'iid|+1': 6,
          'ill_title': '子宫内膜异位症',
          'ill_content': '子宫内膜异位症（endometriosis）是指有活性的内膜细胞种植在子宫内膜以外的位置而形成的一种女性常见妇科疾病。内膜细胞本该生长在子宫腔内，但由于子宫腔通过输卵管与盆腔相通，因此使得内膜细胞可经由输卵管进入盆腔异位生长。目前对此病发病的机制有多种说法，其中被普遍认可的是子宫内膜种植学说。本病多发生于生育年龄的女性，青春期前不发病，绝经后异位病灶可逐渐萎缩退化。',
          'contentSec': '子宫内膜异位症的主要病理变化为异位内膜周期性出血及其周围组织纤维化，形成异位结节，痛经、慢性盆腔痛、月经异常和不孕是其主要症状。病变可以波及所有的盆腔组织和器官，以卵巢、子宫直肠陷凹、宫骶韧带等部位最常见，也可发生于腹腔、胸腔、四肢等处。'
        },
        {
          'iid|+1': 7,
          'ill_title': '绝经期综合征',
          'ill_content': '绝经期综合症是指归女绝经期，由于卵巢分泌功能缓慢减弱，植物性神经功能障碍，新陈代谢及营养障碍性出现的症状。如月经紊乱、头晕、心烦急躁、口干、潮热、舌尖红、脉细数等。',
          'contentSec': ""
        },
        {
          'iid|+1': 8,
          'ill_title': '多发性流产',
          'ill_content': '',
          'contentSec': ""
        },
        {
          'iid|+1': 9,
          'ill_title': '',
          'ill_content': '',
          'contentSec': ""
        }]
      }
    })
    fn(res);
  }
}
module.exports = {
  ajax: ajax
}
