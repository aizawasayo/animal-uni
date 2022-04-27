<template>
  <view class="uni-list-cell bg-white" hover-class="uni-list-cell-hover">
    <view class="item-info">
      <view class="info-left">
        <image v-if="item.photoSrc.length > 0" class="info-img"
          :src="`${apiUrl}${typeof item.photoSrc[0] === 'string' ? item.photoSrc[0] : item.photoSrc[0].src}`" />
        <image v-else class="info-img" src="../../static/noPhoto.png"></image>  
        <text class="info-name">{{ item.name }}</text>
      </view>
      <text class="info-price">{{ item.price }}</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'ArchiveItem',
    inject: ['apiUrl'],
    props: {
      item: {
        type: Object,
        required: true,
      },
    },
  }
</script>

<style lang="scss">
</style>
