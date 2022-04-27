<template>
  <!-- 筛选弹窗 -->
  <uni-popup ref="popRef" :customTop="marginTop ? marginTop : 44" @maskClick="finishFilter">
    <scroll-view class="popup-content"  scroll-y>
      <filter-group v-for="(option, i) in filterOpts" @filterChange="filterChange" :key="option.title + i"
        :filterOption="option" />
    </scroll-view>
    <view class="modalBtn-view">
      <button type="default" @click="resetFilter" class="modalBtn">重置</button>
      <button type="default" @click="finishFilter" class="modalBtn-finish">完成</button>
    </view>
  </uni-popup>
</template>

<script>
  import { ref, toRefs, onMounted, onUnmounted } from 'vue'
  import FilterGroup from '@/components/FilterGroup.vue'
  import useFilter from '@/composables/useFilter'
  import eventBus from '@/common/mitt'

  export default {
    name: "FilterPop",
    components: { FilterGroup },
    props: ['marginTop','insideMarginTop'],
    setup(props, { attrs }) {
      const popRef = ref(null)

      const { filterOpts, filterChange, resetFilter } = useFilter(attrs.listQuery, attrs.type)

      const finishFilter = () => {
        eventBus.emit('closePop', attrs.type)
      }

      //const insideTop = computed(() => )

      onMounted(() => {
        eventBus.on('showPop', data => {
          if (data.type === attrs.type) {
            if (data.val) {
              popRef.value.open('top')
            } else {
              popRef.value.close()
            }
          }
        })
      })

      onUnmounted(() => {
        eventBus.off('showPop')
      })

      return {
        popRef,
        filterOpts,
        filterChange,
        resetFilter,
        finishFilter,
      };
    }
  }
</script>

<style lang="scss">
  .uni-popup.top {
    top: 44px !important;
    // .mask[name='mask'] {
    //   top: 44px !important;
    //   margin-top: 44px !important;
    // }
  }
  .popup-content {
    background-color: #FFFFFF;
    padding-top: 18rpx;
    max-height: 800rpx;
  }

  .modalBtn-view {
    display: flex;
    flex-direction: row;
    background-color: #FFFFFF;

    .modalBtn {
      flex: 1;
      color: #333333;
      border-radius: 0;
    }

    .modalBtn-finish {
      flex: 1;
      background-color: #81C784;
      color: white;
    }

    .modalBtn:active {
      opacity: 0.7;
    }

    .modalBtn-finish:active {
      background-color: #66BB6A;
      opacity: 0.7;
    }
  }
</style>
