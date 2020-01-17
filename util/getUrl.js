// 配置所有请求
const request = require('request')

const config = require('../config/config')
const menuBody = require('./menu')

// 微信请求url公共部分
const weixinUrl = 'https://api.weixin.qq.com/'

class wxApi {
  // 封装request请求
  requestApi(url, method, data) {
    return new Promise((resolve, reject) => {
      if (method == 'get' || method == 'GET') {
        request({
            url: url,
            method: 'GET'
          },
          (err, res, body) => {
            if (err) {
              throw err
            } else {
              let data = {
                res,
                body
              }
              resolve(data)
            }
          })
      } else {
        request({
          url: weixinUrl + url,
          method: 'POST',
          headers: { //设置请求头
            "content-type": "application/json",
          },
          json: true,
          body: data
        }, (err, res, body) => {
          if (err) {
            throw err
          } else {
            let data = {
              res,
              body
            }
            resolve(data)
          }
        })
      }
    })
  }

  // 获取token
  reqAccessToken() {
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

  // token过期重新获取
  async getToken(func) {
    this.reqAccessToken()
    let token = await config.readAccessToken()
    this.func(token)
  }

  // 添加自定义菜单接口
  async addMenu(data) {
    // 获取token
    let token = ''
    if (data) {
      token = data
    } else {
      token = await config.readAccessToken()
    }
    let url = 'cgi-bin/menu/create?access_token=' + token
    console.warn(url)
    // post请求创建自定义底部菜单
    request({
      url: weixinUrl + url,
      method: 'POST',
      headers: { //设置请求头
        "content-type": "application/json",
      },
      json: true,
      body: menuBody.menuTest
    }, (err, res, body) => {
      console.warn('--------------------------------')
      if (body.errcode === 42001) {
        this.getToken(this.addMenu)
      }
      if (!err && body.errcode === 0) {
        console.warn('更改菜单成功')
      } else {
        console.warn(body)
      }
    })
  }
  // 删除自定义菜单接口
  async delMenu() {
    let token = await config.readAccessToken()
    let url = 'cgi-bin/menu/delete?access_token=' + token
    request(url, (err, res, body) => {
      if (!err && body.errcode === 0) {
        console.warn('删除自定义菜单成功')
      } else {
        console.warn('---------')
        console.warn(body)
      }
    })
  }

  // 创建个性化菜单
  async gexinghuaMenu(data) {
    let token = ''
    if (data) {
      token = data
    } else {
      token = await config.readAccessToken()
    }
    let url = 'cgi-bin/menu/addconditional?access_token=' + token
    console.warn(url)
    // post请求创建个性化底部菜单
    console.log('更改个性化菜单')
    request({
      url: weixinUrl + url,
      method: 'POST',
      headers: { //设置请求头
        "content-type": "application/json",
      },
      json: true,
      body: menuBody.gexinghua
    }, (err, res, body) => {
      console.warn('--------------------------------')
      if (body.errcode === 42001) {
        this.getToken(this.gexinghuaMenu)
      }
      if (!err && body.menuid) {
        console.warn('更改菜单成功')
      } else {
        console.warn(body)
      }
    })
  }
  // 查询个性化菜单
  async queryInterface() {
    let token = await config.readAccessToken()
    let url = weixinUrl + 'cgi-bin/menu/get?access_token=' + token
    let data = await this.requestApi(url, 'GET')
    let arr = []
    data = JSON.parse(data.body)
    console.log(data)

    data.conditionalmenu.map(item => {
      arr.push(item.menuid)
    })
    return arr
  }
  // 删除个性化菜单
  async delgexinghuaMenu() {
    let arr = await this.queryInterface()
    console.log('------------')
    console.log(arr)
    let token = await config.readAccessToken()
    let url = weixinUrl + 'cgi-bin/menu/delconditional?access_token=' + token

    request({
        url: url,
        method: 'POST',
        json: true,
        body: {
          menuid: arr[0]
        }
      },
      (err, res, body) => {
        if (!err && body.errcode === 0) {
          console.warn('删除个性化菜单成功')
        } else {
          console.warn('删除个性化菜单失败')
          console.warn(body)
        }
      })
  }
  // 获取签名然后调用js-sdk
  async getsignature(data) {
    console.log('---------------------------')
    console.log('这是是获取js-sdk签名')
    let token = ''
    if (data) {
      token = data
    } else {
      token = await config.readAccessToken()
    }
    let fectUrl = weixinUrl + `cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`
    let resData = await this.requestApi(fectUrl, 'get')
    resData = JSON.parse(resData.res.body)
    if (resData.errcode == 0) {
      console.log('获取签名成功')
      return resData.ticket
    }
  }
  // 添加客服帐号
  async addServe() {
    let token = await config.readAccessToken()
    let url = weixinUrl + 'customservice/kfaccount/add?access_token=' + token
    let data = {
      "kf_account": "test1@test",
      "nickname": "客服1",
      "password": "pswmd5"
    }
    request({
      url: url,
      method: 'POST',
      headers: { //设置请求头
        "content-type": "application/json",
      },
      json: true,
      body: data
    }, (err, res, body) => {
      if (body.errcode === 0) {
        console.warn('增加客服成功')
      } else {
        console.warn(body)
      }
    })
  }
  //客服接口-发消息
  async serveSend() {
    let token = await config.readAccessToken()
    let url = weixinUrl + 'cgi-bin/message/custom/send?access_token=' + token
    let data = {
      "touser":"OPENID",
      "msgtype":"text",
      "text":
      {
           "content":"Hello World"
      }
  }
    request({
      url: url,
      method: 'POST',
      headers: { //设置请求头
        "content-type": "application/json",
      },
      json: true,
      body: data
    }, (err, res, body) => {
      if (body.errcode === 0) {
        console.warn('发送成功')
      } else {
        console.warn(body)
      }
    })
  }
}

module.exports = wxApi