import { serverConfig } from '../config/config';
import { sign } from './util'

export function http(url, data, method = 'POST', useAuth = false, showLoading = true) {
  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({
        title: '加载中...',
      })
    }

    let timestamp = new Date().getTime()

    data = {
      timestamp,
      ...data
    }

    let signString = sign(data, serverConfig.appSecret)
    console.log(signString)
    data = {
      sign: signString,
      ...data
    }

    console.log('http request url:' + url)
    console.log('http request info:' + JSON.stringify(data))

    wx.request({
      url: serverConfig.gatewayServer + url,
      method: method,
      data: data,
      dataType: 'json',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: (res) => {
        console.log(res)
        wx.hideLoading()

        if (res.statusCode !== 200) {
          wx.showToast({
            title: '服务器繁忙',
            icon: 'none'
          })
          reject(res)
        }

        if (res.data.code == 0) {
          resolve(res.data.data)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
          reject(res.data.msg)
        }
      },
      fail: (res) => {
        console.log(res)
        wx.showToast({
          title: '服务器繁忙',
          icon: 'none'
        })
        wx.hideLoading()
        reject(res)
      }
    });
  })

}