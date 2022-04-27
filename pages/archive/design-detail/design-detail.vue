<template>
  <uni-loading v-if="isLoading"></uni-loading>
  <view v-else-if="itemDetail!== null" class="detailContainer">
    <text class="detailTitle">
      【{{ typeName }}】{{itemDetail.name}}
    </text>
    <view class="detailInfo">
      <view class="infoInline">
        <text class="infoLabel">发布时间：</text>
        <uni-dateformat :date="itemDetail.created_time * 1000"></uni-dateformat>
      </view>
      <view class="infoInline">
        <text class="infoLabel">作者：</text>
        <image class="userAvatar" v-if="itemDetail.user" :src="apiUrl + itemDetail.user.avatar" />
        <span v-if="itemDetail.user" style="flex: 1;">{{ itemDetail.user.nickname }}</span>
      </view>
    </view>
    <view class="uni-flex img-box" v-for="img in itemDetail.photoSrc" :key="img.uid">
      <image :src="apiUrl + img.src" mode="aspectFit"></image>
      <text> {{ img.name }} </text>
    </view>
    <rich-text :nodes="itemDetail.content" />
  </view>
</template>

<script>
  import { ref, unref, computed } from 'vue'
  import { getDesign } from '@/request_api/design'

  export default {
    inject: ["apiUrl"],
    setup() {
      const isLoading = ref(false)
      const itemDetail = ref(null)

      const typeList = [
        { text: '衣服', value: 'clothingDesign' },
        { text: '帽子', value: 'hatDesign' },
        { text: '图案', value: 'patternDesign' },
      ]

      const typeName = computed(() => {
        let type = '衣服'
        if (itemDetail && itemDetail.type) {
          let index = typeList.findIndex(t => t.value === itemDetail.type)
          type = typeList[index].text
        }
        return type
      })

      const getDetail = async (id) => {
        isLoading.value = true
        const { data } = await getDesign(id)
        itemDetail.value = data
        isLoading.value = false
      }

      return {
        isLoading,
        itemDetail,
        getDetail,
        typeName
      }
    },
    onLoad(option) {
      this.getDetail(option.id)
    },
  }
</script>

<style lang="scss">
  .detailContainer {
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    padding-left: 20rpx;
    padding-right: 20rpx;

    .detailTitle {
      font-size: 36rpx;
      font-weight: 700;
      text-align: center;
      line-height: 100rpx;
      color: $uni-color-primary;
    }

    .detailInfo {
      margin-bottom: 60rpx;
      padding: 10rpx 20rpx;
      border: 1rpx dashed #4dd0e1;
      border-radius: 8rpx;
      background-color: #f1f6f7;
      color: #BDBDBD;

      .infoInline {
        display: flex;
        align-items: center;
      }

      .infoLabel {
        font-weight: bold;
        color: black;
      }

      .userAvatar {
        width: 30rpx;
        height: 30rpx;
        border-radius: 30rpx;
        margin-right: 10rpx;
      }
    }

    .img-box {
      flex-direction: column;

      image {
        width: 100%;
      }

      text {
        display: block;
        text-align: center;
        line-height: 80rpx;
        color: #333333;
      }
    }

    p {
      font-size: 22rpx;
    }

    a {
      font-weight: 300;
      color: #FF3366;
    }

  }
</style>
