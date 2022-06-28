<template>
  <toolbar-paging-list apiType="recipe" :listApi="listApi">
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
            <!-- <uni-tag v-if="isCollected" text="已拥有" size="small"
                customStyle="background-color: #8BC34A; color: #fff; border-color:#8BC34A;"></uni-tag> -->
          </view>
          <text class="info-price">{{ item.size }}</text>
        </view>
      </view>
    </template>
  </toolbar-paging-list>
</template>

<script>
import ToolbarPagingList from '@/components/ToolbarPagingList.vue'
import { getRecipes } from '@/request_api/recipe'

export default {
  components: {
    ToolbarPagingList,
  },
  inject: ['apiUrl', 'utils'],
  setup(props) {
    return {
      listApi: getRecipes,
    }
  },
}
</script>

<style lang="scss"></style>
