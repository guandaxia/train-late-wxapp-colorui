//index.js
// import {http} from '../../utils/http.js'
import { checkTrainCode } from '../../utils/util.js'
//获取应用实例
const app = getApp()
let interstitialAd = null
Page({
  data: {
    queryHistory: [],
    input: '',
    showClear: false,
    showKeyboard: false,
    trainCodeShow: 0,
    selectStartStation: {},
    selectEndStation: {},
    tabNav: ['车次', '站点'],
    tabCur: 0,
    // customBar: app.globalData.CustomBar,
  },
  onLoad: function () {

    // 在页面onLoad回调事件中创建插屏广告实例
    // if (wx.createInterstitialAd) {
    //   interstitialAd = wx.createInterstitialAd({
    //     adUnitId: 'adunit-032802b5ea274bdd'
    //   })
    //   interstitialAd.onLoad(() => { })
    //   interstitialAd.onError((err) => { })
    //   interstitialAd.onClose(() => { })
    // }
    
    let that = this
    wx.getStorage({
      key: 'query_history',
      success (res) {

        that.setData({
          queryHistory: res.data || []
        })
      }
    })
  },
  onShow(){
    // interstitialAd.show().catch((err) => {
    //   console.error(err)
    // })
    let globalData = app.globalData
    this.setData({
      selectStartStation: globalData.selectStartStation,
      selectEndStation: globalData.selectEndStation,
    })
  },
  pageTap: function () {
    // 在页面空白处点击时隐藏小键盘
    this.setData({
      showKeyboard: false
    })
    wx.showTabBar()
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

    if(showKeyboard){
      wx.showTabBar()
    }else{
      wx.hideTabBar()
    }

    this.setData({
      showKeyboard: !showKeyboard
    })
  },
  keyboardValue({ detail}){

    this.setData({
      ...detail
    })
  },

  hideKeyboard({detail}){
    this.setData({
      ...detail
    })
    wx.showTabBar()
  },


  // // 字母按键
  // letterButton: function (event) {
  //   let data = event.currentTarget.dataset
  //   console.log(data.letter)
  //   this.setData({
  //     input: data.letter,
  //     showClear: true
  //   })
  // },
  // // 数字按键
  // numberButton: function (event) {
  //   let data = event.currentTarget.dataset
  //   console.log(data.number)
  //   let input = this.data.input

  //   input = input + data.number
  //   if (input.length > 6) {
  //     return
  //   }

  //   this.setData({
  //     input: input,
  //     showClear: true
  //   })
  // },
  // hideKeyboard: function () {
  //   this.setData({
  //     showKeyboard: false
  //   })
  //   wx.showTabBar()
  // },
  // delInput: function () {
  //   let input = this.data.input
  //   let newInput = input.substring(0, input.length - 1)

  //   this.setData({
  //     input: newInput,
  //     showClear: newInput.length  // 最后一个数字时隐藏删除按钮
  //   })
  // },
  formSubmit({detail}){

    if (this.data.tabCur == 0){
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
      const db = wx.cloud.database()
      db.collection('train_list').where({
        train_code: trainCode
      }).get().then(res => {
        console.log(res.data)
        if(res.data.length <= 0){
          wx.showToast({
            title: '未找到车次',
            image: '/images/error.png'
          })
          return 
        }
        let info = res.data[0]
        let historyInfo = {
          train_code: info.train_code,
          train_no: info.train_no,
          start: info.start_station,
          end: info.end_station,
          list: []
        }
        let queryHistory = this.data.queryHistory

        let index = queryHistory.findIndex(item => {
          return item.train_code == trainCode
        })

        if (index !== -1) {
          queryHistory.splice(index, 1)
        }
        queryHistory.unshift(historyInfo)
        if (queryHistory.length > 5) {
          // 删除最后一个元素，保证不超过10条历史记录
          queryHistory.pop()
        }
        wx.setStorage({
          key: 'query_history',
          data: queryHistory,
        })
        
        wx.navigateTo({
          url: `../list/list?id=${trainCode}&train_no=${info.train_no}`
        })

        this.setData({
          queryHistory: queryHistory,
          input: '',
          showClear: false
        })

      })
      return

      // http('/getStationStopInfo', { 'train_number': trainCode }, 'POST')
      //   .then(res => {
      //     console.log(res)
      //     let trainInfo = res.train_info
          
      //     app.globalData.stationList = trainInfo

      //     let startStation = trainInfo[0].station_name
      //     let endStation = trainInfo[0].end_station_name
      //     let historyInfo = {
      //       train_code: trainCode,
      //       start: startStation,
      //       end: endStation,
      //       list: trainInfo
      //     }

      //     let queryHistory = this.data.queryHistory
      //     if (!queryHistory[0] || (queryHistory[0].train_code !== historyInfo.train_code)) {
      //       let length = queryHistory.unshift(historyInfo)
      //       console.log(length)
      //       if (length > 5) {
      //         queryHistory.splice(5, length - 5)
      //         console.log(queryHistory)
      //       }

      //       wx.setStorageSync('query_history', queryHistory)
      //       this.setData({
      //         queryHistory: queryHistory,
      //         input: '',
      //         showClear: false
      //       })
      //     }

      //     wx.navigateTo({
      //       url: '../list/list?id=' + trainCode
      //     })
      //   }).catch(error => {
      //     console.log(error)
      //   })
    }else{
      let startStationInfo = this.data.selectStartStation || {}
      let stopStationInfo = this.data.selectEndStation || {}
      
      if (startStationInfo.stationCode == undefined){
        wx.showToast({
          title: '请选择起点车站',
          image: '/images/error.png'
        })
        return
      }
      if (stopStationInfo.stationCode == undefined) {
        wx.showToast({
          title: '请选择终点车站',
          image: '/images/error.png'
        })
        return
      }

      wx.showLoading({
        title: '数据加载中'
      })
      wx.cloud.callFunction({
        name: 'stationTrainList',
        data: {
          start_station_code: startStationInfo.stationCode,
          end_station_code: stopStationInfo.stationCode
        }
      }).then(res => {

        console.log(res.result)
        wx.hideLoading()

        app.globalData.stationTrainList = res.result
        wx.navigateTo({
          url: '../trainTime/trainTime'
        })
      }).catch(err=>{

      })

      // let params = {
      //   start_code: startStationInfo.stationCode,
      //   end_code: stopStationInfo.stationCode
      // }
      // 
      // http('/stationTrainList', params, 'POST')
      //   .then(res => {
      //     console.log(res)
      //     app.globalData.stationTrainList = res.train_list
      //     wx.navigateTo({
      //       url: '../trainTime/trainTime'
      //     })

      //   }).catch(error=>{

      //   })

    }
  },

  query(e){
    // console.log(e)
    let data = e.currentTarget.dataset.info

    app.globalData.stationList = data.list
    wx.navigateTo({
      url: `../list/list?id=${data.train_code}&train_no=${data.train_no}`
    })
  },
  switch(e) {
    let type = e.currentTarget.dataset.type
    console.log(type)
    this.setData({
      trainCodeShow: type
    })
  },

  selectStation(e){
    let type = e.currentTarget.dataset.type
    console.log(type)
    wx.navigateTo({
      url: '/pages/stationList/stationList?type=' + type,
    })

  },

  arrowTap(){
    let tmp = this.data.selectStartStation

    let selectEndStation = tmp
    let selectStartStation = this.data.selectEndStation

    this.setData({
      selectStartStation,
      selectEndStation
    })
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
})
