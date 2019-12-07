// pages/home/home.js

let interstitialAd = null

Page({

  /**
   * 页面的初始数据
   */
  data: {

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

  showQrcode() {
    wx.previewImage({
      urls: ['https://7068-phot-c9b2df-1257336224.tcb.qcloud.la/%E8%B5%9E%E8%B5%8F%E7%A0%81.jpg?sign=7737350e2ca9df2faafcebd3ee728ce5&t=1562329330'], 
    })
  },

  goUrl(e) {
    console.log(e.currentTarget.dataset.url)
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: `/pages/${url}/${url}`,
    })
  }
})