// 消息推送 消息聊天
const xml2js = require('xml2js');

function message(body, query) {
  let now = new Date().getTime()
  let reply = ''
  msgtype = body.msgtype[0]
  if (body.msgtype[0] === 'text') {
    reply = '<xml>' +
    '<ToUserName><![CDATA['+ body.fromusername +']]></ToUserName>' +
    '<FromUserName><![CDATA['+ message.tousername +']]></FromUserName>' +
    '<CreateTime>'+ now +'</CreateTime>' +
    '<MsgType><![CDATA['+ message.MsgType +']]></MsgType>' +
    '<Content><![CDATA[收到你的信息]]></Content>' +
    '</xml>'
  }
  return reply
}
module.exports = message