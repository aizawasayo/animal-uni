<template>
  <view class="loginBox">
    <view class="loginPadd">
      <uni-forms
        ref="registerFormRef"
        :rules="registerFormRules"
        :modelValue="registerFormData"
        label-position="top"
        :border="true"
      >
        <uni-forms-item label="邮箱" required name="email">
          <uni-easyinput
            v-model="registerFormData.email"
            placeholder="请输入邮箱"
            :inputBorder="false"
            prefixIcon="email"
            style="font-size: 16px"
            @input="isValid = true"
          />
        </uni-forms-item>
        <uni-forms-item label="用户名" required name="username">
          <uni-easyinput
            v-model="registerFormData.username"
            placeholder="请输入用户名"
            :inputBorder="false"
            prefixIcon="contact"
            style="font-size: 16px"
            @input="isValid = true"
          />
        </uni-forms-item>
        <uni-forms-item label="密码" required name="password">
          <uni-easyinput
            type="password"
            v-model="registerFormData.password"
            placeholder="请输入密码"
            :inputBorder="false"
            prefixIcon="locked-filled"
            @input="isValid = true"
          />
        </uni-forms-item>
      </uni-forms>
      <button
        type="primary"
        class="uni-primary-bg"
        @click="goRegister"
        :disabled="!isValid"
      >
        注册
      </button>
    </view>
  </view>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { clearReactiveObj } from '@/common/utils.js'
import { addUser } from '@/request_api/user'
import { goPage } from '../../../common/utils'

export default {
  name: 'Register',
  setup(props) {
    const registerFormData = reactive({
      email: '',
      username: '',
      password: '',
    })
    const registerFormRef = ref(null)
    const isValid = ref(true)

    const goRegister = () => {
      registerFormRef.value
        .validate()
        .then(res => {
          isValid.value = true
          addUser(registerFormData)
            .then(res1 => {
              uni.showModal({
                title: '提示',
                content: '注册成功，立即登录?',
                confirmColor: '#3FB984',
                success: function (res) {
                  if (res.confirm) {
                    uni.navigateBack({
                      success() {
                        let pages = getCurrentPages() // 当前页面
                        let beforePage = pages[pages.length - 2] // 上一页
                        if (!beforePage || !beforePage.loginFormData)
                          beforePage = pages[pages.length - 1]

                        beforePage.loginFormData.username =
                          registerFormData.username
                        beforePage.loginFormData.password =
                          registerFormData.password
                        // beforePage.changeTagMode && beforePage.changeTagMode()
                      },
                    })
                  } else if (res.cancel) {
                    uni.switchTab({
                      url: '/pages/tabBar/guide/guide',
                    })
                  }
                },
              })
            })
            .catch(err => {
              const errMessage =
                typeof err !== 'object'
                  ? '注册失败，请检查后重新输入，点击【确定】按钮将清除输入内容。'
                  : '提交失败，' + err.message
              uni.showModal({
                title: '提示',
                content: errMessage,
                confirmColor: '#3FB984',
                success: function (res) {
                  if (res.confirm) {
                    clearReactiveObj(registerFormData, '')
                    isValid.value = true
                  }
                },
              })
            })
        })
        .catch(err => {
          isValid.value = false
          // 表单验证错误
          console.log(err)
        })
    }

    return {
      registerFormRef,
      registerFormData,
      isValid,
      goRegister,
      registerFormRules: {
        email: {
          rules: [
            {
              required: true,
              errorMessage: '请输入邮箱',
            },
            {
              format: 'email',
              errorMessage: '请输入正确的邮箱地址',
            },
          ],
        },
        username: {
          rules: [
            {
              required: true,
              errorMessage: '用户名不能为空',
            },
            {
              minLength: 6,
              maxLength: 12,
              errorMessage: '用户名长度在 {minLength} 到 {maxLength} 个字符',
            },
          ],
        },
        password: {
          rules: [
            {
              required: true,
              errorMessage: '密码不能为空',
            },
            {
              validateFunction: function (rule, value, data, callback) {
                // 至少8个字符，至少1个大写字母，1个小写字母和1个数字,不能包含特殊字符（非数字字母）：
                // ^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$
                const reg = new RegExp(/^[a-zA-Z0-9]{8,16}$/)
                if (!value) {
                  callback('密码不能为空')
                } else if (!reg.test(value)) {
                  callback('密码不符合规则')
                }
                return true
              },
            },
          ],
        },
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.loginBox {
  height: 100%;
  background-color: white;

  .loginPadd {
    padding: 100rpx 50rpx;
  }

  .uni-input-wrapper {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    // padding: 8px 13px;
    flex-direction: row;
    flex-wrap: nowrap;
    background-color: #ffffff;
  }
}

.uni-input-placeholder,
.uni-input-input {
  display: flex;
  justify-content: flex-start;
  text-align: right;
  align-items: center;
  line-height: 28px;
  font-size: 15px;
  padding: 0px;
  flex: 1;
  background-color: #ffffff;
}

.uni-icon {
  font-family: uniicons;
  font-size: 24px;
  font-weight: normal;
  font-style: normal;
  width: 24px;
  height: 24px;
  line-height: 24px;
  color: #999999;
}

.uni-eye-active {
  color: #3fb984;
}

.register-text {
  color: $uni-color-info;
  text-align: center;
  line-height: 40px;
  text-decoration: underline;
}
</style>
