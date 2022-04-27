<template>
  <scroll-list ref="scrollList" type="turnip" :query="query" :listApi="listApi" fullDomClass='.uni-swiper-wrapper'
    singleDomClass=".community-card">
    <template #default="{ item, refreshList }">
      <uni-card class="community-card" isShadow
        @click="utils.goPage('/pages/community/turnip/turnip-detail/turnip-detail?id=' + item._id)" spacing="20px"
        padding="0px">
        <view class="content-box">
          <view class="content-header">
            <uni-tag v-if="item.exchangeType === '我有菜'" text="我有菜" size="small"
              custom-style="background-color: #3FB984; color: #fff; border-color: #3FB984;"></uni-tag>
            <uni-tag v-else text="我有价" size="small"
              customStyle="background-color: #8BC34A; color: #fff; border-color: #8BC34A;"></uni-tag>
            <text>|</text>
            <text class="">菜价：{{ item.price }}</text>
          </view>
          <text class="content-box-text">{{$filters.textFilter(item.detail, 50)}}</text>
          <view class="content-deal">
            <view v-if="item.isLineup" class="lineup">
              <view v-if="item.isAuto"><text class="org-circle"> </text><text> 0 人在排</text></view>
              <view v-else><text class="green-circle"> </text><text>{{ item.maxPeople }} 个空位 </text>
              </view>
            </view>
            <view v-else class="contact">
              <text>{{$filters.textFilter(item.contact + '-' + item.contactDetail, 10)  }}</text>
            </view>
            <view class="limit-time">
              <text class="iconfont icon-time"></text>
              <uni-countdown :show-day="false" :hour="$filters.countdown(item.validTime, 'h')"
                :minute="$filters.countdown(item.validTime, 'm')" :second="$filters.countdown(item.validTime, 's')"
                color="#666"
                splitorColor="#666" />
            </view>
            <uni-tag :text="item.isLineup ? (item.isAuto ? '立即排队' : '立即上岛') : '立即联系'" circle type="success"
              @click="utils.goPage('/pages/community/turnip/turnip-detail/turnip-detail?id=' + item._id)"></uni-tag>
          </view>
        </view>
      </uni-card>
    </template>
  </scroll-list>
</template>

<script>
  import { ref } from 'vue'
  import ScrollList from '@/components/ScrollList.vue'
  import { getTurnipList } from '@/request_api/turnip'

  export default {
    name: 'Turnip',
    components: { ScrollList },
    inject: ['utils'],
    props: {
      query: {
        type: String,
        default: ''
      },
    },
    setup(props) {
      return {
        listApi: getTurnipList
      }
    }
  }
</script>

<style lang="scss">
</style>
