import { ref, computed } from "vue"
import { timeFormat } from '@/common/utils'

/*
  有效时间的逻辑是：
  - 新发布的信息：
    1. 选择器的默认值比当前时间多两小时，且不能选择当前时间之前的时间
    2. 也就是只能在 当前时间-24:00 的时间段里选
    3. 选择完成后赋值给 formData.validTime (处理成时间戳) 
  - 编辑已存在的信息: 
    1. 如果 formData.validTime 小于当前时间，则显示已过期，点击重新开启才显示 picker；
      不点击则不修改原本的 formData.validTime 值
    2. 如果 formData.validTime 还在有效期，则显示 picker，且值为 formData.validTime 的 时间
      若选择了新的时间再赋值给 formData.validTime
*/
export default function usePickerTime(formData) {
  // 是否还在有效期，默认为 true
  const validity = computed(() => {
    let valid = true
    // 如果是编辑已存在的信息，如果 formData.validTime 小于 当前时间，则为 false
    if (formData.validTime !== null && (formData.validTime * 1000 - Date.now()) <= 0) valid = false
    return valid
  })

  // timeFormat 是将传入时间转换成 hour:minute 的格式

  const nowTime = computed(() => timeFormat()) // 当前时间 小时:分钟
  const defaultTime = computed(() => {
    if (formData.validTime !== null && validity.value) {
      return timeFormat(formData.validTime) // 如果是修改信息且还在有效期
    } else {
      return timeFormat(null, 2) // 比当前时间多两小时
    }
  })
  const pickerTime = ref(defaultTime.value) // picker 的默认值

  const resetTime = () => {
    formData.validTime = null
  }

  const validTimeChange = e => {
    pickerTime.value = e.detail.value
  }

  return {
    validity,
    nowTime,
    pickerTime,
    resetTime,
    validTimeChange
  }
}
