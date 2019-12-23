<template>
  <div class="wrapper">
    <!-- banner图 start -->
    <div class='banner'>
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide v-for="item in bannerList" :key="item">
          <img :src="item" alt="banner">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <!-- banner图 end -->
    <!-- 秒杀商品倒计时 -->
    <div v-if="type === 1" class="good_count">
      <div class="count_div" v-if="!isStart">
        <span class="count_colon">秒杀活动还未开始</span>
      </div>
      <div class="count_div" v-if="isStart && !isFinish">
        <span class="count_colon">倒计时</span>
        <span class='count_conutdown'>{{countDown.hou}}</span>
        <span class="count_colon">:</span>
        <span class='count_conutdown'>{{countDown.min}}</span>
        <span class="count_colon">:</span>
        <span class='count_conutdown'>{{countDown.sec}}</span>
      </div>
      <div class="count_div" v-if="isFinish">
        <span class="count_colon">秒杀活动已结束</span>
      </div>
    </div>
    <!-- 商品详情 start -->
    <div class="shop-detail">
      <div class="shop-detail-info">
        <div class="title">
          {{name}}
        </div>
      </div>
      <div class="shop-detail-price">
        <template v-if="type === 4">积分价:</template>
        ￥{{price}}
        <span v-if="type !== 0">￥{{priceOrignal}}</span>
      </div>
      <div class="shop-detail-seal">
        <span>快递费：{{type === 4 ? '包邮' : goodDetail.postFee}}</span>
        <span>月销：{{goodDetail.numSale}}</span>
        <span>库存：{{goodDetail.stock}}</span>
      </div>
    </div>
    <!-- 商品详情 end -->
    <!-- 商品参数 start -->
    <div class="shop-size">
      <div class="shop-size-li" @click="selectShop">
        选择颜色分类
        <i class="iconfont icon-youjiantou"></i>
      </div>
      <div class="shop-size-li" @click="selectCash">
        产品参数
        <i class="iconfont icon-youjiantou"></i>
      </div>
    </div>
    <!-- 商品参数 end -->
    <div class="shop-details">
      <div class="swiper-tab">
        <div class="swiper-tab-list" :class="currentTab == 0 ? 'on' : ''"  @click="swichNav(0)">
          <span>商品详情</span>
        </div>
        <div class="swiper-tab-list" :class="currentTab == 1 ? 'on' : ''" @click="swichNav(1)">
          <span>推荐商品</span>
        </div>
        <div class="swiper-tab-list" :class="currentTab == 2 ? 'on' : ''" @click="swichNav(2)">
          <span>评价（{{goodDetail.comentSize}}）</span>
        </div>
      </div>
      <div class="swiper-box">
        <div class="details" v-if="currentTab == 0">
          <template v-for="(item, index) in goodDetail.goodsImg">
            <img :key="index" :src="item" alt="商品详情图片">
          </template>
        </div>
        <div v-else-if="currentTab == 1">
          <div class="special-shop">
            <template v-if="list.length > 0">
              <template v-for="item in list">
                <div class="special-shop-li" :key="item.id" @click="goDetails(item.id)">
                  <div class="image">
                    <img :src="item.imgurl" alt="商品图片">
                  </div>
                  <div class="main">
                    <div class="title">{{item.name}}</div>
                    <div class="text">
                      <text>￥</text>
                      {{item.price}}
                    </div>
                  </div>
                </div>
              </template>
            </template>
            <template v-else>
              <div class="noneData">暂无推荐商品</div>
            </template>
          </div>
        </div>
        <div v-else>
          <template v-if="commentList.length > 0">
            <template v-for="item in commentList">
              <div class="comment-li" :key="item.id">
                <div class="comment-li-title">
                  <img :src="item.avator" alt="用户头像">
                  <div class="comment-title">
                    <span>{{item.name}}</span>
                    <div class="comment-star">
                      <template v-if="item.star > 0">
                        <img src="../../assets/img/activity/star-active.png" alt="评论">
                      </template>
                      <template v-else>
                        <img src="../../assets/img/activity/star.png" alt="评论">
                      </template>
                      <template v-if="item.star > 1">
                        <img src="../../assets/img/activity/star-active.png" alt="评论">
                      </template>
                      <template v-else>
                        <img src="../../assets/img/activity/star.png" alt="评论">
                      </template>
                      <template v-if="item.star > 2">
                        <img src="../../assets/img/activity/star-active.png" alt="评论">
                      </template>
                      <template v-else>
                        <img src="../../assets/img/activity/star.png" alt="评论">
                      </template>
                      <template v-if="item.star > 3">
                        <img src="../../assets/img/activity/star-active.png" alt="评论">
                      </template>
                      <template v-else>
                        <img src="../../assets/img/activity/star.png" alt="评论">
                      </template>
                      <template v-if="item.star > 4">
                        <img src="../../assets/img/activity/star-active.png" alt="评论">
                      </template>
                      <template v-else>
                        <img src="../../assets/img/activity/star.png" alt="评论">
                      </template>
                    </div>
                  </div>
                  <div class="comment-date">{{item.create_at}}</div>
                </div>
                <div class="comment-li-text">
                  {{item.content}}
                </div>
                <div class="comment-li-pic">
                  <template v-for="(img, idx) in item.imgList">
                    <img :src="img" :key="idx" alt="评价图片">
                  </template>
                </div>
              </div>
            </template>
          </template>
          <template v-else>
            <div class="noneData">暂无评价</div>
          </template>
        </div>
      </div>
    </div>
    <!-- 详情底部 -->
    <div class="details-fixed">
      <div class="fixed-line">
        <template v-if="type === 0">
        <div class="fixed-left fixed-shou" v-if="!isfollow" @click="collection">
          <div>
            <img src="../../assets/img/activity/star.png" alt="收藏">
            <span>收藏</span>
          </div>
        </div>
        <div class="fixed-left fixed-shou" v-else @click="collection">
          <div>
            <img src="../../assets/img/activity/star-active.png" alt="收藏">
            <span class="red">已收藏</span>
          </div>
        </div>
        </template>
        <div class="fixed-left fixed-shou" @click="goCart">
          <div>
            <img src="../../assets/img/activity/cart.png" alt="购物车">
            <span>购物车</span>
          </div>
        </div>
        <button class="fixed-button fixed-cart" v-if="type === 0" @click="selectShop">
          加入购物车
        </button>
        <button class="fixed-button fixed-pay" @click="selectShop">
          立即购买
        </button>
      </div>
    </div>

    <!-- 加入购物车-商品信息mask -->
    <div class="goods_mask" v-if='!boxhidden' @click='closegoods'></div>
    <div class="goods_info" v-if='!boxhidden'>
      <div class='goods_top'>
        <div class='goods_img' v-if="productInfo.icon">
          <img :src='productInfo.icon' alt="商品图片">
        </div>
        <div style='height:130rpx'>
          <div class='goods_money'>
            <span>￥</span>{{productInfo.price}}
          </div>
          <div class='goods_money2' v-if="productInfo.name">
            <span>已选：</span>"{{productInfo.name}}"
          </div>
          <div class='goods_money2'>
            <span>库存：</span>{{productInfo.stock}}
          </div>
        </div>
        <div class="goods_close" @click='closegoods'>
          <img src='../../assets/img/activity/xqguanbi.png'>
        </div>
      </div>
      <div class="size" v-for="(item, index) in skus" :key="index">
        <div class="title">{{item.spec_name}}</div>
        <div class="size-line">
          <span v-for="(itm, idx) in item.spec_values" :key="idx" :class="moSku[index] == itm.spec_value_name?'skuActive': ''" @click="skuItem(index, idx)">
            {{itm.spec_value_name}}
          </span>
        </div>
      </div>
      <div class="flex-num">
        <div class="flex-row flex-y-center mb-20" style="padding:30rpx 0">
          <div class="flex-grow-1">数量</div>
          <div class="flex-grow-0">
            <div class="flex-row number-input-box">
              <div class="flex-grow-0 flex-x-center flex-y-center number-btn number-sub disabled" @click='down'>-</div>
              <div class="flex-grow-0">
                <div type="number" maxlength='2' class="flex-grow-1 number-input">{{payNum}}</div>
              </div>
              <div class="flex-grow-0 flex-x-center flex-y-center number-btn number-add" @click='up'>+</div>
            </div>
          </div>
        </div>
      </div>
      <div class="goods_confirm">
        <button v-if="type === 0" @click="addCart(productInfo.id)">加入购物车</button>
        <button :class="type !== 0 ? 'wid100' : ''" @click="toBuy(productInfo.id)">立即购买</button>
      </div>
    </div>

    <!-- 产品参数 -->
    <div class="goods_mask" v-if='!cashhidden' @click='closeCash'></div>
    <div class="goods_info goods_info_params" v-if='!cashhidden' style="height: 500rpx">
      <div class="goods_close" @click='closeCash'>
        <img src='../../assets/img/activity/xqguanbi.png' alt="关闭">
      </div>
      <template v-if="proParams.length > 0">
        <div class="params_item" v-for="(item, index) in proParams" :key="index">
          <div class="title">
            {{item.name}}
          </div>
          <ul>
            <li v-for="(itm, idx) in item.value" :key="idx">
              <span>{{itm.name}}</span>
              <span>{{itm.value}}</span>
            </li>
          </ul>
        </div>
      </template>
      <template v-else>
        <div class="noneData">暂无产品参数</div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsDetail',
  data () {
    return {
      type: 0,
      id: '',
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
      bannerList: [],
      name: '',
      spikePrice: '',
      price: '',
      priceOrignal: '',
      goodsImg: [],
      goodDetail: {},
      isfollow: '',
      noWid: '',
      currentTab: 0,
      payNum: 1,
      moSku: [],
      skus: [],
      list: [],
      commentList: [],
      productInfo: {},
      boxhidden: true,
      cashhidden: true,
      isStart: false,
      isFinish: false,
      proParams: [],
      actEndTime: '',
      countDown: {}
    }
  },
  inject: ['reload'],
  methods: {
    init () {
      // 普通商品
      let _this = this
      this.$dataPost('/api/goods/goods/getDetail', {
        userId: window.localStorage.getItem('userId'),
        goodsId: _this.id
      }, (res) => {
        this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        let datas = res.data
        let spec = JSON.parse(datas.spec)
        let sku = []
        for (let i = 0; i < spec.length; i++) {
          sku[i] = spec[i].spec_values[0].spec_value_name
        }
        let proParams = datas.params ? JSON.parse(datas.param) : []
        _this.bannerList = datas.banner
        _this.name = res.data.name
        _this.spikePrice = datas.spikePrice
        _this.price = datas.price
        _this.goodsImg = datas.goodsImg
        _this.goodDetail = res.data
        _this.isfollow = datas.isfollow
        _this.productList = datas.productList
        _this.skus = spec
        _this.moSku = sku
        _this.noWid = datas.goodsId
        _this.proParams = proParams
      })
    },
    getDetailSpike () {
      // 秒杀商品详情接口
      let _this = this
      this.$dataPost('/api/goods/goods/getSpikeDetail', {
        userId: window.localStorage.getItem('userId'),
        spikeId: _this.id
      }, (res) => {
        this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        let datas = res.data
        let spec = JSON.parse(datas.spec)
        let sku = []
        for (let i = 0; i < spec.length; i++) {
          sku[i] = spec[i].spec_values[0].spec_value_name
        }
        let isStart = new Date().getTime() >= new Date(res.data.startTime.replace(/-/g, '/')).getTime() ? 'true' : ''
        let proParams = datas.params ? JSON.parse(datas.param) : []
        _this.bannerList = datas.banner
        _this.name = res.data.name
        _this.price = datas.spikePrice
        _this.priceOrignal = datas.price
        _this.goodsImg = datas.goodsImg
        _this.goodDetail = res.data
        _this.isfollow = datas.isfollow
        _this.productList = datas.productList
        _this.skus = spec
        _this.moSku = sku
        _this.noWid = datas.goodsId
        _this.actEndTime = res.data.endTime
        _this.proParams = proParams
        _this.isStart = isStart
        // 执行倒计时函数
        _this.countDownFun()
      })
    },
    getDetailNine () {
      // 9.9商品详情接口
      let _this = this
      this.$dataPost('/api/goods/goods/getNineDetail', {
        userId: window.localStorage.getItem('userId'),
        nineId: _this.id
      }, (res) => {
        this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        let datas = res.data
        let spec = JSON.parse(datas.spec)
        let sku = []
        for (let i = 0; i < spec.length; i++) {
          sku[i] = spec[i].spec_values[0].spec_value_name
        }
        let proParams = datas.params ? JSON.parse(datas.param) : []
        _this.bannerList = datas.banner
        _this.name = res.data.name
        _this.price = datas.spikePrice
        _this.priceOrignal = datas.price
        _this.goodsImg = datas.goodsImg
        _this.goodDetail = res.data
        _this.isfollow = datas.isfollow
        _this.productList = datas.productList
        _this.skus = spec
        _this.moSku = sku
        _this.noWid = datas.goodsId
        _this.proParams = proParams
      })
    },
    getDetailNew () {
      // 新人专享商品详情接口
      let _this = this
      this.$dataPost('/api/goods/goods/getNewDetail', {
        userId: window.localStorage.getItem('userId'),
        newId: _this.id
      }, (res) => {
        this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        let datas = res.data
        let spec = JSON.parse(datas.spec)
        let sku = []
        for (let i = 0; i < spec.length; i++) {
          sku[i] = spec[i].spec_values[0].spec_value_name
        }
        let proParams = datas.params ? JSON.parse(datas.param) : []
        _this.bannerList = datas.banner
        _this.name = res.data.name
        _this.price = datas.spikePrice
        _this.priceOrignal = datas.price
        _this.goodsImg = datas.goodsImg
        _this.goodDetail = res.data
        _this.isfollow = datas.isfollow
        _this.productList = datas.productList
        _this.skus = spec
        _this.moSku = sku
        _this.noWid = datas.goodsId
        _this.proParams = proParams
      })
    },
    swichNav (idx) {
      // 切换商品详情
      let _this = this
      if (_this.currentTab === idx) {
        return false
      } else {
        _this.currentTab = idx
      }
      if (_this.currentTab === 2) {
        // 评价
        _this.getEvaluateList()
      } else if (_this.currentTab === 1) {
        // 推荐商品
        _this.getInfofy()
      }
    },
    getInfofy () {
      // 推荐商品
      let _this = this
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      this.$dataPost('/api/goods/recommend', {
        userId: window.localStorage.getItem('userId'),
        type: '1',
        pageNum: 1,
        pageSize: '10'
      }, (res) => {
        this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.list = res.data.list
      })
    },
    getEvaluateList () {
      // 评价
      let _this = this
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      this.$dataPost('/api/goods/getGoodsComent', {
        userId: window.localStorage.getItem('userId'),
        goodsId: _this.goodDetail.goodsId,
        pageNum: '1',
        pageSize: '20'
      }, (res) => {
        this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.commentList = res.data.list
      })
    },
    collection () {
      // 收藏商品
      this.$dataPost('/api/memberFollow/setFollow', {
        userId: window.localStorage.getItem('userId'),
        goodsId: this.goodDetail.goodsId
      }, (res) => {
        if (res.msg === '取消关注') {
          this.$toast({
            message: '取消收藏'
          })
          this.isfollow = false
        } else if (res.msg === '关注成功') {
          this.$toast({
            message: '收藏成功'
          })
          this.isfollow = true
        }
      })
    },
    goCart () {
      this.$router.replace('cart')
    },
    goDetails (id) {
      this.$router.replace({path: 'goodsDetail', query: {id: id}})
      this.reload()
    },
    selectShop () {
      // 显示遮罩层,分类
      if (!this.isStart && this.type === 1) {
        // 秒杀商品且未开始秒杀
        this.$toast({
          message: '该商品秒杀还未开始'
        })
        return false
      }
      if (this.isFinish && this.type === 1) {
        // 秒杀商品且倒计时已结束
        this.$toast({
          message: '该商品秒杀已结束'
        })
        return false
      }
      this.boxhidden = false
      this.getInfo(this.moSku)
    },
    closegoods () {
      // 关闭遮罩层,分类
      this.boxhidden = true
    },
    selectCash () {
      // 显示产品参数
      this.cashhidden = false
    },
    closeCash () {
      // 关闭产品参数
      this.cashhidden = true
    },
    skuItem (index, idx) {
      // 大分类index、小分类idx
      var dateMoSku = this.moSku
      dateMoSku[index] = this.skus[index].spec_values[idx].spec_value_name
      this.moSku = dateMoSku
      this.getInfo(this.moSku)
    },
    getInfo (data) {
      // 获取商品信息
      let stockName = ''
      let dateMoSku = data
      let skus = this.skus
      for (let i = 0; i < skus.length; i++) {
        let name = skus[i].spec_name + ':' + dateMoSku[i] + '*'
        stockName += name
      }
      stockName = stockName.substr(0, stockName.length - 1)
      this.$dataPost('/api/goods/getProduct', {
        userId: window.localStorage.getItem('userId'),
        type: this.type,
        id: this.id,
        spec: stockName
      }, (res) => {
        this.$indicator.close()
        if (res.code !== 0) {
          this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        this.productInfo = res.data
        this.price = res.data.price
      })
    },
    down () {
      // 数量减
      var num = this.payNum
      if (num <= 1 || this.productInfo.stock === 0) {
        return false
      } else {
        this.payNum = --num
      }
    },
    up () {
      // 数量加
      var num = this.payNum
      if (num >= this.productInfo.stock) {
        this.$toast({
          message: '大于库存'
        })
        return false
      } else {
        this.payNum = ++num
      }
    },
    addCart (guigeId) {
      // 加入购物车
      let _this = this
      if (_this.isFinish && _this.type === 1) {
        // 秒杀商品且倒计时已结束
        _this.$toast({
          message: '该商品秒杀已结束'
        })
        return false
      }
      this.$dataPost('/api/memberCart/addCart', {
        userId: window.localStorage.getItem('userId'),
        goodsId: _this.goodDetail.goodsId,
        productId: guigeId,
        num: _this.payNum
      }, (res) => {
        if (res.code !== 0) {
          this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.$toast({
          message: '加入购物车成功'
        })
        _this.boxhidden = true
        _this.cashhidden = true
      })
    },
    toBuy (guigeId) {
      // 立即购买
      let _this = this
      let productInfo = _this.productInfo
      localStorage.setItem('productInfo', JSON.stringify(productInfo))
      let tempObj = {
        goodId: _this.id,
        type: _this.type ? _this.type : '0',
        buyNum: _this.payNum,
        goodName: _this.name
      }
      _this.$router.push({path: 'conOrder', query: tempObj})
    },
    countDownFun () {
      // 倒计时函数
      var _this = this
      // 获取当前时间，同时得到活动结束时间数组
      let newTime = new Date().getTime()
      // 对结束时间进行处理渲染到页面
      // endTimeList.forEach(o => {
      let endTime = new Date(_this.actEndTime.replace(/-/g, '/')).getTime()
      let obj = null
      let isFinish = _this.isFinish
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0 && !isFinish) {
        let time = (endTime - newTime) / 1000
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24))
        let hou = parseInt(time % (60 * 60 * 24) / 3600)
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60)
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60)
        if (day > 0) {
          hou = hou * day
        }
        obj = {
          hou: _this.timeFormat(hou),
          min: _this.timeFormat(min),
          sec: _this.timeFormat(sec)
        }
      } else {
        // 活动已结束，全部设置为'00'
        obj = {
          day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
        isFinish = true
      }
      // 渲染，然后每隔一秒执行一次倒计时函数
      _this.countDown = obj
      _this.isFinish = isFinish
      if (!isFinish) {
        setTimeout(_this.countDownFun, 1000)
      }
    },
    timeFormat (param) {
      // 小于10的格式化函数
      return param < 10 ? '0' + param : param
    }
  },
  watch: {
    '$route' (to, from) {
      console.log(to)
      console.log(from)
    }
  },
  created () {
    let _this = this
    let type = parseInt(_this.$route.query.type)
    let id = _this.$route.query.id
    _this.id = id
    if (type) {
      _this.type = type
    } else {
      type = 0
      _this.type = 0
    }
    if (type === 0) {
      // 普通商品
      _this.init()
    } else if (type === 1) {
      // 秒杀商品
      _this.getDetailSpike()
    } else if (type === 2) {
      // 9.9商品
      _this.getDetailNine()
    } else if (type === 3) {
      // 砍价商品
      _this.getDetailBargain()
    } else if (type === 4) {
      // 积分商品
      _this.getDetailInteg()
    } else if (type === 5) {
      // 新人专享
      _this.getDetailNew()
    }
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
.wrapper {
  padding-bottom: 1.5rem;
}

.banner {
  height: 10rem;
}

.swiper-container {
  height: 100%;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 商品内容 */
.shop-detail {
  background: #fff;
  border-bottom: .02rem solid #EEEEEE;
}

.shop-detail-info {
  display: flex;
}

.shop-detail-info .title {
  flex: 1;
  font-size: .4rem;
  color: #000;
  padding: .2rem .3rem;
}

.shop-detail-info .server {
  width: 1.8rem;
  border: 0;
  border-left: .02rem solid #ccc;
  text-align: center;
  margin-top: .2rem;
  background: transparent;
  padding: 0;
  overflow: visible;
  position: relative;
}

.shop-detail-info .server img {
  width: .8rem;
  height: .8rem;
}

.shop-detail-info .server span {
  font-size: .3rem;
  color: #ADADAD;
  display: block;
  width: 100%;
}

.shop-detail-price {
  font-size: .44rem;
  color: #E83632;
  padding: 0 .3rem;
}

.shop-detail-price span {
  font-size: .3rem;
  color: #AEAEAE;
  text-decoration: line-through;
  margin-left: .15rem;
}

.shop-detail-seal {
  padding: 0 .3rem;
  font-size: .28rem;
  color: #7D7D7D;
  margin: .2rem 0;
  display: flex;
}

.shop-detail-seal span:nth-child(2) {
  flex: 1;
  text-align: center;
}

/* 商品规格 */
.shop-size {
  border-top: .02rem solid #eee;
  padding: .2rem 0;
  background: #f5f5f5;
}

.shop-size-li {
  display: flex;
  font-size: .36rem;
  line-height: 1.3rem;
  border-bottom: .02rem solid #eee;
  padding: 0 .25rem;
  background: #fff;
}

.shop-size-li i {
  margin-left: auto;
  font-size: .32rem;
  color: #ccc;
}

/* 商品详情 */
.swiper-tab{
  width: 100%;
  text-align: center;
  overflow: hidden;
  background: #fff;
  font-size: .32rem;
}

.swiper-tab-list{
  float: left;
  width: 33.3%;
  padding: .36rem 0;
  border-bottom: .02rem solid #dfdfdf;
}

.on{
  border-bottom: .06rem solid #970407;
}

.swiper-tab-list span{
  display: block;
  font-size: .4rem;
  line-height: 1.5em;
}

.swiper-box{
  display: block;
  width: 100%;
  height: auto;
  overflow: hidden;
}

.swiper-box .details img{
  width: 100%;
  display: block;
}

/* 推荐商品 */
.special-shop {
  padding: .2rem .3rem .25rem;
  border-bottom: .02rem solid #f5f5f5;
  background: #fff;
}

.special-shop .special-shop-li {
  display: inline-block;
  width: 48%;
  margin-right: 4%;
  margin-bottom: .45rem;
}

.special-shop .special-shop-li:nth-child(2n) {
  margin-right: 0;
}

.special-shop .special-shop-li .image {
  height: 4.8rem;
  border-radius: .1rem;
  overflow: hidden;
}

.special-shop .special-shop-li .image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.special-shop .special-shop-li .title {
  font-size: .36rem;
  line-height: 1.5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: .15rem 0;
}

.special-shop .special-shop-li .text {
  font-size: .3rem;
  color: #D50000;
}

.special-shop .special-shop-li .text span {
  font-size: .28rem;
  margin: .03rem 0;
}

.special-shop .special-shop-li .text span.ori-price {
  text-decoration: line-through;
  color: #AEAEAE;
  float: right;
}

/* 评价 */
.comment-li {
  padding: .25rem 0 .35rem;
  border-bottom: .02rem solid #eee;
  background: #fff;
}

.comment-li-title {
  display: flex;
  padding: 0 .35rem;
}

.comment-li-title > img {
  width: 1.3rem;
  height: 1.3rem;
  border-radius: 50%;
}

.comment-li-title .comment-title{
  flex: 1;
  font-size: .3rem;
  color: #000;
  padding: .15rem .28rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 五角星 */
.comment-star {
  margin-top: .12rem;
}

.comment-star img {
  width: .6rem;
  height: .6rem;
}

.comment-date {
  font-size: .3rem;
  color: #7D7D7D;
  margin-left: auto;
  padding-top: .12rem;
}

.comment-li-text {
  padding: .25rem .3rem 0;
  font-size: .32rem;
  color: #7D7D7D;
}

.comment-li-pic {
  display: flex;
  flex-wrap: wrap;
  padding: 0 .36rem;
}

.comment-li-pic img {
  width: 32%;
  height: 3rem;
  object-fit: cover;
  margin-right: 2%;
  margin-top: .2rem;
}

.comment-li-pic img:nth-child(3n) {
  margin-right: 0;
}

/* 详情底部操作 */
.details-fixed {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1.4rem;
  background: #fff;
  border-top: .02rem solid #eee;
}

.fixed-line {
  display: flex;
  height: 1.4rem;
}

.fixed-left {
  width: 2rem;
  text-align: center;
  position: relative;
}

.fixed-left div {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fixed-left img {
  width: .5rem;
  height: .5rem;
}

.fixed-left span {
  font-size: .3rem;
  color: #AEAEAE;
  display: block;
}

.fixed-left span.red {
  color: #E83632;
}

.fixed-button {
  flex: 1;
  font-size: .36rem;
  color: #fff;
  line-height: 1.4rem;
  border-radius: 0;
  border: 0;
}

.fixed-cart {
  background: #F27132;
}

.fixed-pay {
  background: #E83632;
}
/* 加入购物车 */
.goods_mask {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: 99;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
}

.goods_info {
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 99;
  background: #fff;
}

.goods_top {
  padding: .2rem 0 .2rem 3.7rem;
  position: relative;
  height: 2.2rem;
}

.goods_img {
  position: absolute;
  top: -.6rem;
  left: .2rem;
  width: 3rem;
  height: 3rem;
  border: .04rem solid #fff;
  border-radius: .06rem;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2);
  float: left;background-color:#fff;
}

.goods_img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods_money {
  color: #E83632;
  font-weight: bold;
  font-size: .44rem;
  line-height: 2em;
}

.goods_money2 {
  color: #999;
  line-height: 2em;
}

.goods_close {
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 50%;
}

.goods_close img {
  width: .7rem;
  height: .7rem;
}

.goods_confirm {
  width: 100%;
  position: absolute;
  bottom: 0;
}

.goods_confirm button {
  text-align: center;
  line-height: 1.4rem;
  color: #fff;
  width: 50%;
  float: left;
  border-radius: 0;
  background: #F27132;
  font-size: .4rem;
  border: 0;
}

.goods_confirm .wid100 {
  width: 100%;
}

.goods_confirm button:last-child {
  background: #E83632;
}

.flex-num {
  margin-bottom: 1.5rem;
  padding: .3rem .4rem;
}

.flex-row {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-flex-direction: row;
  flex-direction: row;
}

.flex-grow-0{
  min-width: 0;
  -webkit-box-flex: 0;
  -webkit-flex-grow: 0;
  -ms-flex-positive: 0;
  flex-grow: 0;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
}

.flex-grow-1{
  min-width: 0;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  -webkit-flex-shrink: 1;
  -ms-flex-negative: 1;
  flex-shrink: 1;
}
.flex-x-center{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.flex-y-center{
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;

  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  -ms-grid-row-align: center;
  align-items: center;
}

.number-input-box {
  height: 1rem;
}

.number-input-box .number-btn.disabled {
  background: #eee;
  color: #aaa;
}

.number-input-box .number-btn {
  height: 100% !important;
  width: 1rem;
  background: #eee;
}

.number-input-box .number-input {
  height: 1rem !important;
  border: none;
  text-align: center;
  width: 2rem;
  line-height: 1rem;
  margin: 0 .05rem !important;
}

.number-input-box .number-btn {
  height: 100% !important;
  width: 1rem;
  background: #eee;
  font-size: .5rem;
}

/* 规格 */
.size {
  padding: .3rem .4rem;
  border-bottom: .02rem solid #eee;
}

.size .size-line {
  padding-top: .3rem;
}

.size .size-line span {
  font-size: .3rem;
  padding: 0 .4rem;
  background: #eee;
  line-height: .8rem;
  margin-right: .2rem;
  display: inline-block;
  border-radius: .4rem;
  color: #7D7D7D;
}

.size .size-line span.skuActive {
  background: #dd191d;
  color: #fff;
}

.params_item {
  padding: .4rem;
}
.params_item .title {
  font-size: .44rem;
  margin-bottom: .15rem;
}
.params_item ul span {
  margin-right: .15rem;
}
.goods_info_params {
  min-height: 8rem;
}
/* 秒杀 */
.good_count{
  padding: .15rem 0;
  background: #e83632;
  font-size: .34rem;
  color: #fff;
  text-align: center;
}
.good_count .count_div{
  display: inline-block;
}
.good_count .count_conutdown{
  width: .9rem;
  line-height: .9rem;
  color: #fff;
  text-align: center;
  display: inline-block;
  font-size: .4rem;
  border-radius: .15rem;
}
.good_count .count_colon{
  line-height: .9rem;
  margin: 0 .15rem;
}
</style>
