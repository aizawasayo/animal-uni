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
      ref="communitySwiper"
    >
      <swiper-item
        class="swiper-item"
        v-for="(tab, i) in tabBars"
        :key="tab.id + i"
      >
        <swiper-paging-list
          :ref="
            el => {
              if (el) communityListRefs[i] = el
            }
          "
          :tabIndex="i"
          :currentIndex="currentTab"
          :pageSize="tab.id === 'board' ? 2 : 5"
          :apiType="tab.id"
          :listApi="getListApi(tab.id)"
          :hasTopic="tab.id === 'board'"
        >
          <template #default="{ item, refreshItem }">
            <component
              :is="tab.itemComponent"
              :item="item"
              :isDetail="false"
              :refresh-item="refreshItem"
              @go-detail="() => itemClick(item._id, tab.id)"
            ></component>
          </template>
        </swiper-paging-list>
      </swiper-item>
    </swiper>
  </z-paging-swiper>
  <uni-fab
    ref="fab"
    :pattern="{ buttonColor: '#3FB984' }"
    horizontal="right"
    vertical="bottom"
    :popMenu="false"
    @fabClick="fabClick"
  />
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, onBeforeUpdate } from 'vue'
import { useStore } from 'vuex'
import SwiperPagingList from '@/components/SwiperPagingList.vue'
import BoardCard from '@/pages/community/board/BoardCard.vue'
import TurnipCard from '@/pages/community/turnip/TurnipCard.vue'
import TradeCard from '@/pages/community/trade/TradeCard.vue'
import useSwiperTabs from '@/composables/useSwiperTabs'
import useLogin from '@/composables/useLogin'
import { getBoardList } from '@/request_api/board'
import { getTurnipList } from '@/request_api/turnip'
import { getTradeList } from '@/request_api/trade'
import { goPage } from '@/common/utils'

export default {
  components: {
    SwiperPagingList,
    BoardCard,
    TurnipCard,
    TradeCard,
  },
  setup() {
    const communityListRefs = ref([])
    const tabBars = [
      { name: '森友墙', id: 'board', itemComponent: BoardCard },
      { name: '菜市场', id: 'turnip', itemComponent: TurnipCard },
      { name: '交易区', id: 'trade', itemComponent: TradeCard },
    ]

    const store = useStore()
    const userId = computed(() => store.getters.userId)

    const { currentTab, tabsChange, animationfinish } = useSwiperTabs()

    const fabClick = () => {
      if (userId.value) {
        const apiType = tabBars[currentTab.value].id
        goPage(`/pages/community/${apiType}/add-${apiType}/add-${apiType}`)
      } else {
        useLogin().goLogin('发布信息需要先登录，确定前往登录页面')
      }
    }

    const itemClick = (id, apiType) => {
      //goPage(`/pages/community/${type}/${type}-detail/${type}-detail?id=${id}`)
      goPage(
        `/pages/community/community-detail/community-detail?id=${id}&apiType=${apiType}&tabIndex=${currentTab.value}`
      )
    }

    const refreshCommunityList = index => {
      communityListRefs.value[index].reloadList()
    }

    const refreshCommunityItem = ({ index, getItemApi, id }) => {
      communityListRefs.value[index].refreshItem(getItemApi, id)
    }

    onMounted(() => {
      uni.$on('refresh-community-list', refreshCommunityList)
      uni.$on('refresh-community-item', refreshCommunityItem)
    })

    onBeforeUnmount(() => {
      uni.$off('refresh-community-list')
      uni.$off('refresh-community-item')
    })

    onBeforeUpdate(() => {
      communityListRefs.value = []
    })

    return {
      currentTab,
      tabBars, // 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
      tabsChange,
      animationfinish,
      fabClick,
      itemClick,
      communityListRefs,
      getListApi: type => {
        let listApi = null
        switch (type) {
          case 'board':
            listApi = getBoardList
            break
          case 'turnip':
            listApi = getTurnipList
            break
          case 'trade':
            listApi = getTradeList
            break
        }
        return listApi
      },
    }
  },
}
</script>
