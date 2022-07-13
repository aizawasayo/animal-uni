<template>
  <view class="loginBox">
    <view class="loginPadd">
      <uni-forms
        ref="loginFormRef"
        :rules="loginFormRules"
        :modelValue="loginFormData"
        label-position="top"
        :border="true"
      >
        <uni-forms-item label="用户名" required name="username">
          <uni-easyinput
            v-model="loginFormData.username"
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
            v-model="loginFormData.password"
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
        @click="goLogin"
        :disabled="!isValid"
      >
        登录
      </button>
      <navigator class="register-text" url="/pages/user/register/register"
        >还没有账号？去注册</navigator
      >
      <!-- #ifndef H5 -->
      <view class="thirdpart-line">
        <view></view>
        <text>第三方登录</text>
        <view></view>
      </view>
      <view class="thirdpart-login">
        <image src="@/static/weixin.png" @click="thirdLogin('weixin')" />
        <image src="@/static/qq.png" @click="thirdLogin('qq')" />
        <image src="@/static/weibo.png" @click="thirdLogin('sinaweibo')" />
      </view>
      <!-- #endif -->
    </view>
  </view>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { onLoad } from '@dcloudio/uni-app'
import { clearReactiveObj } from '@/common/utils.js'

export default {
  name: 'Login',
  setup(props) {
    const loginFormData = reactive({
      username: 'aizawasayo',
      password: 'iwnini122900',
    })
    const loginFormRef = ref(null)
    const isValid = ref(true)

    const store = useStore()
    const isUniverifyLogin = computed(() => store.isUniverifyLogin)
    const univerifyErrorMsg = computed(() => store.univerifyErrorMsg)
    const phoneNumber = computed(() => store.phoneNumber)

    const goLogin = async () => {
      try {
        await loginFormRef.value.validate()
        isValid.value = true
        await store.dispatch('user/login', loginFormData)
        uni.showToast({
          title: `登录成功`,
          success: res => {
            uni.navigateBack({
              success() {
                let pages = getCurrentPages() // 当前页面
                let beforePage = pages[pages.length - 2] // 上一页
                // beforePage.changeTagMode && beforePage.changeTagMode()
              },
            })
          },
        })
      } catch (err) {
        isValid.value = false
        if (!Array.isArray(err)) {
          // 非表单验证错误
          const errMessage =
            typeof err !== 'object'
              ? '登录失败，请检查后重新输入，点击【确定】按钮将清除输入内容。'
              : '登录失败，' + err.message
          uni.showModal({
            title: '提示',
            content: errMessage,
            confirmColor: '#3FB984',
            success: function (res) {
              if (res.confirm) {
                clearReactiveObj(loginFormData, '')
                isValid.value = true
              } else if (res.cancel) {
                // console.log('用户点击取消')
              }
            },
          })
        }
      }
    }

    const univerifyInfoKey = 'univerifyInfo'
    const providerList = ref([])

    const thirdLogin = provider => {
      // 一键登录已在APP onLaunch的时候进行了预登陆，可以显著提高登录速度。登录成功后，预登陆状态会重置
      uni.login({
        provider,
        // #ifdef MP-ALIPAY
        scopes: 'auth_user', //支付宝小程序需设置授权类型
        // #endif
        success: async res => {
          console.log('login success:', res)
          uni.showToast({
            title: '登录成功',
            duration: 1000,
          })
          // 更新保存在 store 中的登录状态
          store.commit('setProvide', provider)
          // #ifdef APP-PLUS
          store.commit('setUniverifyLogin', provider === 'univerify')
          switch (provider) {
            case 'univerify': // 一键登录
              store.dispatch('loginByUniverify', { provider, res })
              break
            case 'apple':
              store.dispatch('loginByApple', { provider, res })
              break
          }
          // #endif
          // #ifdef MP-WEIXIN
          console.warn(
            '如需获取openid请参考uni-id: https://uniapp.dcloud.net.cn/uniCloud/uni-id'
          )
          uni.request({
            url: 'https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/user-center',
            method: 'POST',
            data: {
              action: 'loginByWeixin',
              params: {
                code: res.code,
                platform: 'mp-weixin',
              },
            },
            success(res) {
              console.log(res)
              if (res.data.code !== 0) {
                console.log('获取openid失败：', res.data.errMsg)
                return
              }
              uni.setStorageSync('openid', res.data.openid)
            },
            fail(err) {
              console.log('获取openid失败：', err)
            },
          })
          // #endif
        },
        fail: err => {
          console.log('login fail:', err)
          // 一键登录点击其他登录方式
          if (err.code == '30002') {
            uni.closeAuthView()

            uni.showToast({
              title: '其他登录方式',
              duration: 1000,
            })
            return
          }
          // 未开通
          if (err.code == 1000) {
            uni.showModal({
              title: '登录失败',
              content: `${err.errMsg}\n，错误码：${err.code}`,
              confirmText: '开通指南',
              cancelText: '确定',
              success: res => {
                if (res.confirm) {
                  setTimeout(() => {
                    plus.runtime.openWeb(
                      'https://ask.dcloud.net.cn/article/37965'
                    )
                  }, 500)
                }
              },
            })
            return
          }
          // 一键登录预登陆失败
          if (err.code == '30005') {
            uni.showModal({
              showCancel: false,
              title: '预登录失败',
              content: univerifyErrorMsg.value || err.errMsg,
            })
            return
          }
          // 一键登录用户关闭验证界面
          if (err.code != '30003') {
            uni.showModal({
              showCancel: false,
              title: '登录失败',
              content: JSON.stringify(err),
            })
          }
        },
        complete: () => {},
      })
    }

    onLoad(() => {
      // #ifndef H5
      uni.getProvider({
        service: 'oauth', // 获取服务供应商
        success: result => {
          providerList.value = result.provider.map(value => {
            let providerName = ''
            switch (value) {
              case 'weixin':
                providerName = '微信登录'
                break
              case 'qq':
                providerName = 'QQ登录'
                break
              case 'sinaweibo':
                providerName = '新浪微博登录'
                break
              case 'xiaomi':
                providerName = '小米登录'
                break
              case 'alipay':
                providerName = '支付宝登录'
                break
              case 'baidu':
                providerName = '百度登录'
                break
              case 'jd':
                providerName = '京东登录'
                break
              case 'toutiao':
                providerName = '头条登录'
                break
              case 'apple':
                providerName = '苹果登录'
                break
              case 'univerify':
                providerName = '一键登录'
                break
            }
            return {
              name: providerName,
              id: value,
            }
          })
        },
        fail: error => {
          console.log('获取登录通道失败', error)
        },
      })
      if (isUniverifyLogin.value) {
        store
          .dispatch('getPhoneNumber', uni.getStorageSync(univerifyInfoKey))
          .then(phoneNum => {
            store.commit('setPhoneNumber', phoneNum)
          })
      }
      // #endif
    })

    return {
      loginFormRef,
      loginFormData,
      isValid,
      goLogin,
      loginFormRules: {
        username: {
          rules: [
            {
              required: true,
              errorMessage: '用户名不能为空',
            },
            {
              validateFunction: function (rule, value, data, callback) {
                if (value.length < 6 || value.length > 12) {
                  callback('用户名长度应在6-12之间')
                }
                return true
              },
            },
          ],
        },
        password: {
          rules: [
            {
              required: true,
              errorMessage: '密码不能为空',
            },
          ],
        },
      },
      providerList,
      phoneNumber,
      isUniverifyLogin,
      thirdLogin,
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

.thirdpart-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 100rpx;
  view {
    flex: 1;
    height: 1px;
    background-color: #eee;
  }
  text {
    flex: 1;
    text-align: center;
    color: #666;
  }
}
.thirdpart-login {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 200rpx;
  image {
    width: 100rpx;
    height: 100rpx;
    margin: 0 20rpx;
  }
}
</style>
