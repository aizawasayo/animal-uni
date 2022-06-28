<template>
  <view class="content">
    <z-paging
      ref="paging"
      v-model="dataList"
      @query="queryList"
      :fixed="false"
      :auto="false"
      :default-page-size="15"
      inside-more
      :show-loading-more-when-reload="true"
    >
      <template #refresher="{ refresherStatus }">
        <uni-refresher :status="refresherStatus" />
      </template>
      <view class="item" v-for="(item, i) in dataList" :key="item.name + i">
        <archive-item :item="item" @click="itemClick(item._id)"> </archive-item>
      </view>
      <template #loadingMoreNoMore>
        <uni-nomore></uni-nomore>
      </template>
    </z-paging>
  </view>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import ArchiveItem from '@/pages/archive/ArchiveItem.vue'
import usePagingList from '@/composables/usePagingList'
import { goSwitchPage } from '@/common/utils'

export default {
  name: 'ArchiveList',
  components: {
    ArchiveItem,
  },
  inject: ['apiUrl', 'utils'],
  emits: ['changeSort'],
  props: {
    tabIndex: {
      type: Number,
      default: function () {
        return 0
      },
    },
    // 当前swiper切换到第几个index
    currentIndex: {
      type: Number,
      default: function () {
        return 0
      },
    },
    tabType: {
      type: String,
      required: true,
    },
    filterParams: {
      type: Object,
    },
    listParams: {
      type: Object,
    },
  },
  setup(props, { attrs, emit }) {
    const { currentIndex, tabIndex, tabType, listParams, filterParams } =
      toRefs(props)

    const listQuery = reactive({
      type: [tabType.value],
      ...toRefs(listParams.value),
    })

    const { paging, dataList, total, queryList, reloadList, page, limit } =
      usePagingList(attrs.listApi, listQuery, currentIndex, tabIndex, true)

    watch(
      filterParams,
      val => {
        if (Object.keys(val).length >= 1) {
          Object.keys(val).forEach(key => {
            listQuery[key] = val[key]
          })
        } else if (Object.keys(val).length === 0) {
          // 重置操作
          const defaultKeys = [
            'query',
            'page',
            'pageSize',
            'sort',
            'sortJson',
            'type',
          ]
          Object.keys(listQuery).forEach(key => {
            if (!defaultKeys.includes(key)) {
              delete listQuery[key]
            }
          })
        }
      },
      { deep: true }
    )

    const itemClick = id => {
      goSwitchPage(
        `/pages/archive/archive-detail/archive-detail?id=${id}&apiType=${attrs.apiType}&tabIndex=${tabIndex.value}`,
        dataList.value,
        attrs.listApi,
        { ...listQuery, page: page, pageSize: limit },
        total
      )
    }

    return {
      paging,
      dataList,
      total,
      listQuery,
      queryList,
      reloadList,
      itemClick,
    }
  },
}
</script>

<style lang="scss"></style>
