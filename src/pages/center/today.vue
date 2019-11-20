<template>
  <div class="wrapper">
    <div class="top">
      <div class="top-bg">
        <div class="top-bg-line">
          {{income.todayPrice}}
          <span>{{income.yesdayPrice}}</span>
        </div>
        <div class="top-bg-line">
          今日收益
          <span>昨日收益</span>
        </div>
      </div>
      <div class="swiper-tab">
        <div class="swiper-tab-list" :class="currentTab == 3 ? 'on' : ''" @click="switchNav(3)">
          <span>今日</span>
        </div>
        <div class="swiper-tab-list" :class="currentTab == 4 ? 'on' : ''" @click="switchNav(4)">
          <span>昨日</span>
        </div>
      </div>
    </div>

    <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <template v-if="incomeList.length > 0">
        <template v-for="item in incomeList">
          <div class="todat-item" :key="item.id">
            <div class="pic">
              <img :src="item.avator" alt="头像">
            </div>
            <div class="text">
              <span>{{item.name}}</span>
              <span>{{item.create_at}}</span>
              <span>订单号：{{item.order_sn}}</span>
            </div>
            <div class="money">
              +{{item.com_price}}
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <div class="noneData">暂无数据</div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Today',
  data () {
    return {
      currentTab: 3,
      income: {
        todayPrice: 0,
        yesdayPrice: 2
      },
      incomeList: [],
      page: 1,
      pageSize: 30,
      isLast: false
    }
  },
  methods: {
    init () {
      // 初始化获取收益数据
      let _this = this
      _this.$dataPost('/api/orderCom/getMemberCom', {
        userId: window.localStorage.getItem('userId')
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.income.todayPrice = res.data.todayPrice
        _this.income.yesdayPrice = res.data.yesdayPrice
      })
    },
    switchNav (type) {
      // 切换收益状态
      let _this = this
      _this.currentTab = type
      _this.page = 1
      _this.attrIncomeList(type)
    },
    attrIncomeList (type) {
      // 获取收益列表
      let _this = this
      _this.$dataPost('/api/orderCom/getMemberComList', {
        userId: window.localStorage.getItem('userId'),
        type: type,
        pageSize: _this.pageSize,
        pageNumber: _this.page,
        platformId: 0
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        if (this.page === 1) {
          _this.incomeList = []
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
    this.init()
    this.attrIncomeList(this.currentTab)
  }
}
</script>

<style scoped>
.top-bg {
  background: #970407;
  height: 1.4rem;
  padding: 1.5rem .6rem;
  box-sizing: content-box;
}

.top-bg .top-bg-line {
  font-size: .5rem;
  color: #fff;
}

.top-bg .top-bg-line:last-child {
  font-size: .36rem;
  margin-top: .15rem;
}

.top-bg .top-bg-line span {
  float: right;
}

/* 分栏 */
.swiper-tab{
  width: 100%;
  border-bottom: .02rem solid #dfdfdf;
  text-align: center;
  overflow: hidden;
  background: #fff;
}

.swiper-tab-list{
  float: left;
  width: 50%;
}

.swiper-tab-list span{
  display: block;
  font-size: .36rem;
  color: #7D7D7D;
  line-height: 1.2rem;
}

.on{
  border-bottom: .06rem solid #970407;
}

.on span {
  color: #970407;
}

/* 列表 */
.todat-item {
  display: flex;
  padding: .25rem .3rem;
  background: #fff;
  border-bottom: .02rem solid #eee;
}

.todat-item .pic {
  width: 1.5rem;
}

.todat-item .pic img {
  width: 100%;
  height: 1.5rem;
  border-radius: 50%;
}

.todat-item .text {
  flex: 1;
  padding-left: .2rem;
}

.todat-item .text span {
  font-size: .3rem;
  color: #7D7D7D;
  display: block;
  margin-bottom: .15rem;
}

.todat-item .text span:first-child {
  color: #000;
}

.todat-item .money {
  font-size: .4rem;
  color: #970407;
  margin-top: .25rem;
}

.none-money {
  margin-top: 1.5rem;
  text-align: center;
  color: #7D7D7D;
}
</style>
