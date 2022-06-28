<template>
  <scroll-view
    class="scroll-v uni-list"
    enable-back-to-top
    scroll-y
    :lower-threshold="10"
    @scrolltolower="loadMore"
    refresher-enabled
    :refresher-triggered="isRefresh"
    @refresherrefresh="refreshList"
  >
    <block v-for="item in list" :key="item._id">
      <slot :item="item" :type="type"></slot>
    </block>
    <uni-load-more :status="status" :icon-size="16" :content-text="loadText" />
  </scroll-view>
</template>

<script>
import { reactive, toRefs, computed, watch } from 'vue'
import { useStore } from 'vuex'
import useList from '@/composables/useList'

export default {
  name: 'ScrollList',
  props: {
    type: {
      type: String,
    },
    query: {
      type: String,
      default: '',
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    topic: {
      type: String,
    },
    designType: {
      type: String,
    },
    sortObj: {
      type: Object,
      default: { created_time: -1 },
    },
    listApi: {
      type: Function,
    },
    isGuide: {
      type: Boolean,
      default: false,
    },
    onlyUser: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs, slots }) {
    const {
      query,
      pageSize,
      sortObj,
      topic,
      designType,
      listApi,
      isGuide,
      onlyUser,
    } = toRefs(props)
    const store = useStore()
    const sort = computed(() => JSON.stringify(sortObj.value))
    const userId = computed(() => store.getters.userId)

    const listQuery = reactive({
      query,
      page: 1,
      pageSize,
      sort,
    })

    const listProps = useList({
      listQuery,
      getListApi: listApi.value,
    })

    watch(
      isGuide,
      val => {
        if (val) listQuery['status'] = 'published'
      },
      { immediate: true }
    )

    watch(
      onlyUser,
      val => {
        if (val) listQuery['user'] = userId.value
      },
      { immediate: true }
    )

    watch(
      topic,
      val => {
        if (val) {
          listQuery['topic'] = val
          listQuery['page'] = 1
        }
      },
      { immediate: true }
    )

    // 设计分类查询
    watch(
      designType,
      val => {
        if (val && val !== null) {
          listQuery['type'] = val
          listQuery['page'] = 1
        }
      },
      { immediate: true }
    )

    return {
      listQuery,
      ...listProps,
    }
  },
}
</script>

<style lang="scss"></style>
