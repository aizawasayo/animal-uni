import { getOptionList } from '@/request_api/option'

export async function requestOption({ type, title, key, unMulit }) {
  try {
    let res = await getOptionList({ type })
    let optionList = res.data.map(item => ({
      text: item.name,
      value: item.name,
    }))
    let isMulit = unMulit ? false : true
    const option = { list: optionList, title, filterKey: key, mulit: isMulit }
    return option
  } catch (err) {
    console.warn(err)
  }
}

export async function getFilterOptions(type) {
  let optionsList = null

  const hasFake = {
    list: [
      { text: '有赝品', value: true },
      { text: '无赝品', value: false }
    ],
    title: '有无赝品',
    filterKey: 'hasFake',
    mulit: false // 单选
  }

  const orderType = {
    list: [
      { text: '订购', value: '订购' },
      { text: '不可订购', value: '不可订购' },
      { text: '里数兑换', value: '里数兑换' },
      { text: '非卖品', value: '非卖品' },
    ],
    title: '订购类型',
    filterKey: 'orderType',
    mulit: true
  }

  const ownStatus = {
    list: [
      { text: '未捕捉', value: false },
      { text: '已捕捉', value: true }
    ],
    title: '捕捉情况',
    filterKey: 'collected',
    mulit: false
  }

  const collectStatus = {
    list: [
      { text: '未拥有', value: true },
      { text: '已拥有', value: false },
    ],
    title: '收集情况',
    filterKey: 'collected',
    mulit: false
  }
  // 通用
  const rarity = await requestOption({ type: 'rarity', title: '稀有度', key: 'rarity' })
  const activity = await requestOption({ type: 'activity', title: '动森活动', key: 'activity' })
  const season = await requestOption({ type: 'season', title: '季节', key: 'season' })
  const size = await requestOption({ type: 'size', title: '尺寸', key: 'size' })

  switch (type) {
    case 'fish':
      // 鱼类
      const fishLocale = await requestOption({ type: 'fishLocale', title: '场所', key: 'locale' })
      const fishUnlock = await requestOption({ type: 'fishUnlock', title: '解锁条件', key: 'unlockCondition' })
      const shadow = await requestOption({ type: 'shadow', title: '鱼影大小', key: 'shadow' })
      optionsList = [fishLocale, shadow, fishUnlock, rarity, ownStatus]
      break;
    case 'insect':
      // 昆虫
      const insectLocale = await requestOption({ type: 'insectLocale', title: '场所', key: 'locale' })
      const insectUnlock = await requestOption({ type: 'insectUnlock', title: '解锁条件', key: 'unlockCondition' })
      optionsList = [insectLocale, insectUnlock, rarity, ownStatus]
      break;
    case 'halobios':
      // 海洋生物
      const halobiosLocale = await requestOption({ type: 'halobiosLocale', title: '场所', key: 'locale' })
      const halobiosUnlock = await requestOption({
        type: 'halobiosUnlock',
        title: '解锁条件',
        key: 'unlockCondition'
      })
      const halobiosShadow = await requestOption({ type: 'halobiosShadow', title: '鱼影大小', key: 'shadow' })
      optionsList = [halobiosLocale, halobiosShadow, halobiosUnlock, ownStatus]
      break;
    case 'fossil':
      optionsList = [collectStatus]
      break;
    case 'artwork':
      optionsList = [size, hasFake, collectStatus]
      break;
    case 'islander':
      // 岛民
      const sex = {
        list: [
          { text: '♀', value: 0 },
          { text: '♂', value: 1 },
        ],
        title: '性别',
        filterKey: 'sex',
        mulit: false
      }
      const breed = await requestOption({ type: 'breed', title: '种族', key: 'breed' })
      const character = await requestOption({ type: 'character', title: '种族', key: 'character' })
      const voice = await requestOption({ type: 'voice', title: '音高', key: 'voice' })
      const hobby = await requestOption({ type: 'hobby', title: '爱好', key: 'hobby' })
      optionsList = [sex, breed, character, voice, hobby, collectStatus]
      break;
    case 'furniture':
      // 家具
      // const furnitureType = await requestOption({ type: 'furnitureType', title: '家具类型', key: 'type' })
      const furnitureChannels = await requestOption({
        type: 'furnitureChannels',
        title: '家具来源',
        key: 'channels'
      })
      const series = await requestOption({ type: 'series', title: '家具系列', key: 'series' })
      optionsList = [furnitureChannels, series, size, activity, orderType, collectStatus]
      break;
    case 'clothing':
      // 服饰
      // const clothingType = await requestOption({ type: 'clothingType', title: '服饰类型', key: 'type' })
      const clothingChannels = await requestOption({
        type: 'clothingChannels',
        title: '服饰来源',
        key: 'channels'
      })
      const clothingColor = await requestOption({ type: 'clothingColor', title: '服饰颜色', key: 'color' })
      const clothingStyle = await requestOption({ type: 'clothingStyle', title: '服饰风格', key: 'style' })
      const clothingTheme = await requestOption({ type: 'clothingTheme', title: '服饰主题', key: 'theme' })
      season['filterKey'] = 'saleTime'
      season['title'] = '售卖时间'
      optionsList = [clothingChannels, clothingColor, clothingStyle, clothingTheme, activity, season,
        orderType, collectStatus
      ]
      break;
    case 'plant':
      const plantType = {
        list: [
          { text: '种子', value: '种子' },
          { text: '水果', value: '水果' },
          { text: '树苗', value: '树苗' },
          { text: '树', value: '树' },
          { text: '花', value: '花' },
          { text: '蘑菇', value: '蘑菇' },
          { text: '灌木', value: '灌木' },
          { text: '其他', value: '其他' },
        ],
        title: '植物类型',
        filterKey: 'type',
        mulit: true
      }
      optionsList = [plantType, collectStatus]
      break;
    case 'material':
      // 素材/材料
      const materialChannels = {
        list: [{ text: '商店购买', value: '商店购买' },
          { text: '狸端机订购', value: '狸端机订购' },
          { text: '岛民赠送', value: '岛民赠送' },
          { text: 'npc赠送', value: 'npc赠送' },
          { text: '素材岛挖掘', value: '素材岛挖掘' },
          { text: '花卉杂交', value: '花卉杂交' },
          { text: '星座当月许愿', value: '星座当月许愿' },
          { text: '对流星许愿次日', value: '对流星许愿次日' },
          { text: '海滩拾取', value: '海滩拾取' },
          { text: '海滩喷水处挖掘', value: '海滩喷水处挖掘' },
          { text: '树边采集', value: '树边采集' },
          { text: '砍树掉落', value: '砍树掉落' },
          { text: '摇晃树干', value: '摇晃树干' },
          { text: '砍竹子', value: '砍竹子' },
          { text: '敲石头', value: '敲石头' },
          { text: '钓鱼', value: '钓鱼' },
          { text: '挖掘地面', value: '挖掘地面' },
          { text: '打落气球', value: '打落气球' },
          { text: '果树掉落', value: '果树掉落' },
          { text: '非果树掉落', value: '非果树掉落' },
          { text: '针叶树掉落', value: '针叶树掉落' },
          { text: '阔叶树掉落', value: '阔叶树掉落' },
          { text: '打落蓝色气球', value: '打落蓝色气球' },
          { text: '捕虫网捕捉', value: '捕虫网捕捉' },
          { text: '潜水打捞', value: '潜水打捞' },
          { text: '与阿獭交换帆立贝随机获得', value: '与阿獭交换帆立贝随机获得' },
        ],
        title: '素材来源',
        filterKey: 'channels',
        mulit: true
      }
      optionsList = [season, activity, materialChannels]
      break;
    case 'tool':
      // 工具
      const toolChannels = await requestOption({ type: 'toolChannels', title: '工具来源', key: 'channels' })
      optionsList = [toolChannels, collectStatus]
      break;
    case 'recipe':
      // DIY配方
      const diyType = await requestOption({ type: 'diyType', title: 'DIY类型', key: 'type' })
      const diyChannels = await requestOption({ type: 'diyChannels', title: 'DIY来源', key: 'channels' })
      const diyUnlock = await requestOption({ type: 'diyUnlock', title: '解锁条件', key: 'unlockCondition' })
      optionsList = [diyType, diyChannels, diyUnlock, collectStatus]
      break;
    case 'record':
      optionsList = [collectStatus]
      break;
  }

  let filterOptions = optionsList.map(opt => {
    opt.list.map(item => { item.checked = false })
    return { ...opt }
  })
  return filterOptions
}
