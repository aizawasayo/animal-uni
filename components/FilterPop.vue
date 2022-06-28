<template>
  <!-- 筛选弹窗 -->
  <uni-popup
    ref="popRef"
    :customTop="marginTop ? marginTop : 44"
    @maskClick="finishFilter"
  >
    <scroll-view class="popup-content" scroll-y>
      <filter-group
        v-for="(option, i) in filterOpts"
        @filterChange="filterChange"
        :key="option.title + i"
        :filterOption="option"
      />
    </scroll-view>
    <view class="modalBtn-view">
      <button type="default" @click="resetFilter" class="modalBtn">重置</button>
      <button type="default" @click="finishFilter" class="modalBtn-finish">
        完成
      </button>
    </view>
  </uni-popup>
</template>

<script>
import { ref, toRefs } from 'vue'
import { onLoad, onUnload, onShow, onHide } from '@dcloudio/uni-app'
import FilterGroup from '@/components/FilterGroup.vue'
import useFilter from '@/composables/useFilter'
import eventBus from '@/common/mitt'

export default {
  name: 'FilterPop',
  components: { FilterGroup },
  // props: ['marginTop', 'insideMarginTop'],
  props: {
    listQuery: {
      type: Object,
    },
    apiType: {
      type: String,
    },
    reloadList: Function,

    isTabBar: { type: Boolean, default: false },
    marginTop: Number,
  },
  setup(props) {
    const popRef = ref(null)
    const { listQuery, apiType, reloadList, isTabBar, marginTop } =
      toRefs(props)

    const { filterOpts, filterChange, resetFilter } = useFilter(
      listQuery.value,
      apiType.value,
      reloadList.value
    )

    const finishFilter = () => {
      eventBus.emit('closePop', apiType.value)
    }

    onLoad(() => {
      if (!isTabBar.value) {
        eventBus.on('showPop', data => {
          if (data.type === apiType.value) {
            if (data.val) {
              popRef.value.open('top')
            } else {
              popRef.value.close()
            }
          }
        })
      }
    })

    onUnload(() => {
      if (!isTabBar.value) {
        eventBus.off('showPop')
      }
    })

    onShow(() => {
      if (isTabBar.value) {
        eventBus.on('showPop', data => {
          if (data.type === apiType.value) {
            if (data.val) {
              popRef.value.open('top')
            } else {
              popRef.value.close()
            }
          }
        })
      }
    })

    onHide(() => {
      if (isTabBar.value) {
        eventBus.off('showPop')
      }
    })
    return {
      popRef,
      filterOpts,
      filterChange,
      resetFilter,
      finishFilter,
      apiType,
      marginTop,
    }
  },
}
</script>

<style lang="scss" scoped>
.uni-popup {
  z-index: 108;
}
.uni-popup.top {
  top: 44px !important;
}
.popup-content {
  background-color: #ffffff;
  padding-top: 18rpx;
  max-height: 800rpx;
}

.modalBtn-view {
  display: flex;
  flex-direction: row;
  background-color: #ffffff;

  .modalBtn {
    flex: 1;
    color: #333333;
    border-radius: 0;
  }

  .modalBtn-finish {
    flex: 1;
    background-color: #81c784;
    color: white;
  }

  .modalBtn:active {
    opacity: 0.7;
  }

  .modalBtn-finish:active {
    background-color: #66bb6a;
    opacity: 0.7;
  }
}
</style>
