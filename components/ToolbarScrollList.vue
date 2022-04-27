<template>
  <view class="wrapper">
    <list-toolbar ref="toolbarRef" :type="$attrs.type" :checkKey="checkKey" :checkVal="checkVal"
      :sortChange="sortChange">
    </list-toolbar>
    <scroll-view class="scroll-v uni-list" :style="'height:'+this.scrollHeight+'px'" enable-back-to-top scroll-y
      refresher-enabled :refresher-triggered="isRefresh" @refresherrefresh="refreshList" :lower-threshold="10"
      @scrolltolower="loadMore">
      <block v-for="item in list" :key="item._id">
        <slot :item="item" :refreshList="refreshList" :type="$attrs.type"></slot>
      </block>
      <uni-load-more :status="status" :icon-size="16" :content-text="loadText" />
    </scroll-view>
  </view>
  <filter-pop :listQuery="listQuery" :type="$attrs.type" :marginTop="88"></filter-pop>
</template>

<script>
  import { ref, toRefs, reactive, watch, onMounted } from 'vue'
  import ListToolbar from '@/components/ListToolbar.vue'
  import FilterPop from '@/components/FilterPop.vue'
  import useList from '@/composables/useList'
  import useSort from '@/composables/useSort'
  import useScroll from '@/composables/useScroll'
  import useFilter from '@/composables/useFilter'
  import queryMixin from '@/common/queryMixin'

  export default {
    name: "ToolbarScrollList",
    components: {
      ListToolbar,
      FilterPop
    },
    mixins: [queryMixin],
    setup(props, { attrs }) {
      const query = ref('')
      const sort = ref({ name: 1 })
      const toolbarRef = ref(null)

      const { checkSort, sortString, checkKey, checkVal, sortChange } = useSort(sort, val => {
        sort.value = val;
      })

      const listQuery = reactive({
        query,
        page: 1,
        pageSize: 0,
        sort: sortString,
      })

      const { filterOpts, filterChange, resetFilter } = useFilter(listQuery, attrs.type)

      // 列表请求返回数据及列表刷新方法
      const listProps = useList(
        listQuery,
        attrs.listApi,
        null,
        '.uni-list-cell'
      )

      const finishFilter = () => {
        toolbar.value.popVisible = false
      }

      const { scrollHeight, changeScrollHeight } = useScroll({
        fullDomClass: '.wrapper',
        topDomClass: '.list-toolbar',
        listQuery,
        singleHeight: listProps.singleHeight,
      })

      onMounted(() => {
        changeScrollHeight()
      })

      return {
        query,
        listQuery,
        ...listProps,
        scrollHeight,
        toolbarRef,
        checkKey,
        checkVal,
        sortChange,
      };
    },
  }
</script>

<style lang="scss">
  .uni-popup.top {
    top: 88px !important;
  }
</style>
