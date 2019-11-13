// mini-program/pages/addTrip/addTrip.js
const dayjs = require('../../libs/dayjs.min.js')
import { checkTrainCode, debounce } from '../../utils/util.js'
import { stationStopInfo, getTrainNo } from '../../utils/train'


let globaleStationList = []
let insertData = {}
const db = wx.cloud.database()
const collection = db.collection('my_trip')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    startDate: '',
    endDate: '',
    input: '',
    showClear: false,
    showKeyboard: false,
    showSeatInput: false,
    startStationList: ['请先输入车次'],
    endStationList: ['请先输入车次'],
    seatTypeList: [
      '二等座', '硬座', '硬卧', '无座', '软座', '一等座', '商务/特等座', '高级软卧', '动卧', '其他'
    ],
    carriageList: [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '加1', '加2', '加3'
    ],
    letterDisabled: true,
    numberDisabled: false,
    seatNumber: '',
    seatType: '',
    carriage: '',
    selected: false,
    subscribe: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let date = dayjs().format('YYYY-MM-DD')
    let endDate = dayjs().add(31, 'day').format('YYYY-MM-DD')
    this.setData({
      startDate: date,
      endDate,
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

  pageTap: function () {
    // 在页面空白处点击时隐藏小键盘
    this.setData({
      showKeyboard: false,
      showSeatInput: false,
    })
  },

  clearInput: function () {
    console.log('clear')
    globaleStationList = []
    this.setData({
      input: '',
      showClear: false,
      startStationList: ['请先输入车次'],
      endStationList: ['请先输入车次'],
      startStationName: '',
      endStationName: ''
    })
  },
  bindKeyInput: function () {
    console.log('key input')
    let showKeyboard = this.data.showKeyboard
    this.setData({
      showKeyboard: !showKeyboard
    })
  },
  keyboardValue({ detail }) {
    this.setData({
      ...detail
    })
    console.log(detail)
    this.queryStationList()

  },

  hideKeyboard({ detail }) {
    this.setData({
      ...detail
    })
  },

  queryStationList: debounce(async function () {
    let trainCode = this.data.input
    console.log(trainCode)
    trainCode = checkTrainCode(trainCode)
    if (!trainCode) {
      return false
    }
    let trainInfo = await getTrainNo(trainCode)
    console.log(trainInfo)
    if (trainInfo === false) {
      return false
    }

    let info = await stationStopInfo(trainInfo['train_no'])

    globaleStationList = []
    insertData['station_list'] = info.stationList
    info.stationList.forEach(item => {
      globaleStationList.push(item.station_name)
    })

    this.setData({
      startStationList: globaleStationList.slice(0, globaleStationList.length - 1), //移除终点站
      endStationList: ['请先选择起点站'],
    })
    return true
  }, 1500),

  dateChange(e) {
    let date = e.detail.value
    insertData['date'] = date
    this.setData({
      date
    })
  },
  selectStartStation(e) {
    console.log(e.detail.value)

    let index = parseInt(e.detail.value)
    let startStationList = this.data.startStationList
    let endStationList = []
    endStationList = globaleStationList.slice(index + 1)
    this.setData({
      startStationName: startStationList[index],
      endStationList
    })

    insertData['start_station'] = startStationList[index]
    insertData['start_time'] = insertData['station_list'][index]['start_time']

  },
  selectEndStation(e) {

    let index = e.detail.value
    let endStationList = this.data.endStationList
    this.setData({
      endStationName: endStationList[index],
    })
    let info = insertData['station_list'].find(res => {
      return res.station_name == endStationList[index]
    })
    insertData['end_station'] = endStationList[index]
    insertData['end_time'] = info['arrive_time']

  },

  async queryTicketCheck(trainCode, date, stationName) {
    let res = await wx.cloud.callFunction({
      name: 'queryTicketCheck',
      data: {
        trainCode,
        date: this.data.date,
        stationName
      }
    })
    return res.result
  },

  subscribeChange({ detail }) {
    console.log(detail.value)

    this.data.selected = detail.value.length > 0 ? true : false
  },
  subscribeMessage() {
    let selected = !this.data.selected
    if (selected) {
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
    console.log(this.data.subscribe)
    this.setData({
      selected
    })

    return
  },

  async formSubmit({ detail }) {
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

    if (!insertData['start_station']) {
      wx.showToast({
        title: '起点站为空',
        image: '/images/error.png'
      })
      return
    }
    if (!insertData['end_station']) {
      wx.showToast({
        title: '终点站为空',
        image: '/images/error.png'
      })
      return
    }
    if (!insertData['date']) {
      wx.showToast({
        title: '请选择乘车日期',
        image: '/images/error.png'
      })
      return
    }

    let openid = getApp().globalData.openid
    if (openid) {
      let res = await collection.where({
        train_code: trainCode,
        date: insertData['date'],
      }).get()
      console.log(res)
      if (res.data.length > 0) {
        let that = this
        wx.showModal({
          content: `已经存在${insertData['date']}的${trainCode}车次，是否继续`,
          showCancel: true,
          success(res) {
            console.log(res)
            if (res.confirm) {
              that.saveTrip(trainCode)
            }
          }
        })
      } else {
        this.saveTrip(trainCode)
      }
    }

  },

  async saveTrip(trainCode) {
    wx.showLoading({
      title: '数据加载中'
    })



    let ticketCheck = await this.queryTicketCheck(trainCode, insertData['date'], insertData['start_station'])
    console.log(ticketCheck)

    let data = this.data

    insertData['train_code'] = trainCode
    insertData['seat_type'] = data.seatType
    insertData['seat_number'] = data.seatNumber
    insertData['carriage'] = data.carriage
    insertData['ticket_check'] = ticketCheck
    insertData['subscribe'] = data.subscribe

    console.log(insertData)

    let openid = getApp().globalData.openid
    let dateObj = new Date(insertData['date'] + ' ' + insertData['start_time'])
    let res = await collection.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        date_obj: dateObj,
        date: insertData['date'],
        train_code: insertData['train_code'],
        start_station: insertData['start_station'],
        start_time: insertData['start_time'],
        end_station: insertData['end_station'],
        end_time: insertData['end_time'],
        station_list: insertData['station_list'],
        seat_type: insertData['seat_type'],
        seat_number: insertData['seat_number'],
        carriage: insertData['carriage'],
        ticket_check: insertData['ticket_check'],
        subscribe: insertData['subscribe'],
        create_time: db.serverDate()
      }
    })
    console.log(res)

    wx.showToast({
      title: '添加成功',
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
      })
    }, 1200)
  },

  inputSeatNumber() {
    this.setData({
      showSeatInput: true
    })
  },

  // 字母按键
  letterButton(event) {
    if (this.data.letterDisabled) {
      return
    }
    let data = event.currentTarget.dataset

    let input = this.data.seatNumber
    let length = input.length
    let endStr = input[length - 1]
    if (endStr >= 0 && endStr <= 9) {
      input += data.letter
    } else {
      input = input.substring(0, length - 1) + data.letter
    }
    this.setData({
      seatNumber: input,
      numberDisabled: true
    })


  },
  // 数字按键
  numberButton(event) {
    if (this.data.numberDisabled) {
      return
    }
    let data = event.currentTarget.dataset
    console.log(data.number)
    let input = this.data.seatNumber

    input = input + data.number
    if (input.length > 3) {
      return
    }

    this.setData({
      seatNumber: input,
      letterDisabled: false,
    })
  },
  hideSeatInput() {
    this.setData({
      showSeatInput: false
    })
  },
  delInput() {
    let input = this.data.seatNumber
    let newInput = input.substring(0, input.length - 1)

    this.setData({
      seatNumber: newInput,
      numberDisabled: false,
      letterDisabled: newInput.length == 0
    })

  },
  // 选择车厢
  selectCarriage(e) {
    let carriage = this.data.carriageList[e.detail.value]
    this.setData({
      carriage
    })
  },

  selectSeatType(e) {
    let seatType = this.data.seatTypeList[e.detail.value]
    this.setData({
      seatType
    })
  }


})