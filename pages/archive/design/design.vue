<template>
  <view class="tabs">
    <scroll-view class="tab-bar scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
      <view v-for="(tab, index) in tabBars" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index"
        @click="ontabtap">
        <text class="uni-tab-item-title" :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
      </view>
    </scroll-view>
    <view class="line-h"></view>
    <swiper :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="300" @change="ontabchange">
      <swiper-item v-for="(tab, index1) in tabBars" :key="index1">
        <scroll-list :ref="el => { if (el) scrollListRefs[index1] = el }" :designType="tab.id" :query="query"
          :listApi="listApi"
          fullDomClass='.uni-swiper-wrapper' singleDomClass=".board-card">
          <template #default="{ item, refreshList }">
            <board-card :item="item" :isDetail="false" :refreshFun="refreshList"
              @go-detail="utils.goPage('/pages/archive/design-detail/design-detail?id=' + item._id)"></board-card>
          </template>
        </scroll-list>
      </swiper-item>

    </swiper>
  </view>
  <uni-fab ref="fab" :pattern="{buttonColor: '#3FB984'}" horizontal="right" vertical="bottom" :popMenu="false"
    @fabClick="fabClick" />
</template>

<script>
  import { ref, computed, onMounted, onBeforeUpdate } from 'vue'
  import { mapGetters, useStore } from 'vuex'
  import { getDesignList } from '@/request_api/design'
  import ScrollList from '@/components/ScrollList.vue'
  import BoardCard from '@/pages/community/board/BoardCard.vue'
  import { goPage } from '@/common/utils'

  export default {
    components: {
      ScrollList,
      BoardCard
    },
    inject: ['utils'],
    setup(props) {
      const query = ref('')
      const tabIndex = ref(0)
      const scrollInto = ref('')
      const tabBars = [
        { name: '衣服', id: 'clothingDesign' },
        { name: '帽子', id: 'hatDesign' },
        { name: '图案', id: 'patternDesign' },
      ]

      const store = useStore()
      const userId = computed(() => store.getters.userId)
      const scrollListRefs = ref([])

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
          goPage(`../add-design/add-design?type=` + type)
        } else {
          useLogin().goLogin('发布信息需要先登录，确定前往登录页面')
        }
      }

      onMounted(() => {
        tabBars.forEach((tab, i) => {
          scrollListRefs.value[i].changeScrollHeight()
        })
      })

      onBeforeUpdate(() => {
        scrollListRefs.value = []
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
        scrollListRefs,
        listApi: getDesignList
      }
    },
    // mounted() {
    //   this.tabBars.forEach((tab, i) => {
    //     this.$refs.scrollListRefs[i].changeScrollHeight()
    //   })
    // }
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
