<template>
  <div class="wrapper">
    <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <template v-if="incomeList.length > 0">
        <template v-for="item in incomeList">
          <div class="todat-item" :key="item.id">
            <div class="text">
              <span>提现金额：{{item.money}}</span>
              <span>提现时间：{{item.createAt}}</span>
            </div>
            <div class="money txNow" v-if="item.status==0">
              提现中
            </div>
            <div class="money txAgree" v-else-if="item.status==1">
              同意提现
            </div>
            <div class="money txRefuse" v-else>
              拒绝提现
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
  name: 'Wallet',
  data () {
    return {
      incomeList: [],
      page: 1,
      pageSize: 30,
      isLast: false
    }
  },
  methods: {
    attrIncomeList () {
      // 获取收益列表
      let _this = this
      _this.$dataPost('/api/extract/getExtractList', {
        userId: window.localStorage.getItem('userId'),
        pageSize: _this.pageSize,
        pageNumber: _this.page
      }, (res) => {
        this.$indicator.close()
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
        this.attrIncomeList()
      }
    }
  },
  created () {
    this.attrIncomeList()
  },
  beforeCreate () {
    this.$indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
    })
  }
}
</script>

<style scoped>
/* 列表 */
.todat-item {
  display: flex;
  padding: .25rem .3rem;
  background: #fff;
  border-bottom: .02rem solid #eee;
}

.todat-item .text {
  flex: 1;
  padding-left: .2rem;
}

.todat-item .text span {
  font-size: .36rem;
  color: #7D7D7D;
  display: block;
  margin-bottom: .15rem;
}

.todat-item .text span:first-child {
  font-size: .3rem;
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

.txNow {
  color: #fdd575;
}

.txAgree {
  color: #7cd27c;
}

.txRefuse {
  color: #fd7575;
}
</style>
