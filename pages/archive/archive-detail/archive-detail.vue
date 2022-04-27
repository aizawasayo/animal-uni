<template>
  <uni-loading
    v-if="isLoading"
    ref="loading">
  </uni-loading>
  <view v-else class="padd-container">
    <switch-image :imageUrl="imageUrl" detailType="archive" :cId="itemId" :refIndex="refIndex"
      @switch-fun="nId => switchCB(nId)"></switch-image>
    <view class="uni-list radius-box">
      <uni-list-item :show-extra-icon="true" :extra-icon="{type:'circle-filled',color:'#29b6f6'}" title="名称"
        :rightText="itemDetail.name" />
      <uni-list-item v-if="itemDetail.engName || itemDetail.jpnName" :show-extra-icon="true"
        :extra-icon="{type:'info',color:'#673ab7'}" title="其他译名"
        :rightText="$filters.textFilter(`${itemDetail.engName} , ${itemDetail.jpnName}`,30)" />
      <uni-list-item v-if="itemDetail.realName" :show-extra-icon="true" :extra-icon="{type:'vip',color:'#ec407a'}"
        title="真实名字" :rightText="itemDetail.realName" />
      <uni-list-item v-if="itemDetail.type" :show-extra-icon="true" :extra-icon="{type:'list',color:'#ffb300'}"
        title="类型" :rightText="itemDetail.type" />
      <uni-list-item v-if="itemDetail.price" :show-extra-icon="true" :extra-icon="{type:'wallet',color:'#8BC34A'}"
        title="价格" :rightText="itemDetail.price.toString()" />
      <uni-list-item v-if="itemDetail.price" :show-extra-icon="true" :extra-icon="{type:'shop',color:'#0277BD'}"
        title="豆狸回收价格" :rightText="(itemDetail.price * 0.25).toString()" />
      <uni-list-item v-if="itemDetail.price" :show-extra-icon="true" :extra-icon="{type:'gift',color:'#00BB00'}"
        title="箱子回收价格" :rightText="(itemDetail.price * 0.2).toString()" />
      <uni-list-item v-if="itemDetail.size" :show-extra-icon="true" :extra-icon="{type:'paperclip',color:'#FF5809'}"
        title="占地尺寸" :rightText="itemDetail.size" />
      <uni-list-item v-if="itemDetail.colorInfo" :show-extra-icon="true" :extra-icon="{type:'color',color:'#F00078'}"
        title="颜色"
        :rightText="itemDetail.colorInfo" />
      <uni-list-item v-if="itemDetail.styleInfo" :show-extra-icon="true" :extra-icon="{type:'heart',color:'#00bcd4'}"
        title="风格" :rightText="itemDetail.styleInfo" />
      <uni-list-item v-if="itemDetail.themeInfo" :show-extra-icon="true" :extra-icon="{type:'vip',color:'#cddc39'}"
        title="主题" :rightText="itemDetail.themeInfo" />
      <uni-list-item v-if="itemDetail.series" :show-extra-icon="true" :extra-icon="{type:'eye',color:'#009688'}"
        title="所属系列" :rightText="itemDetail.series" />
      <uni-list-item v-if="itemDetail.orderType " :show-extra-icon="true" :extra-icon="{type:'cart',color:'#3f51b5'}"
        title="订购类型" :rightText="itemDetail.orderType" />
      <uni-list-item v-if="itemDetail.remould" :show-extra-icon="true" :extra-icon="{type:'starhalf',color:'#FDD835'}"
        title="改造类型" :rightText="itemDetail.remould" />
      <uni-list-item v-if="itemDetail.saleTime" :show-extra-icon="true" :extra-icon="{type:'calendar',color:'#1DE9B6'}"
        title="售卖时间" :rightText="itemDetail.saleTime" />
      <uni-list-item v-if="itemDetail.channelInfo" :show-extra-icon="true"
        :extra-icon="{type:'paperplane',color:'#ec407a'}" title="获取途径" :rightText="itemDetail.channelInfo" />
      <uni-list-item v-if="itemDetail.channelDetail" title="途径详情" :rightText="itemDetail.channelDetail" />
    </view>
    <view v-if="itemDetail.photoSrc.length !== 0" class="more-image radius-box">
      <text class="image-title">全部图片 (点击可查看大图)</text>
      <view class="image-box">
        <view class="image" v-for="img in itemDetail.photoSrc">
          <image v-if="img.src" :src="apiUrl + img.src" @click.stop="utils.previewImage(apiUrl + img.src)"
            mode="aspectFit" />
          <image v-else :src="apiUrl + img" @click.stop="utils.previewImage(apiUrl + img)" mode="aspectFit" />
          <text v-if="img.src" class="imageText">{{ $filters.itemColorFilter(img.name, itemDetail.name) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
  import { ref, computed, inject } from 'vue'
  import SwitchImage from '@/components/SwitchImage.vue'
  import { getFurniture } from '@/request_api/furniture'
  import { getClothing } from '@/request_api/clothing'

  export default {
    components: { SwitchImage },
    inject: ["apiUrl", "utils"],
    setup() {
      const isLoading = ref(false)
      const itemDetail = ref(null)
      const apiType = ref('')
      const itemId = ref('')
      const refIndex = ref(0)
      const apiUrl = inject('apiUrl')
      const imageUrl = computed(() => {
        let val = '../../../static/noPhoto.png'
        if (itemDetail.value && itemDetail.value.photoSrc.length !== 0) {
          val = (typeof itemDetail.value.photoSrc[0] === 'string') ? `${apiUrl}${itemDetail.value.photoSrc[0]}` :
            `${apiUrl}${itemDetail.value.photoSrc[0].src}`
        }
        return val
      })

      const getDetailApi = (t) => {
        let api = null
        switch (t) {
          case 'furniture':
            api = getFurniture
            break;
          case 'clothing':
            api = getClothing
            break;
        }
        return api
      }

      const getDetail = async (id, aType) => {
        isLoading.value = true
        const { data } = await getDetailApi(aType)(id)
        itemDetail.value = data

        if (data.color) itemDetail.value.colorInfo = data.color.join('、')
        if (data.style) itemDetail.value.styleInfo = data.style.join('、')
        if (data.theme) itemDetail.value.themeInfo = data.theme.join('、')

        if (typeof data.type !== 'string') itemDetail.value.type = data.type.join('/')

        const activity = data.activity ? '[' + data.activity + '期间] ' : ''
        itemDetail.value.channelInfo = activity + data.channels.join('/')
        isLoading.value = false
      }

      const switchDetail = (switchType) => {
        var pages = getCurrentPages(); //当前页面栈
        if (pages.length > 1) {
          var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
          console.log(beforePage.$refs.archive)
          beforePage.$refs.archive.archiveListRefs[refIndex.value].getDetailData(itemId.value, switchType, nId => {
            getDetail(nId, apiType.value)
            itemId.value = nId
          }); // 触发上一个页面(组件实例)中的方法, 并传过去当前的id 值
        }
      }

      const switchCB = (nId) => {
        getDetail(nId, apiType.value)
        itemId.value = nId
      }

      return {
        isLoading,
        itemDetail,
        getDetail,
        switchDetail,
        apiType,
        itemId,
        imageUrl,
        refIndex,
        switchCB
      }
    },
    onLoad(option) {
      this.itemId = option.id
      this.refIndex = parseInt(option.tabIndex)
      this.apiType = option.apiType
      this.getDetail(option.id, option.apiType)
    }
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
    // justify-content: space-between;
    flex-wrap: wrap;

    .image {
      display: flex;
      height: 200rpx;
      width: 25%;
      flex-direction: column;

      image {
        width: 100%;
        flex: 1
      }

      .imageText {
        text-align: center;
        line-height: 52rpx;
        color: #3b4144;
        font-size: 22rpx;
      }
    }
  }
</style>
