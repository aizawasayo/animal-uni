<template>
  <uni-loading v-if="isLoading"></uni-loading>
  <view v-else class="formContainer">
    <uni-forms ref="turnipFormRef" :rules="turnipFormRules" :modelValue="turnipFormData"
      :border="true" label-width="160">
      <uni-forms-item label="菜价" required name="price">
        <uni-easyinput v-model="turnipFormData.price" type="number" placeholder="请输入大头菜报价" :inputBorder="false"
          style="font-size: 16px;" @input="isValid = true" />
      </uni-forms-item>
      <uni-forms-item label="交易类型" name="exchangeType">
        <uni-data-checkbox selectedTextColor="#3FB984" selectedColor="#3FB984" v-model="turnipFormData.exchangeType"
          :localdata="exchangeList">
        </uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item label="上岛说明" name="detail">
        <uni-easyinput type="textarea" v-model="turnipFormData.detail" placeholder="门票/报酬等等,需要补充的内容都填这里"
          @input="isValid = true" />
      </uni-forms-item>
      <uni-forms-item label="有效时间至">
        <text v-if="!validity" class="uni-text-gray" @click="resetTime">已过期，点击重新开启</text>
        <picker v-else mode="time" :value="pickerTime" :start="nowTime" @change="validTimeChange">
          <view class="uni-input">{{ pickerTime }}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item v-show="isPrice" label="排队模式" required name="isLineup">
        <switch checked @change="e => switchChange(e,'isLineup')" color="#3FB984" />
      </uni-forms-item>
      <uni-forms-item v-show="isLineBL" label="是否公开" required name="isPublic">
        <switch checked @change="e => switchChange(e,'isPublic')" color="#3FB984" />
      </uni-forms-item>
      <uni-forms-item v-show="isLineBL" label="自动叫号" required name="isAuto">
        <switch checked @change="e => switchChange(e,'isAuto')" color="#3FB984" />
      </uni-forms-item>
      <uni-forms-item v-show="isLineBL && isAutoBL" label="同时登岛人数限制">
        <uni-number-box v-model="turnipFormData.maxPeople" :min="1" :max="100"></uni-number-box>
      </uni-forms-item>
      <uni-forms-item v-show="isLineBL && isAutoBL" label="登岛超时时间(分钟)">
        <uni-number-box v-model="turnipFormData.maxTime" :min="1"></uni-number-box>
      </uni-forms-item>
      <uni-forms-item v-show="!isLineBL" label="联系方式" name="contact">
        <uni-data-checkbox selectedTextColor="#3FB984" selectedColor="#3FB984" v-model="turnipFormData.contact"
          :localdata="contactList">
        </uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item v-show="!isLineBL" :label="turnipFormData.contact" name="contactDetail">
        <uni-easyinput type="textarea" v-model="turnipFormData.contactDetail" placeholder="请输入具体联系方式"
          @input="isValid = true" />
      </uni-forms-item>
      <uni-forms-item v-show="isLineBL" label="开岛密码" name="psw">
        <uni-easyinput v-model="turnipFormData.psw" placeholder="请输入开岛密码" :inputBorder="false"
          @input="isValid = true"
          style="font-size: 16px;" />
      </uni-forms-item>
    </uni-forms>
    <button type="primary" class="uni-primary-bg editBtn" @click="submitEdit" :disabled="!isValid">发布</button>
  </view>

</template>

<script>
  import { ref, reactive, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { getTurnip, addTurnip } from '@/request_api/turnip'
  import { stringToStamp, goBack } from '@/common/utils'
  import usePickerTime from '@/composables/usePickerTime'

  export default {
    setup(props) {
      const store = useStore()
      const userId = computed(() => store.getters.userId)

      const isValid = ref(true)
      const isLoading = ref(false)

      const turnipFormRef = ref(null)
      const turnipFormData = reactive({
        price: null,
        user: '',
        exchangeType: '我有价', // 交易类型，我有菜/我有价
        chooseTime: '',
        validTime: null,
        isLineup: true, // 是否排队模式
        isPublic: true, // 是否公开
        isAuto: true, // 自动叫号
        maxPeople: 2, // 登岛人数限制
        maxTime: 10, // 登岛最长时间 单位（分钟）
        contact: 'SW', // 联系方式
        contactDetail: '', //详细联系方式
        detail: '', // 上岛说明
        psw: ''
      })

      const pickerTimeProps = usePickerTime(turnipFormData)

      const isLineBL = computed(() =>
        turnipFormData.isLineup &&
        turnipFormData.exchangeType === '我有价' ?
        true :
        false
      )
      const isAutoBL = computed(() => turnipFormData.isAuto)
      const isPrice = computed(() =>
        turnipFormData.exchangeType === '我有菜' ? false : true
      )
      const contact = computed(() =>
        turnipFormData.contact !== 'SW' ?
        '联系方式' :
        '直接输入12位好友编号(无需-分割)'
      )

      const getTurnipInfo = async (id) => {
        isLoading.value = true
        const { data } = await getTurnip(id)
        Object.keys(data).forEach(key => {
          turnipFormData[key] = data[key]
        })
        isLoading.value = false
      }

      const switchChange = (e, key) => {
        turnipFormData[key] = e.detail.value
      }

      const submitEdit = async () => {
        try {
          await turnipFormRef.value.validate()
          isValid.value = true
          if (pickerTimeProps.validity.value) {
            turnipFormData.validTime = stringToStamp(pickerTimeProps.pickerTime.value)
          }
         
          turnipFormData.user = userId.value
          if (turnipFormData.exchangeType === '我有菜') {
            turnipFormData.isLineup = false
            turnipFormData.isPublic = false
            turnipFormData.isAuto = false
          }

          const { code } = await addTurnip(turnipFormData)
          uni.showToast({
            title: ' 发布成功！',
            duration: 2000,
            success: res => {
              goBack('turnip')
            }
          })
        } catch (err) {
          uni.showToast({
            title: err.message,
            icon: 'error'
          })
          isValid.value = false
        }
      }

      return {
        ...pickerTimeProps,
        isLoading,
        isValid,
        turnipFormRef,
        turnipFormData,
        isLineBL,
        isAutoBL,
        isPrice,
        contact,
        getTurnipInfo,
        switchChange,
        submitEdit,
        exchangeList: [
          { value: '我有菜', text: '我有菜' },
          { value: '我有价', text: '我有价' }
        ],
        contactList: [
          { value: 'SW', text: 'SW' },
          { value: '微信', text: '微信' },
          { value: 'QQ', text: 'QQ' },
          { value: '开岛密码', text: '开岛密码' }
        ],
        turnipFormRules: {}
      };
    },
    onLoad(options) {
      if (options.id) {
        this.getTurnipInfo(options.id)
      }
    },
    // onBackPress(options) {
    //   /*
    //   - Android 实体返回键 (from = backbutton)
    //   - 顶部导航栏左边的返回按钮 (from = backbutton)
    //   - 返回 API，即 uni.navigateBack() (from = navigateBack)
    //   */
    //   /*
    //   只有在该函数中返回值为 true 时，才表示不执行默认的返回，自行处理此时的业务逻辑。
    //   当不阻止页面返回却直接调用页面路由相关接口（如：uni.switchTab）时，可能会导致页面显示异常，可以通过延迟调用路由相关接口解决。
    //   不返回或返回其它值，均会执行默认的返回行为。
    //   */
    //   if (options.from === 'navigateBack') {
    //     // 如果是 uni.navigateBack() 触发的
    //     return false;
    //   }
    //   this.goBack();
    //   return true;
    // },
  }
</script>

<style lang="scss">

</style>
