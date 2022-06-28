<template>
  <uni-list-item>
    <template #body>
      <view class="post-info uni-row">
        <view class="content-box uni-flex-column">
          <text class="content-text">{{
            item.name
              ? $filters.textFilter(item.name, 15)
              : item.content
              ? $filters.textFilter(item.content, 15)
              : $filters.textFilter(item.detail, 15)
          }}</text>
          <uni-dateformat
            class="post-time"
            :date="item.created_time * 1000"
          ></uni-dateformat>
        </view>
      </view>
    </template>
    <template #footer>
      <view class="deal-box">
        <view>
          <uni-icons
            type="compose"
            color="#3FB984"
            @click="
              utils.goPage(
                `/pages/archive/add-design/add-design?id=${item._id}`
              )
            "
          ></uni-icons>
        </view>
        <view>
          <uni-icons
            type="closeempty"
            color="#7C77B9"
            @click="deleteById(item._id)"
          ></uni-icons>
        </view>
      </view>
    </template>
  </uni-list-item>
</template>

<script>
import { defineComponent } from 'vue'
import useDelete from '@/composables/useDelete'
import { deleteDesign } from '@/request_api/design'

export default defineComponent({
  name: 'DesignItem',
  inject: ['utils'],
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  emits: ['delete-design'],
  setup(props, { emit }) {
    const { deleteById } = useDelete(deleteDesign, () => {
      emit('delete-design')
    })

    return {
      deleteById,
    }
  },
})
</script>

<style lang="scss">
.post-info {
  flex: 1;

  .content-box {
    display: flex;
    flex-direction: column;
    flex: 1;

    .post-time {
      color: #999;
      font-size: 24rpx;
    }
  }
}

.deal-box {
  display: flex;
  flex-direction: row;
  align-items: center;

  .uni-icons {
    margin-left: 20rpx;
  }
}
</style>
