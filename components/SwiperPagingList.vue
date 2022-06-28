<!-- 在这个文件对每个tab对应的列表进行渲染 -->
<template>
  <view class="content">
    <!-- :auto="false" 这里设置了z-paging加载时禁止自动调用reload方法，自行控制何时reload（懒加载）-->
    <!-- :fixed="false" 设置 z-paging不铺满全屏，使用局部滚动 (根据父节点高度撑满)-->
    <!-- :enable-back-to-top="currentIndex===tabIndex" 在微信小程序上可以多加这一句，因为默认是允许点击返回顶部的，但是这个页面有多个scroll-view，会全部返回顶部，所以需要控制是当前index才允许点击返回顶部 -->
    <z-paging
      ref="paging"
      v-model="dataList"
      @query="queryList"
      :fixed="false"
      :auto="false"
      :default-page-size="pageSize"
      inside-more
      :show-loading-more-when-reload="true"
    >
      <template v-if="$attrs.hasTopic" #top>
        <topic-bar ref="topicRef" v-model:topic="topic" />
      </template>
      <template #refresher="{ refresherStatus }">
        <uni-refresher :status="refresherStatus" />
      </template>
      <view v-for="(item, index) in dataList" :key="index">
        <slot
          :item="item"
          :item-index="index"
          :refresh-item="refreshItem"
        ></slot>
      </view>
      <template #loadingMoreNoMore>
        <uni-nomore></uni-nomore>
      </template>
    </z-paging>
  </view>
</template>

<script>
import { ref, reactive, toRefs, computed, watch } from 'vue'
import { useStore } from 'vuex'
import TopicBar from '@/pages/community/board/TopicBar.vue'
import usePagingList from '@/composables/usePagingList'

export default {
  components: {
    TopicBar,
  },
  props: {
    // 当前组件的index，也就是当前组件是swiper中的第几个
    tabIndex: {
      type: Number,
      default: function () {
        return 0
      },
    },
    //当前swiper切换到第几个index
    currentIndex: {
      type: Number,
      default: function () {
        return 0
      },
    },
    apiType: {
      type: String,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    onlyUser: {
      type: Boolean,
      default: false,
    },
    designType: {
      type: String,
    },
  },
  setup(props, { attrs }) {
    const { currentIndex, tabIndex, apiType, onlyUser, designType } =
      toRefs(props)

    const store = useStore()
    const userId = computed(() => store.getters.userId)
    const topic = ref('')

    // 构造一个由自己控制的查询参数对象，便于添加和删除筛选字段
    const listQuery = reactive({
      query: '',
      sort: JSON.stringify({ created_time: -1 }),
      type: designType.value,
      user: onlyUser.value ? userId.value : null,
    })

    const { paging, dataList, queryList, reloadList } = usePagingList(
      attrs.listApi,
      listQuery,
      currentIndex,
      tabIndex
    )

    watch(topic, val => {
      if (apiType.value === 'board') listQuery.topic = val
    })

    const refreshItem = async (getItemApi, id, type) => {
      const params = type ? [id, type] : [id] // type 用于处理评论列表项的特殊情况
      try {
        const { data } = await getItemApi(...params)
        const index = dataList.value.findIndex(l => l._id === id)
        dataList.value[index] = data
      } catch (err) {
        console.log(err)
      }
    }

    return {
      topic,
      paging,
      dataList,
      queryList,
      reloadList,
      refreshItem,
    }
  },
}
</script>

<style>
/* 注意:父节点需要固定高度，z-paging的height:100%才会生效 */
.content {
  height: 100%;
}
</style>
