<template>
  <view class="content">
    <z-paging
      ref="paging"
      v-model="dataList"
      @query="queryList"
      :default-page-size="pageSize"
      inside-more
      :show-loading-more-when-reload="true"
    >
      <template v-if="hasBanner" #top>
        <slot name="top"></slot>
      </template>
      <template #refresher="{ refresherStatus }">
        <uni-refresher :status="refresherStatus" />
      </template>
      <view class="item" v-for="(item, i) in dataList" :key="item._id + i">
        <guide-item :item="item" @click="itemClick(item._id)"></guide-item>
      </view>
      <template #loadingMoreNoMore>
        <uni-nomore></uni-nomore>
      </template>
    </z-paging>
  </view>
</template>

<script>
import { defineComponent, ref, reactive, toRefs } from 'vue'
// import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import GuideItem from '@/pages/guide/GuideItem.vue'
import usePagingList from '@/composables/usePagingList'
import { getGuideList } from '@/request_api/guide'
import { goPage } from '@/common/utils'

export default defineComponent({
  name: 'GuideList',
  components: {
    GuideItem,
  },
  inject: ['utils'],
  emits: ['list-tap'],
  props: {
    query: {
      type: String,
      default: '',
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    hasBanner: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { query } = toRefs(props)

    const listQuery = reactive({
      query,
      sort: JSON.stringify({ display_time: 1 }),
    })

    // 为了共用 tab swiper 列表的组合函数 usePagingList，虚构两个 tab ref
    const currentIndex = ref(0)
    const tabIndex = ref(0)

    const { paging, dataList, queryList, reloadList } = usePagingList(
      getGuideList,
      listQuery,
      currentIndex,
      tabIndex
    )

    const itemClick = id => {
      if (query.value) {
        emit('list-tap')
      }
      goPage(`/pages/guide/guide-detail/guide-detail?id=${id}`)
    }

    return {
      paging,
      dataList,
      listQuery,
      queryList,
      reloadList,
      itemClick,
    }
  },
})
</script>
