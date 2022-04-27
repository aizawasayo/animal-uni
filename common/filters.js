/** 截取字数长度, 常用
 * @param {string} text
 * @param {number} length
 */

function textFilter(text, length) {
  let shortText = text
  const len = length ? length : 20
  if (text && text.length > len) {
    shortText = text.substring(0, len) + '...'
  }
  return shortText
}

function itemColorFilter(text, name) {
  let resText =  text.split('.')[0]
  if(resText.length > name.length) {
    resText = resText.replace(name, '')
  } else {
    resText = name
  }
  return resText
}

const countdown = (validTime, type) => {
  const dateDiff = validTime * 1000 - Date.now()
  if (dateDiff <= 0) return 0

  const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); // 计算出相差天数
  const leaveSeconds = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const leaveSeconds1 = leaveSeconds % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const leaveSeconds2 = leaveSeconds1 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  switch (type) {
    case 'h':
      return Math.floor(leaveSeconds / (3600 * 1000)) // 小时数
      break;
    case 'm':
      return Math.floor(leaveSeconds1 / (60 * 1000)) // 相差分钟数
      break;
    case 's':
      return Math.round(leaveSeconds2 / 1000) // 相差秒数
      break;
  }

}

export default {
  textFilter,
  itemColorFilter,
  countdown,
}
