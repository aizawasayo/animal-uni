<template>
  <uni-load-more v-if="isLoading" :iconSize="30" status="loading" :content-text="loadText"></uni-load-more>
  <view v-else>
    <community-card type="turnip" :item-detail="itemDetail" />
    <contact-card type="turnip" :item-detail="itemDetail" />
  </view>
  <comment-list v-if="aid" ref="commentListRef" type="turnip" :id="aid" @delete-comment="deleteCommentId">
  </comment-list>
  <FixedInput v-if="aid" type="turnip" :id="aid" @fresh-comment="refreshComment" @add-comment="addCommentId">
  </FixedInput>
  <view style="height: 100rpx;"></view>
</template>

<script>
  import { ref, reactive, toRefs, computed, watch, onMounted } from 'vue'
  import useComment from '@/composables/useComment'
  import CommunityCard from '../../CommunityCard.vue'
  import ContactCard from '../../ContactCard.vue'
  import CommentList from '@/components/CommentList.vue'
  import FixedInput from '@/components/FixedInput.vue'
  import { getTurnip, addTurnip } from '@/request_api/turnip'

  export default {
    name: 'TurnipDetail',
    components: { CommunityCard, ContactCard, CommentList, FixedInput },
    setup(props) {
      const isLoading = ref(false)
      const itemDetail = ref(null)
      const aid = ref('')

      const commentListRef = ref(null)

      const getDetail = async () => {
        if (isLoading.value) return
        isLoading.value = true
        const { data } = await getTurnip(aid.value)
        itemDetail.value = data
        isLoading.value = false
      }

      const refreshComment = () => {
        commentListRef.value.refreshList()
        getDetail(aid.value)
      }

      const commentProps = useComment(aid, addTurnip)

      const dealBtn = () => {
        uni.showModal({
          content: "1.请勿将密码泄露给他人 2.每位森友一次只能加入一个岛屿 3.完成交易后，请一定要回到这里点击“离开岛屿”！",
          confirmText: '我知道啦！',
          success: (e) => {},
        })
      }

      return {
        aid,
        isLoading,
        itemDetail,
        getDetail,
        commentListRef,
        refreshComment,
        ...commentProps,
      }
    },
    onLoad(option) {
      this.aid = option.id
      this.getDetail()
    },
  }
</script>

<style lang="scss">

</style>
