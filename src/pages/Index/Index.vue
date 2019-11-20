<template>
  <div class="wrapper" ref="wrapper">
    <div class="banner">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="item in bannerList" :key="item.id">
          <img :src="item.imgUrl" alt="banner" @click="bannerToDetail(item.mode, item.goodsId)">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>

    <div class="coupon">
      <div class="coupon-li">
        <router-link to="/seckill">
          <img src="../../assets/img/index/miaosha.png" alt="秒杀" />
          <span>秒杀</span>
        </router-link>
      </div>
      <div class="coupon-li">
        <router-link :to="{ path: '/goods', query: { type: 'hai'}}">
          <img src="../../assets/img/index/hwzg.png" alt="海外直购" />
          <span>海外直购</span>
        </router-link>
      </div>
      <div class="coupon-li">
        <router-link to="/nine">
          <img src="../../assets/img/index/baoyou.png" alt="9块9包邮" />
          <span>9块9包邮</span>
        </router-link>
      </div>
      <div class="coupon-li">
        <router-link to="/newPeople">
          <img src="../../assets/img/index/xrzx.png" alt="新人专享" />
          <span>新人专享</span>
        </router-link>
      </div>
    </div>

    <div class="advertise" v-for="item in advertiseList" :key="item.id">
      <router-link to="homeShopkeeper">
        <img :src="item.imgUrl" alt="广告图">
      </router-link>
    </div>

    <!-- 福利专区 -->
    <div class='activity'>
      <div class='title'>
        <img src='../../assets/img/index/fuli.png' alt="图片">
        <span class='line'>Welfare Zone  </span>
        <div class='more'>
          <router-link to="/seckill">
          <span>更多</span>
          <i class='iconfont icon-youjiantou'></i>
          </router-link>
        </div>
      </div>
      <!-- 时间列表 -->
      <div class="gundong" ref="incomeWrapper">
        <div class="gundongList" ref="personTab">
          <template v-for="(item, index) in getTimeList">
            <div @click="selectTime(item.timeId, index)" class="before" :key="index" :class="timeCur == index ? 'active' : ''">
              <span class="">{{item.startTime}}-{{item.endTime}}</span>
              <div class="txt">{{item.ans}}</div>
            </div>
          </template>
        </div>
      </div>
      <template v-if="actGoodsList.length != 0">
        <div class='actGoods'>   <!-- 商品 -->
          <div class="actGoodsList">
            <template v-for="(item, index) in actGoodsList">
              <div class="actGoods-item" :key="index">
                <router-link :to="{path: 'goodsDetail', query: {id: item.id, type: 1}}">
                  <div class="img">
                    <img :src='item.imgurl'>
                  </div>
                  <span class="name">{{item.name}}</span>
                  <!-- 进度条 -->
                  <div class='strip'>
                    <progress :value="item.endvalPro" max="100"></progress>
                  </div>
                  <div class='price'>
                    <span>￥</span>
                    <span class='reality'>{{item.newPrice}}</span>
                    <span class='Original'>￥{{item.oldPrice}}</span>
                  </div>
                </router-link>
              </div>
            </template>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="noneData">
          该时间段下暂无商品
        </div>
      </template>
    </div>

    <!-- 9.9专区 -->
    <div class='activity jiu'>
      <div class='title'>
        <img src='../../assets/img/index/9.9.png' alt="图片">
        <span class='line'>Package Mail  </span>
        <div class='more'>
          <router-link to="/nine">
            <span>更多</span>
            <i class='iconfont icon-youjiantou'></i>
          </router-link>
        </div>
      </div>
      <div class="special-banner" v-if="img_url" @click="bannerToDetail(item.mode, item.goodsId)">
        <img :src="img_url.imgUrl" alt="9.9专区 banner">
      </div>
      <div class="special-shop">
        <template v-for="item in jiuList">
          <div class="special-shop-li" :key="item.id">
            <router-link :to="{path: 'goodsDetail', query: {id: item.id, type: 2}}">
              <div class="image">
                <img :src="item.imgurl" alt="商品图片">
              </div>
              <div class="main">
                <div class="title">{{item.name}}</div>
                <div class="text">
                  <span class="di">超低价</span>
                  ￥{{item.newPrice[0]}}
                </div>
              </div>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <!-- 新人专区 -->
    <div class='activity kanjia'>
      <div class='title'>
        <img src='../../assets/img/index/new_title.png' alt="图片">
        <span class='line'>Newcomers Enjoyment  </span>
        <div class='more'>
          <router-link to="/newPeople">
            <span>更多</span>
            <i class='iconfont icon-youjiantou'></i>
          </router-link>
        </div>
      </div>
      <div class="special-banner" v-if="newDataImg" @click="bannerToDetail(newDataImg.mode, newDataImg.goodsId)">
        <img :src="newDataImg.imgUrl" alt="新人专区 banner">
      </div>
      <div class="special-shop">
        <template v-for="item in newDataGoodsList">
          <div class="special-shop-li" :key="item.id">
            <router-link :to="{path: 'goodsDetail', query: {id: item.id, type: 5}}">
              <div class="image">
                <img :src="item.imgurl" alt="商品图片">
              </div>
              <div class="main">
                <div class="title">{{item.name}}</div>
                <div class="text">
                  <span>￥</span>
                  {{item.newPrice}}
                </div>
              </div>
            </router-link>
          </div>
        </template>
      </div>
    </div>

    <!-- 今日主推 start -->
    <div class="special-area-li special-area-li-today">
      <div class="today-title">
        <img src="../../assets/img/index/jinri.png" alt="今日主推">
      </div>
      <template v-for="item in todayList">
        <router-link :to="{path: 'goodsDetail', query: {id: item.id}}" :key="item.id">
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
    </div>

    <Nav :innerActive="innerActive"></Nav>
  </div>
