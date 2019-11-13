// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  
  let dateObj = new Date(event.date + ' ' + event.start_time)
  console.log(dateObj)
  let openid = wxContext.OPENID

  try{
    let res = await db.collection('my_trip').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        openid,
        date_obj: dateObj,
        date: event.date,
        train_code: event.train_code,
        start_station: event.start_station,
        start_time: event.start_time,
        end_station: event.end_station,
        end_time: event.end_time,
        station_list: event.station_list,
        seat_type: event.seat_type,
        seat_number: event.seat_number,
        carriage: event.carriage,
        ticket_check: event.ticket_check,
        create_time: db.serverDate()
      }
    })

    return {"code":0, "message":"添加成功"}
  }catch(error){
    return {"code":1, "message":error}
  }
  
  
}