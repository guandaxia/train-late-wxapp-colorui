/**
 * 代售点查询
 * 地址： https://kyfw.12306.cn/otn/queryAgencySellTicket/query
 * 参数： province 省份
 *       city     城市
 *       county   区
 * method: GET
 * 结果： {"validateMessagesShowId":"_validatorMessage","status":true,"httpstatus":200,"data":{"datas":[{"bureau_code":"Q","station_telecode":"DMQ","belong_station":"东莞东","province":"广东","city_code":"1504","city":"东莞","county":"万江区","windows_quantity":"1","agency_name":"东莞市万江明通票务服务部","address":"东莞市万江区简沙洲社区简沙洲商业街15号铺","addressencode":"%B6%AB%DD%B8%CA%D0%CD%F2%BD%AD%C7%F8%BC%F2%C9%B3%D6%DE%C9%E7%C7%F8%BC%F2%C9%B3%D6%DE%C9%CC%D2%B5%BD%D615%BA%C5%C6%CC","phone_no":"--","start_time_am":"0800","stop_time_am":"1200","start_time_pm":"1200","stop_time_pm":"1800"}],"flag":true},"messages":[],"validateMessages":{}}
 */
// 云函数入口文件
// const cloud = require('wx-server-sdk')
const fly = require("flyio")
const querystring = require("querystring")

// cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let [province, city, county] = event.region
  console.log(event.region)
  province = province.replace('省', '')
  province = province.replace('自治区', '')
  province = province.replace('市', '')

  city = city.replace('市', '')
  
  let url = "https://kyfw.12306.cn/otn/queryAgencySellTicket/query"
  let data = {
    province,
    city,
    county,
  }


  url = url + '?' + querystring.stringify(data)
  console.log(url)

  fly.config.headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
  }

  try {
    let result = await fly.get(url)
    console.log(result.data)

    return result.data.data.datas
  } catch (e) {
    return e
  }


}