// pages/trainTime/trainTime.js
const app = getApp()
import { http } from '../../utils/http.js'
import { stationStopInfo } from '../../utils/train'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    stationList: [],
    title: '',
    trainCodeSort: 0,
    startTimeSort: 1,
    arriveTimeSort: 0,
    menu: [{
      key: 'station_train_code',
      title: '车次',
      sort: 0
    },
    {
      key: 'start_time',
      title: '出发时间',
      sort: 1
    },
    {
      key: 'arrive_time',
      title: '到达时间',
      sort: 0
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let globalData = app.globalData
    let stationList = globalData.stationTrainList
    let startStation = globalData.selectStartStation.stationName
    let endStation = globalData.selectEndStation.stationName
    let title = startStation + '-' + endStation

    this.setData({
      title,
      stationList
    })

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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {

    }
  },

  sortHandle(e) {
    let index = e.currentTarget.dataset.index
    console.log(index)
    let menu = this.data.menu
    let key = menu[index].key

    let sort = menu[index].sort

    for (let i = 0; i < menu.length; i++) {
      menu[i].sort = 0
    }

    let stationList = this.data.stationList
    stationList.sort((a, b) => {
      if (sort == 0 || sort == 2) {
        menu[index].sort = 1
        return a[key].localeCompare(b[key])
      } else {
        menu[index].sort = 2
        return b[key].localeCompare(a[key])
      }
    })

    this.setData({
      stationList,
      menu
    })
  },

  async search(e) {
    let trainCode = e.currentTarget.dataset.trainCode
    let globalData = getApp().globalData

    let result = await stationStopInfo(trainCode)
    console.log(result)
    if (result.stationList.length === 0) {
      wx.showToast({
        title: '未找到该车次',
        image: '/images/error.png'
      })
      return
    }
    globalData.stationStopList = result.stationList

    let historyInfo = {
      train_code: trainCode,
      start: result.start_station,
      end: result.end_station,
    }
    let queryHistory = wx.getStorageSync('query_history') || []

    let index = queryHistory.findIndex(item => {
      return item.train_code == trainCode
    })

    if (index !== -1) {
      queryHistory.splice(index, 1)
    }
    queryHistory.unshift(historyInfo)
    if (queryHistory.length > 5) {
      // 删除最后一个元素，保证不超过10条历史记录
      queryHistory.pop()
    }
    wx.setStorage({
      key: 'query_history',
      data: queryHistory,
    })

    wx.navigateTo({
      url: `../list/list?id=${trainCode}`
    })
  }
})