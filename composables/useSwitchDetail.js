import { computed } from 'vue'
import { useStore } from 'vuex'

export default function useSwitchDetail(itemId, callback) {
  const store = useStore()
  const listIds = computed(() => store.getters.listIds)
  const listParams = computed(() => store.getters.listParams)
  const listApi = computed(() => store.getters.listApi)
  const total = computed(() => store.getters.total)

  // 查看前一项
  const switchPrev = () => {
    // 获取当前项在存储的列表 id 数组中的序号
    const index = listIds.value.indexOf(itemId.value)

    if (index === 0) {
      // 当前项是目前列表中的第一条
      uni.showToast({
        title: '已经是第一项',
        icon: 'error',
      })
      return
    }
    callback(listIds.value[index - 1])
  }

  // 查看后一项
  const switchNext = async () => {
    const index = listIds.value.indexOf(itemId.value)

    if (index === listIds.value.length - 1) {
      // 当前项是目前列表中的最后一条，就需要去请求下一页数据，以得到后面的 ids
      if (index === total.value - 1) {
        // 如果是列表总数的最后一条
        uni.showToast({
          title: '已经是最后一项',
          icon: 'error',
        })
        return
      } else {
        const queryParams = listParams.value
        const totalPage = Math.ceil(total.value / queryParams.pageSize)
        // 如果下一页的页码值大于总页数直接 return
        if (
          queryParams.page + 1 > totalPage ||
          total.value <= queryParams.pageSize
        )
          return
        queryParams.page += 1
        // 请求参数放入缓存
        store.commit('list/setParams', queryParams)

        const { data } = await listApi.value(queryParams)
        const idsArr = listIds.value
        data.list.map(item => {
          idsArr.push(item._id)
        })
        store.commit('list/setIds', idsArr)
        callback(listIds.value[index + 1])
      }
    } else {
      callback(listIds.value[index + 1])
    }
  }

  const switchFun = type => {
    if (type === 'prev') {
      switchPrev()
    } else {
      switchNext()
    }
  }

  return {
    switchFun,
  }
}
