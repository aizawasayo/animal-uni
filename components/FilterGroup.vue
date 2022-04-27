<template>
  <text class="filter-title">{{filterOption.title}}</text>
  <view class="filter-group">
    <view v-for="(item, index) in filterList"
      :key="item.value + index"
      class="filterBtn" :class="{ 'filterBtn-active': item.checked }">
      <text @click.stop="tapFilter(filterOption.filterKey, item.value, filterOption.mulit, index)"
        class="filterBtn-text" :class="{ 'filterBtn-text-active': item.checked }">{{ item.text }}</text>
    </view>
  </view>
</template>

<script>
  import { ref, watch } from 'vue'
  export default {
    name: "FilterGroup",
    props: {
      filterOption: {
        type: Object,
      }
    },
    emits: ['filterChange'],
    setup(props, { emit }) {
      const filterList = ref(props.filterOption.list)

      // 点击某个筛选选项的值
      const tapFilter = (key, val, mulit, i) => { // 关键值
        if (mulit) { // 如果允许多选
          filterList.value[i].checked = !filterList.value[i].checked
        } else { // 单选则选项互斥，最多只能有一个true  
          filterList.value.forEach(item => item.checked = false)
          filterList.value[i].checked = !filterList.value[i].checked
        }

        // 获取被选中的选项值
        const checkList = filterList.value.filter(item => item.checked)
        let checkVal = mulit ? [] : ''
        if (mulit) {
          checkList.forEach(item => {
            checkVal.push(item.value)
          })
        } else {
          checkVal = checkList[0].value
        }

        // 触发父组件自身的选项数组 及 查询参数【listQuery】中的筛选条件  
        emit('filterChange', { key, checkVal, list: filterList.value })
      }

      return {
        filterList,
        tapFilter
      }
    }
  }
</script>

<style lang="scss">
  .filter-title {
    display: block;
    margin-bottom: 18rpx;
    padding: 0 20rpx;
    font-size: 32rpx;
    color: #333333
  }

  .filter-group {
    margin-left: 10rpx;
    margin-right: 10rpx;
    display: inline-flex;
    flex-direction: row;
    // justify-content: flex-start;
    flex-wrap: wrap;
  }

  .filter-group:after {
    content: '';
    width: 20%;
  }

  .filterBtn {
    flex: 0 0 auto;
    // min-width: 80rpx;
    height: 60rpx;
    margin-bottom: 18rpx;
    margin-left: 10rpx;
    margin-right: 10rpx;
    padding: 0rpx 28rpx;
    background-color: #f7f7f7;
    border-color: transparent;
  }

  .filterBtn-active {
    background-color: #E8F5E9;
    border-color: #4CAF50
  }

  .filterBtn-text {
    display: block;
    text-align: center;
    line-height: 60rpx;
    color: #666666;
    font-size: 28rpx
  }

  .filterBtn-text-active {
    color: #43A047;
    // font-size: 14rpx;
  }
</style>
