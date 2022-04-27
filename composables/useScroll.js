import { ref, computed, watch } from 'vue'
import { getScrollHeight } from '@/common/utils'

/*
  本函数有两个应用场景：
  (1). 整页的滚动列表计算对应的 pageSize
  (2). 通过获取外部容器高度动态设置<scroll-view>组件的高度，并计算 pageSize
*/

export default function useScroll({
  fullDomClass, // 滚动列表外部容器的类名，也可以是id
  topDomClass, // 容器内需要减去的 DOM 的类名
  listQuery, // 列表查询参数，主要用于获取和操作 pageSize
  singleHeight // 列表单个元素的高度
}) {
  // 滚动列表的高度 / <scroll-view> 组件的高度
  const scrollHeight = ref(0)
  // 应用中 顶部选项卡滚动列表的比较多，就默认一个 swiper 外部容器的类名
  // const fullDom = fullDomClass || '.uni-swiper-wrapper'

  // 包含滚动列表的组件挂载成功后，调用这个方法
  // 获取/计算真正滚动部分的高度，并给 scrollHeight 赋值
  const changeScrollHeight = () => {
    getScrollHeight(scrollHeight, fullDomClass, topDomClass)
  }

  // 传过来的 singleHeight 是个 ref 对象，是在 useList 函数内的属性
  // singleHeight 被赋值的时机是：当 pageSize 为 0 时请求到列表数据并赋值给组件的 list 属性，
  // 再等到 DOM 渲染成功，就去获取单个元素高度。
  watch([scrollHeight, singleHeight], val => {
    if (val[0] && val[1]) {
      listQuery.pageSize = Math.ceil(val[0] / val[1])
      listQuery.page = 1
    }
  }, )

  return {
    scrollHeight,
    changeScrollHeight,
  }
}
