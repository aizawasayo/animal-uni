import app from './modules/app'
import user from './modules/user'
import list from './modules/list'

const storeContent = {
  state: {
    isUniverifyLogin: false,
    loginProvider: '',
    openid: null,
    testvuex: false,
    colorIndex: 0,
    colorList: ['#FF0000', '#00FF00', '#0000FF'],
    noMatchLeftWindow: true,
    active: 'componentPage',
    activeOpen: '',
    menu: [],
    univerifyErrorMsg: '',
    phoneNumber: '',
  },
  mutations: {
    setProvider(state, provider) {
      state.loginProvider = provider
    },
    setOpenid(state, openid) {
      state.openid = openid
    },
    setTestTrue(state) {
      state.testvuex = true
    },
    setTestFalse(state) {
      state.testvuex = false
    },
    setColorIndex(state, index) {
      state.colorIndex = index
    },
    setMatchLeftWindow(state, matchLeftWindow) {
      state.noMatchLeftWindow = !matchLeftWindow
    },
    setActive(state, tabPage) {
      state.active = tabPage
    },
    setActiveOpen(state, activeOpen) {
      state.activeOpen = activeOpen
    },
    setMenu(state, menu) {
      state.menu = menu
    },
    setUniverifyLogin(state, payload) {
      typeof payload !== 'boolean' ? (payload = !!payload) : ''
      state.isUniverifyLogin = payload
    },
    setUniverifyErrorMsg(state, payload = '') {
      state.univerifyErrorMsg = payload
    },
    setPhoneNumber(state, phoneNumber) {
      state.phoneNumber = phoneNumber
    },
  },
  getters: {
    options: state => state.app.options,
    systemInfo: state => state.app.systemInfo,
    token: state => state.user.token,
    userId: state => state.user.userId,
    currentColor(state) {
      return state.colorList[state.colorIndex]
    },
    listParams: state => state.list.listParams,
    listIds: state => state.list.listIds,
    listApi: state => state.list.listApi,
    total: state => state.list.total,
  },
  actions: {
    // lazy loading openid
    getUserOpenId: async function ({ commit, state }) {
      return await new Promise((resolve, reject) => {
        if (state.openid) {
          resolve(state.openid)
        } else {
          uni.login({
            success: data => {
              setTimeout(function () {
                // 模拟异步请求服务器获取 openid
                const openid = '123456789'
                console.log('uni.request mock openid[' + openid + ']')
                commit('setOpenid', openid)
                resolve(openid)
              }, 1000)
            },
            fail: err => {
              console.log(
                'uni.login 接口调用失败，将无法正常使用开放接口等服务',
                err
              )
              reject(err)
            },
          })
        }
      })
    },
    getPhoneNumber: function ({ commit }, univerifyInfo) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: 'https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/univerify-login',
          method: 'POST',
          data: univerifyInfo,
          success: res => {
            const data = res.data
            if (data.success) {
              resolve(data.phoneNumber)
            } else {
              reject(res)
            }
          },
          fail: err => {
            reject(err)
          },
        })
      })
    },
    loginByUniverify: function ({ commit, dispatch }, { provider, res }) {
      return new Promise((resolve, reject) => {
        // 一键登录
        commit('setUniverifyLogin', true)
        uni.closeAuthView()
        const univerifyInfo = {
          provider,
          ...res.authResult,
        }
        dispatch('getPhoneNumber', univerifyInfo)
          .then(phoneNumber => {
            commit('setPhoneNumber', phoneNumber)
            uni.setStorageSync(univerifyInfoKey, univerifyInfo)
            resolve()
          })
          .catch(err => {
            uni.showModal({
              showCancel: false,
              title: '手机号获取失败',
              content: `${err.errMsg}\n，错误码：${err.code}`,
            })
            console.error(res)
            reject(err)
          })
      })
    },
    loginByApple: async function ({ commit }, { provider, res }) {
      // 获取用户信息
      let getUserInfoErr, result

      try {
        result = await uni.getUserInfo({
          provider,
        })
      } catch (e) {
        getUserInfoErr = e
      }

      if (getUserInfoErr) {
        let content = getUserInfoErr.errMsg
        if (~content.indexOf('uni.login')) {
          content = '请在登录页面完成登录操作'
        }
        uni.showModal({
          title: '获取用户信息失败',
          content: '错误原因' + content,
          showCancel: false,
        })
      }
      // uni-id 苹果登录
      console.warn(
        '此处使用uni-id处理苹果登录，详情参考: https://uniapp.dcloud.net.cn/uniCloud/uni-id'
      )
      uni.request({
        url: 'https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/user-center',
        method: 'POST',
        data: {
          action: 'loginByApple',
          params: result.userInfo,
        },
        success: res => {
          console.log('uniId login success', res)
          if (res.data.code !== 0) {
            uni.showModal({
              showCancel: false,
              content: `苹果登录失败: ${JSON.stringify(res.data.msg)}`,
            })
          } else {
            uni.setStorageSync('openid', res.data.openid)
            uni.setStorageSync('apple_nickname', res.data.userInfo.nickname)
          }
          resolve(res)
        },
        fail: e => {
          uni.showModal({
            content: `苹果登录失败: ${JSON.stringify(e)}`,
            showCancel: false,
          })
          reject(e)
        },
      })
    },
  },
  modules: {
    app,
    user,
    list,
  },
}
// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store(storeContent)
// #endif

// #ifdef VUE3
import { createStore } from 'vuex'
const store = createStore(storeContent)
// #endif
export default store
