import { ref, unref, computed } from 'vue'
import { useStore } from 'vuex'

export default function useLike(item, editApi, callback) {
  const store = useStore()
  const userId = computed(() => store.getters.userId)

  const isLiked = computed(() => unref(item).likes.includes(userId.value))

  const addLike = async () => {
    // 已经点过赞了,则取消点赞
    const params = isLiked.value ? { $pull: { likes: userId.value } } : {
      $push: { likes: userId.value}
    }

    await editApi({ _id: unref(item)._id, ...params })
    uni.showToast({
      title: isLiked.value ? '取消点赞成功' : '点赞成功',
      success() {
        callback && callback()
      }
    })
  }

  return {
    isLiked,
    addLike
  }
}
