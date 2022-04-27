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
        <scroll-list :ref="el => {if (el) postListRefs[i] = el} " :designType="tab.id" :listApi="listApi" fullDomClass='.uni-swiper-wrapper' singleDomClass=".uni-list-item">
          <template #default="{ item, refreshList }">
            <design-item :item="item" :refreshFun="refreshList" :type="tab.id"></design-item>
          </template>
        </scroll-list>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
  import { ref, computed, onMounted, onBeforeUpdate } from 'vue'
  import DesignItem from '@/components/DesignItem.vue'
  import ScrollList from '@/components/ScrollList.vue'
  import { getDesignList } from '@/request_api/design'

  export default {
    components: {
      DesignItem,
      ScrollList
    },
    setup(props) {
      const tabIndex = ref(0)
      const scrollInto = ref('')

      const tabBars = [
        { name: '衣服', id: 'clothingDesign' },
        { name: '帽子', id: 'hatDesign' },
        { name: '图案', id: 'patternDesign' },
      ]
      const postListRefs = ref([])

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
        tabIndex,
        tabBars,
        postListRefs,
        scrollInto,
        listApi: getDesignList,
        switchTab,
        ontabtap,
        ontabchange
      };
    },
  }
</script>

<style lang="scss">

</style>
