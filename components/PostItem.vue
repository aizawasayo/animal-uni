<template>
  <uni-list-item>
    <template #body>
      <view class="post-info uni-row">
        <view class="content-box uni-flex-column">
          <text
            class="content-text">{{ item.title ? $filters.textFilter(item.title, 15): (item.content ? $filters.textFilter(item.content, 15):  $filters.textFilter(item.detail, 15))}}</text>
          <uni-dateformat class="post-time" :date="(type === ('turnip' || 'trade')) ? item.validTime *1000 :item.created_time*1000"></uni-dateformat>
        </view>
      </view>
    </template>
    <template #footer>
      <view class="deal-box">
        <view>
          <uni-icons type="compose" color="#3FB984" @click="goEdit(item._id)"></uni-icons>
        </view>
        <view>
          <uni-icons type="closeempty" color="#7C77B9" @click="deleteById(item._id)"></uni-icons>
        </view>
      </view>
    </template>
  </uni-list-item>
</template>

<script>
  import { defineComponent, ref, reactive, toRefs, computed, onMounted } from 'vue'
  import useDelete from '@/composables/useDelete'
  import { deleteGuide } from '@/request_api/guide'
  import { deleteBoard } from '@/request_api/board'
  import { deleteTurnip } from '@/request_api/turnip'
  import { deleteTrade } from '@/request_api/Trade'
  import { firstToUpper, goPage } from '@/common/utils'

  export default defineComponent({
    name: "PostItem",
    props: {
      item: {
        type: Object,
        default: null
      },
      refreshFun: {
        type: Function,
        default: null
      },
      type: {
        type: String,
      },
    },
    setup(props) {
      const { type, refreshFun } = toRefs(props)
      const deleteApi = computed(() => {
        let deleteFun = null
        switch(type.value){
          case 'guide':
          deleteFun = deleteGuide
          break;
          case 'board':
          deleteFun = deleteBoara
          break;
          case 'turnip':
          deleteFun = deleteTurnip
          break;
          case 'trade':
          deleteFun = deleteTrade
          break;
        }
        return deleteFun
      })
      const { deleteById } = useDelete(deleteApi, refreshFun.value)
    
      const goEdit = id => {
        if (type.value !== 'guide') {
          goPage(`/pages/community/${type.value}/add-${type.value}/add-${type.value}?id=` + id)
        } else {
          goPage(`/pages/guide/guide-detail/guide-detail?id=` + id)
        }
      }

      return {
        deleteById,
        goEdit,
      };
    }
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
      margin-left: 20rpx
    }
  }
</style>
