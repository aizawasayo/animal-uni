<template>
  <view class="tabs">
    <scroll-view class="tab-bar scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
      <view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index"
        @click="ontabtap">
        <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
      </view>
    </scroll-view>
    <view class="line-h"></view>
    <swiper :current="tabIndex" class="swiper-box" :duration="300" @change="ontabchange">
      <swiper-item v-for="(tab, i) in tabBars" :key="tab.id + i">
        <scroll-list :ref="el => {if (el) postListRefs[i] = el} " :query="query" :type="tab.id" :listApi="listApi(tab.id)" fullDomClass='.uni-swiper-wrapper' singleDomClass=".uni-list-item">
          <template #default="{ item, refreshList }">
            <post-item :item="item" :refreshFun="refreshList" :type="tab.id"></post-item>
          </template>
        </scroll-list>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  import { ref, computed, onMounted, onBeforeUpdate } from 'vue'
  import PostItem from '@/components/PostItem.vue'
  import ScrollList from '@/components/ScrollList.vue'
  import { getBoardList } from '@/request_api/board'
  import { getTurnipList } from '@/request_api/turnip'
  import { getTradeList } from '@/request_api/trade'
  import { getGuideList } from '@/request_api/guide'

  export default {
    components: {
      PostItem,
      ScrollList
    },
    setup(props) {
      const query = ref('')
      const tabIndex = ref(0)
      const scrollInto = ref('')

      const tabBars = [
        { name: '攻略', id: 'guide' },
        { name: '森友墙', id: 'board' },
        { name: '菜市场', id: 'turnip' },
        { name: '交易区', id: 'trade' },
      ]
      const postListRefs = ref([])
      
      const listApi = (type) => {
        let listFun = null
        switch (type) {
          case 'guide':
            listFun = getGuideList
            break;
          case 'board':
            listFun = getBoardList
            break;
          case 'turnip':
            listFun = getTurnipList
            break;
          case 'trade':
            listFun = getTradeList
            break;
        }
        return listFun
      }

      const switchTab = (index) => {
        if (tabIndex.value === index) return

        tabIndex.value = index;
        scrollInto.value = tabBars[index].id;
      }

      const ontabtap = (e) => {
        let index = e.target.dataset.current || e.currentTarget.dataset.current;
        switchTab(index);
      }
      
      const ontabchange = (e) => {
        let index = e.target.current || e.detail.current;
        switchTab(index);
      }

      onMounted(() => {
        postListRefs.value.forEach((list, i) => {
          postListRefs.value[i].changeScrollHeight()
        })
      })
      
      onBeforeUpdate(() => {
        postListRefs.value = []
      })

      return {
        query,
        tabIndex,
        tabBars,
        postListRefs,
        scrollInto,
        listApi,
        switchTab,
        ontabtap,
        ontabchange
      };
    },
  }
</script>

<style lang="scss">

</style>
