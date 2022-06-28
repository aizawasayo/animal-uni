<template>
  <uni-loading v-if="isLoading" ref="loading"> </uni-loading>
  <view v-else class="padd-container">
    <switch-image :imageUrl="imageUrl" :cId="itemId" @switch-item="switchFun">
    </switch-image>
    <view class="uni-list radius-box">
      <uni-list-item
        :show-extra-icon="true"
        :extra-icon="{ type: 'circle-filled', color: '#29b6f6' }"
        title="名称"
        :rightText="itemDetail.name"
      />
      <uni-list-item
        v-if="itemDetail.engName || itemDetail.jpnName"
        :show-extra-icon="true"
        :extra-icon="{ type: 'info', color: '#673ab7' }"
        title="其他译名"
        :rightText="`${itemDetail.engName} , ${itemDetail.jpnName}`"
      />
      <uni-list-item
        v-if="itemDetail.realName"
        :show-extra-icon="true"
        :extra-icon="{ type: 'vip', color: '#ec407a' }"
        title="真实名字"
        :rightText="itemDetail.realName"
      />
      <uni-list-item
        v-if="itemDetail.price"
        :show-extra-icon="true"
        :extra-icon="{ type: 'wallet', color: '#ffb300' }"
        title="价格"
        :rightText="itemDetail.price.toString()"
      />
      <uni-list-item
        v-if="itemDetail.salePrice"
        :show-extra-icon="true"
        :extra-icon="{ type: 'shop', color: '#8BC34A' }"
        title="售出价格"
        :rightText="itemDetail.salePrice.toString()"
      />
      <uni-list-item
        v-if="itemDetail.size"
        :show-extra-icon="true"
        :extra-icon="{ type: 'paperclip', color: '#0277BD' }"
        title="尺寸"
        :rightText="itemDetail.size"
      />
      <uni-list-item
        v-if="itemDetail.north || itemDetail.south"
        :show-extra-icon="true"
        :extra-icon="{ type: 'calendar', color: '#8BC34A' }"
        title="出现月份"
        :rightText="`北半球  ${itemDetail.north}\n南半球  ${itemDetail.south}`"
      />
      <uni-list-item
        v-if="itemDetail.period"
        :show-extra-icon="true"
        :extra-icon="{ type: 'map', color: '#00bcd4' }"
        title="时间段"
        :rightText="
          itemDetail.period === '1点-24点' ? '全天' : itemDetail.period
        "
      />
      <uni-list-item
        v-if="itemDetail.locale"
        :show-extra-icon="true"
        :extra-icon="{ type: 'location', color: '#cddc39' }"
        title="场所"
        :rightText="
          typeof itemDetail.locale === 'string'
            ? itemDetail.locale
            : itemDetail.locale.join('、')
        "
      />
      <uni-list-item
        v-if="itemDetail.shadow"
        :show-extra-icon="true"
        :extra-icon="{ type: 'email', color: '#3f51b5' }"
        title="影子"
        :rightText="itemDetail.shadow"
      />
      <uni-list-item
        v-if="itemDetail.weatherCondition"
        :show-extra-icon="true"
        :extra-icon="{ type: 'flag', color: '#1DE9B6' }"
        title="出现条件"
        :rightText="itemDetail.weatherCondition"
      />
      <uni-list-item
        v-if="itemDetail.unlockCondition"
        :show-extra-icon="true"
        :extra-icon="{ type: 'locked', color: '#ec407a' }"
        title="解锁要求"
        :rightText="itemDetail.unlockCondition"
      />
      <uni-list-item
        v-if="itemDetail.rarity"
        :show-extra-icon="true"
        :extra-icon="{ type: 'starhalf', color: '#FDD835' }"
        title="稀有度"
        :rightText="itemDetail.rarity"
      />
      <uni-list-item
        v-if="itemDetail.introduction"
        title="傅达科普"
        :rightText="itemDetail.introduction"
      />
      <uni-list-item
        v-if="itemDetail.hasFake"
        :show-extra-icon="true"
        :extra-icon="{ type: 'eye', color: '#009688' }"
        title="赝品鉴别方法"
        :rightText="itemDetail.fakeCharacter"
        :ellipsis="2"
      />
    </view>
    <view
      v-if="apiType === 'artwork' && itemDetail.photoSrc.length !== 0"
      class="more-image radius-box"
    >
      <text class="image-title">全部图片 (点击可查看大图)</text>
      <view class="image-box">
        <view class="image">
          <image
            :src="apiUrl + itemDetail.photoSrc[0].src"
            @click.stop="
              utils.previewImage(apiUrl + itemDetail.photoSrc[0].src)
            "
            mode="aspectFit"
          />
          <text class="imageText">真品</text>
        </view>
        <view v-if="itemDetail.hasFake" class="image">
          <image
            :src="apiUrl + itemDetail.photoSrc[1].src"
            @click.stop="
              utils.previewImage(apiUrl + itemDetail.photoSrc[1].src)
            "
            mode="aspectFit"
          />
          <text class="imageText">赝品</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import { ref, inject } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import SwitchImage from '@/components/SwitchImage.vue'
import useSwitchDetail from '@/composables/useSwitchDetail'
import { getFish } from '@/request_api/fish'
import { getInsect } from '@/request_api/insect'
import { getHalobios } from '@/request_api/halobios'
import { getFossil } from '@/request_api/fossil'
import { getArtwork } from '@/request_api/artwork'

export default {
  components: { SwitchImage },
  inject: ['apiUrl', 'utils'],
  props: {
    id: {
      type: String,
    },
    apiType: {
      type: String,
    },
  },
  setup(props) {
    const apiType = ref(props.apiType)
    const itemId = ref(props.id)
    const isLoading = ref(false)
    const itemDetail = ref(null)

    const apiUrl = inject('apiUrl')
    const imageUrl = ref('')

    const getDetailApi = t => {
      let api = null
      switch (t) {
        case 'fish':
          api = getFish
          break
        case 'insect':
          api = getInsect
          break
        case 'halobios':
          api = getHalobios
          break
        case 'fossil':
          api = getFossil
          break
        case 'artwork':
          api = getArtwork
          break
      }
      return api
    }

    const getDetail = async id => {
      isLoading.value = true
      const { data } = await getDetailApi(props.apiType)(id)
      itemDetail.value = data
      imageUrl.value =
        typeof data.photoSrc === 'string'
          ? `${apiUrl}${data.photoSrc}`
          : `${apiUrl}${data.photoSrc[0].src}`
      isLoading.value = false
    }

    const { switchFun } = useSwitchDetail(itemId, nId => {
      getDetail(nId)
      itemId.value = nId
    })

    onLoad(option => {
      getDetail(option.id)
    })

    return {
      isLoading,
      itemId,
      itemDetail,
      apiType,
      getDetail,
      imageUrl,
      switchFun,
    }
  },
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

.image-title {
  color: #333;
  line-height: 100rpx;
  margin-left: 30rpx;
  font-weight: bold;
}

.image-box {
  display: flex;
  flex-direction: row;
  padding: 0rpx 15rpx 30rpx;
  justify-content: space-between;

  .image {
    display: flex;
    height: 300rpx;
    flex: 1;
    flex-direction: column;

    image {
      width: 100%;
      flex: 1;
    }

    .imageText {
      text-align: center;
      line-height: 52rpx;
      color: #3b4144;
    }
  }
}
</style>
