// 配置所有请求
const request = require('request')

const config = require('../config/config')
const menu = require('./menu')

// 微信请求url公共部分
const weixinUrl = 'https://api.weixin.qq.com/'

class wxApi {

  // 获取token
  reqAccessToken () {
    let AppId = config.AppId
    let AppSecret = config.AppSecret
    let url = weixinUrl + 'cgi-bin/token?grant_type=client_credential&appid=' + AppId + '&&secret=' + AppSecret
    // 利用request发送get请求获取assetsToken
    request(url, (err, res, body) => {
      if (res.statusCode == 200) {
        let AcessToken = JSON.parse(body).access_token
        //将拿到的值写入文件中
        config.writeAccessToken(AcessToken)
      }
    })
  }

  // 添加接口
  async addMenu () {
    let menuBody = menu.bottomMenu
    // 获取token
    let token = await config.readAccessToken()
    let url = 'cgi-bin/menu/create?access_token=' + token
    // post请求创建自定义底部菜单
    request({
      url: weixinUrl + url,
      method: 'POST',
      headers: {//设置请求头
        "content-type": "application/json",
      },
      json: true,
      body: JSON.stringify(menuBody)
    }, (err, res, body) => {
      console.warn('--------------------------------')
      console.warn(res)
      console.warn(body)
    })
  }
}

module.exports = wxApi

