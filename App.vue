<script>
export default {
  onLaunch: function () {
    // console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
    // console.log('App Launch')
    // this.$store.dispatch('app/getOptsByApi')
  },
  onShow: function () {
    // console.log('App Show')
    this.$store.dispatch('app/getSystemInfo')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
@import '@/static/iconfont.css';

/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/uni.css';
@import './common/animal.scss';

/* H5 兼容 pc 所需 */
/* #ifdef H5 */
@media screen and (min-width: 768px) {
  body {
    overflow-y: scroll;
  }
}

/* 顶栏通栏样式 */
/* .uni-top-window {
      left: 0;
      right: 0;
  } */
/* #endif */

page {
  background-color: #f5f5f5;
  height: 100%;
  font-size: 28rpx;
  // line-height: 1.8;
}

/* #endif*/
</style>
