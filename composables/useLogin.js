import { goPage } from '@/common/utils'

export default function useLogin(tipText, cancelCallback) {
  const goLogin = () => {
    uni.showModal({
      title: "提示",
      content: tipText || "本操作需要登录权限，请先登录",
      confirmColor: "#3FB984",
      success: function(res) {
        if (res.confirm) {
          goPage('/pages/user/login/login')
        } else if (res.cancel) {
          cancelCallback && cancelCallback()
        }
      },
    })
  }

  return {
    goLogin
  }
}
