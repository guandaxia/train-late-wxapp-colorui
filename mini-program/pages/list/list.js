// pages/list/list.js
const dayjs = require('../../libs/dayjs.min.js')
// import { http } from '../../utils/http.js'
const app = getApp()
let scrollTop = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainCode: '列车时刻表',
    stationList: [],
    CustomBar: app.globalData.CustomBar,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let trainCode = options.id
    let trainNo = options.train_no
    console.log(trainNo)
    // let stationList = app.globalData.stationList
    // wx.showLoading({
    //   title:'数据加载中'
    // })
    // wx.cloud.callFunction({
    //   name: 'stationStopInfo',
    //   data: {
    //     trainNo,
    //   }
    // }).then(res => {

    //   console.log(res.result)
    //   let stationList = this.formatList(res.result)
    //   wx.hideLoading()
    //   this.setData({
    //     stationList
    //   })
    // }).catch(err=>{
    //   wx.hideLoading()
    // })

    // stationList = this.formatList(stationList)
    this.setData({
      trainCode,
      stationList: getApp().globalData.stationStopList
    })
    let scrollTop = wx.getStorageSync('scrollTop') || 0
    console.log(scrollTop)
    wx.pageScrollTo({
      scrollTop,
      duration: 300,
    })
  },

  onPageScroll(e) {
    console.log(e.scrollTop)//获取滚动条当前位置的值
    scrollTop = e.scrollTop
  },

  /**
   * 格式化时刻列表
   */
  formatList(list) {
    let nowTime = dayjs()
    let startTime = '', arriveTime = '', diffStartTime = 0, diffArriveTime = 0
    let tmpList = []
    list.forEach(item => {
      item.disabled = false
      startTime = dayjs().format('YYYY-MM-DD') + ' ' + item.start_time
      arriveTime = dayjs().format('YYYY-MM-DD') + ' ' + item.arrive_time
      diffStartTime = nowTime.diff(dayjs(startTime), 'minute')
      diffArriveTime = nowTime.diff(dayjs(arriveTime), 'minute')

      // if ((diffArriveTime <= 60 && diffArriveTime >=-180 ) || (diffStartTime <= 60 && diffStartTime >= -180)){
      //   item.disabled = false
      // }
      tmpList.push(item)
    })
    tmpList[tmpList.length - 1].start_time = '----'
    console.log(tmpList[tmpList.length - 1])
    return tmpList
  },

  formSubmit({ detail }) {
    let station = detail.value.station
    let index = detail.value.index
    let trainCode = this.data.trainCode

    wx.showLoading({
      title: '数据加载中'
    })
    wx.cloud.callFunction({
      name: 'trainLate',
      data: {
        train_code: trainCode,
        station,
      }
    }).then(res => {

      console.log(res.result)
      wx.hideLoading()
      let trainInfo = res.result
      if (trainInfo.start_time == '' && trainInfo.arrive_time == '') {
        wx.showToast({
          title: '未查到，请稍后重试',
          icon: 'none'
        })
        return
      }

      let key = 'stationList[' + index + "]"

      let stationInfo = this.data.stationList[index]
      stationInfo['actual_start_time'] = trainInfo.start_time
      stationInfo['actual_arrive_time'] = trainInfo.arrive_time
      stationInfo['buttonText'] = '刷新'
      console.log(stationInfo)
      this.setData({
        [key]: stationInfo
      })

    }).catch(err => {
      wx.hideLoading()
    })
    return
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.setStorage({
      key: 'scrollTop',
      data: scrollTop,
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.setStorage({
      key: 'scrollTop',
      data: scrollTop,
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})