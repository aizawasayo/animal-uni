<template>
  <toolbar-scroll-list type="islander" :listApi="listApi">
    <template #default="{ item, refreshList }">
      <view class="uni-list-cell bg-white" hover-class="uni-list-cell-hover" @click="utils.goPage('/pages/archive/scrollListDemo')">
        <view class="item-info">
          <image class="info-img" :src="`${apiUrl}${item.photoSrc}`" />
          <view class="info-left">
            <view class="info-name">
              <text class="islander-name">{{ item.name }} </text>
              <text class="islander-sex"
                :style="{color: (item.sex === 0) ? '#ffc0cb':'#80DEEA'}">{{ (item.sex === 0) ? '♀' : '♂' }}</text>
            </view>
            <text class="islander-motto">{{ item.character }} - {{ item.motto }}</text>
          </view>
          <view class="info-right">
            <text class="islander-breed">{{ item.breed }}</text>
            <text class="islander-birth">{{ item.birth }}</text>
          </view>
        </view>
      </view>
    </template>
  </toolbar-scroll-list>
</template>

<script>
  import ToolbarScrollList from '@/components/ToolbarScrollList.vue'
  import { getIslanders } from '@/request_api/islander'

  export default {
    components: {
      ToolbarScrollList
    },
    inject: ['apiUrl', 'utils'],
    setup(props) {
      return {
        listApi: getIslanders
      };
    }
  }
</script>

<style lang="scss">
  .item-info {
    display: flex;
    flex-direction: row;
    flex: 1;
    align-items: center;
    padding: 20rpx 30rpx;
  }

  .info-img {
    width: 60rpx;
    height: 80rpx;
    margin-left: 20rpx;
    margin-right: 40rpx;
  }

  .info-left,
  .info-right {
    display: flex;
    flex-direction: column;
  }

  .info-left {
    flex: 1;
    align-items: flex-start;
  }

  .islander-name {
    font-size: 32rpx;
  }

  .islander-sex {
    font-size: 30rpx;
    margin-left: 10rpx;
  }

  .info-right {
    width: 120rpx;

    text {
      font-size: 22rpx;
      text-align: center;
    }
  }

  .islander-breed,
  .islander-motto {
    color: #999;
  }

  .islander-birth {
    color: $uni-color-success;
  }
</style>
