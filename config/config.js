const path = require('path')
const fs = require('fs')

const ticket_file = path.join(__dirname, '../util/ticket.txt')
const accessTokenFile = path.join(__dirname, '../util/accessToken.txt')

console.log(accessTokenFile)
// 公众号基本配置
const config = {
  AppId: 'wxa9c7b72fc4aa158d',
  AppSecret: 'f6b6be31a68ffa3240529e3ef93069c0',
  //获取access_token
  readAccessToken () {
    let result = ''
    return new Promise((reolve, reject) => {
      fs.readFile (accessTokenFile, (err, data) => {
        if (err) {
          reject(err)
        } else {
          // data是base64
          result = data.toString()
          reolve(result)
        }
      })
    })
  },
  // 写入acess_token
  writeAccessToken (content) {
    fs.writeFileSync(accessTokenFile, content, err => {
      throw err
    })
  }
}

module.exports = config