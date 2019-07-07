// pages/ticketCheck/ticketCheck.js
const dayjs = require('../../libs/dayjs.min.js')
import { checkTrainCode, throttle } from '../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showKeyboard: false,
    input: '',
    showClear: false,
    date: '',
    stationList: ['请先选择车次'],
    stationName: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let endDate = dayjs().add(31, 'day')
    let date = dayjs().format("YYYY-MM-DD")
    console.log(endDate.format("YYYY-MM-DD"))
    this.setData({
      date: date,
      startDate: date,
      endDate: endDate.format("YYYY-MM-DD")
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
      title: this.data.ticketCheck,
      path: '/pages/ticketCheck/ticketCheck'
    }

  },

  pageTap: function () {
    // 在页面空白处点击时隐藏小键盘
    this.setData({
      showKeyboard: false
    })
    wx.showTabBar()
  },
  clearInput () {
    console.log('clear')
    this.setData({
      input: '',
      showClear: false,
      stationList: ['请先选择车次'],
      stationName: ''
    })
  },
  bindKeyInput () {
    console.log('key input')
    let showKeyboard = this.data.showKeyboard

    this.setData({
      showKeyboard: !showKeyboard
    })
  },
  keyboardValue({ detail }) {

    this.setData({
      ...detail
    })

    let input = detail.input
    console.log(input)
    if (!checkTrainCode(input)) {
      return
    }
    wx.showLoading({
      title: '数据加载中'
    })
    wx.cloud.callFunction({
      name: 'stationStopInfo',
      data: {
        trainCode: input,
      }
    }).then(res => {
      wx.hideLoading()
      console.log(res.result)

      let stationList = []
      res.result.forEach(item=>{
        stationList.push(item.station_name)
      })

      stationList.pop() //截取终点站

      this.setData({
        stationList,
        stationName: stationList[0]
      })
    }).catch(err => {
      wx.hideLoading()
    })
    
  },

  hideKeyboard({ detail }) {
    this.setData({
      ...detail
    })
  },

  dateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  selectStation(e){
    console.log(this.data.stationList[e.detail.value])
    this.setData({
      stationName: this.data.stationList[e.detail.value]
    })
  },

  formSubmit({ detail}){
    console.log(detail)
    let trainCode = detail.value.train_code

    trainCode = checkTrainCode(trainCode)
    if (!trainCode) {
      wx.showToast({
        title: '车次格式错误',
        image: '/images/error.png'
      })
      return
    }

    let stationName = this.data.stationName
    if (!stationName){
      wx.showToast({
        title: '车站为空',
        image: '/images/error.png'
      })
      return
    }
    wx.showLoading({
      title: '数据加载中'
    })
    wx.cloud.callFunction({
      name: 'queryTicketCheck',
      data: {
        trainCode,
        date: this.data.date,
        stationName
      }
    }).then(res => {

      console.log(res.result)
      
      wx.hideLoading()
      if(!res.result){
        wx.showToast({
          title: '未找到检票口信息',
          icon: 'none'
        })
        return
      }
      this.setData({
        ticketCheck: `${trainCode} 在 ${stationName} 的检票口为: ${res.result}`
      })
    }).catch(err => {
      wx.hideLoading()
    })

    
  }
})