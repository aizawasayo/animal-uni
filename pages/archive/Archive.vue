<template>
  <view v-if="typeList.length" class="tabs">
    <scroll-view class="tab-bar scroll-h" :scroll-x="true" :show-scrollbar="false">
      <view v-for="(tab, index) in typeList" :key="tab.value + index" class="uni-tab-item"
        :data-current="index" @click="ontabtap">
        <text class="uni-tab-item-title"
          :class="tabIndex==index ? 'uni-tab-item-title-active' : ''">{{tab.text}}</text>
      </view>
    </scroll-view>
    <view class="line-h"></view>
    <list-toolbar ref="toolbarRef" :type="apiType" :checkKey="checkKey" :checkVal="checkVal" :sortChange="sortChange">
    </list-toolbar>
    <swiper :current="tabIndex" class="swiper-box" style="flex: 1;" :duration="300" @change="ontabchange">
      <swiper-item class="swiper-item" v-for="(tab, index1) in typeList" :key="index1">
        <!-- #ifndef APP-NVUE -->
        <archive-list :ref="el => { if (el) archiveListRefs[index1] = el }" :apiType="apiType" :tabType="tab.value"
          :filterParams="filterObj" :listParams="listParams" :listIndex="index1">
        </archive-list>
        <!-- #endif -->
      </swiper-item>
    </swiper>
  </view>
  <!-- 筛选弹窗 -->
  <filter-pop :listQuery="filterObj" :type="apiType" :marginTop="130"></filter-pop>
</template>

<script>
  import { ref, reactive, toRefs, watch, onMounted, onUpdated, onBeforeUpdate } from 'vue'
  import ListToolbar from '@/components/ListToolbar.vue'
  import FilterPop from '@/components/FilterPop.vue'
  import ArchiveList from '@/pages/archive/ArchiveList.vue'
  import useSort from '@/composables/useSort'
  import queryMixin from '@/common/queryMixin'
  import { requestOption } from '@/common/get-options'

  export default {
    props: {
      apiType: {
        type: String
      }
    },
    components: {
      ListToolbar,
      ArchiveList,
      FilterPop
    },
    mixins: [queryMixin],
    setup(props) {
      const { apiType } = toRefs(props)
      const query = ref('')
      const sort = ref({ name: 1 })
      const tabIndex = ref(0)
      const toolbarRef = ref(null)
      const archiveListRefs = ref([])

      const typeList = ref([])

      const { sortString, checkKey, checkVal, sortChange } = useSort(sort, (val) => {
        sort.value = val;
      })

      const filterObj = reactive({})

      const listParams = reactive({
        query,
        sort: sortString,
      })

      const getTypeList = async () => {
        if (apiType.value === 'clothing') {
          const res = await requestOption({ type: 'clothingType', title: '服饰类型', key: 'type' })
          typeList.value = res.list
        } else {
          const res = await requestOption({ type: 'furnitureType', title: '家具类型', key: 'type' })
          typeList.value = res.list
        }
      }

      const switchTab = index => {
        if (tabIndex.value === index) {
          return;
        }

        tabIndex.value = index;
      }

      const ontabtap = e => {
        let index = e.target.dataset.current || e.currentTarget.dataset.current;
        switchTab(index);
      }

      const ontabchange = e => {
        let index = e.target.current || e.detail.current;
        switchTab(index);
      }

      onMounted(() => {
        getTypeList()
      })

      onUpdated(() => {
        typeList.value.forEach((tab, i) => {
          archiveListRefs.value[i].changeScrollHeight()
        })
      })

      onBeforeUpdate(() => {
        archiveListRefs.value = []
      })

      return {
        apiType,
        query,
        filterObj,
        listParams,
        typeList,
        tabIndex,
        toolbarRef,
        archiveListRefs,
        switchTab,
        ontabtap,
        ontabchange,
        checkKey,
        checkVal,
        sortChange
      };
    },
  }
</script>

<style lang="scss">
  .uni-popup.top {
    top: 130px !important;
  }
</style>
