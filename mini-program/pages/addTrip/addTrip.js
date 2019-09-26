// mini-program/pages/addTrip/addTrip.js
const dayjs = require('../../libs/dayjs.min.js')
import { checkTrainCode } from '../../utils/util.js'
import { getTrainNo } from '../../utils/train'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    startDate: '',
    endDate: '',
    input: '',
    showClear: false,
    showKeyboard: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = dayjs().format('YYYY-MM-DD')
    let endDate = dayjs().add(31, 'day').format('YYYY-MM-DD')
    this.setData({
      startDate: date,
      endDate,
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

  pageTap: function () {
    // 在页面空白处点击时隐藏小键盘
    this.setData({
      showKeyboard: false
    })
  },

  clearInput: function () {
    console.log('clear')
    this.setData({
      input: '',
      showClear: false
    })
  },
  bindKeyInput: function () {
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
    this.queryStationList()
  },

  hideKeyboard({ detail }) {
    this.setData({
      ...detail
    })
  },

  async queryStationList() {
    let trainCode = this.data.input
    console.log(trainCode)
    trainCode = checkTrainCode(trainCode)
    if (!trainCode) {
      return
    }
    let info = await getTrainNo(trainCode)
    console.log(info)
  },

  dateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  selectStation(e) {
    console.log(this.data.stationList[e.detail.value])
    this.setData({
      stationName: this.data.stationList[e.detail.value]
    })
  },

  formSubmit({ detail }) {
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
    if (!stationName) {
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
      if (!res.result) {
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