// 云函数入口文件
const cloud = require('wx-server-sdk')
const fly = require("flyio")

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  let queryResult = await db.collection('station_list').where({
    station_name: event.stationName
  }).field({
    station_code: true
  }).get()

  if (!queryResult){
    return {
      code: 1,
      msg: '请输入正确的车站名称'
    }
  }

  let stationTelecode = queryResult['data'][0]['station_code']

  let url = "https://www.12306.cn/index/otn/index12306/queryTicketCheck"
  
  let data = {
    'trainDate': event.date,
    'station_train_code': event.trainCode,
    'from_station_telecode': stationTelecode,
  }
  console.log(data)
  fly.config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  try {
    let result = await fly.post(url, data)
    console.log(result.data)
    // let statinInfo = result.data.data.data
    return result.data.data
  } catch (e) {
    return e
  }
}