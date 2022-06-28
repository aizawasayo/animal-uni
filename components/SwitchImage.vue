<template>
  <view class="image-main radius-box">
    <uni-icons
      type="left"
      size="40"
      color="#ddd"
      @click="$emit('switchItem', 'prev')"
    ></uni-icons>
    <image
      :src="imageUrl"
      @click.stop="utils.previewImage(imageUrl)"
      mode="aspectFit"
      class="image"
    />
    <uni-icons
      type="right"
      size="40"
      color="#ddd"
      @click="$emit('switchItem', 'next')"
    ></uni-icons>
  </view>
</template>

<script>
import { toRefs } from 'vue'

export default {
  name: 'SwitchImage',
  inject: ['utils'],
  emits: ['switchItem'],
  props: {
    imageUrl: {
      type: String,
    },
    // detailType: {
    //   // 属于什么内容的详情页，博物馆/图鉴
    //   type: String,
    //   validator: function (value) {
    //     // 值必须匹配下列字符串中的一个
    //     return ['museum', 'archive'].indexOf(value) !== -1
    //   },
    // },
    cId: {
      type: String,
    },
  },
  setup(props, { emit }) {},
}
</script>

<style lang="scss">
.image-main {
  display: flex;
  align-items: center;
  margin-top: 30rpx;
  height: 250rpx;

  .image {
    width: 100%;
    height: 100%;
  }
}
</style>
