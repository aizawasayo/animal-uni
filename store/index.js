// #ifdef VUE3
import { createStore } from 'vuex'

import app from './modules/app.js'
import user from './modules/user.js'

const store = createStore({
  // #endif
  state: {
    isUniverifyLogin: false,
    openid: null,
    testvuex: false,
    colorIndex: 0,
    colorList: ['#FF0000', '#00FF00', '#0000FF'],
    noMatchLeftWindow: true,
    active: 'componentPage',
    activeOpen: '',
    menu: [],
    univerifyErrorMsg: '',
  },
  mutations: {
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
      typeof payload !== 'boolean' ? payload = !!payload : '';
      state.isUniverifyLogin = payload;
    },
    setUniverifyErrorMsg(state, payload = '') {
      state.univerifyErrorMsg = payload
    }
  },
  getters: {
    options: state => state.app.options,
    systemInfo: state => state.app.systemInfo,
    token: state => state.user.token,
    userId: state => state.user.userId,
    currentColor(state) {
      return state.colorList[state.colorIndex]
    }
  },
  actions: {
    // lazy loading openid
    getUserOpenId: async function({
      commit,
      state
    }) {
      return await new Promise((resolve, reject) => {
        if (state.openid) {
          resolve(state.openid)
        } else {
          uni.login({
            success: (data) => {
              commit('login')
              setTimeout(function() { //模拟异步请求服务器获取 openid
                const openid = '123456789'
                console.log('uni.request mock openid[' + openid + ']');
                commit('setOpenid', openid)
                resolve(openid)
              }, 1000)
            },
            fail: (err) => {
              console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
              reject(err)
            }
          })
        }
      })
    },
    getPhoneNumber: function({
      commit
    }, univerifyInfo) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: 'https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/univerify-login',
          method: 'POST',
          data: univerifyInfo,
          success: (res) => {
            const data = res.data
            if (data.success) {
              resolve(data.phoneNumber)
            } else {
              reject(res)
            }

          },
          fail: (err) => {
            reject(res)
          }
        })
      })
    }
  },
  modules: {
    app,
    user
  }

})

export default store
