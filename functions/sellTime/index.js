// 云函数入口文件
const cloud = require('wx-server-sdk')
const fly = require("flyio")

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  if (!event.stationCode) {
    return {
      code: 1,
      msg: '请输入正确的车站名称'
    }
  }

  let url = "https://www.12306.cn/index/otn/index12306/queryScSname"

  let data = {
    'station_telecode': event.stationCode,
  }
  console.log(data)
  fly.config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  try {
    let result = await fly.post(url, data)
    console.log(result.data)

    let stationList = result.data.data
    if(stationList.length <= 0){
      return []
    }


    let queryResult = await db.collection('station_list').where({
      station_name: db.command.in(stationList)
    }).field({
      station_name: true,
      sell_time: true
    }).get()
    console.log(queryResult)
    return queryResult.data
  } catch (e) {
    return e
  }
}