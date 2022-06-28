<template>
  <z-paging-swiper>
    <template #top>
      <view v-if="hasNotch" class="status_bar">
        <!-- 这里是状态栏 -->
      </view>
      <uni-nav-bar
        backgroundColor="transparent"
        :leftWidth="0"
        :rightWidth="90"
      >
        <template #default>
          <uni-search-bar
            class="search-bar"
            placeholder="请输入图鉴关键字"
            bgColor="#FFFFFF"
            @confirm="confirmQuery"
            v-model="query"
            cancelButton="none"
          >
            <template #searchIcon>
              <uni-icons color="#BEBEBE" size="24" type="search" />
            </template>
          </uni-search-bar>
        </template>
        <template #right
          ><button class="tag-button" @click="tagButtonTap">
            {{ tagMode ? '退出标记' : '标记模式' }}
          </button></template
        >
      </uni-nav-bar>
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
        <museum-list
          :tabIndex="i"
          :currentIndex="currentTab"
          :apiType="tab.id"
          :listApi="getListApi(tab.id)"
          v-model:position="position"
          :showPosition="['fish', 'insect', 'halobios'].includes(tab.id)"
          :isTagMode="tagMode"
          :isShowTag="isShowTag"
          :query="query"
          :sort="sort"
          @changeSort="changeSort"
          @changeTag="changeTag"
          :ref="
            el => {
              if (el) museumListRefs[i] = el
            }
          "
        >
        </museum-list>
      </swiper-item>
    </swiper>
  </z-paging-swiper>
</template>
<script>
import { ref, computed } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import MuseumList from '@/pages/museum/MuseumList.vue'
import useSwiperTabs from '@/composables/useSwiperTabs'
import useTagMode from '@/composables/useTagMode'
import { getFishes } from '@/request_api/fish'
import { getInsects } from '@/request_api/insect'
import { getHalobiosList } from '@/request_api/halobios'
import { getFossils } from '@/request_api/fossil'
import { getArtworkList } from '@/request_api/artwork'

export default {
  components: {
    MuseumList,
  },
  setup() {
    const query = ref('')
    const sort = ref({ name: 1 })
    const position = ref('north')
    const museumListRefs = ref([])

    const tabBars = [
      { name: '鱼类', id: 'fish' },
      { name: '昆虫', id: 'insect' },
      { name: '海洋生物', id: 'halobios' },
      { name: '化石', id: 'fossil' },
      { name: '艺术品', id: 'artwork' },
    ]

    const changeSort = val => {
      sort.value = val
    }

    const { currentTab, tabsChange, animationfinish } = useSwiperTabs()

    const confirmQuery = e => {
      /* 点击软键盘搜索按键触发 */
      if (!e.value) {
        uni.showModal({
          title: '提示',
          content: '请输入内容。',
        })
        return
      }
    }

    const { tagMode, tagButtonTap, changeTagMode, isShowTag, changeTag } =
      useTagMode(tabBars, museumListRefs)

    onLoad(() => {
      // 监听事件
      uni.$on('switchTab', data => {
        tabsChange(data.selectedTab)
      })
    })

    onUnload(() => {
      // 移除监听事件
      uni.$off('switchTab')
    })

    const hasNotch = computed(() => {
      /* #ifndef H5 */
      return plus.navigator.hasNotchInScreen()
      /* #endif */
      /* #ifdef H5 */
      return false
      /* #endif */
    })

    return {
      query,
      sort,
      currentTab,
      tabBars,
      position,
      tagMode,
      museumListRefs,
      changeSort,
      tabsChange,
      animationfinish,
      tagButtonTap,
      changeTagMode,
      isShowTag,
      changeTag,
      confirmQuery,
      hasNotch,
      getListApi: type => {
        let listApi = null
        switch (type) {
          case 'fish':
            listApi = getFishes
            break
          case 'insect':
            listApi = getInsects
            break
          case 'halobios':
            listApi = getHalobiosList
            break
          case 'fossil':
            listApi = getFossils
            break
          case 'artwork':
            listApi = getArtworkList
            break
        }
        return listApi
      },
    }
  },
}
</script>

<style scoped>
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
}

.search-bar {
  width: 100%;
  padding: 0;
  align-items: center;
}

.tag-button {
  padding: 0 30rpx;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 28rpx;
  background-color: #04b96e;
  color: white;
  border-radius: 40rpx;
  box-shadow: 0 0 10rpx rgba(9, 199, 161, 0.6);
}
</style>
