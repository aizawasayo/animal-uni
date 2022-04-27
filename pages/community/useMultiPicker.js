import { ref, computed } from "vue"

export default function useMultiPicker(optionList, formData) {
  let firstArr = []
  optionList.forEach(op => firstArr.push(op.type))

  /* 当前选中的每个列序号值数组
    默认为 [0,0]
    如果是修改信息而非新发布，则根据传入的 formData.exchangeType 来
  */
  const multiIndex = computed(() => {
    let indexArray = [0, 0]
    if (formData.exchangeType) {
      const exchangeTypeArr = formData.exchangeType.split('-')
      console.log(exchangeTypeArr)
      indexArray[0] = firstArr.findIndex(item => item === exchangeTypeArr[0])
      indexArray[1] = optionList[indexArray[0]].children.findIndex(item => item === exchangeTypeArr[1])
    }
    return indexArray
  })

  const multiArrayColumn2 = computed(() => [...optionList[multiIndex.value[0]].children])
  /* 多列选择列表的可选值：
  - 第一个参数：Array，第一列可选值，根据传过来的配置项固定
  - 第二个参数： Array，第二列是可选值，根据第一列选择的值变化
  */
  const multiArray = ref([
    firstArr,
    multiArrayColumn2.value,
  ])

  const multiColumnChange = (e) => {
    multiIndex.value[e.detail.column] = e.detail.value
    if (e.detail.column === 0) {
      // 当触发滑动第一列的时候，自动改变第二列为对应的数组
      multiArray.value[1] = exchangeList[multiIndex.value[0]].children
    }
  }

  return {
    multiArray,
    multiIndex,
    multiColumnChange
  }
}
