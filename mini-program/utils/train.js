import { formatNumber } from './util.js'

/**
   * 格式化时刻列表
   */
function formatList(list) {
  let startTime = '', arriveTime = '', diffStartTime = 0, diffArriveTime = 0
  let tmpList = []
  list.forEach(item => {
    tmpList.push({
      station_name: item.station_name,
      // start_time: item.start_time.substr(0, 2) + ":" + item.start_time.substr(2),
      // arrive_time: item.arrive_time.substr(0, 2) + ":" + item.arrive_time.substr(2)
      start_time: item.start_time,
      arrive_time: item.arrive_time
    })

  })
  tmpList[0].arrive_time = '----'
  tmpList[tmpList.length - 1].start_time = '----'

  return tmpList
}


async function stationStopInfo(trainNo) {
  wx.showLoading()
  try {
    let { result } = await wx.cloud.callFunction({
      name: 'stationStopInfo',
      data: {
        trainNo,
      }
    })
    wx.hideLoading()

    if (result === "") {
      return {
        stationList: [],
      }
    }

    console.log(result)
    let stationList = formatList(result)
    console.log(stationList)

    if (stationList.length == 0) {
      return {
        stationList: [],
      }
    }


    let stationInfo = {
      start_station: result[0].station_name,
      end_station: result[stationList.length - 1].station_name,
      stationList: stationList
    }

    return stationInfo

  } catch (error) {
    console.log(error)
    wx.hideLoading()
    return {
      stationList: [],
    }
  }

}

async function getTrainNoByDb(trainCode) {
  const db = wx.cloud.database()
  let res = await db.collection('train_list').where({
    train_code: trainCode
  })
    .orderBy('date', 'desc')
    .get()
  if (res.data.length <= 0) {
    return false
  }
  return res.data[0]
}

function getTrainNoByUrl(trainCode) {
  let url = 'https://search.12306.cn/search/v1/train/search'

  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const day = new Date().getDate()
  console.log([year, month, day].map(formatNumber))
  let date = [year, month, day].map(formatNumber).join('')

  // trainCode = trainCode.toLowerCase()
  console.log(`${url}?keyword=${trainCode}&date=${date}`)
  return new Promise((resolve, reject) => {

    wx.request({
      url: `${url}?keyword=${trainCode}&date=${date}`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        let trainList = res.data.data || []
        let trainInfo = {}
        let find = 0
        console.log(trainList)
        if (trainList.length == 0) {
          reject({})
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
          reject({})
        }

        resolve(trainInfo)
      },
      fail: function (err) {
        // fail
        reject(err)
      },
      complete: function () {
        // complete

      }
    })
  })

}

async function getTrainNo(trainCode) {
  try {
    wx.showLoading({
      title: '加载中...'
    })
    let ret = await getTrainNoByDb(trainCode)

    if (ret === false) {
      ret = await getTrainNoByUrl(trainCode)
    }

    wx.hideLoading()
    return ret
  } catch (error) {
    wx.hideLoading()

    return false
  }
}

module.exports = {
  getTrainNo,
  stationStopInfo
}