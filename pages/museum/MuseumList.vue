<template>
  <view :id="type+'-list-container'">
    <list-toolbar ref="toolbarRef" :type="type" :checkKey="checkKey" :checkVal="checkVal" :sortChange="sortChange">
    </list-toolbar>
    <scroll-view class="scroll-v uni-list" :style="'height:'+this.scrollHeight+'px'" enable-back-to-top scroll-y
      refresher-enabled :refresher-triggered="isRefresh" @refresherrefresh="refreshList" :lower-threshold="10"
      @scrolltolower="loadMore">
      <block v-for="(item, i) in list" :key="item._id">
        <museum-item :ref="el => {if (el) museumItemRefs[i] = el} " :item="item"
          :position="(type !== 'fossil' && type !== 'artwork') ? position : ''"
          :isShowTag="$attrs.isShowTag(item._id)" @click="itemClick(item._id, type, i)">
        </museum-item>
      </block>
      <uni-load-more :status="status" :icon-size="16" :content-text="loadText" />
    </scroll-view>

    <view v-if="type !== 'fossil' && type !== 'artwork'" class="position-toggle"
      :class="{posSouth :(position === 'south')}"
      @click="$emit('update:position', (position === 'north') ? 'south' : 'north')">
      <uni-icons type="map-pin-ellipse" size="28" color="#fff"></uni-icons>
      <text class="position-text">{{ position === 'north' ? '北' : '南' }}</text>
    </view>
    <!-- 筛选弹窗 -->
    <filter-pop :listQuery="listQuery" :type="type"></filter-pop>
  </view>
</template>

<script>
  import { ref, reactive, toRefs, computed, watch, onBeforeUpdate } from 'vue'
  // import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
  import MuseumItem from '@/pages/museum/MuseumItem.vue'
  import ListToolbar from '@/components/ListToolbar.vue'
  import FilterPop from '@/components/FilterPop.vue'
  import useList from '@/composables/useList'
  import useSort from '@/composables/useSort'
  import useScroll from '@/composables/useScroll'
  import { getFishes } from '@/request_api/fish'
  import { getInsects } from '@/request_api/insect'
  import { getHalobiosList } from '@/request_api/halobios'
  import { getFossils } from '@/request_api/fossil'
  import { getArtworkList } from '@/request_api/artwork'
  import { getUser, editUser } from '@/request_api/user'
  import { goPage } from '@/common/utils'

  export default {
    name: 'MuseumList',
    components: {
      MuseumItem,
      ListToolbar,
      FilterPop
    },
    inject: ['apiUrl'],
    emits: ['changeSort', 'update:position', 'changeTag'],
    props: {
      type: {
        type: String,
        required: true
      },
      query: {
        type: String,
        default: ''
      },
      sort: {
        type: Object,
      },
      position: {
        type: String,
        required: true,
        validator: function(value) {
          // 值必须匹配下列字符串中的一个
          return ['north', 'south'].indexOf(value) !== -1
        }
      },
      isTagMode: {
        type: Boolean,
        default: false
      },
    },
    setup(props, { emit, attrs }) {
      const { type, query, sort, isTagMode, position } = toRefs(props)

      const toolbarRef = ref(null)
      const museumItemRefs = ref([])
      const checkSort = ref(sort.value)

      const { sortString, checkKey, checkVal, sortChange } = useSort(checkSort, (val) => {
        emit('changeSort', val)
      })

      // 如果父组件的 sort 被改变了，判断这个排序字段是否包含在当前图鉴的排序字段列表里
      watch(sort, val => {
        if (toolbarRef.value.sortKeyArr.includes(Object.keys(val)[0])) {
          // 如果是同步改变本图鉴列表的排序值，否则不变
          checkSort.value = val
        }
      })

      const listQuery = reactive({
        query,
        page: 1,
        pageSize: 0,
        sort: sortString,
      })

      const getListApi = (t) => {
        let api = null
        switch (t) {
          case 'fish':
            api = getFishes
            break;
          case 'insect':
            api = getInsects
            break;
          case 'halobios':
            api = getHalobiosList
            break;
          case 'fossil':
            api = getFossils
            break;
          case 'artwork':
            api = getArtworkList
            break;
        }
        return api
      }
      // 列表请求返回数据及列表刷新方法
      const listProps = useList(
        listQuery,
        getListApi(type.value),
        null,
        '.uni-list-cell'
      )

      const { scrollHeight, changeScrollHeight } = useScroll({
        fullDomClass: '.uni-swiper-wrapper',
        topDomClass: '.list-toolbar',
        listQuery,
        singleHeight: listProps.singleHeight,
      })

      const itemClick = (id, type, index) => {
        if (isTagMode.value) {
          // changeTag(type, id)
          emit('changeTag', { type, id })
        } else {
          goPage(`/pages/museum/museum-detail/museum-detail?id=${id}&type=${type}&tabIndex=${attrs.listIndex}`)
        }
      }

      const getAllList = (callback) => {
        const currentList = listProps.allList.value
        callback(currentList)
      }

      onBeforeUpdate(() => {
        museumItemRefs.value = []
      })

      return {
        listQuery,
        ...listProps,
        scrollHeight,
        changeScrollHeight,
        toolbarRef,
        checkKey,
        checkVal,
        sortChange,
        museumItemRefs,
        itemClick,
        getAllList
      };
    },
  };
</script>

<style lang="scss">
  .position-toggle {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 160rpx;
    height: 80rpx;
    border-width: 2rpx;
    border-color: #fff;
    box-shadow: 0 0 10rpx rgba($color: #000000, $alpha: 0.2);
    color: #fff;
    background-color: #8BC34A;
    bottom: 200rpx;
    right: 40rpx;
    border-radius: 60rpx;
    z-index: 9;

    .position-text {
      color: #fff;
      width: 60rpx;
      text-align: center;
      font-size: 40rpx;
      text-shadow: 0 0 10rpx rgba($color: #000000, $alpha: 0.2);
    }
  }

  .posSouth {
    background-color: #3FB984;
  }
</style>
