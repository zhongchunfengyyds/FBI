var express = require('express');
var router = express.Router()
const rawBody = require('raw-body')

const sha1 = require("sha1")
// 获取所有的请求
const wxApi = require('../util/getUrl')
const wxRequest = new wxApi()
// 获取accessToken
wxRequest.reqAccessToken()
// 创建自定义菜单
wxRequest.gexinghuaMenu()

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.query)
  let token = 'xiaozhong'
  let $signature = req.query.signature
  let $timestamp = req.query.timestamp
  let $nonce = req.query.nonce
  let $echostr = req.query.echostr
  let array = [token, $timestamp, $nonce]
  console.log(array)
  array.sort()
  // console.log(array)
  let tempStr = array.join('')
  // console.log(tempStr)
  var resultCode = sha1(tempStr) //对传入的字符串进行加密
  // 获取AccessToken
  console.log($echostr)
  if (resultCode === $signature) {
    res.send($echostr);
  } else {
    res.send('mismatch');
  }
})

router.post('/',function(req, res, next){
  console.log(req.query, req.body) 
})
module.exports = router;