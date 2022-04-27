<template>
  <view class="uni-list bg-white">
    <block v-for="item in list" :key="item._id">
      <guide-item :item="item"></guide-item>
    </block>
  </view>
  <uni-load-more :status="status" :icon-size="16" :content-text="loadText" />
</template>

<script>
  import { defineComponent, ref, reactive, toRefs, onMounted } from 'vue'
  // import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
  import GuideItem from '@/pages/guide/GuideItem.vue'
  import useList from '@/composables/useList'
  import useScroll from '@/composables/useScroll'
  import { getGuideList } from '@/request_api/guide'
  import { dateUtils } from '@/common/utils.js';

  export default defineComponent({
    name: 'GuideList',
    components: {
      GuideItem,
    },
    inject: ['apiUrl'],
    props: {
      query: {
        type: String,
        default: ''
      },
      fullDomClass: {
        type: String
      },
      topDomClass: {
        type: String
      }
    },
    setup(props) {
      const sortJson = { 'display_time': 1 }
      const { query, fullDomClass, topDomClass } = toRefs(props)

      const listQuery = reactive({
        query,
        page: 1,
        pageSize: 0,
        status: 'published',
        sort: JSON.stringify(sortJson),
      })

      // 列表请求返回数据及列表刷新方法
      const listProps = useList(
        listQuery,
        getGuideList,
        null,
        '.uni-list-cell'
      )

      const { changeScrollHeight } = useScroll({
        fullDomClass: fullDomClass.value || null,
        topDomClass: topDomClass.value || null,
        listQuery,
        singleHeight: listProps.singleHeight,
      })

      return {
        ...listProps,
        changeScrollHeight
      };
    },
  });
</script>

<style lang="scss">

</style>
