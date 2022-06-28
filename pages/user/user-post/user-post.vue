<template>
  <z-paging-swiper>
    <template #top>
      <z-tabs
        ref="tabs"
        :list="tabBars"
        :bar-width="100"
        active-color="#3FB984"
        :current="currentTab"
        @change="tabsChange"
      />
      <view class="line-h"></view>
    </template>

    <swiper
      class="swiper"
      :current="currentTab"
      @animationfinish="animationfinish"
    >
      <swiper-item
        class="swiper-item"
        v-for="(tab, i) in tabBars"
        :key="tab.id + i"
      >
        <swiper-paging-list
          :tabIndex="i"
          :currentIndex="currentTab"
          :ref="
            el => {
              if (el) postListRefs[i] = el
            }
          "
          :pageSize="10"
          :apiType="tab.id"
          :listApi="getListApi(tab.id)"
        >
          <template #default="{ item }">
            <post-item
              :item="item"
              @delete-post="deletePost"
              :apiType="tab.id"
            ></post-item>
          </template>
        </swiper-paging-list>
      </swiper-item>
    </swiper>
  </z-paging-swiper>
</template>

<script>
import { ref, onBeforeUpdate } from 'vue'
import SwiperPagingList from '@/components/SwiperPagingList.vue'
import PostItem from '@/components/PostItem.vue'
import useSwiperTabs from '@/composables/useSwiperTabs'
import { getBoardList } from '@/request_api/board'
import { getTurnipList } from '@/request_api/turnip'
import { getTradeList } from '@/request_api/trade'
import { getGuideList } from '@/request_api/guide'

export default {
  components: {
    SwiperPagingList,
    PostItem,
    // ScrollList,
  },
  setup(props) {
    const query = ref('')
    const tabBars = [
      // { name: '攻略', id: 'guide' },
      { name: '森友墙', id: 'board' },
      { name: '菜市场', id: 'turnip' },
      { name: '交易区', id: 'trade' },
    ]
    const postListRefs = ref([])
    const { currentTab, tabsChange, animationfinish } = useSwiperTabs()

    // 删除信息后刷新我的发布对应tab的列表，再去更新对应展示页面的列表
    const deletePost = () => {
      postListRefs.value[currentTab.value].reloadList()
      uni.$emit('refresh-community-list', currentTab.value)
    }

    onBeforeUpdate(() => {
      postListRefs.value = []
    })

    return {
      query,
      tabBars,
      currentTab,
      tabsChange,
      animationfinish,
      postListRefs,
      deletePost,
      getListApi: type => {
        let listFun = null
        switch (type) {
          case 'guide':
            listFun = getGuideList
            break
          case 'board':
            listFun = getBoardList
            break
          case 'turnip':
            listFun = getTurnipList
            break
          case 'trade':
            listFun = getTradeList
            break
        }
        return listFun
      },
    }
  },
}
</script>
