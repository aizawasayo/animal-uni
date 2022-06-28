import { ref, watch, nextTick } from 'vue'

// z-paging分页列表组合方法
export default function usePagingList(
  listApi,
  listQuery,
  currentIndex,
  tabIndex,
  recordPage
) {
  const paging = ref(null)
  const dataList = ref([])
  const total = ref(0)
  const firstLoaded = ref(false)

  // 博物馆等场景记住当前页码和 pageSize 用
  const page = ref(0)
  const limit = ref(0)

  const reloadList = () => {
    paging.value.reload()
  }

  watch(
    currentIndex,
    newVal => {
      if (newVal === tabIndex.value) {
        //懒加载，当滑动到当前的item时，才去加载
        if (!firstLoaded.value) {
          nextTick(() => {
            reloadList()
          })
        }
      }
    },
    { immediate: true }
  )

  // watch 能监听 getter，而且必须像这样使用箭头函数。或者直接监听一个 ref
  watch(
    listQuery,
    val => {
      reloadList()
    },
    { deep: true }
  )

  const queryList = (pageNo, pageSize) => {
    // 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
    // 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
    // 模拟请求服务器获取分页数据，请替换成自己的网络请求
    const params = {
      page: pageNo,
      pageSize,
      ...listQuery,
    }

    if (recordPage) {
      page.value = pageNo
      limit.value = pageSize
    }

    listApi(params)
      .then(res => {
        // 将请求的结果数组传递给z-paging
        total.value = res.data.total
        paging.value.complete(res.data.list)
        firstLoaded.value = true
      })
      .catch(res => {
        // 如果请求失败写this.$refs.paging.complete(false);
        // 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
        // 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
        paging.value.complete(false)
      })
  }

  return {
    paging,
    dataList,
    total,
    queryList,
    reloadList,
    page,
    limit,
  }
}
