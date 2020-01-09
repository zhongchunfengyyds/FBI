// 消息推送 消息聊天
const xml2js = require('xml2js');

function message(body, query) {
    console.log(1)
    if (body.MsgType[0] === 'text') {
        console.log(2)
        let builder = new xml2js.Builder();
        console.log(3)
        let xml = {
            ToUserName: query.openid,
            FromUserName: body.fromusername,
            CreateTime: new Date().getTime(),
            MsgType: 'text',
            Content: body.content
        };
        return builder.buildObject(xml);
    }

}
module.exports = message