// mini-program/pages/sellTime/sellTime.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    station: ''
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
        stationList: res.result
      })
    }).catch(err => {
      wx.hideLoading()
    })

  }

})