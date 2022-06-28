<template>
  <uni-loading v-if="isLoading"></uni-loading>
  <view v-else class="formContainer">
    <uni-forms
      ref="tradeFormRef"
      :rules="tradeFormRules"
      :modelValue="tradeFormData"
      :border="true"
      label-width="160"
    >
      <uni-forms-item label="上岛说明" name="detail">
        <uni-easyinput
          type="textarea"
          v-model="tradeFormData.detail"
          placeholder="门票/报酬等等,需要补充的内容都填这里"
          @input="isValid = true"
        />
      </uni-forms-item>
      <uni-forms-item label="交易类型" name="exchangeType">
        <!-- #ifndef MP-ALIPAY -->
        <picker
          mode="multiSelector"
          @columnchange="multiColumnChange"
          :value="multiIndex"
          :range="multiArray"
        >
          <view class="uni-input"
            >{{ multiArray[0][multiIndex[0]] }}-{{
              multiArray[1][multiIndex[1]]
            }}</view
          >
        </picker>
        <!-- #endif -->
      </uni-forms-item>
      <uni-forms-item label="有效时间至">
        <text v-if="!validity" class="uni-text-gray" @click="resetTime"
          >已过期，点击重新开启</text
        >
        <picker
          v-else
          mode="time"
          :value="pickerTime"
          :start="nowTime"
          @change="validTimeChange"
        >
          <view class="uni-input">{{ pickerTime }}</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item label="排队模式" required name="isLineup">
        <switch
          checked
          @change="e => switchChange(e, 'isLineup')"
          color="#3FB984"
        />
      </uni-forms-item>
      <uni-forms-item
        v-show="isLineBL"
        label="是否公开"
        required
        name="isPublic"
      >
        <switch
          checked
          @change="e => switchChange(e, 'isPublic')"
          color="#3FB984"
        />
      </uni-forms-item>
      <uni-forms-item v-show="isLineBL" label="自动叫号" required name="isAuto">
        <switch
          checked
          @change="e => switchChange(e, 'isAuto')"
          color="#3FB984"
        />
      </uni-forms-item>
      <uni-forms-item v-show="isLineBL && isAutoBL" label="同时登岛人数限制">
        <uni-number-box
          v-model="tradeFormData.maxPeople"
          :min="1"
          :max="100"
        ></uni-number-box>
      </uni-forms-item>
      <uni-forms-item v-show="isLineBL && isAutoBL" label="登岛超时时间(分钟)">
        <uni-number-box
          v-model="tradeFormData.maxTime"
          :min="1"
        ></uni-number-box>
      </uni-forms-item>
      <uni-forms-item v-show="!isLineBL" label="联系方式" name="contact">
        <uni-data-checkbox
          selectedTextColor="#3FB984"
          selectedColor="#3FB984"
          v-model="tradeFormData.contact"
          :localdata="contactList"
        >
        </uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item
        v-show="!isLineBL"
        :label="tradeFormData.contact"
        name="contactDetail"
      >
        <uni-easyinput
          type="textarea"
          v-model="tradeFormData.contactDetail"
          placeholder="请输入具体联系方式"
          @input="isValid = true"
        />
      </uni-forms-item>
      <uni-forms-item v-show="isLineBL" label="开岛密码" name="psw">
        <uni-easyinput
          v-model="tradeFormData.psw"
          placeholder="请输入开岛密码"
          :inputBorder="false"
          @input="isValid = true"
          style="font-size: 16px"
        />
      </uni-forms-item>
    </uni-forms>
    <button
      type="primary"
      class="uni-primary-bg editBtn"
      @click="submitEdit"
      :disabled="!isValid"
    >
      {{ itemId ? '修改' : '发布' }}
    </button>
  </view>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { onLoad } from '@dcloudio/uni-app'
import { getTrade, addTrade } from '@/request_api/trade'
import { stringToStamp, goBack } from '@/common/utils'
import usePickerTime from '@/composables/usePickerTime'
import useMultiPicker from '../../useMultiPicker'

export default {
  props: {
    id: {
      type: String,
    },
  },
  setup(props) {
    const store = useStore()
    const userId = computed(() => store.getters.userId)
    const itemId = ref(props.id)

    const isValid = ref(true)
    const isLoading = ref(false)

    const tradeFormRef = ref(null)
    const tradeFormData = reactive({
      user: '',
      exchangeType: '',
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
      psw: '',
      comments: [],
    })

    const pickerTimeProps = usePickerTime(tradeFormData)
    const isLineBL = computed(() => tradeFormData.isLineup)
    const isAutoBL = computed(() => tradeFormData.isAuto)

    const contact = computed(() =>
      tradeFormData.contact !== 'SW'
        ? '联系方式'
        : '直接输入12位好友编号(无需-分割)'
    )

    const exchangeList = [
      {
        type: '交易',
        children: [
          '家具相关',
          '服饰相关',
          '材料相关',
          'DIY手册相关',
          '活动相关',
          '花卉相关',
          '其他',
        ],
      },
      {
        type: '特殊NPC',
        children: [
          '傅珂(妹妹)',
          '骆岚(壁纸地板)',
          '薛革(鞋袜包包)',
          '绢儿(服装)',
          '狐利(艺术品)',
          '然然(园艺)',
          '其他',
        ],
      },
    ]

    const multiPickerProps = useMultiPicker(exchangeList, tradeFormData)

    const getTradeInfo = async () => {
      isLoading.value = true
      const { data } = await getTrade(itemId.value)
      Object.keys(data).forEach(key => {
        tradeFormData[key] = data[key]
      })
      isLoading.value = false
    }

    const switchChange = (e, key) => {
      tradeFormData[key] = e.detail.value
    }

    const submitEdit = async () => {
      try {
        await tradeFormRef.value.validate()
        isValid.value = true
        if (pickerTimeProps.validity.value) {
          tradeFormData.validTime = stringToStamp(
            pickerTimeProps.pickerTime.value
          )
        }
        tradeFormData.user = userId.value
        if (tradeFormData.isLineup === false) {
          tradeFormData.isPublic = false
          tradeFormData.isAuto = false
        }
        const multiArr = multiPickerProps.multiIndex.value
        tradeFormData.exchangeType =
          exchangeList[multiArr[0]].type +
          '-' +
          exchangeList[multiArr[0]].children[multiArr[1]]

        const res = await addTrade(tradeFormData)

        uni.showToast({
          title: res.message,
          success: () => {
            goBack({ type: 2, getItemApi: getTrade, id: itemId.value })
          },
        })
      } catch (err) {
        uni.showToast({
          title: err.message,
          icon: 'error',
        })
        isValid.value = false
      }
    }

    onLoad(option => {
      if (option.id) {
        getTradeInfo()
      }
    })

    return {
      ...pickerTimeProps,
      ...multiPickerProps,
      isLoading,
      isValid,
      itemId,
      tradeFormRef,
      tradeFormData,
      isLineBL,
      isAutoBL,
      contact,
      getTradeInfo,
      switchChange,
      submitEdit,
      contactList: [
        { value: 'SW', text: 'SW' },
        { value: '微信', text: '微信' },
        { value: 'QQ', text: 'QQ' },
        { value: '开岛密码', text: '开岛密码' },
      ],
      tradeFormRules: {},
    }
  },
}
</script>

<style lang="scss"></style>
