<template>
  <div class="wrapper">
    <template v-if="incomeList.length > 0">
      <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <template v-for="(item, index) in incomeList">
          <div class="good_div" :key="item.goodsId" @click="goDetail(item.goodsId)">
            <img class="img" :src="item.imgurl" alt="商品图片">
            <div class="good_right">
              <div class="name">{{item.name}}</div>
              <div class="good_bottom">
                <span class="money">¥<span class="price">{{item.price}}</span></span>
                <div @click.stop="cancleCollect(item.goodsId, index)" class="btn">取消收藏</div>
              </div>
            </div>
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
  name: 'CollEction',
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
      _this.$dataPost('/api/memberFollow/getFollowList', {
        userId: window.localStorage.getItem('userId'),
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
    goDetail (goodsId) {
      this.$router.push({path: 'goodsDetail', query: {id: goodsId, type: 0}})
    }
  },
  created () {
    this.attrIncomeList()
  }
}
</script>

<style scoped>
/* 列表 */
.list {
  background: #f9f9f9;
}

.item:first-child {
  border-top: 0;
}

.item {
  background: #fff;
  border-top: .02rem solid #f1f1f1;
  border-bottom: .02rem solid #f1f1f1;
  margin: 0 0 .2rem;
}

.order-item:last-child {
  margin-bottom: 0;
}

.good_div {
  border-bottom: .02rem solid #eaeaea;
  padding: .3rem;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.good_div .img {
  width: 2.8rem;
  height: 2.8rem;
  flex-shrink: 0;
  margin-right: .3rem;
}

.good_div .good_right {
  flex-grow: 1;
  overflow: hidden;
}

.good_div .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: .4rem;
}

.good_bottom {
  overflow: hidden;
  margin-top: .3rem;
}

.good_bottom .money {
  float: left;
  font-size: .32rem;
  color: #D50000;
  line-height: 2em;
}

.good_bottom .money .price {
  margin-left: .1rem;
  font-size: .44rem;
  font-weight: bold;
}

.good_bottom .btn {
  width: 2rem;
  line-height: .9rem;
  float: right;
  font-size: .32rem;
  color: #D50000;
  border-radius: .45rem;
  border: .02rem solid #D50000;
  text-align: center;
}

</style>
