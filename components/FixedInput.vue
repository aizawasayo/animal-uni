<template>
  <view class="fixed-input">
    <input class="uni-input" type="text" :value="commentInfo.content" placeholder="请输入评论" @input="changeInput"
      @confirm="changeInput" />
    <button class="submit-btn uni-success-bg" type="default" @click="submitComment">发送</button>
  </view>
</template>

<script>
  import { ref, reactive, toRefs, computed } from 'vue'
  import { useStore } from 'vuex'
  import { addComment } from '@/request_api/comment'

  export default {
    name: "FixedInput",
    props: {
      id: String,
      type: String,
    },
    emits: ['fresh-comment', 'add-comment'],
    setup(props, { emit }) {
      const { id, type } = toRefs(props)

      const store = useStore()
      const userId = computed(() => store.getters.userId)

      const commentInfo = reactive({
        aid: id.value, // 文章id
        uid: userId.value, // 登录用户id
        content: ''
      })
      const changeInput = e => {
        commentInfo.content = e.detail.value
      }
      const submitComment = async () => {
        try {
          const { data } = await addComment(type.value, commentInfo)
          uni.showToast({
            title: '评论发布成功！',
            success: res => {
              commentInfo.content = ''
              emit('add-comment', data._id)
              emit('fresh-comment')
            }
          })
        } catch (err) {
          uni.showToast({
            title: err.message,
            icon: 'error'
          })
        }

      }
      return {
        commentInfo,
        changeInput,
        submitComment
      };
    }
  }
</script>

<style lang="scss">
  .fixed-input {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: row;
    z-index: 999;

    .uni-input {}

    .submit-btn {
      width: 180rpx;
    }

  }
</style>
