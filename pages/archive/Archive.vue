<template>
  <z-paging-swiper>
    <template #top>
      <z-tabs
        v-if="tabBars.length"
        ref="tabs"
        :list="tabBars"
        name-key="text"
        :tab-width="120"
        :bar-width="70"
        active-color="#3FB984"
        :current="currentTab"
        @change="tabsChange"
      />
      <view class="line-h"></view>
      <list-toolbar
        ref="toolbarRef"
        :apiType="apiType"
        :checkKey="checkKey"
        :checkVal="checkVal"
        :sortChange="sortChange"
      />
    </template>

    <swiper
      class="swiper"
      :current="currentTab"
      @animationfinish="animationfinish"
    >
      <swiper-item
        class="swiper-item"
        v-for="(tab, i) in tabBars"
        :key="tab.value + i"
      >
        <archive-list
          :ref="
            el => {
              if (el) archiveListRefs[i] = el
            }
          "
          :tabIndex="i"
          :currentIndex="currentTab"
          :apiType="apiType"
          :tabType="tab.value"
          :listApi="getListApi"
          :listParams="listParams"
          :filterParams="filterParams"
        >
        </archive-list>
      </swiper-item>
    </swiper>
  </z-paging-swiper>
  <filter-pop
    :listQuery="filterParams"
    :apiType="apiType"
    :marginTop="130"
    :reloadList="reloadList"
  />
</template>

<script>
import { ref, reactive, toRefs, computed, onMounted, onBeforeUpdate } from 'vue'
import ListToolbar from '@/components/ListToolbar.vue'
import FilterPop from '@/components/FilterPop.vue'
import ArchiveList from '@/pages/archive/ArchiveList.vue'
import useSwiperTabs from '@/composables/useSwiperTabs'
import useSort from '@/composables/useSort'
import useQuery from '@/composables/useQuery'
import { requestOption } from '@/common/get-options'
import { getClothingList } from '@/request_api/clothing'
import { getFurnitureList } from '@/request_api/furniture'

export default {
  props: {
    apiType: {
      type: String, // clothing || furniture
    },
  },
  components: {
    ListToolbar,
    ArchiveList,
    FilterPop,
  },
  setup(props) {
    const { apiType } = toRefs(props)
    const sort = ref({ name: 1 })
    const toolbarRef = ref(null)
    const archiveListRefs = ref([])

    const tabBars = ref([])

    const { query } = useQuery()

    const { sortString, checkKey, checkVal, sortChange } = useSort(
      sort,
      val => {
        sort.value = val
      }
    )

    const { currentTab, tabsChange, animationfinish } = useSwiperTabs()

    const filterParams = reactive({})
    const listParams = reactive({
      query,
      sort: sortString,
    })

    const getTabBars = async () => {
      const res = await requestOption({
        type: apiType.value === 'clothing' ? 'clothingType' : 'furnitureType',
        title: apiType.value === 'clothing' ? '服饰类型' : '家具类型',
        key: 'type',
      })

      tabBars.value = res.list
    }

    const reloadList = () => {
      archiveListRefs.value.forEach(ref => {
        ref.reloadList()
      })
    }

    onMounted(() => {
      getTabBars()
    })

    onBeforeUpdate(() => {
      archiveListRefs.value = []
    })

    return {
      apiType,
      query,
      listParams,
      filterParams,
      tabBars,
      toolbarRef,
      archiveListRefs,
      currentTab,
      tabsChange,
      animationfinish,
      checkKey,
      checkVal,
      sortChange,
      reloadList,
      getListApi: computed(() =>
        apiType.value !== 'clothing' ? getFurnitureList : getClothingList
      ),
    }
  },
}
</script>

<style lang="scss" scoped>
.uni-popup.top {
  /* #ifdef H5 */
  top: 130px !important;
  /* #endif */
  /* #ifndef H5 */
  top: 82px !important;
  /* #endif */
}
</style>
