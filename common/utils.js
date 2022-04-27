/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (!time) {
    return ''
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 把标准时间转换成时间戳
 * 传入标准时间
 */
export function timestamp(date) {
  let myDate = date ? new Date(date) : new Date()
  return Date.parse(myDate) / 1000
  // return Math.round(new Date(date).getTime() / 1000)
}

/**
 * 时间戳转换成把标准时间
 * 传入时间戳
 */
export function standardTime(timestamp) {
  let time = timestamp.toString() + '000'
  return new Date(parseInt(time))
}

/**
 * 将传入时间转换成 hour:minute 的格式
 * @param {(Object|string|number)} time // 传入标准时间/时间戳都可
 * @param {string} addHour // 再传入时间基础上需增加的小时数，为截止时间功能特定需求
 */
export function timeFormat(time, addHour) {
  let dealTime = time ? (typeof time !== 'number' ? timestamp(time) : time) : timestamp(new Date())
  if (addHour) dealTime += addHour * 3600

  return parseTime(dealTime, '{h}:{i}')
}

/**
 * 将传入时间字符串转换成时间戳
 * @param {(string)} hiTime // 09:11 hour:minute
 */
export function stringToStamp(hiTime) {
  const nowTime = new Date()
  // 为了兼容IOS，需先将字符串转换为'2021/9/11 09:11:23'
  const stringTime = `${parseTime(nowTime,'{y}/{m}/{d}')} ${hiTime}:${parseTime(nowTime,'{s}')}`
  return Date.parse(stringTime) / 1000 // 返回'2021-09-12 9:11:23'的时间戳
}

export function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

export let dateUtils = {
  UNITS: {
    '年': 31557600000,
    '月': 2629800000,
    '天': 86400000,
    '小时': 3600000,
    '分钟': 60000,
    '秒': 1000
  },
  humanize: function(milliseconds) {
    var humanize = '';
    for (var key in this.UNITS) {
      if (milliseconds >= this.UNITS[key]) {
        humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
        break;
      }
    }
    return humanize || '刚刚';
  },
  format: function(dateStr) {
    var date = this.parse(dateStr)
    var diff = Date.now() - date.getTime();
    if (diff < this.UNITS['天']) {
      return this.humanize(diff);
    }
    var _format = function(number) {
      return (number < 10 ? ('0' + number) : number);
    };
    return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
      _format(date.getHours()) + ':' + _format(date.getMinutes());
  },
  parse: function(str) { // 将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
    var a = str.split(/[^0-9]/);
    return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
  }
};

export const setHistory = (val) => {
  let searchHistory = uni.getStorageSync('search:history');
  if (!searchHistory) searchHistory = [];

  // 判断内容是否已存在，如果存在，那么把它删除再重新添加到第一个
  if (searchHistory.includes(val)) {
    searchHistory.splice(searchHistory.findIndex(item => item === val), 1)
  }
  searchHistory.unshift(val)

  uni.setStorage({
    key: 'search:history',
    data: searchHistory,
    success: function() {
      // console.log('success');
    }
  });
}

export const removeHistory = () => {
  uni.removeStorage({
    key: 'search:history',
    success: function(res) {
      console.log('success');
    }
  });
  return []
}

//获取当前月份及下一月份的中文，博物馆列表图鉴用
export function getMonthStr() {
  const m = new Date().getMonth()
  const month = m + 1 + '月'
  const monthNext = m + 2 > 12 ? '1月' : m + 2 + '月'
  return {
    isOnMonth: (data) => data.includes(month),
    isGoNextM: (data) => data.includes(month) && !data.includes(monthNext)
  }
}

export const setReactiveObj = (obj, data) => {
  Object.keys(data).forEach(key => {
    obj[key] = data[key]
  })
}

export const clearReactiveObj = (obj, val) => {
  Object.keys(obj).forEach(key => {
    obj[key] = val !== null ? val : undefined
  })
}

import store from '@/store'
export const getScrollHeight = (heightRef, dom1, dom2) => {
  if (!dom1) { // 处理外部容器是整页的情况
    uni.createSelectorQuery().select(dom2).boundingClientRect().exec(ret1 => {
      heightRef.value = store.state.app.systemInfo.windowHeight - ret1[0].height
    })
  } else {
    uni.createSelectorQuery().select(dom1).boundingClientRect().exec(ret => {
      if (!dom2) {
        heightRef.value = ret[0].height
        return
      }
      uni.createSelectorQuery().select(dom2).boundingClientRect().exec(ret1 => {
        heightRef.value = ret[0].height - ret1[0].height
      })
    })
  }
}

// 获取单个 DOM 高度
export const getSingleHeight = (heightRef, dom) => {
  uni.createSelectorQuery().select(dom).boundingClientRect().exec(ret => {
    heightRef.value = ret[0].height
  })
}

export const previewImage = (imgList, index, apiUrl) => {
  const imgUrlList = []
  if (typeof imgList === 'string') {
    let url = apiUrl ? `${apiUrl}${imgList}` : imgList
    imgUrlList.push(url)
  } else {
    imgList.forEach(img => {
      imgUrlList.push(apiUrl ? `${apiUrl}${img.src}` : img)
    })
  }

  uni.previewImage({
    current: index ? index : 0,
    urls: imgUrlList
  })
}

// 字符串首字母转大写，后面字母小写
/**
 * js字符串切割
 * @str {string}
 */
export function firstToUpper(str) {
  return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase())
}

export function goPage(page, successCB) {
  uni.navigateTo({
    url: page,
    success() {
      successCB && successCB()
    }
  })
}

/*
 * 社区的发布/修改成功专用回调
 */
export function goBack(type) {
  uni.navigateBack({
    success() {
      let pages = getCurrentPages(); // 当前页面
      let beforePage = pages[pages.length - 2]; // 上一页
      const { tabIndex } = beforePage
      // 执行上一页的刷新方法 
      if (beforePage.postListRefs) { // 用户列表页/设计列表页 修改后刷新
        beforePage.postListRefs[tabIndex].refreshList()
      }
      if (beforePage.$refs[type]) { // 社区悬浮按钮发布后刷新
        beforePage.$refs[type].$refs.scrollList.refreshList()
      }
      if (beforePage.scrollListRefs) { // 设计分享页悬浮按钮发布后刷新
        beforePage.scrollListRefs[type].refreshList()
      }
    }
  })
}
