<template>
  <uni-loading
    v-if="isLoading"
    ref="loading">
  </uni-loading>
  <view v-else class="listContainer">
    <uni-list>
      <uni-list-item :show-extra-icon="true" :extra-icon="{type:'phone',color:'#ec407a'}" title="绑定手机号"
        rightText="186****6011" />
      <uni-list-item :show-extra-icon="true" showArrow :extra-icon="{type:'locked',color:'#cddc39'}" title="修改密码"
        :to="`../password/password`" />
      <uni-list-item :show-extra-icon="true" :extra-icon="{type:'info',color:'#29b6f6'}" title="动森之家版本"
        rightText="V.3.6.3" />
      <uni-list-item :show-extra-icon="true" showArrow :extra-icon="{type:'help',color:'#8BC34A'}"
        title="关于我们" />
      <uni-list-item :show-extra-icon="true" showArrow :extra-icon="{type:'checkbox',color:'#3f51b5'}"
        title="隐私政策" />
      <uni-list-item :show-extra-icon="true" showArrow :extra-icon="{type:'email',color:'#FDD835'}"
        title="意见反馈" />
    </uni-list>
    <button type="primary" class="uni-primary-bg editBtn" @click="logout">退出登录</button>
  </view>
</template>

<script>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { getUser } from '@/request_api/user'

  export default {
    setup(props) {
      const store = useStore()
      const userInfo = reactive({})
      const userId = computed(() => store.getters.userId)
      const isLoading = ref(false)

      const getUserInfo = async () => {
        isLoading.value = true
        const { data } = await getUser(userId.value)
        Object.keys(data).forEach(key => {
          userInfo[key] = data[key]
        })
        isLoading.value = false
      }

      const logout = async () => {
        await store.dispatch('user/logout')
        uni.showToast({
          title: `退出登录成功`,
          success: (res) => {
            uni.switchTab({
                url: '/pages/tabBar/guide/guide'
            });
          }
        })
      }

      onMounted(() => {
        getUserInfo()
      })



      return {
        isLoading,
        userInfo,
        logout
      };
    }
  }
</script>

<style lang="scss">
  .listContainer {
    margin-bottom: 30rpx;

    .uni-list {
      margin-bottom: 30rpx;
    }
  }
  
  .editBtn {
    margin: 30rpx;
  }
</style>
