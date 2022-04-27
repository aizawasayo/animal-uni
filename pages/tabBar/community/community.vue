<template>
  <view class="tabs">
    <scroll-view class="tab-bar scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
      <view v-for="(tab,index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index"
        @click="ontabtap">
        <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
      </view>
    </scroll-view>
    <view class="line-h"></view>
    <swiper :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="300" @change="ontabchange">
      <swiper-item>
        <board ref="board" :query="query"></board>
      </swiper-item>
      <swiper-item>
        <turnip ref="turnip" :query="query"></turnip>
      </swiper-item>
      <swiper-item>
        <trade ref="trade" :query="query"></trade>
      </swiper-item>
    </swiper>
  </view>
  <uni-fab ref="fab" :pattern="{buttonColor: '#3FB984'}" horizontal="right" vertical="bottom" :popMenu="false" @fabClick="fabClick" />
</template>

<script>
  import { ref, computed, onMounted } from 'vue'
  import { mapGetters, useStore } from 'vuex'
  import useLogin from '@/composables/useLogin'
  import Board from '@/pages/community/board/Board.vue'
  import Turnip from '@/pages/community/turnip/Turnip.vue'
  import Trade from '@/pages/community/trade/Trade.vue'
  import { goPage } from '@/common/utils'

  export default {
    components: {
      Board,
      Turnip,
      Trade
    },
    inject: ['utils'],
    setup(props) {
      const query = ref('')
      const tabIndex = ref(0)
      const scrollInto = ref('')
      const tabBars = [
        { name: '森友墙', id: 'board' },
        { name: '菜市场', id: 'turnip' },
        { name: '交易区', id: 'trade' },
      ]
      const store = useStore()
      const userId = computed(() => store.getters.userId)
      const board = ref(null)
      const turnip = ref(null)
      const trade = ref(null)

      const switchTab = (index) => {
        if (tabIndex.value === index) {
          return;
        }
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

      const fabClick = () => {
        if (userId.value) {
          const type = tabBars[tabIndex.value].id
          goPage(`../../community/${type}/add-${type}/add-${type}`)
        } else {
          useLogin().goLogin('发布信息需要先登录，确定前往登录页面')
        }
      }
      
      onMounted(()=> {
        board.value.$refs.scrollList.changeScrollHeight()
        turnip.value.$refs.scrollList.changeScrollHeight()
        trade.value.$refs.scrollList.changeScrollHeight()
      })

      return {
        query,
        tabIndex,
        tabBars,
        scrollInto,
        ontabchange,
        ontabtap,
        switchTab,
        fabClick,
        board,
        turnip,
        trade
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