</template>

<script>
import Nav from '../../components/nav.vue'
import BScroll from 'better-scroll'
export default {
  name: 'Index',
  data () {
    return {
      swiperOption: {
        notNextTick: true,
        loop: true,
        initialSlide: 0,
        autoplay: {
          delay: 5000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets'
        }
      },
      innerActive: 0,
      bannerList: [],
      // 福利专区
      advertiseList: [],
      getTimeList: [],
      timeCur: 0,
      actGoodsList: [],
      // 9.9专区
      jiuList: [],
      img_url: null,
      // 新人专区
      newDataImg: null,
      newDataGoodsList: [],
      todayList: [],
      // 通过分享进入会获取到这两个参数
      InvitationCode: '',
      shopId: ''
    }
  },
  methods: {
    initBanner () {
      // 初始化轮播图
      this.$dataPost('/api/cms/slide/list', {
        type: '0'
      }, (res) => {
        if (res.code === 0) {
          this.bannerList = res.data
        }
      })
    },
    initAdvertise () {
      // 初始化广告位
      this.$dataPost('/api/cms/slide/list', {
        type: '1'
      }, (res) => {
        if (res.code === 0) {
          this.advertiseList = res.data
        }
      })
    },
    initDate () {
      var _this = this
      // 初始化福利专区时间
      _this.$dataPost('/api/goodsSpike/getTime', {}, (res) => {
        if (res.data === '' || res.data == null) {
          _this.$messagebox({
            title: '提示',
            message: '没有数据'
          })
        } else {
          let width = (res.data.length) * 3
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].ans === '正在秒杀') {
              _this.timeCur = i
              _this.getGoodsByTime(res.data[i].timeId)
              break
            }
            if (res.data[i].ans === '即将开始') {
              _this.timeCur = i
              _this.getGoodsByTime(res.data[i].timeId)
              break
            }
          }
          // 滚动区域插件
          _this.getTimeList = res.data
          _this.$refs.personTab.style.width = width + 'rem'
          _this.$nextTick(() => {
            _this.incomeScroll = new BScroll(_this.$refs.incomeWrapper, {
              startX: 0,
              click: true,
              scrollX: true,
              stopPropagation: false,
              eventPassthrough: 'vertical'
            })
          })
        }
      })
    },
    selectTime (timeId, index) {
      // 点击时间段获取数据
      let _this = this
      _this.timeCur = index
      _this.getGoodsByTime(timeId)
    },
    getGoodsByTime (timeId) {
      // 通过时间段获取时间
      let _this = this
      _this.$dataPost('/api/goodsSpike/getGoodsByTime', {
        timeId: timeId,
        pageNumber: 1,
        pageSize: 20,
        userId: window.localStorage.getItem('userId')
      }, (res) => {
        if (res.code === 0) {
          let list = res.data.list
          for (let i = 0; i < list.length; i++) {
            let namevue = list[i].num_sale / list[i].stock * 100
            let endval = namevue.toFixed(2)
            list[i].endvalPro = endval
          }
          _this.actGoodsList = list
        }
      })
    },
    initJiu () {
      // 初始化9.9专区
      let _this = this
      this.$dataPost('/api/cms/nine', {
        userId: window.localStorage.getItem('userId')
      }, (res) => {
        if (res.data === '' || res.data === null) {
          _this.$messagebox({
            title: '提示',
            message: '没有数据'
          })
        } else {
          let spArr = []
          if (res.data.goodsList != null && res.data.goodsList.length > 3) {
            // 只取前三组
            spArr = res.data.goodsList.slice(0, 3)
          } else {
            spArr = res.data.goodsList
          }
          for (var i = 0; i < 3; i++) {
            spArr[i].newPrice = spArr[i].newPrice.toString().split('.')
          }
          _this.img_url = res.data.img
          _this.jiuList = spArr
        }
      })
    },
    initNew () {
      // 初始化新人专区
      let _this = this
      this.$dataPost('/api/cms/goodsNew', {
        userId: window.localStorage.getItem('userId')
      }, (res) => {
        if (res.data === '' || res.data === null) {
          _this.$messagebox({
            title: '提示',
            message: '没有数据'
          })
        } else {
          var data = res.data
          if (data.goodsList.length > 3) {
            _this.newDataGoodsList = data.goodsList.slice(0, 3)
          } else {
            _this.newDataGoodsList = data.goodsList
          }
          _this.newDataImg = data.img
        }
      })
    },
    initShopList () {
      // 初始化今日主推
      let _this = this
      this.$dataPost('/api/goods/recommend', {
        type: '0',
        pageNum: 1,
        pageSize: '20',
        userId: window.localStorage.getItem('userId')
      }, (res) => {
        _this.$indicator.close()
        if (res.data === '' || res.data === null) {
          _this.$messagebox({
            title: '提示',
            message: '没有数据'
          })
        } else {
          _this.todayList = res.data.list
        }
      })
    },
    bannerToDetail (type, id) {
      // 跳转详情
      if (type === 0 && id) {
        this.$router.push({path: 'goodsDetail', query: {id: id, type: 0}})
      }
    },
    getCode () {
      this.$dataPost('/api/member/user/getUserInfoGz', {
        code: window.localStorage.getItem('code'),
        InvitationCode: this.InvitationCode,
        shopId: this.shopId
      }, (res) => {
        if (res.data === '' || res.data === null) {
          this.$messagebox({
            title: '提示',
            message: '没有数据'
          })
        }
      })
    }
  },
  created () {
    // 通过二维码进入会获取到这两个
    this.InvitationCode = this.$route.query.InvitationCode
    this.shopId = this.$route.query.shopId
    this.getCode()
    this.initBanner()
    this.initAdvertise()
    this.initDate()
    this.initJiu()
    this.initNew()
    this.initShopList()
  },
  beforeCreate () {
    this.$indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
    })
  },
  components: {
    Nav
  }
}
</script>

