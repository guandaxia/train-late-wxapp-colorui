const md5 = require('../libs/md5.min.js')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function sign(data, secret) {
  if (data === undefined || data == null) {
    return ''
  }

  let newkey = Object.keys(data).sort() // 先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  let str = ''
  let value = ''
  for (let i = 0; i < newkey.length; i++) { // 遍历newkey数组
    value = data[newkey[i]]
    if (typeof value === 'object') {
      continue
    }
    str += newkey[i] + '=' + value + '&' // 向新创建的对象中按照排好的顺序依次增加键值对
  }
  // str = str.slice(0, -1) + secret
  str += 'secret=' + secret
  console.log(str)
  return md5(str)
}

function checkTrainCode(str) {
  if (str.length === 0) {
    return false
  }
  let reg = /^[cdglkytzCDGLKYTZ\d]\d{1,5}$/
  let r = str.match(reg)
  if (r == null) {
    return false
  }

  return str[0].toUpperCase() + str.slice(1)
}

// 比较版本号，v1 > v2 时返回 1
function compareVersion(v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

/*函数节流*/
function throttle(fn, interval) {
  let enterTime = 0;//触发的时间
  let gapTime = interval || 300;//间隔时间，如果interval不传，则默认300ms
  return function () {
    let context = this;
    let backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/*函数防抖*/
function debounce(fn, interval) {
  let timer;
  let gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    let context = this;
    let args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}


module.exports = {
  formatNumber: formatNumber,
  formatTime: formatTime,
  sign: sign,
  checkTrainCode: checkTrainCode,
  compareVersion: compareVersion,
  throttle: throttle,
  debounce: debounce,
}
