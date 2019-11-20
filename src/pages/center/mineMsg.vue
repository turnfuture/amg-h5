<template>
  <div class="wrapper">
    <template v-if="incomeList.length > 0">
      <div class="my-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <template v-for="item in incomeList">
          <div class="my-list-item" :key="item.id">
            <router-link :to="{path: 'mineMsgDetails', query: {id: item.id}}">
              <span>{{item.title}}</span>
              <i class="iconfont icon-youjiantou"></i>
            </router-link>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="noneData">暂无数据</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MineMsg',
  data () {
    return {
      incomeList: [],
      page: 1,
      pageSize: 20,
      isLast: false
    }
  },
  methods: {
    attrIncomeList () {
      // 获取列表
      let _this = this
      if (this.page === 1) {
        _this.incomeList = []
      }
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      _this.$dataPost('/api/cms/noticeSys/list', {
        pageSize: _this.pageSize,
        pageNumber: _this.page
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
      // 加载更多
      this.loading = true
      if (this.isLast) {
        this.page++
        this.attrIncomeList()
      }
    },
    cancleCollect (id, index) {
      console.log(id, index)
      let _this = this
      _this.$messagebox.confirm('您确认要取消此收藏？').then(action => {
        _this.$dataPost('/api/memberFollow/setFollow', {
          userId: window.localStorage.getItem('userId'),
          goodsId: id
        }, (res) => {
          _this.incomeList.splice(index, 1)
        })
      })
    },
    goDetail () {
      this.$router.push('shopDetails')
    }
  },
  created () {
    this.attrIncomeList()
  }
}
</script>

<style scoped>
/* 列表 */
.my-list {
  border-top: .02rem solid #eee;
}

.my-list-item a {
  display: flex;
  background: #fff;
  padding: 0 .5rem;
  border-bottom: .02rem solid #eee;
  font-size: .36rem;
  line-height: 1.5rem;
}

.my-list-item:active a {
  background: #eee;
}

.my-list-item i {
  margin-left: auto;
  font-size: .3rem;
  color: #999;
}
</style>
