import { ref, computed, watch } from "vue"
import { parseTime, timestamp } from '@/common/utils'

export default function usePickerDate(formData) {
  const defaultDate = computed(() => parseTime(new Date(), '{y}-{m}-{d}'))
  const pickerDate = ref(defaultDate.value)
  
  const nowTime = computed(() => timestamp() * 1000)

  watch(formData, val => {
    if (formData.startDate) {
      pickerDate.value = parseTime(formData.startDate, '{y}-{m}-{d}')
    }
  }, { immediate: true })

  const changeDate = (e) => {
    pickerDate.value === e
  }
  return {
    pickerDate,
    nowTime,
    changeDate
  }
}
