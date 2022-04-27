/*
  标记模式的业务逻辑都提取到这个函数，梳理下思路：
  1. 未登录状态点击导航栏的【标记模式】按钮无法转换模式，会提示跳转登录
  2. 登录状态，已经标记过的项会显示已标记 tag
*/
import { ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import useLogin from '@/composables/useLogin'
import { getUser, editUser } from '@/request_api/user'


export default function useTagMode(tabBars, listRefs) {
  const tagMode = ref(false)
  const store = useStore()
  const token = computed(() => store.getters.token)
  const userId = computed(() => store.getters.userId)
  const collection = ref([])

  const isCollected = (id) => {
    // let bl = false
    // if(!collection.value.length ) return bl
    const index = collection.value.findIndex(c => c.id === id)
    return index !== -1
  }

  const isShowTag = (id) => {
    return token.value && isCollected(id)
  }

  const getCollection = async () => {
    const res = await getUser(userId.value)
    collection.value = res.data.collected
  }

  const changeTag = async ({ type, id }) => {
    let tagObj = null
    if (!isCollected(id)) {
      // 如果未标记过就标记上
      tagObj = {
        $push: { collected: { type, id } }
      }
    } else {
      tagObj = {
        $pull: { collected: { id } }
      }
    }
    try {
      await editUser(userId.value, tagObj)
      const res = await getUser(userId.value)
      // store.commit('user/setCollection', res.data.collected)
      await getCollection()
    } catch (err) {
      console.log(err)
    }
  }

  watch(userId, val => {
    if (val) {
      getCollection()
    }
  }, { immediate: true })

  const { goLogin } = useLogin('标记功能需要先登录，是否前往登录页面')

  const changeTagMode = () => {
    tagMode.value = !tagMode.value
    nextTick(() => {
      uni.showToast({
        title: !tagMode.value ? '退出【已获得】\r\n快速标记模式' : '进入【已获得】快速标记模式，\r\n再次点击标记按钮会退出标记模式\r\n并自动保存。',
        duration: 3000,
        icon: "none"
      })
    })
  }

  /* 点击导航栏触发按钮触发 */
  const tagButtonTap = () => {
    if (!tagMode.value && !token.value) {
      goLogin()
      return
    }
    changeTagMode()
  }

  return {
    tagMode,
    tagButtonTap,
    changeTagMode,
    isShowTag,
    changeTag
  }
}
