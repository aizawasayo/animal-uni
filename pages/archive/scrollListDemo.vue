<template>
  <view>
    <scroll-view
      show-scrollbar="true"
      style="height: 500px"
      scroll-y="true"
      :refresher-enabled="isOpenRefresh"
      :refresher-triggered="triggered"
      :refresher-threshold="100"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      @refresherabort="onAbort"
      @scrolltolower="loadMore">
      <view v-if="!isOpenRefresh">别拉了，没有更多了~</view>
      <view class="item" v-for="(item, index) in dataList" :key="index">{{ item }}</view>
    </scroll-view>
  </view>
</template>

<script>
  import { ref } from 'vue';
  import { getIslanders } from '@/request_api/islander'
  export default {
    setup() {
      const triggered = ref(false) // 是否触发下拉刷新
      const dataList = ref([])
      const page = ref(0)
      const isOpenRefresh = ref(true)
      const isFreshing = ref(false) // 是否正在请求数据中
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
        28, 29, 30
      ]

      const dealArray = (array, groupNum) => {
        let temp = [];
        for (let i = 0, len = array.length; i < len; i += groupNum) {
          temp.push(array.slice(i, i + groupNum));
        }
        return temp;
      }

      const getData = () => {
        // 前端模拟分页
        let temp = dealArray(arr, 5)
        if (page.value > temp.length - 1) {
          isOpenRefresh.value = false
          return
        }
        dataList.value.push(...temp[page.value])
      }

      // 自定义下拉刷新控件被下拉
      const onPulling = e => {
        console.log(1, "onpulling", e.detail.deltaY);
        if (e.detail.deltaY < 0) return // 防止上滑页面也触发下拉
        triggered.value = true;
      }
      // 自定义下拉刷新被触发
      const onRefresh = () => {
        console.log(2, 'onRefresh')
        if (isFreshing.value) return;
        isFreshing.value = true;
        page.value++;
        setTimeout(() => {
          triggered.value = false;
          isFreshing.value = false;
          getData();
        }, 500);
      }
      // 自定义下拉刷新被复位
      const onRestore = () => {
        triggered.value = 'restore'; // 需要重置
        console.log(3, "onRestore");
      }
      // 自定义下拉刷新被中止
      const onAbort = () => {
        console.log("onAbort");
      }

      const loadMore = () => {
        if (listLoading.value) return
        const totalPage = Math.ceil(total.value / pageSize.value)
        // 如果下一页的页码值大于总页数直接return
        if (page.value + 1 > totalPage || total.value <= pageSize.value) return status.value = 'noMore'

        listQuery.page = listQuery.page + 1
      }

      return {
        triggered,
        dataList,
        page,
        isOpenRefresh, // 是否开启下拉
        isFreshing,
        dealArray,
        getData,
        onPulling,
        onAbort,
        onRefresh,
        onRestore,
        loadMore,
      };
    },
    onLoad() {
      this._freshing = false;
      this.getData()
    },
  };
</script>

<style lang="scss">
  view {
    text-align: center;
  }

  .item {
    line-height: 100px;
  }

  .item:nth-child(odd) {
    background-color: antiquewhite;
  }

  .item:nth-child(even) {
    background-color: aquamarine;
  }
</style>
