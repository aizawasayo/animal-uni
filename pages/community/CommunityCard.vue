<template>
  <uni-card class="community-card" isShadow spacing="15px" padding="0">
    <template v-slot:title>
      <view class="card-title">
        <view class="title-img-box">
          <image class="title-img" :src="apiUrl + itemDetail.user.avatar"></image>
        </view>
        <view class="title-info">
          <text>{{itemDetail.user.islandName}}-{{itemDetail.user.nickname}}</text>
          <view class="sub-info">
            <view class="limit-time">
              <text class="iconfont icon-time"></text>
              <uni-countdown :show-day="false" :hour="$filters.countdown(itemDetail.validTime, 'h')"
                :minute="$filters.countdown(itemDetail.validTime, 'm')"
                :second="$filters.countdown(itemDetail.validTime, 's')"
                color="#666"
                splitorColor="#666" />
            </view>
            <text class="title-splitor"> | </text>
            <text>累计登岛8人</text>
          </view>
        </view>
      </view>
    </template>
    <view class="content-box">
      <view class="content-list">
        <text>菜价：{{itemDetail.price}}</text>
        <text>类型：{{itemDetail.exchangeType}}</text>
        <text v-if="itemDetail.isLineup">排队模式： {{itemDetail.isAuto ? '自动叫号':'岛主手动叫号'}}</text>
        <text v-if="itemDetail.isLineup && itemDetail.isAuto">登岛人数：同时最多{{itemDetail.maxPeople}}人</text>
        <text v-if="itemDetail.isLineup && itemDetail.isAuto">登岛停留时间：{{itemDetail.maxTime}}分钟</text>
      </view>
      <view class="content-detail">{{$filters.textFilter(itemDetail.detail, 200)}}</view>
    </view>
  </uni-card>
</template>

<script>
  import { toRefs } from 'vue'
  export default {
    name: 'CommunityCard',
    inject: ['apiUrl'],
    props: ['type', 'itemDetail'],
    setup(props) {
      const { type } = toRefs(props)
    }
  }
</script>

<style lang="scss">
  .card-title {
    display: flex;
    flex-direction: row;
    margin-bottom: 20rpx;

    .title-img-box {
      width: 80rpx;
      height: 80rpx;
    }

    .title-img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    .title-splitor {
      padding: 0 15rpx;
    }

    .title-info {
      display: flex;
      flex-direction: column;
      margin-left: 20rpx;
      font-size: 24rpx;
      color: #666;

      .sub-info {
        display: flex;
        flex-direction: row;
        align-items: center;
      }
    }
  }

  .content-box {
    .content-list {
      display: flex;
      flex-direction: column;
    }

    .content-detail {
      margin-top: 20rpx;
    }
  }
</style>
