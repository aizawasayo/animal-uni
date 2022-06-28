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
          :ref="
            el => {
              if (el) postDesignListRefs[i] = el
            }
          "
          :pageSize="10"
          :listApi="listApi"
          :designType="tabBars[i].id"
          onlyUser
        >
          <template #default="{ item }">
            <design-item
              :item="item"
              @delete-design="deleteDesign"
            ></design-item>
          </template>
        </swiper-paging-list>
      </swiper-item>
    </swiper>
  </z-paging-swiper>
</template>

<script>
import { ref, onBeforeUpdate } from 'vue'
import SwiperPagingList from '@/components/SwiperPagingList.vue'
import DesignItem from '@/components/DesignItem.vue'
import useSwiperTabs from '@/composables/useSwiperTabs'
import { getDesignList } from '@/request_api/design'

export default {
  components: {
    SwiperPagingList,
    DesignItem,
  },
  setup(props) {
    const tabBars = [
      { name: '衣服', id: 'clothingDesign' },
      { name: '帽子', id: 'hatDesign' },
      { name: '图案', id: 'patternDesign' },
    ]
    const postDesignListRefs = ref([])
    const { currentTab, tabsChange, animationfinish } = useSwiperTabs()

    // 删除设计后刷新对应tab的设计列表
    const deleteDesign = () => {
      postDesignListRefs.value[currentTab.value].reloadList()
    }

    onBeforeUpdate(() => {
      postDesignListRefs.value = []
    })

    return {
      tabBars,
      currentTab,
      tabsChange,
      animationfinish,
      postDesignListRefs,
      listApi: getDesignList,
      deleteDesign,
    }
  },
}
</script>
