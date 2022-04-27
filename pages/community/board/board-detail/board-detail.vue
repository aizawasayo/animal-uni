<template>
  <uni-load-more v-if="isLoading" :iconSize="30" status="loading" :content-text="loadText"></uni-load-more>
  <board-card v-if="itemDetail!== null" :item="itemDetail" :refreshFun="getDetail"></board-card>
  <comment-list v-if="aid" ref="commentListRef" type="board" :id="aid" @delete-comment="deleteCommentId"></comment-list>
  <FixedInput v-if="aid" type="board" :id="aid" @fresh-comment="refreshComment" @add-comment="addCommentId">
  </FixedInput>
  <view style="height: 100rpx;"></view>
</template>

<script>
  import { ref, reactive, toRefs, computed, watch, onMounted } from 'vue'
  import useComment from '@/composables/useComment'
  import BoardCard from '../BoardCard.vue'
  import CommentList from '@/components/CommentList.vue'
  import FixedInput from '@/components/FixedInput.vue'
  import { getBoard, addBoard } from '@/request_api/board'

  export default {
    name: 'BoardDetail',
    components: { BoardCard, CommentList, FixedInput },
    inject: ['apiUrl'],
    setup(props) {
      const isLoading = ref(false)
      const itemDetail = ref(null)
      const aid = ref('')

      const commentListRef = ref(null)

      const getDetail = async () => {
        if (isLoading.value) return
        isLoading.value = true
        const { data } = await getBoard(aid.value)
        itemDetail.value = data
        isLoading.value = false
      }    

      const refreshComment = () => {
        commentListRef.value.refreshList()
        getDetail(aid.value)
      }

      const commentProps = useComment(aid, addBoard)

      return {
        aid,
        isLoading,
        itemDetail,
        getDetail,
        commentListRef,
        refreshComment,
        ...commentProps,
      }
    },
    onLoad(option) {
      this.aid = option.id
      this.getDetail()
    },
  }
</script>

<style lang="scss">



</style>
