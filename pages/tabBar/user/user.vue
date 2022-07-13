<template>
  <uni-loading v-if="isLoading" ref="loading"> </uni-loading>
  <view v-else class="userContainer">
    <view class="userTop radius-box">
      <user-top-edit :userInfo="userInfo" />
      <user-top-article :userId="userId" />
    </view>
    <view class="userBtns radius-box">
      <view class="userBtn">
        <uni-icons type="star" size="26" color="#F9A825" />
        <text class="userBtnText">收藏</text>
      </view>
      <view class="userBtn">
        <uni-icons type="hand-up" size="26" color="#D32F2F" />
        <text class="userBtnText">赞过</text>
      </view>
      <view class="userBtn">
        <uni-icons type="chatboxes" size="26" color="#7CB342" />
        <text class="userBtnText">互动</text>
      </view>
      <view
        class="userBtn"
        @click="utils.goPage(`/pages/user/settings/settings?id=${userId}`)"
      >
        <uni-icons type="gear" size="26" color="#00ACC1" />
        <text class="userBtnText">设置</text>
      </view>
    </view>

    <view class="userInfo radius-box">
      <view class="userCard">
        <text class="cardSideTop">———————— PASSPORT ————————</text>
        <view class="cardInfoTop">
          <image :src="apiUrl + userInfo.avatar" class="cardAvatar" />
          <view class="cardInfoTopIsland">
            <uni-icons
              type="map-pin-ellipse"
              color="#1B5E20"
              size="16"
              class="cardIcon"
            />
            <text>{{ userInfo.islandName }}</text>
            <uni-icons
              type="navigate-filled"
              color="#D81B60"
              size="16"
              class="cardIcon"
            />
            <text>{{
              userInfo.position === 'North' ? '北半球' : '南半球'
            }}</text>
          </view>
        </view>
        <view class="cardInfoBtm">
          <text class="cardInfoIdText">{{ userInfo.nickname }}</text>
          <text>{{ userInfo.gameId }}</text>
          <text>{{ userInfo.signature ? userInfo.signature : '暂无' }}</text>
        </view>
        <view class="cardSideBtm">
          <view
            >登记日：
            <uni-dateformat
              :date="userInfo.startDate * 1000"
              format="yyyy/MM/dd"
            ></uni-dateformat>
          </view>
          <text>{{ `<<<<<<<<<` }}</text>
        </view>
      </view>
    </view>
    <view style="height: 40rpx"></view>
  </view>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import UserTopEdit from '@/pages/user/UserTopEdit.vue'
import UserTopArticle from '@/pages/user/UserTopArticle.vue'
import { setReactiveObj, goPage } from '@/common/utils'
import { getUser } from '@/request_api/user'
import useLogin from '@/composables/useLogin'

export default {
  name: 'UserCenter',
  components: {
    UserTopEdit,
    UserTopArticle,
  },
  inject: ['apiUrl', 'utils'],
  setup(props) {
    const topic = ref('')
    const store = useStore()
    const userInfo = reactive({})

    const isLoading = ref(false)

    const userId = computed(() => store.getters.userId)
    const { goLogin } = useLogin('当前未登录，是否前往登录页面', () => {
      uni.switchTab({
        url: '/pages/tabBar/guide/guide',
      })
    })

    const getUserInfo = async () => {
      isLoading.value = true
      try {
        const { data } = await getUser(userId.value)
        setReactiveObj(userInfo, data)
        if (!data.nickname) {
          uni.showModal({
            title: '提示',
            content: '立即完善信息？',
            confirmColor: '#3FB984',
            success: function (res) {
              if (res.confirm) {
                goPage('/pages/user/user-edit/user-edit')
              }
            },
          })
        }
      } catch (err) {
        // console.log('未登录', err)
        goLogin()
      } finally {
        isLoading.value = false
      }
    }

    // onMounted(() => {
    //   getUserInfo()
    // })

    return {
      isLoading,
      userId,
      userInfo,
      getUserInfo,
      goLogin,
      topic,
    }
  },
  onShow() {
    this.getUserInfo()
  },
}
</script>

<style lang="scss">
.userContainer {
  padding: 0 30rpx;
}

.userTop {
  margin: 30rpx 0;
  padding: 40rpx 20rpx;
}

.userBtns {
  display: flex;
  flex-direction: row;
  padding: 40rpx 0;

  .userBtn {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
  }

  .userBtnText {
    line-height: 60rpx;
    color: #666;
  }
}

.userInfo {
  // background-color: #aedebf;
  background-image: url(../../../static/images/title-bg.jpg);
  padding: 24rpx;
  margin-bottom: 100rpx;
  overflow: hidden;

  .userCard {
    display: flex;
    flex-direction: column;
    border-radius: 20rpx;
    background-image: url(../../../static/images/main-bg.jpg);
    overflow: hidden;

    .cardSideTop {
      background-color: #faf5dd;
      text-align: center;
      color: #33691e;
      font-size: 24rpx;
      line-height: 64rpx;
    }

    .cardInfoTop {
      display: flex;
      flex-direction: row;
      padding: 20rpx 30rpx 0 30rpx;

      .cardAvatar {
        width: 160rpx;
        height: 160rpx;
        border-radius: 20rpx;
        margin-right: 20rpx;
      }

      .cardInfoTopIsland {
        flex: 1;
        flex-direction: row;
        align-items: center;
        height: 68rpx;
        border-bottom: 4rpx solid #faf5dd;

        text {
          font-weight: bold;
          font-size: 30rpx;
        }

        .cardIcon {
          margin-left: 20rpx;
          margin-right: 6rpx;
        }
      }
    }

    .cardInfoBtm {
      display: flex;
      flex-direction: column;
      font-size: 28rpx;
      padding: 0 30rpx;
      margin-bottom: 20rpx;

      text {
        font-size: 28rpx;
        color: #827717;
        line-height: 68rpx;
        border-bottom: 4rpx solid #faf5dd;
      }

      .cardInfoIdText {
        font-size: 32rpx;
        font-weight: bold;
        line-height: 80rpx;
      }
    }

    .cardSideBtm {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      background-color: #faf5dd;
      height: 64rpx;
      padding: 0 40rpx;
      color: #827717;

      text {
        color: #827717;
      }
    }
  }
}
</style>
