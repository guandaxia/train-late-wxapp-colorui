//app.js
App({
  onLaunch: function () {
    wx.cloud.init({
      env: 'phot-c9b2df'
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  globalData: {
    userInfo: null,
    selectStartStation: '',
    selectEndStation: '',
    stationTrainList: [],
  }
})