// pages/date/date.js
const dayjs = require('../../libs/dayjs.min.js')

Page({

  pageData:{
    selectDay: ''
  },

  /**
   * 页面的初始数据
   */
  data: {
    year: new Date().getFullYear(),      // 年份
    month: new Date().getMonth() + 1,    // 月份
    day: new Date().getDate(),
    dateList: [],
    monthInfo: {},
    tips: '',
    monthIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    db.collection('config').doc('12e3b074-ee89-45b6-a6ea-7267c4d86f47').get().then(res => {
      console.log(res.data)
      let count = res.data['buy_ticket_day_count']
      let newDay = dayjs().add(count-1, 'day').format('M月D日')
      this.setData({
        selectDay: dayjs().format('YYYY年M月D日'),
        newDay,
        buyTicketCount: count
      })

    }).catch(err=>{
      console.log(err)
    })

    this.pageData.selectDay = this.data.day

    const days_count = new Date(this.data.year, this.data.month, 0).getDate()
    let daysStyle = this.setDaysStyle(this.data.year, this.data.month, this.data.day)

    

    this.setData({
      days_style: daysStyle,
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
    let shareInfo = {
      title: '2019年购票日历'
    }
    return shareInfo
  },

  monthChange(e){
    //e.detail.currentMonth e.detail.currentYear

    let detail = e.detail
    let dateString = `${detail.currentYear}-${detail.currentMonth}-${this.pageData.selectDay}`
    console.log(dateString)
    let selectDay = dayjs(dateString)

    let newDay = selectDay.add(29, 'day').format('M月D日')

    let daysStyle = this.setDaysStyle(detail.currentYear, detail.currentMonth, this.pageData.selectDay)

    this.setData({
      days_style: daysStyle,
      selectDay: selectDay.format('YYYY年M月D日'),
      newDay
    })
  },

  dayClick(e){
    let detail = e.detail

    this.pageData.selectDay = detail.day

    let dateString = `${detail.year}-${detail.month}-${detail.day}`
    let selectDay = dayjs(dateString)

    let newDay = selectDay.add(this.data.buyTicketCount-1, 'day').format('M月D日')

    let daysStyle = this.setDaysStyle(detail.year, detail.month, detail.day)

    this.setData({
      days_style: daysStyle,
      selectDay: selectDay.format('YYYY年M月D日'),
      newDay
    })

  },

  setDaysStyle(year, month, day){
    const daysCount = new Date(year, month, 0).getDate()
    let daysStyle = new Array

    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(year, month - 1, i)
      if (i == day) {
        daysStyle.push({
          month: 'current', day: i, color: 'white', background: '#46c4f3'
        })
      } else if (date.getDay() == 0) {
        daysStyle.push({
          month: 'current', day: i, color: '#f488cd'
        })
      } else {
        daysStyle.push({
          month: 'current', day: i, color: '#a18ada'
        });
      }
    }
    return daysStyle
  }

})