// 云函数入口文件
const cloud = require('wx-server-sdk')
const fly = require("flyio")
const querystring = require("querystring")


cloud.init()

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTime(date){
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  let date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 29)

  // let url = "https://kyfw.12306.cn/otn/czxx/queryByTrainNo"
  // let data = {
  //   'train_no': event.trainNo,
  //   'from_station_telecode': "VNP",
  //   'to_station_telecode': "VNP",
  //   'depart_date': formatTime(date),
  // }

  //https://kyfw.12306.cn/otn/queryTrainInfo/query?leftTicketDTO.train_no=770000K8130I&leftTicketDTO.train_date=2019-07-23&rand_code=
  let url = "https://kyfw.12306.cn/otn/queryTrainInfo/query"
  let data = {
    'leftTicketDTO.train_no': event.trainNo,
     'leftTicketDTO.train_date': formatTime(date),
     'rand_code': '',
  }


  url = url + '?' + querystring.stringify(data)
  console.log(url)

  fly.config.headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
  }
  
  try{
    let result = await fly.get(url)
    console.log(result)
    // let statinInfo = result.data.data.data
    return result.data.data.data
  }catch(e){
    return e
  }
}