import { formatNumber } from './util.js'

async function getTrainNoByDb(trainCode) {
  const db = wx.cloud.database()
  let res = await db.collection('train_list').where({
    train_code: trainCode
  }).get()
  if (res.data.length <= 0) {
    throw Error()
  }
  return res.data[0]
}

function getTrainNo(trainCode) {
  let url = 'https://search.12306.cn/search/v1/train/search'

  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const day = new Date().getDate()
  console.log([year, month, day].map(formatNumber))
  let date = [year, month, day].map(formatNumber).join('')

  // trainCode = trainCode.toLowerCase()
  console.log(`${url}?keyword=${trainCode}&date=${date}`)
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title: '加载中...'
    })
    wx.request({
      url: `${url}?keyword=${trainCode}&date=${date}`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        let trainList = res.data.data || []
        let trainInfo = {}
        let find = 0
        console.log(trainList)
        if (trainList.length == 0) {
          resolve(getTrainNoByDb(trainCode))
        }
        for (let i = 0; i < trainList.length; i++) {
          if (trainCode == trainList[i]['station_train_code']) {
            find = 1
            trainInfo = {
              train_code: trainList[i].station_train_code,
              train_no: trainList[i].train_no,
              start_station: trainList[i].from_station,
              end_station: trainList[i].to_station,
            }
            break
          }
        }
        if (find === 0) {
          resolve(getTrainNoByDb(trainCode))
        }

        resolve(trainInfo)
      },
      fail: function (err) {
        // fail
        // reject(err)
        resolve(getTrainNoByDb(trainCode))
      },
      complete: function () {
        // complete
        wx.hideLoading()
      }
    })
  })
}

module.exports = {
  getTrainNo
}