<template>
  <div class="wrapper" ref="wrapperScroll">
    <div class="top" ref="topScroll">
      <div class="special-main-time" ref="timeTab">
        <template v-for="(item, index) in getTime">
          <div class="time-item" :class="timeCur == index ? 'now' : ''" :key="item.id" @click="select(item.timeId, index)">
            <span>{{ item.startTime }} - {{ item.endTime }}</span>
            <span>{{ item.ans }}</span>
          </div>
        </template>
      </div>
    </div>
    <!-- 秒杀列表 start -->
    <div>
      <div class='banner' v-if="imgUrl">
        <img :src="imgUrl">
      </div>
      <div class="shop-list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <template v-for="(item, index) in navList">
          <div class="shop-item" :key="index">
            <div class="shop-pic">
              <img :src="item.imgurl">
            </div>
            <div class="shop-main">
              <div class="title">{{ item.name }}</div>
              <div class="size">
                已秒杀：{{ item.num_sale }}
              </div>
              <div class="price">
                ￥{{ item.newPrice }}
                <span>￥{{ item.oldPrice }}</span>
              </div>
            </div>
            <div class="num">
              <button>
                <router-link :to="{path: 'goodsDetail', query: {id: item.id, type: 1}}">
                  去秒杀
                </router-link>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'Seckill',
  data () {
    return {
      timeCur: 0,
      imgUrl: null,
      pageNum: 1,
      getTime: [],
      navList: [],
      isLast: false
    }
  },
  methods: {
    initBanner () {
      var _this = this
      // 初始化轮播图
      _this.$dataPost('/api/cms/slide/list', {
        type: 5
      }, (res) => {
        _this.imgUrl = res.data[0].imgUrl
      })
    },
    init () {
      var _this = this
      let innerWidth = window.innerWidth * 3 / 10
      // 初始化福利专区时间
      _this.$dataPost('/api/goodsSpike/getTime', {}, (res) => {
        if (res.data === '' || res.data == null) {
          _this.$messagebox({
            title: '提示',
            message: '没有数据'
          })
          return false
        }
        _this.$refs.timeTab.style.width = res.data.length * 3 + 'rem'
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].ans === '正在秒杀') {
            _this.timeId = res.data[i].timeId
            _this.timeCur = i
            _this.getGoodsByTime()
            _this.$nextTick(() => {
              _this.topScroll = new BScroll(_this.$refs.topScroll, {
                startX: -(innerWidth * i),
                click: true,
                scrollX: true,
                scrollY: false,
                eventPassthrough: 'vertical'
              })
            })
            break
          }
          if (res.data[i].ans === '即将开始') {
            _this.timeId = res.data[i].timeId
            _this.timeCur = i
            _this.getGoodsByTime()
            _this.$nextTick(() => {
              _this.topScroll = new BScroll(_this.$refs.topScroll, {
                startX: -(innerWidth * i),
                click: true,
                scrollX: true,
                scrollY: false,
                eventPassthrough: 'vertical'
              })
            })
            break
          }
        }
        _this.getTime = res.data
      })
    },
    select (timeId, index) {
      // 點擊時間段
      var _this = this
      _this.timeId = timeId
      _this.timeCur = index
      _this.getGoodsByTime()
    },
    getGoodsByTime () {
      let _this = this
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      // 獲取時間
      _this.$dataPost('/api/goodsSpike/getGoodsByTime', {
        timeId: _this.timeId,
        pageNumber: _this.pageNum,
        pageSize: 20,
        userId: window.localStorage.getItem('userId')
      }, (res) => {
        _this.$indicator.close()
        if (res.data === '' || res.data == null) {
          _this.$messagebox({
            title: '提示',
            message: '没有数据'
          })
          return false
        }
        _this.navList = res.data.list
        _this.isLast = res.data.hasNextPage
        _this.loading = false
      })
    },
    loadMore () {
      this.loading = true
      if (this.isLast) {
        this.pageNum++
        this.getGoodsByTime()
      }
    }
  },
  created () {
    this.initBanner()
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
.top {
  overflow: hidden;
  touch-action: none;
}

.special-main-time {
  white-space: nowrap;
  background: #fff;
  border-top: 1rpx solid #eee;
}

.special-main-time .time-item {
  width: 3rem;
  display: inline-block;
  color: #707070;
  text-align: center;
  padding: .25rem 0;
  border-right: .02rem solid #eee;
  border-bottom: .02rem solid #eee;
  background: #fff;
}

.special-main-time .time-item:last-child {
  border-right: 0;
}

.special-main-time .time-item span {
  font-size: .36rem;
  display: block;
}

.special-main-time .time-item span:last-child {
  font-size: .3rem;
  margin-top: .1rem;
}

.special-main-time .time-item.now {
  color: #970407;
  border-bottom: .02rem solid #970407;
}

.banner img {
  width: 100%;
  display: block;
}

/* 秒杀列表 */
.shop-item {
  display: flex;
  padding: .25rem .4rem;
  background: #fff;
  border-bottom: .02rem solid #eee;
  position: relative;
}

.shop-round {
  padding-right: .2rem;
}

.shop-round .round {
  margin: 1rem 0;
}

.shop-item .shop-pic {
  width: 3rem;
  height: 3rem;
}

.shop-item .shop-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shop-item .shop-main {
  flex: 1;
  padding-left: .25rem;
}

.shop-item .shop-main .title {
  font-size: .36rem;
  color: #1B1B1B;
  margin: .15rem 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.shop-item .shop-main .size {
  font-size: .3rem;
  color: #666;
}

.shop-item .shop-main .size span {
  float: right;
}

.shop-item .shop-main .price {
  font-size: .5rem;
  color: #E31537;
  margin-top: .2rem;
}

.shop-item .shop-main .price span {
  text-decoration: line-through;
  font-size: .2rem;
  color: #AEAEAE;
}

.shop-item .num {
  position: absolute;
  right: .4rem;
  bottom: .4rem;
}

.shop-item .num button {
  width: 1.8rem;
  height: .9rem;
  font-size: .36rem;
  background: transparent;
  padding: 0;
  border: .02rem solid #D50000;
  border-radius: .08rem
}

.shop-item .num button a {
  color: #D50000;
}

.shop-item .num button:active {
  border: 0;
}

/* 秒杀商品空 */
.none-shop {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  text-align: center;
}

.none-shop i {
  font-size: 1.5rem;
  color: #999;
  margin-bottom: .2rem;
}

.none-shop span {
  font-size: .4rem;
  display: block;
}
</style>
