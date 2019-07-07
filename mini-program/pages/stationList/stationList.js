const app = getApp();
import { http } from '../../utils/http.js'

// 在页面中定义插屏广告
Page({
  pageData:{
    stationList: [],
    scroollIndex: 0,
    scroollTag: '',
  },
  data: {
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    type: 0,
    searchList: [],
    historyStationList:[],
    hotStationList:[]
  },
  onLoad(option) {

    this.data.type = option.type

    let historyStationList = wx.getStorageSync('historyStationList') || []
    this.setData({
      historyStationList
    })

    let station = wx.getStorageSync('station')

    if(!station){
      this.getList()
    }else{
      this.pageData.stationList = station.stationList

      this.setData({
        hotStationList: station.hotStationList
      })
    }
    // let list = []
    // let indexBarList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // let station = wx.getStorageSync('station')
    // if(!station){
    //   this.getList()
    // }else{
    //   this.pageData.stationList = station.stationList
    //   let list = [], temp = []
    //   station.stationList.forEach(item=>{
    //     temp = {
    //       character: item.character,
    //       station_info: []
    //     }
    //     item.station_info.forEach(info=>{
    //       temp['station_info'].push(info.station_name)
    //     })
    //     console.log(temp)
    //     list.push(temp)
    //   })

    //   // let list = [station.stationList[0]]
    //   // let list = station.stationList
    //   this.setData({
    //     list,
    //     indexBarList: station.character,
    //     listCur: station.character[0]
    //   })
    // }
  },
  onReady() {
    // let that = this;
    // wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function (res) {
    //   if(res == null){
    //     return
    //   }
    //   that.setData({
    //     boxTop: res.top
    //   })
    // }).exec();
    // wx.createSelectorQuery().select('.indexes').boundingClientRect(function (res) {
    //   if (res == null) {
    //     return
    //   }
    //   that.setData({
    //     barTop: res.top
    //   })
    // }).exec()
  },
  onShow(){
    
  },
  getList(){
    wx.showLoading({
      title: '数据加载中'
    })
    wx.cloud.callFunction({
      name: 'stationList',
    }).then(res => {

      console.log(res.result)
      wx.hideLoading()

      let stationList = res.result.data
      console.log(stationList)

      let hotStationList = []
      stationList.forEach(item=>{
        if(item.is_hot == 1){
          hotStationList.push(item)
        }
      })
      this.setData({
        hotStationList
      })

      wx.setStorage({
        key: 'station',
        data: {
          stationList,
          hotStationList
        },
      })

      this.pageData.stationList = stationList
    }).catch(err=>{

    })

    // http('/stationList')
    //   .then(res => {
    //     console.log(res.character)
    //     let stationList = res.station_list
    //     let character = res.character

    //     this.pageData.stationList = stationList

    //     wx.setStorage({
    //       key: 'station',
    //       data: {
    //         stationList,
    //         character,
    //       },
    //     })

    //     this.setData({
    //       list: stationList,
    //       indexBarList: character,
    //       listCur: character[0]
    //     })
    //   }).catch(error=>{
    //   })
  },
  scroll(e){
    console.log(e.detail)
  },
  scrolltolower(){
    let scroollIndex = this.pageData.scroollIndex + 1
    let stationListLength = this.pageData.stationList.length
    if (scroollIndex > stationListLength){
      return
    }
    this.pageData.scroollIndex = scroollIndex
    let stationList = this.pageData.stationList[scroollIndex]
    let list = this.data.list
    let index = list.length
    let tmpList = 'list[' + index + ']'
    this.setData({
      [tmpList] : stationList
    })
  },
  scrolltoupper(){
    if (this.pageData.scroollTag) {
      return
    }
    setTimeout(() => {
      this.pageData.scroollTag = false
    }, 1000)

    this.pageData.scroollTag = true

    let scroollIndex = this.pageData.scroollIndex-1
    console.log(scroollIndex)
    if(scroollIndex < 0){
      return
    }
    let stationList = this.pageData.stationList[scroollIndex]
    this.pageData.scroollIndex = scroollIndex
    let list = this.data.list
    let index = list.length
    list.unshift(stationList)
    this.setData({
      list,
      listCurID: scroollIndex
    })
  },
  //获取文字信息
  getCur(e) {
    let character = e.target.id
    let index = this.data.indexBarList.indexOf(character)
    if(index == -1){
      return 
    }
    console.log(index)
    this.pageData.scroollIndex = index
    let stationList = [this.pageData.stationList[index]]
    console.log(stationList)
    this.setData({
      hidden: false,
      listCur: e.target.id,
      list: stationList
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.indexBarList[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20
        })
        return false
      }
    }
  },

  selectStation(e){
    let stationInfo = e.currentTarget.dataset.station
    console.log(stationInfo)

    let app = getApp()
    if(this.data.type == 1 ) {
      app.globalData.selectEndStation = {
        stationName: stationInfo.station_name,
        stationCode: stationInfo.station_code
      }
    }else{
      app.globalData.selectStartStation = {
        stationName: stationInfo.station_name,
        stationCode: stationInfo.station_code
      }
    }

    let historyStationList = this.data.historyStationList

    let index = historyStationList.findIndex(item => {
      return item.station_code == stationInfo.station_code
    })


    if (index !== -1) {
      historyStationList.splice(index, 1)
    }
    historyStationList.unshift(stationInfo)
    if(historyStationList.length > 10){
      // 删除最后一个元素，保证不超过10条历史记录
      historyStationList.pop()
    }
    wx.setStorage({
      key: 'historyStationList',
      data: historyStationList,
    })

    wx.navigateBack({
      delta: 1
    })
  },

  bindinput(e){
    let value = e.detail.value 
    if(!value){
      return
    }

    this.setData({
      searchText: value
    })
    this.searchStationList(value)
  },

  clearInput(){
    this.setData({
      searchText: '',
      searchList: []
    })
  },

  formSubmit(e){
    // console.log(e)
    let text = e.detail.value.searchText
    if(text){
      this.searchStationList(text)
    }
  },
  searchStationList(text){
    let stationList = this.pageData.stationList
    let stationInfo = []
    let result = [], temp = {}

    stationList.forEach(info => {
      if (info.station_name.indexOf(text) != -1 ||
        info.pinyin.indexOf(text) != -1 ||
        info.short_pinyin.indexOf(text) != -1) {
        result.push({
          station_name: info.station_name,
          station_code: info.station_code
        })
      }
    })
    if (result.length == 0) {
      wx.showToast({
        title: '未找到相关结果',
        icon: 'none'
      })
      return
    }


    this.setData({
      searchList: result
    })
    // let stationList = this.pageData.stationList
    // let stationInfo = []
    // let result = [], temp = {}
    // wx.showLoading({
    //   title: '查找中……',
    // })
    // stationList.forEach(item => {
    //   stationInfo = item.station_info
    //   stationInfo.forEach(info => {
    //     if (info.station_name.indexOf(text) != -1 ||
    //       info.pinyin.indexOf(text) != -1 ||
    //       info.short_pinyin.indexOf(text) != -1) {
    //       result.push({
    //         station_name: info.station_name,
    //         station_code: info.station_code
    //       })
    //     }
    //   })
    // })
    // wx.hideLoading()
    // if (result.length == 0) {
    //   wx.showToast({
    //     title: '未找到相关结果',
    //     icon: 'none'
    //   })
    //   return
    // }


    // this.setData({
    //   searchList: result
    // })

  }

});