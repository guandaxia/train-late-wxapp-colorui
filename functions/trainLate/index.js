// 云函数入口文件
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

function query(event, type){
  console.log(type)
  console.log(event)
  let url = "http://dynamic.12306.cn/mapping/kfxt/zwdcx/LCZWD/cx.jsp"

  let time = new Date().getTime()
  let date = new Date(time)

  let station = event.station
  let stationEncode = encodeURI(station).replace(/%/g, '-')

  let data = {
    'cz': station,
    'cc': event.train_code,
    'cxlx': type,
    'rq': formatTime(date),
    'czEn': stationEncode,
    'tp': time,
  }

  url = url + '?' + querystring.stringify(data)
  console.log(url)
  return fly.get(url)

}

function formatResult(result){
  
  let res = /\d{2}:\d{2}/.exec(result)
  return Array.isArray(res) && res[0]
}

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
//http://dynamic.12306.cn/mapping/kfxt/zwdcx/LCZWD/cx.jsp?cz=石家庄&cc=z150&cxlx=0&rq=2019-06-22&czEn=-E5-8C-97-E4-BA-AC-E8-A5-BF&tp=1561210753900


  fly.config.headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
  }

  return new Promise((resolve, reject)=>{
    fly.all([query(event, 0), query(event, 1)])
      .then(fly.spread(function (arrive, start) {
        //两个请求都完成
        console.log(arrive.data.replace(/\n/g, ''))
        console.log(start.data.replace(/\n/g, ''))
        let arriveTime = formatResult(arrive.data)
        let startTime = formatResult(start.data)

        resolve({
          'start_time': startTime || '',
          'arrive_time': arriveTime || '',
        })

      }))
      .catch(function (error) {
        console.log(error)
        reject(error)
      })
  })
  
}