<template>
  <view class="userTopArticle">
    <view
      class="userArticle"
      @click="utils.goPage('/pages/user/user-post/user-post')"
    >
      <text class="articleNum">{{ postNum }}</text>
      <text>已发帖</text>
    </view>
    <view class="userArticle">
      <text class="articleNum">5</text>
      <text>获赞</text>
    </view>
    <view
      class="userArticle"
      @click="utils.goPage('/pages/user/user-design/user-design')"
    >
      <text class="articleNum">{{ designNum }}</text>
      <text>我的设计</text>
    </view>
  </view>
</template>

<script>
import { ref, computed, watch, toRefs } from 'vue'
import { getBoardList } from '@/request_api/board'
import { getTurnipList } from '@/request_api/turnip'
import { getTradeList } from '@/request_api/trade'
import { getDesignList } from '@/request_api/design'

export default {
  name: 'UserTopArticle',
  inject: ['utils'],
  props: {
    userId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { userId } = toRefs(props)
    const boardNum = ref(0)
    const turnipNum = ref(0)
    const tradeNum = ref(0)
    const postNum = computed(
      () => boardNum.value + turnipNum.value + tradeNum.value
    )
    const designNum = ref(0)

    const getPostNum = async () => {
      const params = {
        query: '',
        page: 1,
        pageSize: 10,
        sort: JSON.stringify({ created_time: -1 }),
        user: userId.value,
      }
      const boardData = await getBoardList({
        ...params,
        topic: '',
      })
      boardNum.value = boardData.data.total
      const turnipData = await getTurnipList(params)
      turnipNum.value = turnipData.data.total
      const tradeData = await getTradeList(params)
      tradeNum.value = tradeData.data.total
      const designData = await getDesignList(params)
      designNum.value = designData.data.total
    }

    watch(
      userId,
      val => {
        if (val) getPostNum()
      },
      { immediate: true }
    )

    return {
      postNum,
      designNum,
    }
  },
}
</script>

<style lang="scss">
.userTopArticle {
  display: flex;
  flex-direction: row;

  .userArticle {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;

    .articleNum {
      font-size: 40rpx;
      line-height: 60rpx;
    }
  }
}
</style>
