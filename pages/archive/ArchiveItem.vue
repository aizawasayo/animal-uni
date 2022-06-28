<template>
  <view class="uni-list-cell bg-white" hover-class="uni-list-cell-hover">
    <view class="item-info">
      <view class="info-left">
        <image class="info-img" :src="imgSrc" lazy-load />
        <text class="info-name">{{ item.name }}</text>
      </view>
      <text class="info-price">{{ item.price }}</text>
    </view>
  </view>
</template>

<!-- <script>
import { computed } from 'vue'
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
</script> -->

<script setup>
import { computed, inject } from 'vue'

// 声明 props
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const apiUrl = inject('apiUrl')

const imgSrc = computed(() => {
  let src = `/static/noPhoto.png`
  if (props.item.photoSrc.length > 0) {
    src =
      typeof props.item.photoSrc[0] === 'string'
        ? `${apiUrl}${props.item.photoSrc[0]}`
        : `${apiUrl}${props.item.photoSrc[0].src}`
  }
  return src
})
</script>

<style lang="scss"></style>
