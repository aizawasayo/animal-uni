import { ref } from 'vue'

export default function useSwiperTabs() {
  const currentTab = ref(0)
  // tabs通知swiper切换
  const tabsChange = index => {
    currentTab.value = index
  }

  // swiper动画结束
  const animationfinish = e => {
    currentTab.value = e.detail.current
  }

  return {
    currentTab,
    tabsChange,
    animationfinish,
  }
}
