<template>
  <uni-card class="board-card" isShadow padding="10px 0">
    <template v-slot:title>
      <view class="card-title uni-row">
        <view class="title-img-box">
          <image class="title-img" :src="apiUrl + item.user.avatar"></image>
        </view>
        <view class="title-info">
          <text>{{ item.user.nickname }}</text>
          <text></text>
          <uni-dateformat
            class="sub-info"
            :date="item.created_time * 1000"
          ></uni-dateformat>
          <text class="sub-info"
            >{{ item.user.position === 'north' ? '北半球' : '南半球' }}｜{{
              item.user.gameId
            }}</text
          >
        </view>
      </view>
    </template>
    <view class="uni-body" @click="goDetailFun">
      <text v-if="item.name" class="design-title">{{ item.name }}</text>
      <view v-if="item.photoSrc.length" class="image-box">
        <image
          v-for="(item1, index) in item.photoSrc.slice(0, 2)"
          class="image"
          mode="aspectFill"
          :src="apiUrl + item1.src"
          @click.stop="utils.previewImage(item.photoSrc, index, apiUrl)"
        />
      </view>
      <view class="content-box">
        <text class="content-box-text">{{ item.content }}</text>
        <text v-if="!item.name" class="topic"
          >#{{ item.topic ? item.topic : '不限话题' }}#</text
        >
      </view>
    </view>
    <template v-slot:actions v-if="!isDesign">
      <view slot="actions" class="card-actions">
        <view class="card-actions-item" @click.stop="addLike">
          <uni-icons
            type="heart"
            size="18"
            :color="isLiked ? '#3FB984' : '#999'"
          ></uni-icons>
          <text class="card-actions-item-text">{{
            item.likes.length ? item.likes.length : '赞'
          }}</text>
        </view>
        <view class="card-actions-item" @click="goDetailFun">
          <uni-icons type="chatbubble" size="18" color="#999"></uni-icons>
          <text class="card-actions-item-text">{{
            item.comments.length ? item.comments.length : '评论'
          }}</text>
        </view>
        <view class="card-actions-item" @click.stop="share">
          <uni-icons type="redo" size="18" color="#999"></uni-icons>
          <text class="card-actions-item-text">分享</text>
        </view>
      </view>
    </template>
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
import { addBoard, getBoard } from '@/request_api/board'

export default {
  name: 'BoardCard',
  inject: ['apiUrl', 'utils'],
  props: {
    item: {
      type: Object,
      default: null,
    },
    isDetail: {
      // 是否用于详情页, 模式是，用于列表页时需传 false
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

    const { isLiked, addLike } = useLike(item, addBoard, () =>
      props.refreshItem(getBoard, item.value._id)
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
