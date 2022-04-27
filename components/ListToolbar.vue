<template>
  <view class="list-toolbar">
    <view class="sort-wrapper">
      <view class="sort-view" v-for="item in sortList" :key="item.text + new Date().getTime()"
        @click="() => sortChange(item.value)">
        <text class="sort-text" :class="{'sort-active': isSortActive(item.value)}">{{ item.text }}</text>
        <view class="sort-icon">
          <uni-icons type="arrowup" size="14"
            :color="checkKey === item.value && checkVal === 1 ?'#80DEEA':'#949494'">
          </uni-icons>
          <uni-icons type="arrowdown" size="14"
            :color="checkKey === item.value && checkVal === -1 ?'#80DEEA':'#949494'">
          </uni-icons>
        </view>
      </view>
    </view>
    <view class="filter-view" @click="()=> popVisible = !popVisible">
      <view class="separator"></view>
      <view class="filter-text-box">
        <text class="filter-text" :style="{color: popVisible ? '#80DEEA':'#949494'}">筛选</text>
        <uni-icons type="settings" size="16"
          :color="popVisible ? '#80DEEA' : '#949494'">
        </uni-icons>
      </view>
    </view>
  </view>
</template>

<script>
  import { ref, toRefs, computed, watch, onMounted, onUnmounted } from 'vue'
  import eventBus from '@/common/mitt'

  export default {
    name: 'ListToolbar',
    props: ['type', 'sortChange', 'checkKey', 'checkVal'],
    setup(props, { emit }) {
      const { type, checkKey } = toRefs(props)

      const popVisible = ref(false)

      const nameSort = { text: '名字', value: 'name' }
      const priceSort = { text: '价格', value: 'price' }
      const raritySort = { text: '稀有度', value: 'rarity' }
      const shadowSort = { text: '鱼影大小', value: 'shadow' }
      const sizeSort = { text: '尺寸', value: 'size' }
      const birthSort = { text: '生日', value: 'birth' }
      const durabilitySort = { text: '耐久度', value: 'durability' }

      const sortList = computed(() => {
        let sortOptions = []
        switch (type.value) {
          case 'fish':
          case 'insect':
            sortOptions = [nameSort, priceSort, raritySort]
            break;
          case 'halobios':
            sortOptions = [nameSort, priceSort, shadowSort]
            break;
          case 'artwork':
          case 'recipe':
            sortOptions = [nameSort, sizeSort]
            break;
          case 'islander':
            sortOptions = [nameSort, birthSort]
            break;
          case 'furniture':
            sortOptions = [nameSort, priceSort, sizeSort]
            break;
          case 'tool':
            sortOptions = [nameSort, priceSort, durabilitySort]
            break;
          default:
            sortOptions = [nameSort, priceSort]
            break;
        }
        return sortOptions
      })

      const sortKeyArr = computed(() => {
        const keyArr = []
        sortList.value.forEach((sortItem) => {
          keyArr.push(sortItem.value)
        });
        return keyArr
      })

      const isSortActive = (val) => val === checkKey.value

      watch(popVisible, val => {
        if (val) {
          eventBus.emit('showPop', { type: type.value, val: true })
        } else {
          eventBus.emit('showPop', { type: type.value, val: false })
        }
      })

      onMounted(() => {
        eventBus.on('closePop', val => {
          if (val === type.value) {
            popVisible.value = false
          }
        })
      })

      onUnmounted(() => {
        eventBus.off('closePop')
      })

      return {
        popVisible,
        sortList,
        sortKeyArr,
        checkKey,
        isSortActive
      }
    }
  }
</script>

<style lang="scss">
  .list-toolbar {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 80rpx;
    background-color: white;
  }

  .sort-wrapper {
    display: flex;
    flex: 3;
    flex-direction: row;
    justify-content: space-around
  }

  .sort-view {
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .sort-icon {
    display: flex;
    flex-direction: column;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    margin-left: 8rpx;

    .uni-icons {
      line-height: 28rpx;
    }
  }

  .sort-text {
    color: #949494;
  }

  .sort-active {
    color: #80DEEA;
    font-weight: bold;
  }

  .filter-view {
    display: flex;
    flex: 1;
    flex-direction: row;
    align-items: center;

    .separator {
      background-color: #ddd;
      width: 2rpx;
      height: 32rpx;
    }

    .filter-text-box {
      display: flex;
      flex: 1;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .filter-text {
        width: 65rpx;
      }
    }
  }
</style>
