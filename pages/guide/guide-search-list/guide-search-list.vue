<template>
  <view v-if="isHistory" class="history-box">
    <view v-if="historyList.length > 0">
      <view class="history-title">
        <text>搜索历史</text>
        <text class="uni-icon uni-icon-trash" @click="clearSearch"></text>
      </view>
      <view class="history-content">
        <view
          class="history-item"
          v-for="(item, index) in historyList"
          :key="item + index"
          @click="() => historyTap(item)"
        >
          {{ item }}
        </view>
      </view>
    </view>
    <view v-else class="no-data">您还没有历史记录</view>
  </view>
  <guide-list
    v-else
    ref="guideSearchListRef"
    :query="query"
    :pageSize="9"
    @list-tap="listTap"
  ></guide-list>
</template>

<script>
import { defineComponent, ref } from 'vue'
import {
  onNavigationBarSearchInputChanged,
  onNavigationBarSearchInputConfirmed,
  onLoad,
} from '@dcloudio/uni-app'
import { setHistory, removeHistory } from '@/common/utils'
import GuideList from '@/pages/guide/GuideList.vue'

export default defineComponent({
  name: 'GuideSearchList',
  components: { GuideList },
  setup() {
    const historyList = ref([])
    const isHistory = ref(true)
    const query = ref('')

    const guideSearchListRef = ref(null)

    // 历史记录点击
    const historyTap = text => {
      isHistory.value = false
      query.value = text
    }

    //  列表点击
    const listTap = () => {
      // 如果当前是历史搜索页面 ，那么点击不储存,直接 跳转
      if (isHistory.value) {
        return
      } else {
        isHistory.value = true
        // 去做一些相关搜索功能 ，这里直接返回到上一个页面
        // 点击列表存储搜索数据
        setHistory(query.value)
        // uni.navigateBack()
      }
    }

    // 清理历史搜索数据
    const clearSearch = () => {
      uni.showModal({
        title: '提示',
        content: '是否清理全部搜索历史？该操作不可逆。',
        success: res => {
          if (res.confirm) {
            historyList.value = removeHistory()
          }
        },
      })
    }

    // 当 searchInput 输入时触发
    onNavigationBarSearchInputChanged(e => {
      let text = e.text
      if (!text) {
        isHistory.value = true
        historyList.value = []
        historyList.value = uni.getStorageSync('search:history')
        return
      } else {
        isHistory.value = false
        // 关键字搜索
        query.value = e.text
      }
    })

    // 点击软键盘搜索按键触发
    onNavigationBarSearchInputConfirmed(e => {
      let text = e.text
      if (!text) {
        isHistory.value = true
        historyList.value = []
        historyList.value = uni.getStorageSync('search:history')
        uni.showModal({
          title: '提示',
          content: '请输入内容。',
          success: res => {},
        })
        return
      } else {
        setHistory(text)
      }
    })

    onLoad(() => {
      historyList.value = uni.getStorageSync('search:history')
    })

    return {
      query,
      historyList,
      isHistory,
      guideSearchListRef,
      clearSearch,
      listTap,
      historyTap,
    }
  },
})
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
  border-bottom: 1px #eeeeee solid;
  font-size: 28rpx;
}

.no-data {
  text-align: center;
  color: #999;
  margin: 100rpx;
}
</style>
