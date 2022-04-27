<template>
  <view class="image-main radius-box">
    <uni-icons type="left" size="40" color="#ddd" @click="switchDetail('prev')"></uni-icons>
    <image
      :src="imageUrl" @click.stop="utils.previewImage(imageUrl)" mode="aspectFit" class="image" />
    <uni-icons type="right" size="40" color="#ddd" @click="switchDetail('next')"></uni-icons>
  </view>
</template>

<script>
  import { toRefs } from 'vue'
  export default {
    name: 'SwitchImage',
    inject: ["utils"],
    emits: ['switchFun'],
    props: {
      imageUrl: {
        type: String
      },
      detailType: { // 属于什么内容的详情页，博物馆/图鉴
        type: String,
        validator: function(value) {
          // 值必须匹配下列字符串中的一个
          return ['museum', 'archive'].indexOf(value) !== -1
        }
      },
      cId: {
        type: String
      },
      refIndex: {
        type: Number
      }
    },
    setup(props, { emit }) {
      const { detailType, cId, refIndex } = toRefs(props)

      const switchId = (currentList, switchType) => {
        let index = currentList.findIndex(item => item._id === cId.value)
        if ((index === 0 && switchType === 'prev') || (index === currentList.length - 1 && switchType === 'next'))
          return uni.showToast({
            title: '没有更多了',
            icon: 'error'
          })
        const newId = switchType === 'prev' ? currentList[index - 1]._id : currentList[index + 1]._id
        emit('switchFun', newId)
      }

      const switchDetail = (switchType) => {
        var pages = getCurrentPages(); //当前页面栈
        if (pages.length > 1) {
          var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
          if (detailType.value === 'museum') {
            beforePage.museumListRefs[refIndex.value].getAllList(list => {
              switchId(list, switchType)
            })
          } else {
            beforePage.$refs.archive.archiveListRefs[refIndex.value].getAllList(list => {
              switchId(list, switchType)
            }); // 触发上一个页面(组件实例)中的方法, 并传过去当前的id 值
          }
        }
      }
      return {
        switchDetail
      }
    }
  }
</script>

<style lang="scss">
  .image-main {
    display: flex;
    align-items: center;
    margin-top: 30rpx;
    height: 250rpx;

    .image {
      width: 100%;
      height: 100%;
    }
  }
</style>
