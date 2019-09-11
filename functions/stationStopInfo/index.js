// 云函数入口文件
const cloud = require('wx-server-sdk')
const fly = require("flyio")
const querystring = require("querystring")


cloud.init()

const db = cloud.database()

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  // const hour = date.getHours()
  // const minute = date.getMinutes()
  // const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
}

function checkParam(param) {
  if ((param === '' || param === null || param === undefined)) {
    return false
  }
  return true
}

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()

  let date = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2)

  let trainNo = event.trainNo
  let trainCode = event.trainCode
  console.log(trainNo)
  console.log(trainCode)

  if (!checkParam(trainNo) && !checkParam(trainCode)) {
    return {
      code: 1,
      msg: '参数错误'
    }
  }

  if (trainCode) {
    // 参数trainNo为空时，查询数据库
    let queryResult = await db.collection('train_list').where({
      train_code: trainCode
    }).field({
      train_no: true
    }).get()

    console.log(queryResult)

    if (!queryResult) {
      return {
        code: 1,
        msg: '车站名称错误'
      }
    }

    trainNo = queryResult['data'][0]['train_no']

  }

  //https://kyfw.12306.cn/otn/queryTrainInfo/query?leftTicketDTO.train_no=770000K8130I&leftTicketDTO.train_date=2019-07-23&rand_code=
  let url = "https://kyfw.12306.cn/otn/queryTrainInfo/query"
  let data = {
    'leftTicketDTO.train_no': trainNo,
    'leftTicketDTO.train_date': formatTime(date),
    'rand_code': '',
  }


  url = url + '?' + querystring.stringify(data)
  console.log(url)

  fly.config.headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
  }

  try {
    let result = await fly.get(url)
    console.log(result)
    // let statinInfo = result.data.data.data
    // return {
    //   code: 0,
    //   msg: 'success',
    //   data: result.data.data.data
    // }
    return result.data.data.data
  } catch (e) {
    return e
  }
}