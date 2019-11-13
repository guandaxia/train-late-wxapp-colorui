// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  const _ = db.command
  let openid = wxContext.OPENID

  let res = await db.collection('my_trip').where({
    _openid,
    date_obj: _.gte(new Date()) 
  }).get()
  console.log(res)
  return res

}