
const KEY = '4b8b422800e0dccc3c3ec734e47bfa83'

function georegeo(address, city){
  if(!address){
    return 
  }

  let url = 'https://restapi.amap.com/v3/geocode/geo';

  url = `${url}?address=${address}&city=${city}&key=${KEY}`
  console.log(url)
  return new Promise((resolve, reject)=>{
    wx.request({
      url,
      success(res){
        console.log(res.data)
        if(res.data == 0){
          reject(res.info)
        }
        resolve(res.data.geocodes[0])
      },
      fail(err){
        console.log(err)
        reject(err)
      }
    })

  })
}


module.exports = {
  georegeo
}