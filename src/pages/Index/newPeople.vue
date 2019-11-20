<template>
  <div class="wrapper" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
    <template v-if="specialList.length > 0">
      <template v-for="item in specialList">
        <div class="today-li" :key="item.id">
          <router-link :to="{path: 'goodsDetail', query: {id: item.id, type: 5}}">
            <div class="today-li-pic">
              <img :src="item.imgurl" alt="商品图片">
            </div>
            <div class="today-li-main">
              <div class="title">
                {{ item.name }}
              </div>
              <div class="number">
                库存：{{ item.stock }}
              </div>
              <div class="price">
                <span>￥</span>{{ item.newPrice }}
              </div>
            </div>
          </router-link>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="noneData">
        暂无数据
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'NewPeople',
  data () {
    return {
      specialList: [],
      pageNum: 1,
      isLast: false
    }
  },
  methods: {
    init () {
      var _this = this
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      // 初始化折扣商品
      _this.$dataPost('/api/goodsNew/getNewGoodsList', {
        pageNumber: _this.pageNum,
        pageSize: '20',
        userId: window.localStorage.getItem('userId')
      }, (res) => {
        this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.specialList = _this.specialList.concat(res.data.list)
        _this.isLast = res.data.hasNextPage
        _this.loading = false
      })
    },
    loadMore () {
      this.loading = true
      if (this.isLast) {
        this.pageNum++
        this.init()
      }
    }
  },
  created () {
    this.init()
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
.today-li {
  border-top: .02rem solid #f5f5f5;
  padding: .25rem .3rem;
}

.today-li a {
  display: flex;
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
  object-fit: cover;
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
  margin: .15rem 0 .2rem;
}

.today-li .today-li-main .price {
  font-size: .48rem;
  color: #d50000;
}

.today-li .today-li-main .price span {
  font-size: .36rem;
}

.today-li .today-li-main .number {
  font-size: .33rem;
  color: #7D7D7D;
  margin-bottom: .15rem;
}

.noneData {
  line-height: 8rem;
  text-align: center;
  font-size: .4rem;
  color: #666;
}
</style>
