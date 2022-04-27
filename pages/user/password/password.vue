<template>
  <view class="formContainer">
    <uni-forms ref="pswFormRef" :rules="pswFormRules" :modelValue="pswFormData" label-position="top"
      :border="true" label-width="160">
      <uni-forms-item label="原密码" required name="password" leftIcon="person-filled" icon-color="#cddc39">
        <uni-easyinput type="password" v-model="pswFormData.password" placeholder="请输入原密码" :inputBorder="false"
          prefixIcon="locked-filled" @input="isValid = true" />
      </uni-forms-item>
      <uni-forms-item label="确认原密码" required name="oldPsw" leftIcon="person-filled" icon-color="#81C784">
        <uni-easyinput type="password" v-model="pswFormData.oldPsw" placeholder="请确认原密码" :inputBorder="false"
          prefixIcon="locked-filled" @input="isValid = true" />
      </uni-forms-item>
      <uni-forms-item label="新密码" required name="newPsw" leftIcon="person-filled" icon-color="#009688">
        <uni-easyinput type="password" v-model="pswFormData.newPsw" placeholder="请输入新密码" :inputBorder="false"
          prefixIcon="locked-filled" @input="isValid = true" />
      </uni-forms-item>
    </uni-forms>
    <button type="primary" class="uni-primary-bg editBtn" @click="submitEdit" :disabled="!isValid">确认修改</button>
    <button type="default" class="resetBtn" @click="resetForm">重置</button>
  </view>
</template>

<script>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { modifyPsw } from '@/request_api/user'
  export default {
    setup(props) {
      const store = useStore()
      const pswFormData = reactive({ password: '', oldPsw: '', newPsw: '' })
      const pswFormRef = ref(null)
      const userId = computed(() => store.getters.userId)
      const isValid = ref(true)

      const submitEdit = async () => {
        try {
          await pswFormRef.value.validate()
          isValid.value = true
          pswFormData.startDate = pswFormData.startDate / 1000
          const res = await modifyPsw(userId.value, pswFormData)
          uni.showToast({
            title: res.message,
            success: res => {
              uni.navigateBack({})
            }
          })
        } catch (err) {
          uni.showToast({
            icon: 'error',
            title: '输入有误，请修改',
            duration: 2000
          })
          isValid.value = false
        }
      }

      const resetForm = () => {
        isValid.value = false
        Object.keys(pswFormData).forEach(key => {
          pswFormData[key] = ''
        })
      }

      const pswFormRules = {
        password: {
          rules: [{
            required: true,
            errorMessage: '原密码不能为空'
          }, {
            validateFunction: function(rule, value, data, callback) {
              if (pswFormData.oldPsw && value !== pswFormData.oldPsw) {
                callback('两次密码不一致，请重新填写')
              }
            }
          }]
        },
        oldPsw: {
          rules: [{
            required: true,
            errorMessage: '请确认原密码',
          }, {
            validateFunction: function(rule, value, data, callback) {
              if (pswFormData.password && value !== pswFormData.password) {
                callback('两次密码不一致，请重新填写')
              }
            }
          }]
        },
        newPsw: {
          rules: [{
            required: true,
            errorMessage: '新密码不能为空'
          }, {
            validateFunction: function(rule, value, data, callback) {
              const reg = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/)
              if (!reg.test(value)) {
                callback('密码长度必须在8-16之间，必须包含大小写字母和数字')
              }
              if (value === pswFormData.oldPsw) callback('新密码不能和原密码相同！')
            }
          }]
        }
      }

      return {
        pswFormRef,
        pswFormData,
        pswFormRules,
        isValid,
        submitEdit,
        resetForm
      };
    }
  }
</script>

<style lang="scss">
  .resetBtn {
    margin-top: 30rpx;
  }
</style>
