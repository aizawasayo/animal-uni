<template>
  <view class="padd-container">
    <view class="uni-flex archive-box radius-box">
      <view class="archive-link" @click="goLink('furniture')">
        <image src="../../../static/images/icon-furniture.png"></image>
        <text>家具</text>
      </view>
      <view class="archive-link" @click="goLink('clothing')">
        <image src="../../../static/images/icon-clothing.png"></image>
        <text>服饰</text>
      </view>
      <view class="archive-link" @click="goLink('islander')">
        <image src="../../../static/images/icon-islander.png"></image>
        <text>岛民</text>
      </view>
      <view class="archive-link" @click="goLink('plant')">
        <image src="../../../static/images/icon-plant.png"></image>
        <text>植物</text>
      </view>
      <view class="archive-link" @click="goLink('material')">
        <image src="../../../static/images/icon-material.png"></image>
        <text>素材</text>
      </view>
      <view class="archive-link" @click="goLink('tool')">
        <image src="../../../static/images/icon-tool.png"></image>
        <text>工具</text>
      </view>
      <view class="archive-link" @click="goLink('recipe')">
        <image src="../../../static/images/icon-diy.png"></image>
        <text>DIY配方</text>
      </view>
      <view class="archive-link" @click="goLink('record')">
        <image src="../../../static/images/icon-record.png"></image>
        <text>唱片</text>
      </view>
      <view class="archive-link">
        <image src="../../../static/images/icon-facility.png"></image>
        <text>设施</text>
      </view>
    </view>
    <view class="func-box radius-box">
      <view class="uni-flex func-title">
        <uni-icons type="vip-filled" size="22" color="#8BC34A"></uni-icons>
        <text>特色板块</text>
      </view>
      <view class="uni-flex func-content">
        <view class="func-item" @click="utils.goPage('/pages/archive/upload/upload')">
          <text class="func-cont-title1 color-green">大头菜预测</text>
          <text class="func-cont-title2">迅速致富全靠它</text>
          <image src="../../../static/images/forecast.png"></image>
        </view>
        <view class="func-item">
          <text class="func-cont-title1 color-purple">找呀找朋友</text>
          <text class="func-cont-title2">村民交友互助</text>
          <image src="../../../static/images/make-friends.png"></image>
        </view>
        <view class="func-item" @click="utils.goPage('/pages/archive/design/design')">
          <text class="func-cont-title1 color-blue">设计分享板</text>
          <text class="func-cont-title2">DIY服饰绝绝子</text>
          <image src="../../../static/images/design1.png"></image>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import { ref } from 'vue'
  import { goPage } from '@/common/utils'

  export default {
    components: {},
    inject: ['utils'],
    setup() {
      const goLink = (type) => {
        goPage(`/pages/archive/${type}/${type}`)
      }
      return {
        goLink
      }
    }
  }
</script>
<style lang="scss">
  .archive-box {
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-top: 30rpx;
    padding: 30rpx 15rpx;

    .archive-link {
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;

      image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
      }

      text {
        display: block;
        text-align: center;
        line-height: 60rpx;
      }
    }
  }
  .func-box {
     padding: 15rpx 15rpx;
    .func-title {
      align-items: center;
      border-bottom: 2rpx solid #EEEEEE;
      text {
        margin-left: 10rpx;
        font-size: 32rpx;
      }
    }
  }
  .func-content {
    width: 100%;
    margin: 20rpx 0;
      
    .func-item {
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: center;
      .func-cont-title1 {
        font-size: 32rpx;
      }
      .func-cont-title2 {
        color: #999;
        font-size: 24rpx;
      }
      text {
        display: block;        
      }
      image {
        width: 150rpx;
        height: 150rpx;
      }
    }
  }
</style>
