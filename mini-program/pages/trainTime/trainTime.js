// pages/trainTime/trainTime.js
const app = getApp()
import { http } from '../../utils/http.js'

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

  sortHandle(e){
    let index = e.currentTarget.dataset.index
    console.log(index)
    let menu = this.data.menu
    let key = menu[index].key

    let sort = menu[index].sort 

    for(let i=0; i<menu.length; i++){
      menu[i].sort = 0
    }

    let stationList = this.data.stationList
    stationList.sort((a, b)=>{
      if(sort == 0 || sort == 2){
        menu[index].sort = 1
        return a[key].localeCompare(b[key])
      }else{
        menu[index].sort = 2
        return b[key].localeCompare(a[key])
      }
    })

    this.setData({
      stationList,
      menu
    })
  },

  search(e){
    let trainCode = e.currentTarget.dataset.trainCode
    let globalData = getApp().globalData

    const db = wx.cloud.database()
    db.collection('train_list').where({
      train_code: trainCode
    }).get().then(res => {

      console.log(res.data)
      let info = res.data[0]
      let historyInfo = {
        train_code: trainCode,
        train_no: info.train_no,
        start: info.start_station,
        end: info.end_station,
        list: []
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
        url: `../list/list?id=${trainCode}&train_no=${info.train_no}`
      })


    })

    // http('/getStationStopInfo', { 'train_number': trainNumber }, 'POST')
    //   .then(res => {
    //     console.log(res)
    //     let trainInfo = res.train_info

    //     app.globalData.stationList = trainInfo

    //     let startStation = trainInfo[0].station_name
    //     let endStation = trainInfo[0].end_station_name
    //     let historyInfo = {
    //       train_number: trainNumber,
    //       start: startStation,
    //       end: endStation,
    //       list: trainInfo
    //     }

    //     let queryHistory = wx.getStorageSync('query_history') || []
    //     if (!queryHistory[0] || (queryHistory[0].train_number !== historyInfo.train_number)) {
    //       let length = queryHistory.unshift(historyInfo)
    //       console.log(length)
    //       if (length > 5) {
    //         queryHistory.splice(5, length - 5)
    //         console.log(queryHistory)
    //       }

    //       wx.setStorageSync('query_history', queryHistory)
    //     }

    //     wx.navigateTo({
    //       url: '../list/list?id=' + trainNumber
    //     })
    //   }).catch(error => {
    //     console.log(error)
    //   })

  }
})