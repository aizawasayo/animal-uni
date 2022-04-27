import { ref, computed } from 'vue'

export default function useSort(checkSort, sortFun) {
  const checkKey = computed(() => Object.keys(checkSort.value)[0])
  const checkVal = computed(() => Object.values(checkSort.value)[0])

  const sortChange = sortKey => {
    let newSort = {
      [sortKey]: 1
    }

    if (checkKey.value === sortKey) { // 如果是切换同一个key的正序倒序     
      const sVal = checkVal.value === 1 ? -1 : 1
      newSort = {
        [sortKey]: sVal
      }
    }
    // 去改变父组件共用的 sort
    sortFun && sortFun(newSort)
  }

  const sortString = computed(() => JSON.stringify(checkSort.value))

  return {
    sortString,
    checkKey,
    checkVal,
    sortChange,
  }
}
