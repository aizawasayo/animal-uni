<template>
  <uni-loading v-if="isLoading"></uni-loading>
  <view v-else class="add-container">
    <view class="uni-list">
      <view class="uni-list-cell">
        <view class="uni-list-cell-left">
          #当前话题
        </view>
        <view class="uni-list-cell-db">
          <picker @change="topicPickerChange" :value="pickerIndex" :range="topicList" range-key="value">
            <view class="uni-input">{{ pickerTopicName }}</view>
          </picker>
        </view>
      </view>
    </view>
    <view class="content-box">
      <view class="uni-textarea">
        <textarea :value="boardInfo.content" placeholder-style="color:#999" @blur="textAreaBlur"
          placeholder="把你想说的分享出来吧" auto-height />
      </view>
      <uni-file-picker ref="imagePickerRef" v-model="fileList" limit="9" mode="grid" :auto-upload="false" title="请选择图片(非必传)"
        @select="selectImage" @delete="e => deleteImage(e, boardInfo.photoSrc)"></uni-file-picker>
    </view>
    <button type="primary" class="uni-primary-bg editBtn" @click="submitBoard" :disabled="!isValid">发布</button>
  </view>
</template>

<script>
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import useUpload from '@/composables/useUpload'
  import { getBoard, addBoard } from '@/request_api/board'
  import { getOptionList } from '@/request_api/option'
  import { requestOption } from '@/common/get-options'
  import { goBack } from '@/common/utils'

  export default {
    setup(props) {
      const store = useStore()
      const userId = computed(() => store.getters.userId)

      const isLoading = ref(false)

      const topicOption = ref([])
      const topicList = ref([])
      const pickerIndex = ref(0)
      const pickerTopicName = computed(() => {
        return topicList.value.length ? topicList.value[pickerIndex.value].text : '不限话题'
      })

      const boardInfo = reactive({
        topic: '', // 话题
        content: '', // 详细内容
        photoSrc: [],
        icon: '',
        color: '',
        created_time: null
      })

      const { uploadList, getUploadData, fileList, initialList, selectImage, deleteImage } = useUpload(9)

      const isValid = computed(() => boardInfo.content !== '')
      const imagePickerRef = ref(null)

      const getTopicList = async () => {
        isLoading.value = true
        const res = await requestOption({ type: 'topic', title: '话题', key: 'topic', unMulit: true })
        topicList.value = res.list
        isLoading.value = false
      }

      const topicPickerChange = (e) => {
        pickerIndex.value = e.detail.value
        boardInfo.topic = (pickerTopicName.value === '不限话题') ? '' : pickerTopicName.value
      }

      const getBoardInfo = async (id) => {
        await getTopicList()
        isLoading.value = true
        const { data } = await getBoard(id)
        Object.keys(data).forEach(key => {
          boardInfo[key] = data[key]
        })
        initialList(boardInfo.photoSrc)
        const index = topicList.value.findIndex(t => {
          let topic = boardInfo.topic ? boardInfo.topic : '不限话题'
          return t.value === topic
        })
        pickerIndex.value = index
        isLoading.value = false
      }

      const addTopicInfo = () => {
        const topicInfo = topicOption.value.filter(item => item.name === pickerTopicName.value)
        boardInfo.icon = topicInfo[0].icon
        boardInfo.color = topicInfo[0].color
      }

      const submitBoard = async () => {
        try {
          if (uploadList.value.length) {
            // 有待上传文件先去上传
            const dealImgList = await getUploadData()
            boardInfo.photoSrc.push(...dealImgList)
          }
          if (!boardInfo.photoSrc.length) {
            uni.showToast({
              title: '请上传图片！',
              icon: 'error'
            })
            return
          }
          boardInfo.user = userId.value
          addTopicInfo()
          await addBoard(boardInfo)
          uni.showToast({
            title: '发布成功',
            duration: 2000,
            success() {
              goBack('board')
            }
          })
        } catch (err) {
          console.log(err)
        }
      }

      const textAreaBlur = (e) => {
        boardInfo.content = e.detail.value

      }

      onMounted(() => {
        getOptionList({ type: 'topic' }).then(res => {
          topicOption.value = res.data
        })
      })

      return {
        pickerIndex,
        pickerTopicName,
        topicList,
        topicPickerChange,
        isValid,
        isLoading,
        getTopicList,
        getBoardInfo,
        submitBoard,
        boardInfo,
        textAreaBlur,
        fileList,
        selectImage,
        deleteImage,
        imagePickerRef,
      };
    },
    onLoad(options) {
      if (options.id) {
        this.getBoardInfo(options.id)
      } else {
        this.getTopicList()
      }
    }
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
