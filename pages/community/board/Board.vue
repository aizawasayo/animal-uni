<template>
  <topic-bar ref="topicRef" v-model:topic="topic"></topic-bar>
  <scroll-list ref="scrollList" type="board" :query="query" :topic="topic" :listApi="listApi" fullDomClass='.uni-swiper-wrapper' topDomClass=".topic-bar" singleDomClass=".board-card">
    <template #default="{ item, refreshList }">
      <board-card :item="item" :isDetail="false" :refreshFun="refreshList"
        @go-detail="utils.goPage('/pages/community/board/board-detail/board-detail?id=' + item._id)"></board-card>
    </template>
  </scroll-list>
</template>

<script>
  import { ref } from 'vue'
  import ScrollList from '@/components/ScrollList.vue'
  import TopicBar from '@/pages/community/board/TopicBar.vue'
  import BoardCard from './BoardCard.vue'
  import { getBoardList } from '@/request_api/board'

  export default {
    name: 'Board',
    components: { ScrollList, TopicBar, BoardCard },
    inject: ['utils'],
    props: {
      query: {
        type: String,
        default: ''
      },
    },
    setup(props) {
      const topic = ref('')

      return {
        topic,
        listApi: getBoardList
      }
    }
  }
</script>

<style lang="scss">

</style>
