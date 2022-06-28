<template>
  <uni-card class="community-card" isShadow @click="goDetailFun">
    <view class="content-box">
      <view class="content-header">
        <text>{{ item.user.islandName }}</text>
        <text>|</text>
        <text>{{ item.exchangeType }}</text>
      </view>
      <text class="content-box-text">{{
        $filters.textFilter(item.detail, 50)
      }}</text>
      <view class="content-deal">
        <view v-if="item.isLineup" class="lineup">
          <view v-if="item.isAuto"
            ><text class="org-circle"> </text><text> 0 人在排</text></view
          >
          <view v-else
            ><text class="green-circle"> </text
            ><text>{{ item.maxPeople }} 个空位 </text>
          </view>
        </view>
        <view v-else class="contact">
          <text>{{
            $filters.textFilter(item.contact + '-' + item.contactDetail, 10)
          }}</text>
        </view>
        <view class="limit-time">
          <text class="iconfont icon-time"></text>
          <uni-countdown
            :show-day="false"
            :hour="$filters.countdown(item.validTime, 'h')"
            :minute="$filters.countdown(item.validTime, 'm')"
            :second="$filters.countdown(item.validTime, 's')"
            color="#666"
            splitorColor="#666"
          />
        </view>
        <uni-tag
          :text="
            item.isLineup ? (item.isAuto ? '立即排队' : '立即上岛') : '立即联系'
          "
          circle
          type="success"
          @click="goDetailFun"
        ></uni-tag>
      </view>
    </view>
  </uni-card>
  <view>
    <!-- 分享示例 -->
    <uni-popup ref="shareRef" background-color="#fff" type="share">
      <uni-popup-share></uni-popup-share>
    </uni-popup>
  </view>
</template>

<script>
import { ref, toRefs } from 'vue'
import useLike from '@/composables/useLike'
import { addTrade, getTrade } from '@/request_api/trade'

export default {
  name: 'BoardCard',
  inject: ['apiUrl', 'utils'],
  props: {
    item: {
      type: Object,
      default: null,
    },
    isDetail: {
      // 是否用于详情页
      type: Boolean,
      default: true,
    },
    refreshItem: {
      type: Function,
      default: null,
    },
    isDesign: {
      // 是否用于设计分享
      type: Boolean,
      default: false,
    },
  },
  emits: ['go-detail'],
  setup(props, { emit }) {
    const { item } = toRefs(props)
    const shareRef = ref(null)

    const { isLiked, addLike } = useLike(item, addTrade, () =>
      props.refreshItem(getTrade, item.value._id)
    )

    const share = () => {
      shareRef.value.open()
    }

    const goDetailFun = () => {
      if (!props.isDetail) {
        emit('go-detail')
      }
    }
    return {
      isLiked,
      addLike,
      shareRef,
      share,
      goDetailFun,
    }
  },
}
</script>

<style lang="scss">
// 森友墙卡片
.board-card {
  overflow: initial;

  .card-title {
    padding: 5rpx 0;
    display: flex;
    flex-direction: row;

    // border-bottom: 1px #eee solid;
    .title-img-box {
      position: absolute;
      top: -20rpx;
      width: 100rpx;
      height: 100rpx;
      background-color: white;
      border: 2rpx solid #bebebe;
      padding: 4rpx;
      border-radius: 20rpx;
    }

    .title-img {
      width: 100%;
      height: 100%;
      border-radius: 16rpx;
    }

    .title-info {
      display: flex;
      flex-direction: column;
      margin-left: 120rpx;

      text {
        font-size: 22rpx;
        line-height: 28rpx;
      }

      .sub-info {
        font-size: 18rpx;
        color: #999;
      }
    }
  }

  .design-title {
    display: block;
    font-size: 30rpx;
    margin-bottom: 15rpx;
    color: $uni-color-primary;
    font-weight: bold;
  }

  .image-box {
    /* #ifndef APP-NVUE */
    display: flex;
    flex-direction: row;
    /* #endif */
    height: 300rpx;
    justify-content: space-between;
    overflow: hidden;

    .image {
      /* #ifndef APP-NVUE */
      width: 100%;
      height: 100%;
      margin-left: 10rpx;
      margin-right: 10rpx;
      /* #endif */
      flex: 1;
      border-radius: 10rpx;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .content-box {
    padding-top: 20rpx;

    .content-box-text {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      line-height: 22px;
    }

    .topic {
      color: $uni-color-success;
    }
  }

  .card-actions {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 45px;
    border-top: 1px #eee solid;

    .card-actions-item {
      display: flex;
      flex-direction: row;
      align-items: center;

      .card-actions-item-text {
        font-size: 12px;
        color: #666;
        margin-left: 5px;
      }
    }
  }
}
</style>
