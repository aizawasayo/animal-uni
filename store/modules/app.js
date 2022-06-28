// import { getAllOptions } from '@/common/get-options'

const state = {
  options: null,
  systemInfo: null,
}

const mutations = {
  setSystemInfo: (state, systemInfo) => {
    state.systemInfo = systemInfo
  },
  setOptions(state, options) {
    state.options = options
  },
}

const actions = {
  getSystemInfo: async function({
    commit,
    state
  }) {
    return await new Promise((resolve, reject) => {
      if (state.systemInfo !== null) {
        resolve(state.systemInfo)
      } else {
        uni.getSystemInfo({
          success: (res) => {
            commit('setSystemInfo', res)
            resolve(res)
          },
          fail: (err) => {
            console.log('uni.getSystemInfo 接口调用失败，无法获取设备信息', err)
            reject(err)
          }
        })
      }
    })
  },
  // async getOptsByApi({ commit, state }) {
  //   return await new Promise((resolve, reject) => {
  //     if (state.options !== null) {
  //       resolve(state.options)
  //     } else {
  //       getAllOptions()
  //         .then(response => {
  //           commit('setOptions', response)
  //           resolve()
  //         })
  //         .catch(error => {
  //           reject(error)
  //         })
  //     }
  //   })
  // },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
