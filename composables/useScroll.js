import { ref } from 'vue'
import { getScrollHeight } from '@/common/utils'

/*
  本函数有两个应用场景：
  通过获取外部容器高度动态设置<scroll-view>组件的高度
*/

export default function useScroll({
  fullDomClass, // 滚动列表外部容器的类名，也可以是id
  topDomClass, // 容器内需要减去的 DOM 的类名
}) {
  const scrollHeight = ref(0) // 滚动列表的高度 / <scroll-view> 组件的高度
  // 应用中 顶部选项卡滚动列表的比较多，就默认一个 swiper 外部容器的类名
  // const fullDom = fullDomClass || '.uni-swiper-wrapper'

  // 包含滚动列表的组件挂载成功后，调用这个方法
  // 获取/计算真正滚动部分的高度，并给 scrollHeight 赋值
  const changeScrollHeight = () => {
    getScrollHeight({
      heightRef: scrollHeight,
      fullDomClass,
      topDomClass,
    })
  }

  return {
    scrollHeight,
    changeScrollHeight,
  }
}
