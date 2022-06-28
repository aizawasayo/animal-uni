import { getToken, removeToken, removeUserId } from '@/common/auth'

// #ifdef H5
const baseURL = '/api'
// #endif

// #ifndef H5
const baseURL = 'http://106.54.168.208:3003' // 腾讯云服务器
// const baseURL = 'http://192.168.31.168:3003'
// #endif

export default ({ url, method, data }) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseURL}/${url}`,
      method: method || 'GET',
      data: data || {},
      header: { Authorization: getToken() ? 'Bearer ' + getToken() : '' },
      success: res => {
        const { data, statusCode, cookies } = res

        if (res.statusCode === 401) {
          // 表示 token 验证失败，该用户已退出登录
          removeToken()
          removeUserId()
        }
        if (res.statusCode !== 200) return reject(data)
        resolve(data)
      },
      fail: err => {
        uni.showModal({
          content: err.errMsg,
          showCancel: false,
        })
        reject(err)
      },
    })
  })
}
