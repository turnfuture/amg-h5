<template>
  <div class="wrapper">
    <template v-if="incomeList.length > 0">
      <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <template v-for="item in incomeList">
          <div class="todat-item" :key="item.id">
            <div class="pic">
              <img :src="item.avator" alt="头像">
            </div>
            <div class="text">
              <span>{{item.name}}</span>
              <span>{{item.identity==1?'一级粉丝':'二级粉丝'}}</span>
              <span>{{item.create_at}}</span>
            </div>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="noneData">暂无数据</div>
    </template>
    <div class="team_bottom">总人数：{{totalNum}}</div>
  </div>
</template>

<script>
export default {
  name: 'Myteam',
  data () {
    return {
      incomeList: [],
      page: 1,
      pageSize: 20,
      isLast: false,
      totalNum: 0
    }
  },
  methods: {
    init () {
      let _this = this
      if (this.page === 1) {
        _this.incomeList = []
      }
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      _this.$dataPost('/api/member/getMyFans', {
        userId: window.localStorage.getItem('userId'),
        type: '',
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
        _this.incomeList = _this.incomeList.concat(res.map.list)
        _this.totalNum = res.map.total
        _this.isLast = res.map.hasNextPage
        _this.loading = false
      })
    },
    loadMore () {
      // 加载更多
      this.loading = true
      if (this.isLast) {
        this.page++
        this.attrIncomeList()
      }
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.wrapper {
  padding-bottom: 2rem;
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

.team_bottom{
  line-height: 1.5rem;
  background: #970407;
  color: #fff;
  font-size: .4rem;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>
