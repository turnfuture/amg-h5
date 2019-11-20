<template>
  <div class="wrapper">
    <div class='banner' v-if="topImg">
      <img :src="topImg" alt="广告图" >
    </div>
    <div class="nine-shop">
      <div class="title">
        <img src="../../assets/img/activity/jingxuan-min.png" alt="精选低价好货">
      </div>
      <div class="special-shop" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <template v-for="item in specialList">
          <div class="special-shop-li" :key="item.id">
            <router-link :to="{path: 'goodsDetail', query: {id: item.id, type: 2}}">
              <div class="image">
                <img :src="item.imgurl" alt="商品图片">
              </div>
              <div class="main">
                <div class="title">【包邮】{{ item.name }}</div>
                <div class="text">
                  <div class="te">
                    <img src="../../assets/img/activity/ju.png" alt="图标">
                    <span>特价</span>
                  </div>
                  <span class="price">￥{{ item.newPrice }}</span>
                </div>
                <button>马上抢</button>
              </div>
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nine',
  data () {
    return {
      topImg: '',
      specialList: [],
      pageNum: 1,
      isLast: false
    }
  },
  methods: {
    initBanner () {
      var _this = this
      // 初始化轮播图
      _this.$dataPost('/api/cms/slide/list', {
        type: 8
      }, (res) => {
        _this.topImg = res.data[0].imgUrl
      })
    },
    init () {
      var _this = this
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      // 初始化折扣商品
      _this.$dataPost('/api/goodsNine/getNineGoodsList', {
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
.banner img {
  width: 100%;
  display: block;
}

.nine-shop {
  background: #D50000;
}

.nine-shop .title {
  padding: .25rem 0;
}

.nine-shop .title img {
  width: 6.4rem;
  margin: 0 auto;
  display: block;
}

/* 特价商品 */
.special-shop {
  overflow: hidden;
  padding: 0 .3rem .3rem;
  border-bottom: .02rem solid #f5f5f5;
}

.special-shop .special-shop-li {
  float: left;
  width: 49%;
  margin-right: 2%;
  background: #fff;
  border-radius: .08rem;
  margin-bottom: .2rem;
  position: relative;
  padding-bottom: .15rem;
}

.special-shop .special-shop-li:nth-child(2n) {
  margin-right: 0;
}

.special-shop .special-shop-li .image {
  height: 4.5rem;
  border-top-left-radius: .08rem;
  border-top-right-radius: .08rem;
  overflow: hidden;
}

.special-shop .special-shop-li .image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.special-shop .special-shop-li .title {
  font-size: .36rem;
  height: .8rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  padding: .2rem .1rem;
}

.special-shop .special-shop-li .text {
  font-size: .3rem;
  color: #D50000;
  margin-top: .1rem;
}

.special-shop .special-shop-li .text .te {
  width: 1.2rem;
  height: .5rem;
  position: relative;
  display: inline-block;
  text-align: center;
}

.special-shop .special-shop-li .text .te img {
  width: 100%;
  height: 100%;
}

.special-shop .special-shop-li .text .te span {
  position: absolute;
  top: .02rem;
  left: .28rem;
  font-size: .3rem;
  color: #fff;
  line-height: .5rem;
}

.special-shop .special-shop-li .text .price {
  position: relative;
  top: -.1rem;
  margin-left: .1rem;
  font-size: .44rem;
}

.special-shop .special-shop-li button {
  position: absolute;
  right: .1rem;
  bottom: .25rem;
  width: 1.5rem;
  font-size: .26rem;
  color: #fff;
  background: #D50000;
  line-height: .6rem;
  border-radius: .3rem;
  padding: 0;
  border: 0;
}
</style>
