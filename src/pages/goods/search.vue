<template>
  <div class="wrapper">
    <div class="top">
      <form @submit.prevent="search">
        <div class="search">
          <div class="search-bg">
            <i class="iconfont icon-chaxun"></i>
            <input v-focus="true" v-model.trim="value" placeholder="输入商品名称" type="search" >
          </div>
        </div>
      </form>
    </div>
    <!-- 搜索区域 -->
    <div class="special-area-li special-area-li-today" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
      <template v-if="list.length > 0">
      <template v-for="item in list">
        <router-link :to="{path: 'goodsDetail', query: {id: item.goodsId}}" :key="item.goodsId">
          <div class="today-li">
            <div class="today-li-pic">
              <img :src="item.imgurl" alt="商品图片">
            </div>
            <div class="today-li-main">
              <div class="title">
                {{item.name}}
              </div>
              <div class="price">
                <span>￥</span>{{item.price}}
              </div>
              <div class="number">
                销量：{{item.numSale}}
              </div>
            </div>
          </div>
        </router-link>
      </template>
      </template>
      <template v-else>
        <div class="noneData">没有数据</div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      list: [],
      value: '',
      pageNum: 1,
      pageSize: 4,
      isLast: false
    }
  },
  methods: {
    search () {
      let _this = this
      _this.pageNum = 1
      _this.attrData()
    },
    attrData () {
      let _this = this
      if (_this.pageNum === 1) {
        _this.list = []
      }
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      // 获取搜索商品
      _this.$dataPost('/api/goods/findGoods', {
        name: _this.value,
        pageNum: _this.pageNum,
        pageSize: _this.pageSize,
        userId: window.localStorage.getItem('userId')
      }, (res) => {
        _this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.list = _this.list.concat(res.data.list)
        _this.isLast = res.data.hasNextPage
        _this.loading = false
      })
    },
    loadMore () {
      // 加载更多
      this.loading = true
      if (this.isLast) {
        this.pageNum++
        this.attrData()
      }
    }
  },
  directives: {
    focus: {
      inserted: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
  }
}
</script>
<style scoped>
.search {
  padding: .3rem;
  background: #fff;
  border-bottom: .02rem solid #F5F5F5;
}

.search .search-bg {
  height: 1rem;
  border-radius: 1rem;
  background: #F0F0F0;
}

.search .search-bg i {
  color: #ADADAD;
  margin-left: .25rem;
  line-height: 1rem;
}

.search .search-bg input {
  background: transparent;
  height: 1rem;
  width: 90%;
  float: right;
  font-size: .35rem;
}

/* 列表 */
.today-li {
  border-bottom: .01rem solid #f5f5f5;
  display: flex;
  padding: .3rem .25rem;
  background: #fff;
}

.today-li .today-li-pic {
  width: 3rem;
  height: 3rem;
  border-radius: .1rem;
  overflow: hidden;
}

.today-li .today-li-pic img {
  width: 100%;
  height: 100%;
}

.today-li .today-li-main {
  flex: 1;
  padding-left: .25rem;
}

.today-li .today-li-main .title {
  font-size: .36rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  padding: 0;
  color: #000;
  margin: .25rem 0;
  height: .9rem;
}

.today-li .today-li-main .price {
  font-size: .48rem;
  color: #d50000;
}

.today-li .today-li-main .price span {
  font-size: .4rem;
}

.today-li .today-li-main .number {
  font-size: .3rem;
  color: #7D7D7D;
  margin-top: .2rem;
}
</style>
