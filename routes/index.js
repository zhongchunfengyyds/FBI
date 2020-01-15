var express = require('express');
var router = express.Router()

const config = require('../config/config')
const sha1 = require("sha1")
// 消息类型
const message = require('../util/message')
// 获取所有的请求
const wxApi = require('../util/getUrl')
const wxRequest = new wxApi()
// 获取accessToken
wxRequest.reqAccessToken()
// 删除个性化菜单
// wxRequest.delgexinghuaMenu()
// 删除自定义菜单
// wxRequest.delMenu()
// 创建自定义菜单
// wxRequest.addMenu()
// 创建个性化菜单
// wxRequest.gexinghuaMenu()

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
  let result = message(req.body.xml)
  console.log('回复消息')
  console.log(result)
  res.send(result)
})

// 网页授权
router.get('/aouth', async(req, res) => {
  console.log('1------------------------------------')
  console.log(req.query)
  // 获取网页授权的code
  if (!req.query.code) {
    let redirect_url= encodeURI('https://www.xiaozhong.online/aouth')
    console.warn('重定向的地址')
    console.warn(redirect_url)
    res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.AppId}&redirect_uri=${redirect_url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`)
    return
  }

  // 获取用户accessToken 和 apenid
  console.log('2---------------------------------------')
  let code = req.query.code 
  console.log(code)

  let url =  `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.AppId}&secret=${config.AppSecret}&code=${code}&grant_type=authorization_code`
  let userObj = null
  let resData = await wxRequest.requestApi(url, 'get')
  // { 
  //   "access_token":"ACCESS_TOKEN",
  //   "expires_in":7200,
  //   "refresh_token":"REFRESH_TOKEN",
  //   "openid":"OPENID",
  //   "scope":"SCOPE" 
  // }
  console.log('3-------------------------------------')
  console.log(resData.res.body)
  // resData = JSON.parse(resData)
  if (resData.access_token) {
    userObj = resData.res.body
  }
  // 拉取用户信息
  let infoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${userObj.access_token}&openid=${userObj.openid}&lang=zh_CN`
  wxRequest.requestApi(infoUrl, 'get').then(res => {
    if (res) {
      console.log('4----------------------------------------------------')
      console.warn(res)
      res.send(res)
      // res.
    }
  })
})
module.exports = router;