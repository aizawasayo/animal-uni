import { getUser, login, logout } from '@/request_api/user'

import {
  getToken,
  getUserId,
  removeToken,
  removeUserId,
  setToken,
  setUserId,
} from '@/common/auth.js'

const getDefaultState = () => {
  return {
    loginProvider: '',
    token: getToken(),
    userId: getUserId(),
  }
}

const state = getDefaultState()

const mutations = {
  resetState: state => {
    Object.assign(state, getDefaultState())
  },
  setToken: (state, token) => {
    state.token = token
  },
  setId: (state, id) => {
    state.userId = id
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          const { data } = response
          if (!data) {
            reject('认证失败，请重新登陆')
          }
          const { user, token } = data
          commit('setToken', token)
          commit('setId', user._id)
          setToken(token)
          setUserId(user._id)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('setToken', '')
          commit('setId', '')
          removeToken() // must remove token first
          removeUserId()
      
          commit('resetState')

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('setToken', '')
      commit('setId', '')
      removeToken()
      removeUserId()
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
