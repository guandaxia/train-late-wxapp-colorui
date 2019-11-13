// mini-program/pages/historyTrip/historyTrip.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.query()
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

  async query() {

    const db = wx.cloud.database()
    const _ = db.command
    let openid = getApp().globalData.openid

    let res = await db.collection('my_trip').where({
      date_obj: _.lt(new Date())
    }).get()
    // console.log(res)
    let trainList = res.data || []
    this.setData({
      trainList
    })

  },
})