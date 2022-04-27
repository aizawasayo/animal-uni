import { ref, toRefs, watch, nextTick } from 'vue'
import { getSingleHeight } from '@/common/utils'

/*
  捋一下滚动列表逻辑：(这里以 ScrollView组件为例)
  - 滚动到底部/上拉加载：
    触发 @scrolltolower 事件(绑定了本函数)的 loadMore 方法：
    1）如果正在请求数据中(getList)，则 return (用本函数的变量 listLoading 判断)
    2）根据数据总条数 total 和 pageSize 计算，如果下一页的页码值 page 大于总页数 return
      status 为 noMore，没有更多了 (其他情况 status 的默认状态为 more)
    3）都不符合则 page + 1，去请求下一页，并且将 status 设置为 正在加载中（loading）
    4）请求结束🔚后 将 listLoading 设置为 false
  
  - 下拉刷新/普通刷新：
    触发 @refresherrefresh 绑定的 refreshList(普通刷新时手动调用这个事件)：
    1）如果正在请求数据中 return (若 listLoading 为 true 即表示还在请求中)
    2）将 refresher-triggered 属性绑定的值设置 为 true
    3）如果当前页不为 1，将 page 赋值为 1；如果本身就为 1，则执行 getList
    4）请求结束🔚后 将 listLoading 和 isRefresh 都设置为 false
    * 说明：
    :refresher-triggered="isRefresh" // 当前下拉刷新状态：true/false 下拉刷新已经被触发/未被触发
    @refresherpulling="onPulling" // 自定义下拉刷新控件被下拉 / 下拉后触发顺序 ① 
    @refresherrefresh="refreshList" // 自定义下拉刷新被触发 / 下拉后触发顺序 ②
    @refresherrestore="onRestore" // 自定义下拉刷新被复位 / 下拉后触发顺序 ③
    @refresherabort="onAbort" // 自定义下拉刷新被中止
*/

// 请求分页列表数据
export default function useList(listQuery, getListApi, type, singleDomClass) {
  const { page, pageSize } = toRefs(listQuery)
  const list = ref(null)
  const total = ref(0)
  const allList = ref(null)
  const listLoading = ref(false)
  const status = ref('more') // more|loading|noMore	对应 上拉显示更多｜正在加载中｜没有更多了
  const error = ref(null)
  const isRefresh = ref(false) // 下拉刷新是否被触发
  const singleHeight = ref(0)

  let params = [] // 用来处理评论 api 的特殊情况
  type && type.value ?
    (params = [type.value, listQuery]) :
    (params = [listQuery])

  const getList = async () => {
    if (listLoading.value) return
    listLoading.value = true
    status.value = 'loading'
    try {
      const { data } = await getListApi(...params)
      total.value = data.total

      if (page.value === 1) {
        list.value = data.list
        nextTick(() => {
          if (pageSize.value === 0) {
            allList.value = data.list
            getSingleHeight(singleHeight, singleDomClass)
          }
        })
      } else {
        list.value = list.value.concat(data.list)
      }
    } catch (err) {
      error.value = err
    } finally {
      listLoading.value = false
      isRefresh.value = false
      status.value = total.value <= pageSize.value ? 'noMore' : 'more'
      uni.stopPullDownRefresh()
    }
  }

  const loadMore = () => {
    if (listLoading.value) return
    const totalPage = Math.ceil(total.value / pageSize.value)
    // 如果下一页的页码值大于总页数直接return
    if (page.value + 1 > totalPage || total.value <= pageSize.value) return status.value = 'noMore'

    listQuery.page = listQuery.page + 1
  }

  // 刷新列表
  const refreshList = () => {
    if (listLoading.value) return
    isRefresh.value = true
    if (listQuery.page === 1) {
      setTimeout(getList, 500)
    } else {
      // 非第一页则把页码改成 1 即可
      listQuery.page = 1
    }
  }

  // onMounted(getList)

  // 筛选条件改变时，刷新数据
  watch(() => listQuery.sort, val => {
    refreshList()
  })

  // watch 能监听 getter，而且必须像这样使用箭头函数。或者直接监听一个 ref
  watch(
    listQuery,
    val => {
      getList()
    }, { immediate: true, deep: true } // 初始化时就执行一次，代替 onMounted 钩子
  )

  // 也可像这样直接监听 ref 数组
  // watch(
  //   [page, pageSize],
  //   (newValues, prevValues) => {
  //     getList()
  //   },
  //   { immediate: true }
  // )

  return {
    allList,
    list,
    total,
    listLoading,
    status,
    error,
    isRefresh,
    refreshList,
    loadMore,
    singleHeight
  }
}
