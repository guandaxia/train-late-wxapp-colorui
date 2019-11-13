// 云函数入口文件
// 根据车站获取车次信息
const cloud = require('wx-server-sdk')
const fly = require("flyio")
const querystring = require("querystring")


cloud.init()

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTime(date) {
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

  let url = "https://kyfw.12306.cn/otn/leftTicket/query"

  let date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1)
  let data = {
    'leftTicketDTO.train_date': formatTime(date),
    'leftTicketDTO.from_station': event.start_station_code,
    'leftTicketDTO.to_station': event.end_station_code,
    'purpose_codes': "ADULT",
  }

  url = url + '?' + querystring.stringify(data)
  console.log(url)

  fly.config.headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
    'Cookie': 'BIGipServerotn=217055754.64545.0000; RAIL_EXPIRATION=1568939526562; RAIL_DEVICEID=EmKOeMxaJKNT-Kmj0BkLFcuq7qKnJItA9Eza1-Nd9bpAJomLKOvaJpKj9yGYXhF_dyhzvd86XRZxVNtAWX91uzG90ZbWZ4qNmjfnFhwpD2Y1rLWfRuyhXZPCH1olOf--E0nPohnyiT6Lt3hG1hRHTNS4UfvT72Dt; BIGipServerpool_passport=183304714.50215.0000'
  }

  try {
    let result = await fly.get(url)
    console.log(result.data)
    result = result.data.data.result
    console.log(result)
    let trainList = []
    result.forEach(item=>{
      item = item.split('|')
      trainList.push({
        lishi: item[10],
        station_train_code: item[3],
        arrive_time: item[9],
        start_time: item[8],
        train_no: item[2],
      })

    })

    return trainList
  } catch (e) {
    return e
  }
}