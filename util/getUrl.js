// 配置所有请求
const request = require('request')

const config = require('../config/config')

// 微信请求url公共部分
const weixinUrl = 'https://api.weixin.qq.com/'

class wxApi {
  // 获取token
  reqAccessToken () {
    let AppId = config.AppId
    let AppSecret = config.AppSecret
    let url = weixinUrl + 'cgi-bin/token?grant_type=client_credential&appid=' + AppId + '&&secret=' + AppSecret
    console.warn(url)
    // 利用request发送get请求获取assetsToken
    request(url, (err, res, body) => {
      if (res.statusCode == 200) {
        console.warn('拿到AccessToken-------')
        console.warn(body)
        let AcessToken = JSON.parse(body).access_token
        //将拿到的值写入文件中
        config.writeAccessToken(AcessToken)
        // 我现在读取accessToken
        console.warn('读取中-----------------')
        config.readAccessToken().then(res => {
          console.warn(res)
        })
      }
    })
  }
}

module.exports = wxApi