<style scoped>
.wrapper {
  background: #f9f9f9;
  padding-bottom: 1.9rem;
  height: 100%;
}

.banner {
  height: 4.6rem;
}

.banner div {
  height: 100%;
}

.banner div img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-pagination-fraction, .swiper-pagination-custom, .swiper-container-horizontal > .swiper-pagination-bullets {
  top: 86%;
}

/* 分类 */
.coupon {
  display: flex;
  background: #fff;
  border-bottom: 1rpx solid #f5f5f5;
}

.coupon .coupon-li {
  flex: 1;
  text-align: center;
  padding: 0.25rem 0;
}

.coupon .coupon-li img {
  width: 1.1rem;
  height: 1.1rem;
}

.coupon .coupon-li span {
  font-size: 28rpx;
  color: #1B1B1B;
  display: block;
}

.advertise img {
  width: 100%;
}

/* 福利 */
.activity {
  margin: .2rem 0;
}

.activity > .title {
  display: flex;
  overflow: hidden;
  padding: 0.25rem;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.activity > .title .line {
  color: #7d7d7d;
  border-left: .1rem solid #4b6dfe;
  padding-left: .2rem;
  font-size: .3rem;
  margin-left: .25rem;
  padding-top: .1rem;
  padding-bottom: .1rem;
  flex-grow: 1;
  overflow: hidden;
}

.jiu > .title .line {
  border-left-color: #ff353a;
}

.kanjia > .title .line {
  border-left-color: #ffc118;
}

.activity .title img {
  width: 1.8rem;
  flex-shrink: 0;
}

.more {
  flex-shrink: 0;
  color: #333;
  font-size: .3rem;
}

.more .icon-youjiantou {
  font-size: .2rem;
  color: #999;
}

.gundong, .actGoods {
  overflow: hidden;
  /* touch-action: none; */
}

.gundong .gundongList, .actGoodsList {
  white-space: nowrap;
}

.gundong .before {
  width: 3rem;
  display: inline-block;
  font-size: .38rem;
  text-align: center;
  background: #970407;
  color: white;
  padding: .2rem 0;
}

.gundong .before.active {
  font-weight: 600;
  background: #000;
}

.gundong .before .txt {
  font-size: .3rem;
  margin-top: .1rem;
}

/* 商品 */
.actGoods {
  padding: .25rem;
  background: #fff;
}

.actGoods .actGoods-item {
  width: 32.3%;
  margin-right: 1.5%;
  display: inline-block;
}

.actGoods .actGoods-item .img {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
}

.actGoods-item .img img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.actGoods-item .name {
  font-size: .36rem;
  margin: .16rem 0 0;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;
  width: 100%;
}

.actGoods-item .strip progress {
  border: 0;
  width: 95%;
  height: .15rem;
  background: #e5e5e5;
}

progress::-webkit-progress-bar {
  background: #e5e5e5;
}

progress::-webkit-progress-value {
  background: #d50000;
}

.price {
  font-size: .3rem;
  color: #D50000;
  margin-top: .1rem;
  padding-right: .15rem;
}

.price .reality {
  font-size: .36rem;
}

.price .Original {
  float: right;
  color: #aeaeae;
  line-height: .5rem;
  text-decoration: line-through;
}

.noneData {
  font-size: .36rem;
  line-height: 3rem;
  text-align: center;
}

/* 9.9专区 */
.special-shop {
  padding: .25rem;
  background: #fff;
}

.special-shop .special-shop-li {
  display: inline-block;
  width: 32.3%;
  margin-right: 1.5%;
}

.special-shop .special-shop-li:nth-child(3n) {
  margin-right: 0;
}

.special-shop .special-shop-li .image {
  height: 3rem;
  border-radius: .05rem;
  overflow: hidden;
}

.special-shop .special-shop-li .image img {
  width: 100%;
  height: 100%;
}

.special-shop .special-shop-li .title {
  font-size: .36rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: .16rem 0;
}

.special-shop .special-shop-li .text {
  font-size: .36rem;
  color: #D50000;
  line-height: .46rem;
}

.special-shop .special-shop-li .text .di {
  font-size: .22rem;
  color: #fff;
  display: inline-block;
  width: 1.3rem;
  height: .46rem;
  text-align: center;
  line-height: .46rem;
  background: url(../../assets/img/index/ju.png) no-repeat top left;
  background-size: contain;
  margin-right: .1rem;
}

.special-banner img {
  width: 100%;
  display: block;
}

/* 今日主推 */
.today-title {
  padding: .35rem 0 .15rem;
  background: #fff;
  text-align: center;
}

.today-title img {
  width: 40%;
  display: inline-block;
  margin: 0 auto;
}

.today-li {
  border-top: .01rem solid #f5f5f5;
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
