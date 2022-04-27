<template>
  <view class="userTopInfo">
    <image :src="apiUrl + userInfo.avatar" class="userAvatar" />
    <view class="simpleInfo">
      <text class="simpleName">{{userInfo.username}}</text>
      <text class="simpleIntro">{{ userInfo.signature ? userInfo.signature : '这个人很懒，什么都没有留下'}}</text>
    </view>
    <view class="editBtn" @click="utils.goPage('/pages/user/user-edit/user-edit')">
      <uni-icons type="compose" size="16" color="#999" />
      <text class="editTxt">编辑</text>
    </view>
  </view>
</template>

<script>
  import { reactive, computed, onMounted } from 'vue'
  export default {
    name: 'UserTopEdit',
    inject: ['apiUrl', 'utils'],
    props: {
      userInfo: {
        type: Object,
      }
    },
  }
</script>

<style lang="scss">
  .userTopInfo {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10rpx;

    .userAvatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 60rpx;
      margin-right: 20rpx
    }

    .simpleInfo {
      display: flex;
      flex-direction: column;
      flex: 1;

      .simpleName {
        font-size: 36rpx;
        font-weight: bold;
      }

      .simpleIntro {
        color: #999;
      }
    }

    .editBtn {
      width: 110rpx;
      flex-direction: row
    }

    .editTxt {
      margin-left: 4rpx;
      color: #999;
    }

  }
</style>
