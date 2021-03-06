<template>
  <uni-loading v-if="isLoading"></uni-loading>
  <view v-else class="add-container">
    <view class="uni-list">
      <view class="uni-list-cell">
        <view class="uni-list-cell-left"> 设计类型 </view>
        <view class="uni-list-cell-db">
          <picker
            @change="typePickerChange"
            :value="pickerIndex"
            :range="typeList"
            range-key="text"
          >
            <view class="uni-input">{{ pickerTypeName }}</view>
          </picker>
        </view>
      </view>
    </view>
    <view class="uni-list">
      <view class="uni-list-cell">
        <view class="uni-list-cell-left"> 设计名称 </view>
        <view class="uni-list-cell-db">
          <uni-easyinput
            class="item-name"
            v-model="designInfo.name"
            placeholder="请输入设计名称"
            :inputBorder="false"
            style="font-size: 16px"
          />
        </view>
      </view>
    </view>

    <view class="content-box">
      <view class="uni-textarea">
        <textarea
          :value="designInfo.content"
          placeholder-style="color:#999"
          @blur="textAreaBlur"
          placeholder="关于这件设计有什么想说的, 分享一下吧"
          auto-height
        />
      </view>
      <uni-file-picker
        ref="imagePickerRef"
        v-model="fileList"
        limit="9"
        mode="grid"
        :auto-upload="false"
        title="请选择图片(必传)"
        @select="selectImage"
        @delete="e => deleteImage(e, designInfo.photoSrc)"
      ></uni-file-picker>
    </view>
    <button
      type="primary"
      class="uni-primary-bg editBtn"
      @click="submitDesign"
      :disabled="!isValid"
    >
      发布
    </button>
  </view>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { onLoad } from '@dcloudio/uni-app'
import useUpload from '@/composables/useUpload'
import { getDesign, addDesign } from '@/request_api/design'
import { goBack } from '@/common/utils'

export default {
  props: {
    id: {
      type: String,
    },
    designType: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore()
    const userId = computed(() => store.getters.userId)
    const isLoading = ref(false)

    const typeList = [
      { text: '衣服', value: 'clothingDesign' },
      { text: '帽子', value: 'hatDesign' },
      { text: '图案', value: 'patternDesign' },
    ]

    const pickerIndex = ref(
      props.designType
        ? typeList.findIndex(t => t.value === props.designType)
        : 0
    )
    const pickerTypeName = computed(() => typeList[pickerIndex.value].text)

    const designInfo = reactive({
      type: '', // 类型
      name: '', // 名称
      content: '', // 详细内容
      photoSrc: [],
      created_time: null,
    })

    const {
      uploadList,
      getUploadData,
      fileList,
      initialList,
      selectImage,
      deleteImage,
    } = useUpload(9)

    const isValid = computed(
      () => designInfo.name !== '' && designInfo.content !== ''
    )
    const imagePickerRef = ref(null)

    const typePickerChange = e => {
      pickerIndex.value = e.detail.value
    }

    const getDesignInfo = async () => {
      isLoading.value = true
      const { data } = await getDesign(props.id)
      Object.keys(data).forEach(key => {
        designInfo[key] = data[key]
      })
      initialList(designInfo.photoSrc)
      const index = typeList.findIndex(t => t.value === designInfo.type)
      pickerIndex.value = index
      isLoading.value = false
    }

    const submitDesign = async () => {
      try {
        if (uploadList.value.length) {
          // 有待上传文件先去上传
          const dealImgList = await getUploadData()
          designInfo.photoSrc.push(...dealImgList)
        }
        if (!designInfo.photoSrc.length) {
          uni.showToast({
            title: '请上传图片！',
            icon: 'error',
          })
          return
        }
        designInfo.type = typeList[pickerIndex.value].value
        designInfo.user = userId.value
        const res = await addDesign(designInfo)
        uni.showToast({
          title: res.message,
          duration: 2000,
          success() {
            goBack({
              type: pickerIndex.value,
              getItemApi: getDesign,
              id: designInfo._id,
            })
          },
        })
      } catch (err) {
        console.log(err)
      }
    }

    const textAreaBlur = e => {
      designInfo.content = e.detail.value
    }

    onLoad(option => {
      if (option.id) getDesignInfo()
    })

    return {
      pickerIndex,
      pickerTypeName,
      typeList,
      typePickerChange,
      isValid,
      isLoading,
      getDesignInfo,
      submitDesign,
      designInfo,
      textAreaBlur,
      fileList,
      selectImage,
      deleteImage,
      imagePickerRef,
    }
  },
}
</script>

<style lang="scss">
.add-container {
  padding: 20rpx;

  .uni-list {
    margin-bottom: 20rpx;
    border-radius: 10rpx;

    .uni-input {
      color: $uni-success;
      text-align: right;
    }

    .item-name {
      text-align: right;
    }
  }

  .content-box {
    padding: 15rpx;
    border-radius: 10rpx;
    background-color: white;

    .uni-textarea {
      min-height: 300rpx;
    }
  }
}
</style>
