<!-- 在这个文件对每个tab对应的列表进行渲染 -->
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
      <template #top>
        <list-toolbar
          ref="toolbarRef"
          :apiType="apiType"
          :checkKey="checkKey"
          :checkVal="checkVal"
          :sortChange="sortChange"
          :isTabBar="true"
        >
        </list-toolbar>
      </template>
      <!-- 自定义下拉刷新view(如果use-custom-refresher为true且不设置下面的slot="refresher"，此时不用获取refresherStatus，会自动使用z-paging自带的下拉刷新view) -->
      <template #refresher="{ refresherStatus }">
        <uni-refresher :status="refresherStatus" />
      </template>
      <view class="item" v-for="(item, i) in dataList" :key="item.name + i">
        <museum-item
          :item="item"
          :position="
            apiType !== 'fossil' && apiType !== 'artwork' ? position : ''
          "
          :isShowTag="$attrs.isShowTag(item._id)"
          @click="itemClick(item._id)"
        >
        </museum-item>
      </view>
      <template #loadingMoreNoMore>
        <uni-nomore></uni-nomore>
      </template>
    </z-paging>
    <view
      v-if="$attrs.showPosition"
      class="position-toggle"
      :class="{ posSouth: position === 'south' }"
      @click="
        $emit('update:position', position === 'north' ? 'south' : 'north')
      "
    >
      <uni-icons type="map-pin-ellipse" size="28" color="#fff"></uni-icons>
      <text class="position-text">{{
        position === 'north' ? '北' : '南'
      }}</text>
    </view>
    <filter-pop
      :listQuery="listQuery"
      :apiType="apiType"
      :reloadList="reloadList"
      :isTabBar="true"
    />
  </view>
</template>

<script>
import { ref, reactive, watch, toRefs } from 'vue'
import ListToolbar from '@/components/ListToolbar.vue'
import MuseumItem from '@/pages/museum/MuseumItem.vue'
import FilterPop from '@/components/FilterPop.vue'
import usePagingList from '@/composables/usePagingList'
import useSort from '@/composables/useSort'
import { goSwitchPage } from '@/common/utils'

export default {
  components: { ListToolbar, MuseumItem, FilterPop },
  props: {
    // 当前组件的index，也就是当前组件是swiper中的第几个
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
    apiType: {
      type: String,
    },
    query: {
      type: String,
      default: '',
    },
    sort: {
      type: Object,
    },
    position: {
      type: String,
      required: true,
      validator: function (value) {
        // 值必须匹配下列字符串中的一个
        return ['north', 'south'].indexOf(value) !== -1
      },
    },
    isTagMode: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit, attrs }) {
    const { currentIndex, tabIndex, apiType, sort, query, isTagMode } =
      toRefs(props)

    const toolbarRef = ref(null)

    const checkSort = ref(sort.value)

    const { sortString, checkKey, checkVal, sortChange } = useSort(
      checkSort,
      val => {
        emit('changeSort', val)
      }
    )

    // 如果父组件的 sort 被改变了，判断这个排序字段是否包含在当前图鉴的排序字段列表里
    watch(sort, val => {
      if (toolbarRef.value.sortKeyArr.includes(Object.keys(val)[0])) {
        // 如果是同步改变本图鉴列表的排序值，否则不变
        checkSort.value = val
      }
    })

    // 构造一个由自己控制的查询参数对象，便于添加和删除筛选字段
    const listQuery = reactive({
      query,
      sort: sortString,
    })

    const { paging, dataList, total, queryList, reloadList, page, limit } =
      usePagingList(attrs.listApi, listQuery, currentIndex, tabIndex, true)

    const itemClick = id => {
      if (isTagMode.value) {
        // changeTag(type, id)
        emit('changeTag', { type: apiType.value, id })
      } else {
        goSwitchPage(
          `/pages/museum/museum-detail/museum-detail?id=${id}&apiType=${apiType.value}&tabIndex=${tabIndex.value}`,
          dataList.value,
          attrs.listApi,
          { ...listQuery, page: page, pageSize: limit },
          total
        )
      }
    }

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
      itemClick,
    }
  },
}
</script>

<style lang="scss" scoped>
.position-toggle {
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 160rpx;
  height: 80rpx;
  border-width: 2rpx;
  border-color: #fff;
  box-shadow: 0 0 10rpx rgba($color: #000000, $alpha: 0.2);
  color: #fff;
  background-color: #8bc34a;
  bottom: 200rpx;
  right: 40rpx;
  border-radius: 60rpx;
  z-index: 99;

  .position-text {
    color: #fff;
    width: 60rpx;
    text-align: center;
    font-size: 40rpx;
    text-shadow: 0 0 10rpx rgba($color: #000000, $alpha: 0.2);
  }
}

.posSouth {
  background-color: #3fb984;
}
</style>
