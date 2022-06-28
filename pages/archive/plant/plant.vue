<template>
  <toolbar-paging-list apiType="plant" :listApi="listApi">
    <template #default="{ item }">
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
          </view>
          <text class="info-price">{{ item.price }}</text>
        </view>
      </view>
    </template>
  </toolbar-paging-list>
</template>

<script>
import ToolbarPagingList from '@/components/ToolbarPagingList.vue'
import { getPlants } from '@/request_api/plant'

export default {
  components: {
    ToolbarPagingList,
  },
  inject: ['apiUrl', 'utils'],
  setup(props) {
    return {
      listApi: getPlants,
    }
  },
}
</script>

<style lang="scss"></style>
