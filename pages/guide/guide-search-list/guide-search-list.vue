<template>
  <view class="wrapper">
    <view v-if="isHistory" class="history-box">
      <view class="history-title">
        <text>搜索历史</text>
        <text class="uni-icon uni-icon-trash" @click="clearSearch"></text>
      </view>
      <view class="history-content">
        <view class="history-item" v-for="(item, index) in historyList" :key="index" @click="historyListTap(item)">
          {{ item }}
        </view>
      </view>
    </view>
    <view v-else>
      <guide-list ref="guideListRef" :query="query" fullDomClass=".wrapper"></guide-list>
    </view>
  </view>
</template>

<script>
  import { defineComponent, ref, computed, unref, onMounted, nextTick } from 'vue'
  import {
    onNavigationBarSearchInputChanged,
    onNavigationBarSearchInputConfirmed,
    onNavigationBarButtonTap,
    onPullDownRefresh,
    onReachBottom
  } from '@dcloudio/uni-app'
  import { setHistory, removeHistory } from '@/common/utils'
  import GuideList from '@/pages/guide/GuideList.vue'

  export default defineComponent({
    name: 'GuideSearchList',
    components: { GuideList },
    setup() {
      const query = ref('')
      const historyList = ref([])
      // 是否显示搜索历史记录，通过判断是否存在历史记录来获取
      const isHistory = ref(false)
      const guideListRef = ref(null)
      
      /*
      1. 跳转到搜索列表页面时，如有搜索记录就显示记录
      2. 点击搜索记录某项就搜索某项(搜索框显示该项 https://ask.dcloud.net.cn/article/35374)
      */
      /* 历史记录列表点击 */
      const historyListTap = (item) => {
        isHistory.value = false
        query.value = item
      }

      /* 清理历史搜索数据 */
      const clearSearch = () => {
        uni.showModal({
          title: '提示',
          content: '是否清理全部搜索历史？该操作不可逆。',
          success: res => {
            if (res.confirm) {
              historyList.value = removeHistory();
              isHistory.value = false
            }
          }
        });
      }

      onMounted(() => {
        guideListRef.value.changeScrollHeight()
        nextTick(() => {
          // 仅在整个视图(包括子组件)都被渲染之后才会运行的代码
        })
      })

      /* 当 searchInput 输入时触发*/
      onNavigationBarSearchInputChanged(e => {
        isHistory.value = false
        query.value = e.text
      })

      /* 点击软键盘搜索按键触发 */
      onNavigationBarSearchInputConfirmed((e) => {
        let text = e.text;
        if (!text) {
          uni.showModal({
            title: '提示',
            content: '请输入内容。',
            success: res => {
              if (res.confirm) {
                historyList.value = uni.getStorageSync('search:history')
                if (historyList.value.length !== 0) isHistory.value = true
              }
            }
          });
          return;
        } else {
          setHistory(text)
          query.value = text
          isHistory.value = false
          historyList.value = uni.getStorageSync('search:history')
        }
      })

      onReachBottom(() => {
        unref(guideListRef).loadMore()
      })
      onPullDownRefresh(() => {
        guideListRef.value.refreshList()
      })

      return {
        query,
        historyList,
        isHistory,
        guideListRef,
        clearSearch,
        historyListTap,
        sortObj: { 'display_time': 1 }
      };
    },
    onLoad() {
      this.historyList = uni.getStorageSync('search:history');
      if (this.historyList.length !== 0) this.isHistory = true
    }
  });
</script>

<style lang="scss">
  .history-title {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 30rpx;
    padding-bottom: 0;
    font-size: 34rpx;
    color: #333;
  }

  .history-title .uni-icon {
    font-size: 40rpx;
  }

  .history-content {
    display: flex;
    flex-wrap: wrap;
    padding: 15rpx;
  }

  .history-item {
    padding: 4rpx 35rpx;
    border: 1px #f1f1f1 solid;
    background: #fff;
    border-radius: 50rpx;
    margin: 12rpx 10rpx;
    color: #999;
  }

  .history-list-box {
    /* margin: 10rpx 0; */
  }

  .history-list-item {
    padding: 30rpx 0;
    margin-left: 30rpx;
    border-bottom: 1px #EEEEEE solid;
    font-size: 28rpx;
  }
</style>
