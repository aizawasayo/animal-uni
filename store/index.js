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
                // ????????????????????????????????? openid
                const openid = '123456789'
                console.log('uni.request mock openid[' + openid + ']')
                commit('setOpenid', openid)
                resolve(openid)
              }, 1000)
            },
            fail: err => {
              console.log(
                'uni.login ???????????????????????????????????????????????????????????????',
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
        // ????????????
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
              title: '?????????????????????',
              content: `${err.errMsg}\n???????????????${err.code}`,
            })
            console.error(res)
            reject(err)
          })
      })
    },
    loginByApple: async function ({ commit }, { provider, res }) {
      // ??????????????????
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
          content = '????????????????????????????????????'
        }
        uni.showModal({
          title: '????????????????????????',
          content: '????????????' + content,
          showCancel: false,
        })
      }
      // uni-id ????????????
      console.warn(
        '????????????uni-id?????????????????????????????????: https://uniapp.dcloud.net.cn/uniCloud/uni-id'
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
              content: `??????????????????: ${JSON.stringify(res.data.msg)}`,
            })
          } else {
            uni.setStorageSync('openid', res.data.openid)
            uni.setStorageSync('apple_nickname', res.data.userInfo.nickname)
          }
          resolve(res)
        },
        fail: e => {
          uni.showModal({
            content: `??????????????????: ${JSON.stringify(e)}`,
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
