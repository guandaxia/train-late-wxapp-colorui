// componenent/keyboard/keyboard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showKeyboard:{
      type: Boolean,
      value: false,
    },
    inputValue: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 字母按键
    letterButton: function (event) {
      let data = event.currentTarget.dataset
      console.log(data.letter)

      this.triggerEvent('keyboardValue', {
        input: data.letter,
        showClear: true
      })
    },
    // 数字按键
    numberButton: function (event) {
      let data = event.currentTarget.dataset
      console.log(data.number)
      let input = this.properties.inputValue

      input = input + data.number
      if (input.length > 6) {
        return
      }

      this.triggerEvent('keyboardValue', {
        input: input,
        showClear: true
      })
    },
    hideKeyboard: function () {
      this.triggerEvent('hideKeyboard', {
        showKeyboard: false
      })
    },
    delInput: function () {
      let input = this.properties.inputValue
      let newInput = input.substring(0, input.length - 1)

      this.triggerEvent('keyboardValue', {
        input: newInput,
        showClear: true
      })

    },
  }
})
