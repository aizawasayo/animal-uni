<template>
  <view>
    <scroll-view class="scroll-v uni-list" :style="{ height: scrollHeight+'px' }" enable-back-to-top scroll-y
      refresher-enabled :refresher-triggered="isRefresh" @refresherrefresh="refreshList" :lower-threshold="10"
      @scrolltolower="loadMore">
      <block v-for="(item, i) in list" :key="item._id">
        <archive-item :ref="el => {if (el) archiveItemRefs[i] = el} " :item="item"
          @click="utils.goPage(`/pages/archive/archive-detail/archive-detail?id=${item._id}&apiType=${$attrs.apiType}&tabIndex=${$attrs.listIndex}`)">
        </archive-item>
      </block>
      <uni-load-more :status="status" :icon-size="16" :content-text="loadText" />
    </scroll-view>
  </view>
</template>

<script>
  import { ref, reactive, toRefs, computed, watch, onBeforeUpdate } from 'vue'
  import ArchiveItem from '@/pages/archive/ArchiveItem.vue'
  import useList from '@/composables/useList'
  import useScroll from '@/composables/useScroll'
  import { getClothingList } from '@/request_api/clothing'
  import { getFurnitureList } from '@/request_api/furniture'

  export default {
    name: 'ArchiveList',
    components: {
      ArchiveItem,
    },
    inject: ['apiUrl', 'utils'],
    emits: ['changeSort'],
    props: {
      tabType: {
        type: String,
        required: true
      },
      filterParams: {
        type: Object
      },
      listParams: {
        type: Object
      },
    },
    setup(props, { attrs, emit }) {
      const { tabType, filterParams, listParams } = toRefs(props)

      const archiveItemRefs = ref([])

      const listQuery = reactive({
        type: [tabType.value],
        page: 1,
        pageSize: 0,
        ...toRefs(listParams.value)
      })

      watch(filterParams, val => {
        if (Object.keys(val).length > 1) {
          Object.keys(val).forEach(key => {
            listQuery[key] = val[key]
          })
        } else if (Object.keys(val).length === 1) {
          // 重置操作
          const defaultKeys = ['query', 'page', 'pageSize', 'sort', 'sortJson']
          Object.keys(listQuery).forEach(key => {
            if (!defaultKeys.includes(key)) {
              delete listQuery[key]
            }
          })
        }
      }, { deep: true })

      // 列表请求返回数据及列表刷新方法
      const listProps = useList(
        listQuery,
        attrs.apiType !== 'clothing' ? getFurnitureList : getClothingList,
        null,
        '.uni-list-cell'
      )

      const { scrollHeight, changeScrollHeight } = useScroll({
        fullDomClass: '.uni-swiper-wrapper',
        topDomClass: '.list-toolbar',
        // topDomClass: null,
        listQuery,
        singleHeight: listProps.singleHeight,
      })

      const getAllList = (callback) => {
        const currentList = listProps.allList.value
        // let index = currentList.findIndex(item => item._id === cid)
        // if ((index === 0 && switchType === 'prev')|| (index === currentList.length - 1 && switchType === 'next')) return uni.showToast({
        //   title: '没有更多了',
        //   icon: 'error'
        // })
        // const newId = switchType === 'prev' ? currentList[index - 1]._id : currentList[index + 1]._id
        callback(currentList)
      }

      onBeforeUpdate(() => {
        archiveItemRefs.value = []
      })

      return {
        ...listProps,
        scrollHeight,
        changeScrollHeight,
        archiveItemRefs,
        getAllList
      };
    },
  };
</script>

<style lang="scss">
</style>
