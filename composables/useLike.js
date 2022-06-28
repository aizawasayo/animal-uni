import { unref, computed } from 'vue'
import { useStore } from 'vuex'
import useLogin from '@/composables/useLogin'

export default function useLike(item, editApi, callback) {
  const store = useStore()
  const userId = computed(() => store.getters.userId)

  const isLiked = computed(() => unref(item).likes.includes(userId.value))

  const addLike = async () => {
    // 已经点过赞了, 则取消点赞
    const params = isLiked.value
      ? { $pull: { likes: userId.value } }
      : {
          $push: { likes: userId.value },
        }
    try {
      await editApi({ _id: unref(item)._id, ...params })
      uni.showToast({
        title: isLiked.value ? '取消点赞成功' : '点赞成功',
        success() {
          callback && callback()
        },
      })
    } catch (err) {
      if (err.code === 401) {
        useLogin().goLogin('点赞需要先登录，确定前往登录页面')
      } else {
        uni.showToast({
          title: err.message,
          icon: 'error',
        })
      }
    }
  }

  return {
    isLiked,
    addLike,
  }
}
