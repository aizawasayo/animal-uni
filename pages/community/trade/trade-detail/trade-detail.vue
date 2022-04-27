<template>
  <uni-load-more v-if="isLoading" :iconSize="30" status="loading" :content-text="loadText"></uni-load-more>
  <view v-else>
    <community-card type="trade" :item-detail="itemDetail" />
    <contact-card type="trade" :item-detail="itemDetail" />
  </view>
  <comment-list v-if="aid" ref="commentListRef" type="trade" :id="aid"></comment-list>
  <FixedInput v-if="aid" type="trade" :id="aid" @fresh-comment="refreshComment"></FixedInput>
  <view style="height: 100rpx;"></view>
</template>

<script>
  import { ref, reactive, toRefs, computed, watch, onMounted } from 'vue'
  import useComment from '@/composables/useComment'
  import CommunityCard from '../../CommunityCard.vue'
  import ContactCard from '../../ContactCard.vue'
  import CommentList from '@/components/CommentList.vue'
  import FixedInput from '@/components/FixedInput.vue'
  import { getTrade, addTrade } from '@/request_api/trade'
  export default {
    name: 'TradeDetail',
    components: { CommunityCard, ContactCard, CommentList, FixedInput },
    inject: ['apiUrl'],
    setup(props) {
      const isLoading = ref(false)
      const itemDetail = ref(null)
      const aid = ref('')

      const commentListRef = ref(null)

      const getDetail = async (id) => {
        if (isLoading.value) return
        isLoading.value = true
        const { data } = await getTrade(id)
        itemDetail.value = data
        isLoading.value = false
      }

      const commentProps = useComment(aid, addTrade)

      const refreshComment = () => {
        commentListRef.value.refreshList()
        getDetail(aid.value)
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
      this.getDetail(option.id)
    },
  }
</script>

<style lang="scss">

</style>
