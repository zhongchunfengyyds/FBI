// 消息推送 消息聊天
const xml2js = require('xml2js');
function message (data) {
    if (data.MsgType === 'text') {
        let obj = {name: "Super", Surname: "Man", age: 23};
 
        let builder = new xml2js.Builder();
        return builder.buildObject(obj);
    }
}
module.exports = message