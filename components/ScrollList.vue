<template>
  <scroll-view class="scroll-v uni-list" :style="'height:'+this.scrollHeight+'px'" enable-back-to-top scroll-y
    :lower-threshold="10" @scrolltolower="loadMore"
    refresher-enabled :refresher-triggered="isRefresh" @refresherrefresh="refreshList">
    <block v-for="item in list" :key="item._id">
      <slot :item="item" :refreshList="refreshList" :type="type"></slot>
    </block>
    <uni-load-more :status="status" :icon-size="16" :content-text="loadText" />
  </scroll-view>
</template>

<script>
  import { ref, reactive, toRefs, computed, watch } from 'vue'
  import useList from '@/composables/useList'
  import useScroll from '@/composables/useScroll'

  export default {
    name: "ScrollList",
    props: {
      type: {
        type: String,
      },
      query: {
        type: String,
        default: ''
      },
      singleDomClass: {
        type: String,
        required: true
      },
      topic: {
        type: String,
      },
      designType: {
        type: String
      },
      sortObj: {
        type: Object,
        default: { 'created_time': -1 }
      },
      topDomClass: {
        type: String,
      },
      fullDomClass: {
        type: String,
      },
      listApi: {
        type: Function
      }
    },
    setup(props, { attrs, slots }) {
      const { query, sortObj, topic, designType, topDomClass, fullDomClass, singleDomClass, listApi } = toRefs(props)

      const sort = computed(() => JSON.stringify(sortObj.value))

      const listQuery = reactive({
        query,
        page: 1,
        pageSize: 0,
        sort
      })

      const listProps = useList(
        listQuery,
        listApi.value,
        null,
        singleDomClass.value
      )

      const { scrollHeight, changeScrollHeight } = useScroll({
        fullDomClass: fullDomClass.value || null,
        topDomClass: topDomClass.value || null,
        listQuery,
        singleHeight: listProps.singleHeight,
      })

      watch(topic, val => {
        if (val) {
          listQuery['topic'] = val
          listQuery['page'] = 1
        }
      }, { immediate: true })
      
      // 设计分类查询
      watch(designType, val => {
        if (val && val !== null) {
          listQuery['type'] = val
          listQuery['page'] = 1
        }
      }, { immediate: true })
      

      return {
        listQuery,
        ...listProps,
        scrollHeight,
        changeScrollHeight
      };
    }
  }
</script>

<style lang="scss">

</style>
