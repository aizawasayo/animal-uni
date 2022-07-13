<template>
  <view class="content">
    <z-paging
      ref="paging"
      v-model="dataList"
      @query="queryList"
      :default-page-size="pageSize"
      :auto="false"
      inside-more
      :show-loading-more-when-reload="true"
    >
      <template #top>
        <list-toolbar
          ref="toolbarRef"
          :apiType="apiType"
          :checkKey="checkKey"
          :checkVal="checkVal"
          :sortChange="sortChange"
        />
      </template>
      <template #refresher="{ refresherStatus }">
        <uni-refresher :status="refresherStatus" />
      </template>
      <view v-for="(item, index) in dataList" :key="index">
        <slot :item="item" :item-index="index"></slot>
      </view>
      <template #loadingMoreNoMore>
        <uni-nomore></uni-nomore>
      </template>
    </z-paging>
  </view>
  <filter-pop :listQuery="listQuery" :apiType="apiType" :marginTop="88" />
</template>

<script>
import { ref, reactive } from 'vue'
import ListToolbar from '@/components/ListToolbar.vue'
import FilterPop from '@/components/FilterPop.vue'
import usePagingList from '@/composables/usePagingList'
import useSort from '@/composables/useSort'
import queryMixin from '@/common/queryMixin'
import useQuery from '@/composables/useQuery'

export default {
  name: 'ToolbarPagingList',
  components: {
    ListToolbar,
    FilterPop,
  },
  props: {
    apiType: {
      type: String,
    },
    listApi: {
      type: Function,
    },
    pageSize: {
      type: Number,
      default: 15,
    },
  },
  // mixins: [queryMixin],
  setup(props) {
    const sort = ref({ name: 1 })
    const toolbarRef = ref(null)

    const { sortString, checkKey, checkVal, sortChange } = useSort(
      sort,
      val => {
        sort.value = val
      }
    )

    const { query } = useQuery()

    const listQuery = reactive({
      query,
      sort: sortString,
    })

    // 为了共用 tab swiper 列表的组合函数 usePagingList，虚构两个 tab ref
    const currentIndex = ref(0)
    const tabIndex = ref(0)

    const { paging, dataList, total, queryList, reloadList } = usePagingList(
      props.listApi,
      listQuery,
      currentIndex,
      tabIndex
    )

    return {
      paging,
      dataList,
      total,
      listQuery,
      queryList,
      reloadList,
      toolbarRef,
      checkKey,
      checkVal,
      sortChange,
    }
  },
}
</script>

<style scoped>
/* #ifdef H5 */
.uni-popup.top {
  top: 88px !important;
}
/* #endif*/
</style>
