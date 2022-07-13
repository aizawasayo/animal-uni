<template>
  <uni-loading v-if="isLoading"></uni-loading>
  <view v-else-if="itemDetail !== null" class="detailContainer">
    <text class="detailTitle">
      {{ itemDetail.title }}
    </text>
    <view class="detailInfo">
      <view class="infoInline">
        <view>
          <text class="infoLabel">分类：</text>
          {{ itemDetail.type }}
        </view>
        <view>
          <text class="infoLabel">来源平台：</text>
          {{ itemDetail.platforms ? itemDetail.platforms.join('/') : '' }}
        </view>
      </view>
      <view>
        <text class="infoLabel">发布时间：</text>
        <uni-dateformat :date="itemDetail.created_time * 1000"></uni-dateformat>
      </view>
      <view class="guideAuthor">
        <text class="infoLabel">作者：</text>
        <image
          class="guideAvatar"
          v-if="itemDetail.author"
          :src="apiUrl + itemDetail.author.avatar"
        />
        <span v-if="itemDetail.author" style="flex: 1">{{
          itemDetail.author.nickname
        }}</span>
      </view>
      <view v-if="itemDetail.source_uri">
        <text class="infoLabel">原文地址：</text>
        <a :href="itemDetail.source_uri">{{ itemDetail.source_uri }}</a>
      </view>
    </view>
    <rich-text :nodes="itemDetail.content" />
    <comment-list
      v-if="!itemDetail.comment_disabled"
      ref="commentListRef"
      apiType="guide"
      :id="itemId"
      @delete-comment="deleteCommentId"
    ></comment-list>
    <FixedInput
      v-if="!itemDetail.comment_disabled"
      apiType="guide"
      :id="itemId"
      @add-comment="addCommentId"
    ></FixedInput>
    <view style="height: 100rpx"></view>
  </view>
</template>

<script>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import useComment from '@/composables/useComment'
import CommentList from '@/components/CommentList.vue'
import FixedInput from '@/components/FixedInput.vue'
import { getGuide, addGuide } from '@/request_api/guide'
export default {
  components: {
    CommentList,
    FixedInput,
  },
  inject: ['apiUrl'],
  props: {
    id: {
      type: String,
    },
  },
  setup(props) {
    const itemId = ref(props.id)
    const isLoading = ref(false)
    const itemDetail = ref(null)

    const commentListRef = ref(null)

    const getDetail = async () => {
      isLoading.value = true
      const { data } = await getGuide(props.id)
      itemDetail.value = data
      isLoading.value = false
    }

    const { addCommentId, deleteCommentId } = useComment(
      itemId.value,
      addGuide,
      async () => {
        await commentListRef.value.refreshList() // 刷新评论列表
      }
    )

    onLoad(getDetail)

    return {
      isLoading,
      itemId,
      itemDetail,
      getDetail,
      commentListRef,
      addCommentId,
      deleteCommentId,
    }
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
  }

  .detailInfo {
    margin-bottom: 100rpx;
    padding: 8rpx 10rpx;
    border: 1rpx dashed #4dd0e1;
    border-radius: 8rpx;
    background-color: #f1f6f7;
    color: #bdbdbd;

    .infoLabel {
      font-weight: bold;
      color: black;
    }

    .infoInline {
      display: flex;
      justify-content: space-between;
    }

    .guideAuthor {
      display: flex;
      align-items: center;
    }

    .guideAvatar {
      width: 30rpx;
      height: 30rpx;
      border-radius: 30rpx;
      margin-right: 10rpx;
    }
  }

  p {
    font-size: 18rpx;
  }

  a {
    font-weight: 300;
    color: #ff3366;
  }

  img {
    width: 100% !important;
    height: 'auto';
  }
}
</style>
