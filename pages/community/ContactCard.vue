<template>
  <uni-card isShadow spacing="15px" padding="0">
    <view class="content-box">
      <text class="light-text" v-if="itemDetail.isLineUp">前面还有6人{{ itemDetail.isAuto ? '正在排队' : '等待岛主叫号' }}</text>
      <text class="big-text" v-if="itemDetail.isLineUp">上岛密码：******</text>
      <text v-else class="big-text">联系TA：{{itemDetail.contact + '-' + itemDetail.contactDetail}}</text>
      <button size="mini" type="default" class="uni-success-bg contact-btn"
        @click="">{{itemDetail.isLineup ? (itemDetail.isAuto ? '立即排队' : '立即上岛') : '立即联系'}}</button>
    </view>
  </uni-card>
</template>

<script>
  import { toRefs } from 'vue'
  export default {
    name: 'ContactCard',
    props: ['type', 'itemDetail'],
    setup(props) {
      const { type } = toRefs(props)
    }
  }
</script>

<style lang="scss">
  .content-box {
    display: flex;
    flex-direction: column;
    text-align: center;

    .light-text {
      color: #999;
    }

    .big-text {
      font-size: 30rpx;
      line-height: 60rpx;
    }

    .contact-btn {
      width: 100%;
      height: 68rpx;
      line-height: 68rpx;
      border-radius: 34rpx;
    }
  }
</style>
