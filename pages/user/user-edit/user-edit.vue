<template>
  <uni-loading v-if="isLoading"></uni-loading>
  <view v-else>
    <view class="avatarContainer">
      <view class="editAvatar">
        <image :src="avatarFile" class="avatarImg" @click="chooseImage"></image>
        <uni-icons type="camera-filled" size="22" color="#7C77B9" class="avatarIcon" />
      </view>
      <text class="avatarTip">点击更新头像</text>
    </view>
    <view class="formContainer">
      <uni-forms ref="userFormRef" :rules="userFormRules" :modelValue="userFormData" :border="true" label-width="160">
        <uni-forms-item label="昵称" required name="nickname" leftIcon="person-filled" icon-color="#ec407a">
          <uni-easyinput v-model="userFormData.nickname" placeholder="请输入昵称" :inputBorder="false"
            style="font-size: 16px;" @input="isValid = true" />
        </uni-forms-item>
        <uni-forms-item label="动森ID" required name="gameId" leftIcon="info-filled" icon-color="#cddc39">
          <uni-easyinput v-model="userFormData.gameId" placeholder="请输入动森ID" :inputBorder="false"
            @input="isValid = true" />
        </uni-forms-item>
        <uni-forms-item label="岛屿位置" name="position" leftIcon="map-pin-ellipse" icon-color="#29b6f6">
          <uni-data-checkbox selectedTextColor="#3FB984" selectedColor="#3FB984" v-model="userFormData.position"
            :localdata="positionList">
          </uni-data-checkbox>
        </uni-forms-item>
        <uni-forms-item label="登岛日期" leftIcon="flag-filled" icon-color="#8BC34A">
          <uni-datetime-picker class="datetime-picker" type="date" v-model="pickerDate" @change="changeDate($event)"
            :end="nowTime">{{ pickerDate }}
          </uni-datetime-picker>
        </uni-forms-item>
        <uni-forms-item label="岛屿名称" name="islandName" leftIcon="paperplane-filled" icon-color="#3f51b5">
          <uni-easyinput v-model="userFormData.islandName" placeholder="岛屿名称" :inputBorder="false"
            @input="isValid = true"
            style="font-size: 16px;" />
        </uni-forms-item>
        <uni-forms-item label="个性签名" name="signature" leftIcon="paperclip" icon-color="#FDD835">
          <uni-easyinput type="textarea" v-model="userFormData.signature" placeholder="请输入个性签名"
            @input="isValid = true" />
        </uni-forms-item>
      </uni-forms>
    </view>
    <button type="primary" class="uni-primary-bg editBtn" @click="submitEdit" :disabled="!isValid">修改</button>
    <view style="height: 15px;"></view>
  </view>
</template>

<script>
  import { ref, reactive, computed, watch, onMounted, inject } from 'vue'
  import { useStore } from 'vuex'
  import useUpload from '@/composables/useUpload'
  import usePickerDate from '@/composables/usePickerDate'
  import { getUser, editUser } from '@/request_api/user'
  import { timestamp } from '@/common/utils'

  export default {
    name: 'UserEdit',
    // inject: ['apiUrl'],
    setup(props) {
      const store = useStore()
      const apiUrl = inject('apiUrl')

      const userFormRef = ref(null)
      const userFormData = reactive({})
      const isValid = ref(true)
      const isLoading = ref(false)

      const userId = computed(() => store.getters.userId)

      const { uploadList, chooseImage, getUploadData } = useUpload(1)

      const avatarFile = computed(() => {
        if (uploadList.value[0] && uploadList.value[0].indexOf('blob') > -1) {
          // 提交整个表单时才会去手动上传，这个条件赋值只是预览 
          return uploadList.value[0]
        }
        return apiUrl + userFormData.avatar
      })

      const pickerDateProps = usePickerDate(userFormData)

      const getUserInfo = async () => {
        isLoading.value = true
        const { data } = await getUser(userId.value)
        Object.keys(data).forEach(key => {
          userFormData[key] = data[key]
        })
        // uploadList.value[0] = userFormData.avatar
        isLoading.value = false
      }

      const submitEdit = async () => {
        try {
          await userFormRef.value.validate()
          isValid.value = true
          if (uploadList.value.length) {
            userFormData.avatar = await getUploadData()
          }
          userFormData.startDate = timestamp(pickerDateProps.pickerDate.value)
          const res = await editUser(userId.value, userFormData)
          uni.showToast({
            title: res.message,
            success: res => {
              uni.navigateBack({})
            }
          })
        } catch (err) {
          uni.showToast({
            title: err.message,
            icon: 'error'
          })
          isValid.value = false
        }
      }

      onMounted(() => {
        getUserInfo()
      })

      return {
        ...pickerDateProps,
        isLoading,
        userId,
        userFormRef,
        userFormData,
        isValid,
        getUserInfo,
        submitEdit,
        avatarFile,
        chooseImage,
        positionList: [
          { value: 'North', text: '北半球' },
          { value: 'South', text: '南半球' }
        ],
        userFormRules: {
          nickname: {
            rules: [{
              required: true,
              errorMessage: '用户名不能为空'
            }, {
              validateFunction: function(rule, value, data, callback) {
                if (value.length < 2 || value.length > 12) {
                  callback('用户名长度应在2-12之间')
                }
                return true
              }
            }]
          },
          gameId: {
            rules: [{
              maxLength: 17,
              errorMessage: '动森ID只有17位数'
            }]
          }
        },
      }
    },
    onShow() {
      if (this.userId) {
        this.getUserInfo()
      }
    }
  }
</script>

<style lang="scss">
  .avatarContainer {
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 50rpx;
    padding-bottom: 50rpx;

    .editAvatar {
      width: 90px;
      height: 90px;
      position: relative;

      .avatarImg {
        width: 160rpx;
        height: 160rpx;
        border-radius: 50%;
        box-shadow: 0 0 10rpx rgba($color: #000000, $alpha: 0.2);
      }

      .avatarIcon {
        position: absolute;
        bottom: -10rpx;
        right: 10rpx;
      }
    }

    .avatarTip {
      line-height: 58rpx;
      font-size: 24rpx;
      color: '#9E9E9E'
    }
  }

  .editBtn {
    margin: 30rpx;
  }
</style>
