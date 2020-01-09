// 消息推送 消息聊天
const xml2js = require('xml2js');

function message(body, query) {
  let now = new Date().getTime()
  let reply = ''
  msgtype = body.msgtype[0]
  if (msgtype === 'text') {
    reply = '<xml>' +
    '<ToUserName><![CDATA['+ body.fromusername[0] +']]></ToUserName>' +
    '<FromUserName><![CDATA['+ message.tousername[0] +']]></FromUserName>' +
    '<CreateTime>'+ now +'</CreateTime>' +
    '<MsgType><![CDATA['+ msgtype +']]></MsgType>' +
    '<Content><![CDATA[收到你的信息]]></Content>' +
    '</xml>'
  }
  return reply
}
module.exports = message