// mini-program/pages/sellTime/sellTime.js
const dayjs = require('../../libs/dayjs.min.js')

let dayCount = 29
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    station: '',
    date: '',
    startDate: '',
    endDate: '',
    sellDate: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = dayjs().format('YYYY-MM-DD')
    this.setData({
      startDate: date,
    })
    db.collection('config').doc('12e3b074-ee89-45b6-a6ea-7267c4d86f47').get().then(res => {
      console.log(res.data)
      dayCount = res.data['buy_ticket_day_count'] - 1

    }).catch(err => {
      console.log(err)
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
    let station = getApp().globalData.selectStartStation
    this.setData({
      station
    })
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

  bindKeyInput(){
    wx.navigateTo({
      url: '/pages/stationList/stationList',
    })
  },

  dateChange(e) {
    let date = e.detail.value
    console.log(date)

    let diffDay = dayjs(date).diff(dayjs(), 'day')
    if(diffDay<30){
      this.data.sellDate = "随时可买"
    }else{
      this.data.sellDate = dayjs(date).subtract(dayCount, 'day').format('YYYY年M月D日')
    }

    this.setData({
      date
    })
  },

  formSubmit({ detail }) {

    let stationCode = this.data.station.stationCode
    if (stationCode == undefined) {
      wx.showToast({
        title: '请选择车站',
        image: '/images/error.png'
      })
      return
    }
    wx.showLoading({
      title: '数据加载中'
    })
    wx.cloud.callFunction({
      name: 'sellTime',
      data: {
        stationCode,
      }
    }).then(res => {

      console.log(res.result)
      wx.hideLoading()
      this.setData({
        stationList: res.result,
        sellDate: this.data.sellDate
      })
    }).catch(err => {
      wx.hideLoading()
    })

  },

  subscribeChange({ detail }) {
    console.log(detail.value)

    this.data.selected = detail.value.length > 0 ? true : false
  },
  subscribeMessage() {
    if (this.data.selected) {
      let tmpId = 'H3107ND6jqT8oJDnubstKlvT7xgPzMKUiE99PqqYd2M'
      let that = this
      wx.requestSubscribeMessage({
        tmplIds: [tmpId],
        success(res) {
          if (res[tmpId] === "accept") {
            that.data.subscribe = true
            console.log(that.data.subscribe)
          }
          console.log(res)
        },
        fail(err) {
          console.log(err)
        }
      })
    } else {
      this.data.subscribe = false
    }
    return
  },


})