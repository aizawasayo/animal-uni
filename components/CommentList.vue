<template>
  <view class="comment-list">
    <uni-card :title="'最新评论(' + total + ')'">
      <scroll-view
        class="scroll-list"
        scroll-y
        @scrolltolower="loadMore"
        refresher-enabled
        :refresher-triggered="isRefresh"
        @refresherrefresh="refreshList"
      >
        <view v-for="item in list" class="content-box">
          <image :src="apiUrl + item.uid.avatar" class="user-avatar" />
          <view class="content-info">
            <text class="user-name">{{ item.uid.username }}</text>
            <text class="comment-detail">{{ item.content }}</text>
            <view class="comment-footer">
              <uni-dateformat
                class="publish-time"
                :date="item.created_time * 1000"
                :threshold="[60000, 3600000]"
              >
              </uni-dateformat>
              <view
                v-if="userId === item.uid._id"
                class="delete-text"
                @click="() => deleteById(item._id)"
                >删除</view
              >
              <view class="comment-like" @click="addLike(item._id, item.like)">
                <uni-icons type="hand-up" color="#999"></uni-icons>
                <text>{{ item.like }}</text>
              </view>
            </view>
          </view>
        </view>
        <uni-load-more
          :status="status"
          :icon-size="16"
          :content-text="loadText"
        />
      </scroll-view>
    </uni-card>
  </view>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import useList from '@/composables/useList'
import useDelete from '@/composables/useDelete'
import {
  getComments,
  addComment,
  getComment,
  deleteComment,
} from '@/request_api/comment'

export default {
  name: 'CommentList',
  inject: ['apiUrl'],
  props: {
    apiType: String,
    id: String,
  },
  emits: ['delete-comment'],
  setup(props, { emit }) {
    const { apiType, id } = toRefs(props)
    const store = useStore()
    const userId = computed(() => store.getters.userId)

    const listQuery = reactive({
      query: '',
      page: 1,
      pageSize: 5,
      aid: id.value,
      sort: JSON.stringify({ created_time: -1 }),
    })

    const listProps = useList({
      listQuery,
      getListApi: getComments,
      type: apiType,
    })

    const { deleteById } = useDelete(
      deleteComment,
      id => {
        emit('delete-comment', id)
      },
      apiType
    )

    const addLike = async (id, like) => {
      const comment = {
        _id: id, // 评论id
        like: like + 1,
      }

      await addComment(apiType.value, comment)
      uni.showToast({
        title: '点赞成功！',
        success: res => {
          listProps.refreshItem(getComment, id, apiType.value)
        },
      })
    }

    return {
      ...listProps,
      userId,
      deleteById,
      addLike,
    }
  },
}
</script>

<style lang="scss">
.comment-list {
  .scroll-list {
    max-height: 1030rpx;
  }

  .content-box {
    display: flex;
    flex-direction: row;
    margin-top: 30rpx;
    margin-bottom: 30rpx;

    .user-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 30rpx;
      margin-right: 20rpx;
    }

    .content-info {
      display: flex;
      flex-direction: column;
      flex: 1;

      .user-name {
        font-size: 30rpx;
        font-weight: bold;
      }

      .comment-detail {
        color: #666;
      }

      .comment-footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: #999;

        .publish-time {
          flex: 1;
          color: $uni-text-color-grey;
          font-size: 24rpx;
        }

        .delete-text {
          width: 80rpx;
        }

        .comment-like {
          .uni-icons {
            margin-right: 5rpx;
          }
        }
      }
    }
  }
}
</style>
