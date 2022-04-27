<template>
  <view class="loginBox">
    <uni-forms ref="loginFormRef" :rules="loginFormRules" :modelValue="loginFormData" label-position="top"
      :border="true">
      <uni-forms-item label="用户名" required name="username">
        <uni-easyinput v-model="loginFormData.username" placeholder="请输入用户名" :inputBorder="false" prefixIcon="contact"
          style="font-size: 16px;" @input="isValid = true" />
      </uni-forms-item>
      <uni-forms-item label="密码" required name="password">
        <uni-easyinput type="password" v-model="loginFormData.password" placeholder="请输入密码" :inputBorder="false"
          prefixIcon="locked-filled" @input="isValid = true" />
      </uni-forms-item>
    </uni-forms>
    <button type="primary" class="uni-primary-bg" @click="goLogin" :disabled="!isValid">登录</button>
  </view>
</template>

<script>
  import { ref, reactive } from 'vue'
  import { useStore } from 'vuex'
  import { clearReactiveObj } from '@/common/utils.js'

  export default {
    name: 'Login',
    setup(props) {
      const loginFormData = reactive({
        username: 'aizawasayo',
        password: 'iwnini122900'
      })
      const loginFormRef = ref(null)
      const isValid = ref(true)

      const store = useStore()

      const goLogin = async () => {
        try {
          await loginFormRef.value.validate()
          isValid.value = true
          await store.dispatch('user/login', loginFormData)
          uni.showToast({
            title: `登录成功`,
            success: (res) => {
              uni.navigateBack({
                success() {
                  let pages = getCurrentPages(); // 当前页面
                  let beforePage = pages[pages.length - 2]; // 上一页
                  // beforePage.changeTagMode && beforePage.changeTagMode()
                }
              })
            }
          })
        } catch (err) {
          isValid.value = false
          if (typeof err !== 'object') {
            uni.showModal({
              title: '提示',
              content: '登录失败，请检查后重新输入，点击【确定】按钮将清除输入内容。',
              confirmColor: '#3FB984',
              success: function(res) {
                if (res.confirm) {
                  clearReactiveObj(loginFormData, '')
                  isValid.value = true
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            });
          }
        }
      }

      return {
        loginFormRef,
        loginFormData,
        isValid,
        goLogin,
        loginFormRules: {
          username: {
            rules: [{
              required: true,
              errorMessage: '用户名不能为空'
            }, {
              validateFunction: function(rule, value, data, callback) {
                if (value.length < 6 || value.length > 12) {
                  callback('用户名长度应在6-12之间')
                }
                return true
              }
            }]
          },
          password: {
            rules: [{
              required: true,
              errorMessage: '密码不能为空'
            }]
          },
        },
      }
    }
  }
</script>

<style lang="scss">
  page {
    height: 100%;
  }

  .loginBox {
    height: 100%;
    padding: 100rpx 30rpx;
    background-color: white;
  }

  .uni-form-item__title {
    font-size: 16px;
    line-height: 24px;
  }

  .uni-input-wrapper {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    padding: 8px 13px;
    flex-direction: row;
    flex-wrap: nowrap;
    background-color: #FFFFFF;
  }

  .uni-input {
    height: 28px;
    line-height: 28px;
    font-size: 15px;
    padding: 0px;
    flex: 1;
    background-color: #FFFFFF;
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
    color: #3FB984;
  }
</style>
