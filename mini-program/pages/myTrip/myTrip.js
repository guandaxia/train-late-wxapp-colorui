// mini-program/pages/myTrip/myTrip.js
const dayjs = require('../../libs/dayjs.min.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    await this.query()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  async query() {

    const db = wx.cloud.database()
    const _ = db.command
    let openid = getApp().globalData.openid

    let res = await db.collection('my_trip').where({
      date_obj: _.gte(new Date())
    }).get()
    console.log(res)
    let trianList = res.data || []
    console.log(trianList)
    trianList = this.formatList(trianList)
    console.log(trianList)
    this.setData({
      trianList
    })

  },

  /**
   * 格式化时刻列表
   */
  formatList(list) {
    let nowTime = dayjs()
    let startTime = '', arriveTime = '', diffStartTime = 0, diffArriveTime = 0
    let tmpList = []
    list.forEach(item => {
      startTime = dayjs(item.date + ' ' + item.start_time)

      let diffMinute = startTime.diff(nowTime, 'minute')
      let diffHour = startTime.diff(nowTime, 'hour')
      let diffDay = startTime.diff(nowTime, 'day')
      if (diffDay > 1) {
        item.remain_time = diffDay + '天'
      } else if (diffHour > 1) {
        item.remain_time = diffHour + '小时'
      } else {
        item.remain_time = diffMinute + '分钟'
      }

      if (diffMinute <= 180) {
        wx.cloud.callFunction({
          name: 'trainLate',
          data: {
            train_code: item.train_code,
            station: item.start_station,
          }
        }).then(res => {
          console.log(res.result)
          let trainInfo = res.result
          if (trainInfo.start_time == '' && trainInfo.arrive_time == '') {

          }
        })
      }

      tmpList.push(item)
    })
    return tmpList
  },

  gotoTrainList(e){
    console.log(e.currentTarget.dataset.trainInfo)
    let trainInfo = e.currentTarget.dataset.trainInfo

    getApp().globalData.stationStopList = trainInfo.station_list
    let trainCode = trainInfo.train_code

    wx.navigateTo({
      url: `/pages/list/list?id=${trainCode}`,
    })

  }

})