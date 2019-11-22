<template>
  <div class="wrapper">
    <div class="swiper-tab">
      <div class="swiper-tab-list" :class="currentTab == 0 ? 'on' : ''" @click="swichNav(0)">
        <span>未使用</span>
      </div>
      <div class="swiper-tab-list" :class="currentTab == 1 ? 'on' : ''" @click="swichNav(1)">
        <span>已使用</span>
      </div>
      <div class="swiper-tab-list" :class="currentTab == 2 ? 'on' : ''" @click="swichNav(2)">
        <span>已过期</span>
      </div>
    </div>

    <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <template v-if="incomeList.length > 0">
        <template v-for="item in incomeList">
          <div class="list-item" :class="currentTab == 0 ? '' : currentTab == 1 ? 'list-item-use' : 'list-item-overdue'" :key="item.id">
            <div class="sawtooth">
              ￥{{item.money}}
            </div>
            <div class="list-item-text">
              <span v-if="currentTab == 0">满￥{{item.coupon_money}}可用</span>
              <span v-else-if="currentTab == 1">已使用</span>
              <span v-else>{{item.status==2?'已过期':'已失效'}}</span>
              <span>有效至：{{item.limit_endAt}}</span>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <div class="noneData">暂无该类型优惠券</div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Coupon',
  data () {
    return {
      currentTab: 0,
      incomeList: [],
      page: 1,
      pageSize: 10,
      isLast: false
    }
  },
  methods: {
    swichNav (type) {
      // 切换收益状态
      let _this = this
      _this.currentTab = type
      _this.page = 1
      _this.attrIncomeList(type)
    },
    attrIncomeList (type) {
      // 获取收益列表
      let _this = this
      if (this.page === 1) {
        _this.incomeList = []
      }
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      _this.$dataPost('/api/memberCoupon/getMyCouponList', {
        userId: window.localStorage.getItem('userId'),
        type: type,
        pageSize: _this.pageSize,
        pageNum: _this.page
      }, (res) => {
        _this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.incomeList = _this.incomeList.concat(res.data.list)
        _this.isLast = res.data.hasNextPage
        _this.loading = false
      })
    },
    loadMore () {
      this.loading = true
      if (this.isLast) {
        this.page++
        this.attrIncomeList(this.currentTab)
      }
    }
  },
  created () {
    this.attrIncomeList(this.currentTab)
  }
}
</script>

<style scoped>
/* 分栏 */
.swiper-tab{
  width: 100%;
  border-top: .02rem solid #eee;
  border-bottom: .02rem solid #eee;
  text-align: center;
  overflow: hidden;
  background: #fff;
}

.swiper-tab-list{
  float: left;
  width: 33.3%;
  padding: .45rem 0;
}

.swiper-tab-list span{
  display: block;
  font-size: .36rem;
  color: #7D7D7D;
  line-height: 44rpx;
}

.on{
  border-bottom: .06rem solid #d50000;
}

.on span {
  color: #d50000;
}
/* 列表 */
.list-item {
  border: .02rem solid rgb(252, 45, 45);
  margin: .2rem .3rem;
  background: transparent;
  height: 2.5rem;
  display: flex;
}

.sawtooth {
  position: relative;
  overflow: hidden;
  width: 28%;
  height: 100%;
  background: rgb(252, 45, 45);
  font-size: .66rem;
  color: #fff;
  text-align: center;
  line-height: 2.5rem;
}

.sawtooth:after {
  content: ' ';
  width: 0;
  height: 100%;
  position: absolute;
  top: 6px;
  border-left: 6px dotted #f9f9f9;
  right: -3px;
}

.list-item .list-item-text {
  flex: 1;
  padding: .5rem 0 .5rem .6rem;
}

.list-item .list-item-text span {
  font-size: .5rem;
  color: rgb(252, 45, 45);
  display: block;
}

.list-item .list-item-text span:last-child {
  font-size: .32rem;
  color: #999;
  margin-top: .36rem;
}

/* 已使用/已过期 */
.list-item-use {
  border-color: #999;
}

.list-item-use .sawtooth {
  background: #999;
}

.list-item-use  .list-item-text span {
  color: #999;
}

.list-item-overdue {
  border-color: #ccc;
}

.list-item-overdue .sawtooth {
  background: #ccc;
}

.list-item-overdue .list-item-text span {
  color: #ccc;
}

.list-item-overdue .list-item-text span:last-child {
  color: #ccc;
}
</style>
