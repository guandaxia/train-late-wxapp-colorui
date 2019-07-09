// mini-program/pages/sellTicket/sellTicket.js

import { georegeo } from '../../utils/map.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['北京市', '北京市', '东城区'],
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

  },

  regionChange(e){
    console.log(e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },

  formSubmit({ detail }) {

    let region = this.data.region
    if (region == undefined) {
      wx.showToast({
        title: '请选择地区',
        image: '/images/error.png'
      })
      return
    }
    wx.showLoading({
      title: '数据加载中'
    })
    wx.cloud.callFunction({
      name: 'querySellTicket',
      data: {
        region,
      }
    }).then(res => {

      console.log(res.result)
      wx.hideLoading()
      this.setData({
        stationList: res.result
      })
    }).catch(err => {
      wx.hideLoading()
    })
  },

  detail(e){
    console.log(e.currentTarget.dataset)
    let address = e.currentTarget.dataset.address
    let city = this.data.region[1]
  
    georegeo(address, city).then(res=>{
      console.log(res)

      let location = res.location.split(',')
      console.log(location)
      wx.openLocation({
        latitude: parseFloat(location[1]),
        longitude: parseFloat(location[0]),
        scale: 18
      })
    })

  }
})