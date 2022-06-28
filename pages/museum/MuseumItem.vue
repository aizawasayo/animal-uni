<template>
  <view class="uni-list-cell bg-white" hover-class="uni-list-cell-hover">
    <view class="item-info">
      <view class="info-left">
        <image
          class="info-img"
          :src="`${apiUrl}${
            typeof item.photoSrc === 'string'
              ? item.photoSrc
              : item.photoSrc[0].src
          }`"
        />
        <text class="info-name">{{ item.name }}</text>
        <uni-tag
          v-if="isOnMonth"
          text="当前可捉"
          size="small"
          custom-style="background-color: #FFA726; color: #fff; border-color:#FFA726; "
        ></uni-tag>
        <uni-tag
          v-if="isGoNextM"
          text="次月下线"
          size="small"
          customStyle="background-color: #f3715c; color: #fff; border-color:#f3715c;"
        ></uni-tag>
        <uni-tag
          v-if="item.hasFake"
          text="有赝品"
          size="small"
          customStyle="background-color: #F44336; color: #fff; border-color:#F44336;"
        ></uni-tag>
        <uni-tag
          v-if="$attrs.isShowTag"
          text="已拥有"
          size="small"
          customStyle="background-color: #8BC34A; color: #fff; border-color:#8BC34A;"
        ></uni-tag>
      </view>
      <text class="info-price">{{ item.price }}</text>
    </view>
  </view>
</template>

<script>
import { computed, toRefs } from 'vue'
import { getMonthStr } from '@/common/utils'

export default {
  name: 'MuseumItem',
  inject: ['apiUrl'],
  props: {
    item: {
      type: Object,
      required: true,
    },
    position: {
      type: String,
    },
  },
  setup(props, { attrs }) {
    const { item, position } = toRefs(props)

    const isOnMonth = computed(
      () =>
        position.value &&
        getMonthStr().isOnMonth(item.value.activeTime[position.value])
    )
    const isGoNextM = computed(
      () =>
        position.value &&
        getMonthStr().isGoNextM(item.value.activeTime[position.value])
    )

    return {
      isOnMonth,
      isGoNextM,
    }
  },
}
</script>

<style lang="scss" scoped>
.info-img {
  width: 80rpx;
  height: 80rpx;
  margin-right: 20rpx;
}
.uni-tag {
  margin-right: 10rpx;
}
</style>
