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

module.exports = {
  formatTime: formatTime,
  sign: sign
}
