<template>
  <view class="fixed-input">
    <input
      class="uni-input"
      type="text"
      :value="commentInfo.content"
      placeholder="请输入评论"
      @input="changeInput"
      @confirm="changeInput"
    />
    <button
      class="submit-btn uni-success-bg"
      type="default"
      @click="submitComment"
    >
      发送
    </button>
  </view>
</template>

<script>
import { reactive, toRefs, computed, watch } from 'vue'
import { useStore } from 'vuex'
import useLogin from '@/composables/useLogin'
import { addComment } from '@/request_api/comment'

export default {
  name: 'FixedInput',
  props: {
    id: String,
    apiType: String,
  },
  emits: ['add-comment'],
  setup(props, { emit }) {
    const { id, apiType } = toRefs(props)

    const store = useStore()
    const userId = computed(() => store.getters.userId)

    const commentInfo = reactive({
      aid: id.value, // 文章id
      uid: '', // 登录用户id
      content: '',
    })

    watch(
      userId,
      val => {
        if (val) commentInfo.uid = val
      },
      { immediate: true }
    )

    const changeInput = e => {
      commentInfo.content = e.detail.value
    }
    const submitComment = async () => {
      try {
        const { data } = await addComment(apiType.value, commentInfo)
        uni.showToast({
          title: '评论发布成功！',
          success: res => {
            commentInfo.content = ''
            emit('add-comment', data._id)
          },
        })
      } catch (err) {
        if (err.code === 401) {
          useLogin().goLogin('发布评论需要先登录，确定前往登录页面')
        } else {
          uni.showToast({
            title: err.message,
            icon: 'error',
          })
        }
      }
    }
    return {
      commentInfo,
      changeInput,
      submitComment,
    }
  },
}
</script>

<style lang="scss">
.fixed-input {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  z-index: 999;

  .uni-input {
  }

  .submit-btn {
    width: 180rpx;
  }
}
</style>
