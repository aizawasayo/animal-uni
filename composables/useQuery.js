import { ref } from 'vue'
import {
  onNavigationBarSearchInputChanged,
  onNavigationBarSearchInputConfirmed,
} from '@dcloudio/uni-app'

export default function useQuery() {
  const query = ref('')

  // 当 searchInput 输入时触发
  onNavigationBarSearchInputChanged(e => {
    query.value = e.text
  })

  // 点击软键盘搜索按键触发
  onNavigationBarSearchInputConfirmed(e => {
    let text = e.text
    if (!text) {
      uni.showModal({
        title: '提示',
        content: '请输入内容。',
      })
      return
    } else {
      query.value = text
    }
  })

  return {
    query,
  }
}
