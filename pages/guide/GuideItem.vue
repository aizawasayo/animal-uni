<template>
  <view class="uni-list-cell" hover-class="uni-list-cell-hover"
    @click="utils.goPage('/pages/guide/guide-detail/guide-detail?id=' + item._id)">
    <view class="uni-media-list uni-pull-right">
      <image class="uni-media-list-logo" :src="apiUrl + item.image_uri"></image>
      <view class="uni-media-list-body">
        <view class="uni-media-list-text-top"><text class="guideType">[{{item.type}}]</text>{{ item.title }}</view>
        <view class="uni-media-list-text-bottom">
          <view class="guideAuthor">
            <image v-if="item.author && item.author.avatar" :src="apiUrl + item.author.avatar" class="guideAvatar" />
            <text class="guideAuthorName">{{ item.author && item.author.nickname && item.author.nickname }}</text>
          </view>
          <uni-dateformat :date="item.created_time * 1000" format="yyyy/MM/dd"></uni-dateformat>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'GuideItem',
    inject: ['apiUrl', 'utils'],
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
  }
</script>

<style lang="scss">
  .uni-media-list-logo {
    width: 180rpx;
    height: 140rpx;
    border-radius: 10rpx;
  }

  .uni-media-list-body {
    height: auto;
    justify-content: space-around;
  }

  .uni-media-list-text-top {
    height: 74rpx;
    font-size: 28rpx;
    overflow: hidden;
  }

  .uni-media-list-text-bottom {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .guideType {
    color: #80DEEA;
    margin-right: 10rpx;
  }

  .guideAuthor {
    display: flex;
    align-items: center;
  }

  .guideAuthorName {
    color: #BDBDBD;
  }

  .guideAvatar {
    width: 30rpx;
    height: 30rpx;
    border-radius: 30rpx;
    margin-right: 10rpx;
  }
</style>
