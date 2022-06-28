<template>
  <z-paging-swiper>
    <template #top>
      <z-tabs
        ref="tabs"
        :list="tabBars"
        :bar-width="68"
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
          :pageSize="3"
          :designType="tab.id"
          :listApi="listApi"
          :query="query"
          :ref="
            el => {
              if (el) designListRefs[i] = el
            }
          "
        >
          <template #default="{ item }">
            <board-card
              :item="item"
              :isDetail="false"
              isDesign
              @go-detail="
                utils.goPage(
                  `/pages/archive/design-detail/design-detail?id=${item._id}`
                )
              "
            ></board-card>
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
import { ref, computed, onMounted, onBeforeUpdate } from 'vue'
import { useStore } from 'vuex'
import { getDesignList } from '@/request_api/design'
import SwiperPagingList from '@/components/SwiperPagingList.vue'
import BoardCard from '@/pages/community/board/BoardCard.vue'
import useSwiperTabs from '@/composables/useSwiperTabs'
import useLogin from '@/composables/useLogin'

import { goPage } from '@/common/utils'

export default {
  components: {
    SwiperPagingList,
    BoardCard,
  },
  inject: ['utils'],
  setup(props) {
    const query = ref('')

    const tabBars = [
      { name: '衣服', id: 'clothingDesign' },
      { name: '帽子', id: 'hatDesign' },
      { name: '图案', id: 'patternDesign' },
    ]

    const store = useStore()
    const userId = computed(() => store.getters.userId)
    const designListRefs = ref([])

    const { currentTab, tabsChange, animationfinish } = useSwiperTabs()

    const fabClick = () => {
      if (userId.value) {
        goPage(
          `/pages/archive/add-design/add-design?designType=${
            tabBars[currentTab.value].id
          }`
        )
      } else {
        useLogin().goLogin('发布信息需要先登录，确定前往登录页面')
      }
    }

    onBeforeUpdate(() => {
      designListRefs.value = []
    })

    return {
      query,
      currentTab,
      tabBars,
      tabsChange,
      animationfinish,
      fabClick,
      designListRefs,
      listApi: getDesignList,
    }
  },
}
</script>

<style lang="scss">
@import '@/common/uni-nvue.css';

/* #ifndef APP-PLUS */
page {
  width: 100%;
  min-height: 100%;
  display: flex;
}

/* #endif */
</style>
