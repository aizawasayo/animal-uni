<template>
  <view>
    <!-- <view class="status_bar"> -->
    <!-- 这里是占位状态栏 -->
    <!-- </view> -->
    <uni-nav-bar backgroundColor="transparent" :leftWidth="0" :rightWidth="90">
      <template #default>
        <uni-search-bar class="search-bar" placeholder="请输入图鉴关键字" bgColor="#FFFFFF" @confirm="confirmQuery"
          v-model="query" cancelButton="none">
          <template #searchIcon>
            <uni-icons color="#BEBEBE" size="24" type="search" />
          </template>
        </uni-search-bar>
      </template>
      <template #right><button class="tag-button"
          @click="tagButtonTap">{{ tagMode? '退出标记' : '标记模式' }}</button></template>
    </uni-nav-bar>
    <view class="tabs">
      <scroll-view class="tab-bar scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
        <view v-for="(tab, index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index"
          @click="ontabtap">
          <text class="uni-tab-item-title"
            :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
        </view>
      </scroll-view>
      <view class="line-h"></view>
      <swiper :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="300" @change="ontabchange">
        <swiper-item class="swiper-item" v-for="(tab, index1) in tabBars" :key="index1">
          <!-- #ifndef APP-NVUE -->
          <museum-list :ref="el => { if (el) museumListRefs[index1] = el }" :type="tab.id" v-model:position="position"
            :isTagMode="tagMode" :query="query" :sort="sort" :listIndex="index1" @changeSort="changeSort"
            :isShowTag="isShowTag" @changeTag="changeTag">
          </museum-list>
          <!-- #endif -->
        </swiper-item>
      </swiper>
    </view>
  </view>
  <!-- <teleport to="#toggle-position">123</teleport> -->
</template>
<script>
  import { ref, computed, onMounted, onBeforeUpdate, nextTick } from 'vue'
  import { onNavigationBarButtonTap, onLoad } from '@dcloudio/uni-app'
  import useTagMode from '@/composables/useTagMode'
  import MuseumList from '@/pages/museum/MuseumList.vue'

  export default {
    components: {
      MuseumList,
    },
    setup() {
      const query = ref('')
      const sort = ref({ name: 1 })
      const cacheTab = ref([])
      const tabIndex = ref(0)
      const scrollInto = ref('')
      const position = ref('north')
      const museumListRefs = ref([])

      // 缓存每页最多
      const MAX_CACHE_DATA = 100;
      // 缓存页签数量
      const MAX_CACHE_PAGE = 3;
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

      const clearTabData = e => {
        museumListRefs.value[e].list = [];
        museumListRefs.value[e].loadingText = "加载更多...";
      }

      const switchTab = index => {
        if (tabIndex.value === index) {
          return;
        }

        // 缓存 tabId
        if (museumListRefs.value[tabIndex.value].list.length > MAX_CACHE_DATA) {
          let isExist = cacheTab.value.indexOf(tabIndex.value);
          if (isExist < 0) {
            cacheTab.value.push(tabIndex.value);
            //console.log("cache index:: " + tabIndex.value);
          }
        }

        tabIndex.value = index;
        scrollInto.value = tabBars[index].id;

        // 释放 tabId
        if (cacheTab.value.length > MAX_CACHE_PAGE) {
          let cacheIndex = cacheTab.value[0];
          clearTabData(cacheIndex);
          cacheTab.value.splice(0, 1);
          // console.log("remove cache index:: " + cacheIndex.value);
        }
      }

      const ontabtap = e => {
        let index = e.target.dataset.current || e.currentTarget.dataset.current;
        switchTab(index);
      }

      const ontabchange = e => {
        let index = e.target.current || e.detail.current;
        switchTab(index);
      }

      const confirmQuery = (e) => {
        /* 点击软键盘搜索按键触发 */
        if (!e.value) {
          uni.showModal({
            title: '提示',
            content: '请输入内容。'
          });
          return;
        }
      }

      const { tagMode, tagButtonTap, changeTagMode, isShowTag, changeTag } = useTagMode(tabBars, museumListRefs)

      onMounted(() => {
        tabBars.forEach((tab, i) => {
          museumListRefs.value[i].changeScrollHeight()
        })
      })

      onBeforeUpdate(() => {
        museumListRefs.value = []
      })

      onLoad(() => {
        // console.log(111)
        // tabBars.forEach((tab, i) => {
        //   museumListRefs.value[i].changeScrollHeight()
        // })
        //   // 监听事件
        //   uni.$on('switchTab', data => {
        //    switchTab(data.selectedTab);
        //   })
      })
      // onUnload(()=> {
      //   // 移除监听事件  
      //   uni.$off('switchTab');
      // })

      return {
        query,
        sort,
        cacheTab,
        tabIndex,
        tabBars,
        position,
        tagMode,
        scrollInto,
        museumListRefs,
        changeSort,
        clearTabData,
        switchTab,
        ontabtap,
        ontabchange,
        tagButtonTap,
        changeTagMode,
        // isCollected,
        isShowTag,
        changeTag,
        confirmQuery
      }
    },
    onReachBottom() {
      // museumListRefs.value[this.tabIndex].loadMore()
    },
    onPullDownRefresh() {
      // museumListRefs.value[this.tabIndex].refreshList()
    },
  }
</script>

<style lang="scss">
  @import '@/common/uni-nvue.css';

  /* #ifndef APP-PLUS */
  page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
    /* #ifdef H5 */
    height: 88rpx;
    /* #endif */
  }

  /* #endif */

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
