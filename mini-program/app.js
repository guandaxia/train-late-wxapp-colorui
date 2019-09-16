//app.js
import { compareVersion } from './utils/util.js'
App({
  onLaunch: function () {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })

    wx.cloud.init({
      env: 'phot-c9b2df'
    })
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        console.log(e)
        console.log(compareVersion(e.SDKVersion, '1.6.8'))
        if (!compareVersion(e.SDKVersion, '2.1.0')) {
          this.globalData.StatusBar = 0
          return
        }
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
    stationStopList: [],
  }
})