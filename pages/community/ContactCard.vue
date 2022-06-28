<template>
  <uni-card isShadow spacing="15px" padding="0">
    <view class="content-box">
      <text class="light-text" v-if="itemDetail.isLineUp"
        >前面还有6人{{ itemDetail.isAuto ? '正在排队' : '等待岛主叫号' }}</text
      >
      <text class="big-text" v-if="itemDetail.isLineUp">上岛密码：******</text>
      <text v-else class="big-text"
        >联系TA：{{ itemDetail.contact + '-' + itemDetail.contactDetail }}</text
      >
      <button
        size="mini"
        type="default"
        class="uni-success-bg contact-btn"
        @click="dealBtn"
      >
        {{
          itemDetail.isLineup
            ? itemDetail.isAuto
              ? '立即排队'
              : '立即上岛'
            : '立即联系'
        }}
      </button>
    </view>
  </uni-card>
</template>

<script>
export default {
  name: 'ContactCard',
  props: ['itemDetail'],
  setup(props) {
    const dealBtn = () => {
      uni.showModal({
        content:
          '1.请勿将密码泄露给他人 2.每位森友一次只能加入一个岛屿 3.完成交易后，请一定要回到这里点击“离开岛屿”！',
        confirmText: '我知道啦！',
        success: e => {},
      })
    }
    return {
      dealBtn,
    }
  },
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
