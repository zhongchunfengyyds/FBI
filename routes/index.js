var express = require('express');
var router = express.Router();
var crypto =  require('crypto')

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.query)
  let token = 'xiaozhong'
  let $signature = res.query.signature
  let $timestamp  = res.query.timestamp
  let $nonce = res.query.nonce
  let $echostr = req.query.echostr
  let array = [token, $timestamp, $nonce]
  console.log(array)
  array.sort()
  console.log(array)
  let tempStr = array.join('')
  const hashCode = crypto.createHash('sha1'); //创建加密类型 
  var resultCode = hashCode.update(tempStr,'utf8').digest('hex'); //对传入的字符串进行加密
  if(resultCode === $signature){
    res.send($echostr);
  }else{
    res.send('mismatch');
  }
})

module.exports = router;