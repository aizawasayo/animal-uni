import { ref, onMounted } from 'vue'
import { getFilterOptions } from '@/common/get-options'

export default function useFilter(listQuery, type, reloadList) {
  const filterOpts = ref([])

  // 改变列表组件自身的选项数组 及 查询参数【listQuery】中的筛选条件
  const filterChange = param => {
    const key = param.key
    const checkVal = param.checkVal
    const filterList = param.list

    filterOpts.value.forEach(item => {
      if (item.key === key) {
        item.list = filterList
      }
    })

    Object.keys({
      [key]: checkVal,
    }).forEach(key => {
      listQuery[key] = checkVal
    })
    reloadList && reloadList()
  }

  // 重置筛选条件
  const resetFilter = () => {
    filterOpts.value.map(opt => {
      opt.list.map(item => {
        item.checked = false
      })
      return { ...opt }
    })

    const defaultKeys = ['query', 'page', 'pageSize', 'sort', 'sortJson']
    Object.keys(listQuery).forEach(key => {
      if (!defaultKeys.includes(key)) {
        delete listQuery[key]
      }
    })
    reloadList && reloadList()
  }

  onMounted(() => {
    getFilterOptions(type).then(filterOptions => {
      filterOpts.value = filterOptions
    })
  })

  // 清空筛选数据
  return {
    filterOpts,
    filterChange,
    resetFilter,
  }
}
