<template>
  <scroll-view class="topic-bar bg-white" scroll-x @scroll="stopSwiper">
    <text v-for="(item,index) in topicList" class="topic-item" :class="isActive(item.value)? 'active-topic':''"
      @click="switchTopic(item.value)">{{ item.value }}</text>
  </scroll-view>
</template>

<script>
  import { ref, toRefs, onMounted } from 'vue'
  import { requestOption } from '@/common/get-options'

  export default {
    name: 'TopicBar',
    props: {
      topic: {
        type: String,
      }
    },
    emits: ['update:topic'],
    setup(props, { emit }) {
      const { topic } = toRefs(props)
      const topicList = ref([])

      const isActive = (tval) => {
        let bl = false
        if (tval === '不限话题') {
          bl = (topic.value === '') ? true : false
        } else {
          bl = (topic.value === tval) ? true : false
        }
        return bl
      }

      const getTopicList = async () => {
        const res = await requestOption({ type: 'topic', title: '话题', key: 'topic', unMulit: true })
        topicList.value = res.list
      }

      const switchTopic = tval => {
        const nTval = (tval === '不限话题') ? '' : tval
        emit('update:topic', nTval)
      }

      const stopSwiper = () => {
        console.log('停止滚动')
      }

      onMounted(() => {
        getTopicList()
      })

      return {
        topic,
        topicList,
        isActive,
        switchTopic,
        stopSwiper
      }
    }
  }
</script>

<style lang="scss">
  .topic-bar {
    width: 100%;
    height: 80rpx;
    white-space: nowrap;

    .topic-item {
      display: inline-block;
      line-height: 80rpx;
      padding: 0 12rpx;
      color: #666;

      &.active-topic {
        color: $uni-success;
      }
    }
  }
</style>
