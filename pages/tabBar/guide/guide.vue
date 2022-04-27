<template>
  <view class="wrapper">
    <swiper :indicator-dots="true" :autoplay="true">
      <swiper-item v-for="item in banners" :key="item._id" @click="goLink(item.link)">
        <image class="banner-image" :src="apiUrl + item.avatar" />
        <text class="banner-title">{{ item.title }}</text>
      </swiper-item>
    </swiper>
    <guide-list ref="guideListRef" topDomClass=".uni-swiper-wrapper"></guide-list>
  </view>
</template>

<script>
  import { onMounted, ref, unref } from 'vue'
  import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
  import GuideList from '@/pages/guide/GuideList.vue'
  import { goPage } from '@/common/utils'
  import { getBannerList } from '@/request_api/banner'

  export default {
    components: {
      GuideList
    },
    inject: ['apiUrl', 'utils'],
    setup() {
      const bannerLoading = ref(false)
      const banners = ref([])
      const guideListRef = ref(null)

      const getBanner = async () => { // 获取轮播图数据
        if (bannerLoading.value) return
        bannerLoading.value = true
        const { data } = await getBannerList({ state: 0 })
        banners.value = data
        bannerLoading.value = false
        uni.stopPullDownRefresh()
      }
      onMounted(() => {
        getBanner()
        guideListRef.value.changeScrollHeight()
      })
      onReachBottom(() => {
        unref(guideListRef).loadMore()
      })
      onPullDownRefresh(() => {
        getBanner()
        guideListRef.value.refreshList()
      })

      const goLink = (link) => {
        const idArr = link.split('/')
        if (idArr.includes('guide')) { // 是攻略
          const id = idArr[3]
          goPage('../../guide/guide-detail/guide-detail?id=' + id);
        }
        if (idArr.includes('halobios')) {
          uni.switchTab({
            url: '/pages/tabBar/museum/museum',
            success: () => {
              uni.$emit('switchTab', { selectedTab: 2 })
            }
          });
        }
      }

      return {
        banners,
        bannerLoading,
        guideListRef,
        getBanner,
        goLink,
      }
    },
    /**
     * 当 searchInput 配置 disabled 为 true 时触发
     */
    onNavigationBarSearchInputClicked(e) {
      this.utils.goPage('/pages/guide/guide-search-list/guide-search-list');
    },
    /**
     *  点击导航栏 buttons 时触发
     */
    onNavigationBarButtonTap() {
      uni.showModal({
        title: '提示',
        content: '用户点击了功能按钮，这里仅做展示。',
        success: res => {
          if (res.confirm) {
            console.log('用户点击了确定');
          }
        }
      });
    }
  };
</script>

<style>
  image,
  swiper,
  .img-view {
    width: 750rpx;
    width: 100%;
    height: 450rpx;
  }

  .banner-image {
    position: relative;
  }

  .banner-title {
    max-height: 84rpx;
    overflow: hidden;
    position: absolute;
    left: 30rpx;
    bottom: 30rpx;
    width: 90%;
    font-size: 32rpx;
    font-weight: 400;
    line-height: 42rpx;
    color: white;
    z-index: 11;
  }

  .page-section-title {
    margin-top: 50rpx;
  }
</style>
