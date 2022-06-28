<template>
  <view>
    <uni-load-more
      v-if="isLoading"
      :iconSize="30"
      status="loading"
      :content-text="loadText"
    ></uni-load-more>
    <view v-else>
      <component
        v-if="itemDetail !== null"
        :is="detailApis[tabIndex].comp"
        :item="itemDetail"
        :refresh-item="refreshDetail"
      ></component>
      <contact-card v-if="apiType !== 'board'" :item-detail="itemDetail" />
    </view>

    <comment-list
      v-if="itemId"
      ref="commentListRef"
      :apiType="apiType"
      :id="itemId"
      @delete-comment="deleteCommentId"
    ></comment-list>
    <FixedInput
      v-if="itemId"
      :apiType="apiType"
      :id="itemId"
      @add-comment="addCommentId"
    ></FixedInput>
    <view style="height: 100rpx"></view>
  </view>
</template>

<script>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import useComment from '@/composables/useComment'
import BoardCard from '@/pages/community/board/BoardCard.vue'
import TurnipCard from '@/pages/community/turnip/TurnipCard.vue'
import TradeCard from '@/pages/community/trade/TradeCard.vue'
import ContactCard from '@/pages/community/ContactCard.vue'
import CommentList from '@/components/CommentList.vue'
import FixedInput from '@/components/FixedInput.vue'
import { getBoard, addBoard } from '@/request_api/board'
import { getTurnip, addTurnip } from '@/request_api/turnip'
import { getTrade, addTrade } from '@/request_api/trade'

export default {
  name: 'BoardDetail',
  components: {
    BoardCard,
    TurnipCard,
    TradeCard,
    ContactCard,
    CommentList,
    FixedInput,
  },
  inject: ['apiUrl'],
  props: {
    id: {
      type: String,
    },
    apiType: {
      type: String,
    },
    tabIndex: {
      type: [Number, String],
    },
  },
  setup(props) {
    const apiType = ref(props.apiType)
    const itemId = ref(props.id)
    const tabIndex = ref(parseFloat(props.tabIndex))
    const isLoading = ref(false)
    const itemDetail = ref(null)

    const commentListRef = ref(null)

    const detailApis = [
      { getItemApi: getBoard, addItemApi: addBoard, comp: BoardCard },
      { getItemApi: getTurnip, addItemApi: addTurnip, comp: TurnipCard },
      { getItemApi: getTrade, addItemApi: addTrade, comp: TradeCard },
    ]

    const refreshDetail = async () => {
      const { data } = await detailApis[tabIndex.value].getItemApi(itemId.value)
      itemDetail.value = data
      uni.$emit('refresh-community-item', {
        index: tabIndex.value,
        getItemApi: detailApis[tabIndex.value].getItemApi,
        id: itemId.value,
      })
    }

    const getDetail = async () => {
      if (isLoading.value) return
      isLoading.value = true
      await refreshDetail()
      isLoading.value = false
    }

    const { addCommentId, deleteCommentId } = useComment(
      itemId.value,
      detailApis[tabIndex.value].addItemApi,
      async () => {
        await commentListRef.value.refreshList() // 刷新评论列表
        await refreshDetail() // 刷新详情以显示正确的评论数量
      }
    )

    onLoad(getDetail)

    return {
      detailApis,
      isLoading,
      apiType,
      itemId,
      tabIndex,
      itemDetail,
      getDetail,
      refreshDetail,
      commentListRef,
      addCommentId,
      deleteCommentId,
    }
  },
}
</script>

<style lang="scss"></style>
