<template>
  <div class="wrapper">
    <div class="swiper-tab">
      <div class="swiper-tab-list" :class="currentTab == 0 ? 'on' : ''" @click="swichNav(0)">
        <span>全部</span>
      </div>
      <div class="swiper-tab-list" :class="currentTab == 1 ? 'on' : ''" @click="swichNav(1)">
        <span>待付款</span>
      </div>
      <div class="swiper-tab-list" :class="currentTab == 2 ? 'on' : ''" @click="swichNav(2)">
        <span>代发货</span>
      </div>
      <div class="swiper-tab-list" :class="currentTab == 3 ? 'on' : ''" @click="swichNav(3)">
        <span>待收货</span>
      </div>
      <div class="swiper-tab-list" :class="currentTab == 4 ? 'on' : ''" @click="swichNav(4)">
        <span>待评价</span>
      </div>
    </div>

    <template v-if="incomeList.length > 0">
      <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <template v-for="item in incomeList">
          <div class="order-item" :key="item.id">
            <div class="order-item-title" @click.passive="goOrderDetail(item.id)">
              订单号：{{item.order_sn}}
              <span v-if="item.status==0">砍价中</span>
              <span v-else-if="item.status==1">待支付</span>
              <span v-else-if="item.status==2">拼团中</span>
              <span v-else-if="item.status==3">待发货</span>
              <span v-else-if="item.status==4">待收货</span>
              <span v-else-if="item.status==5">退货中</span>
              <span v-else-if="item.status==6">退货成功</span>
              <span v-else-if="item.status==7&&!item.coment">待评价</span>
              <span v-else-if="item.status==7&&item.coment">已完成</span>
              <span v-else-if="item.status==8">订单取消</span>
              <span v-else-if="item.status==9">砍价失败</span>
              <span v-else-if="item.status==10">拼团失败</span>
            </div>
            <div class="order-title-shop" @click.passive="goOrderDetail(item.id)">
              <template v-for="list in item.detailList">
                <div class="shop-item" :key="list.id">
                  <div class="shop-pic">
                    <img :src="list.imgurl" alt="商品图片">
                  </div>
                  <div class="shop-main">
                    <div class="title">{{list.goodName}}</div>
                    <div class="size">
                      规格：{{list.spec}}
                      <span>X{{list.total}}</span>
                    </div>
                    <div class="price">
                      ￥{{list.price}}
                    </div>
                  </div>
                </div>
              </template>
            </div>
            <div class="order-item-total" @click.passive="goOrderDetail(item.id)">
              共{{item.allTotal}}件商品：合计￥<span>{{item.payment}}</span>
            </div>
            <div class="order-item-button" v-if="item.status == 1">
              <button @click.stop="toPay(item.id)">去支付</button>
              <button @click.stop="delOrder(item.id)">取消订单</button>
            </div>
            <div class="order-item-button" v-else-if="item.status == 4">
              <button @click.stop="receiving(item.id)">确认收货</button>
              <button>
                <router-link :to="{path: 'logistics', query: {id: item.id}}">查看物流</router-link>
              </button>
              <button>
                <router-link :to="{path: 'RetuGoods', query: {id: item.id}}">退货</router-link>
              </button>
            </div>
            <div class="order-item-button" v-else-if="item.status == 7&&item.coment">
              <button @click.stop="reMove(item.id)">删除订单</button>
            </div>
            <div class="order-item-button" v-else-if="item.status==7&&!item.coment">
              <button>
                <router-link :to="{path: 'evaluationGood', query: {id: item.id}}">去评价</router-link>
              </button>
            </div>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="noneData">暂时没有该类型订单~</div>
    </template>
  </div>
</template>

<script>
import wx from 'weixin-js-sdk'
export default {
  name: 'Order',
  data () {
    return {
      currentTab: 0,
      incomeList: [],
      page: 1,
      pageSize: 20,
      isLast: false
    }
  },
  methods: {
    swichNav (type) {
      // 切换状态
      let _this = this
      _this.currentTab = type
      _this.page = 1
      _this.attrIncomeList(type)
    },
    attrIncomeList (type) {
      // 获取列表
      let _this = this
      if (this.page === 1) {
        _this.incomeList = []
      }
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      _this.$dataPost('/api/order/getOrderList', {
        userId: window.localStorage.getItem('userId'),
        type: type,
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
        this.attrIncomeList(this.currentTab)
      }
    },
    delOrder (orderId) {
      // 取消订单
      let _this = this
      _this.$messagebox.confirm('您确认要取消此订单？').then(action => {
        _this.$dataPost('/api/order/setStatusOrder', {
          userId: window.localStorage.getItem('userId'),
          orderId: orderId,
          type: '8'
        }, (res) => {
          if (res.code !== 0) {
            _this.$messagebox({
              title: '提示',
              message: res.msg
            })
            return false
          }
          _this.$toast({
            message: '取消订单成功'
          })
          setTimeout(function () {
            _this.page = 1
            _this.attrIncomeList(_this.currentTab)
          }, 1500)
        })
      }).catch(action => {
        console.log('cancel')
      })
    },
    reMove (orderId) {
      // 删除订单
      let _this = this
      _this.$messagebox.confirm('是否确认删除此订单么？').then(action => {
        _this.$dataPost('/api/order/removeOrder', {
          userId: window.localStorage.getItem('userId'),
          orderIdList: [{
            orderId: orderId
          }]
        }, (res) => {
          if (res.code !== 0) {
            _this.$messagebox({
              title: '提示',
              message: res.msg
            })
            return false
          }
          _this.$toast({
            message: '删除订单成功'
          })
          setTimeout(function () {
            _this.page = 1
            _this.attrIncomeList(_this.currentTab)
          }, 1500)
        })
      }).catch(action => {
        console.log('cancel')
      })
    },
    receiving (orderId) {
      // 订单确认收货
      let _this = this
      _this.$messagebox.confirm('您确认已经收到商品了么？').then(action => {
        _this.$dataPost('/api/order/removeOrder', {
          userId: window.localStorage.getItem('userId'),
          orderId: orderId,
          type: '7'
        }, (res) => {
          if (res.code !== 0) {
            _this.$messagebox({
              title: '提示',
              message: res.msg
            })
            return false
          }
          _this.$toast({
            message: '确认收货成功'
          })
          setTimeout(function () {
            _this.page = 1
            _this.attrIncomeList(_this.currentTab)
          }, 1500)
        })
      }).catch(action => {
        console.log('cancel')
      })
    },
    toPay (orderId) {
      // 订单确认收货
      let _this = this
      _this.$messagebox.confirm('您确认要支付此订单？').then(action => {
        _this.$dataPost('/api/wxPay/pay', {
          userId: window.localStorage.getItem('userId'),
          orderId: orderId,
          platform: 2
        }, (res) => {
          if (res.code !== 0) {
            _this.$messagebox({
              title: '提示',
              message: res.msg
            })
            return false
          }
          let payInfo = res.data
          wx.chooseWXPay({
            timestamp: payInfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: payInfo.nonceStr, // 支付签名随机串，不长于 32 位
            package: payInfo.prepayId, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: payInfo.sign, // 支付签名
            success (res) {
              // 支付成功后的回调函数
              _this.$toast({
                message: '支付订单成功'
              })
              setTimeout(function () {
                _this.page = 1
                _this.attrIncomeList(_this.currentTab)
              }, 1500)
            },
            fail (res) {
              _this.$messagebox({
                title: '提示',
                message: res
              })
            }
          })
        })
      }).catch(action => {
        console.log('cancel')
      })
    },
    goOrderDetail (orderId) {
      this.$router.push({path: 'orderDetails', query: {id: orderId}})
    },
    init () {
      let _this = this
      _this.$dataPost('/api/member/config', {
        url: location.href.split('#')[0]
      }, (res) => {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.appId, // 必填，公众号的唯一标识
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.sign, // 必填，签名，见附录1
          jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
      })
    }
  },
  created () {
    this.currentTab = this.$route.query.type
    this.init()
    this.attrIncomeList(this.$route.query.type)
  }
}
</script>

<style scoped>
/* 分栏 */
.swiper-tab {
  width: 100%;
  border-top: .02rem solid #eee;
  border-bottom: .02rem solid #eee;
  text-align: center;
  overflow: hidden;
  background: #fff;
}

.swiper-tab-list {
  float: left;
  width: 20%;
  padding: .45rem 0;
}

.swiper-tab-list span {
  display: block;
  font-size: .36rem;
  color: #7D7D7D;
  line-height: 44rpx;
}

.on {
  border-bottom: .06rem solid #d50000;
}

.on span {
  color: #d50000;
}

/* 列表 */
.list {
  background: #f9f9f9;
  padding-bottom: .2rem;
}

.order-item:first-child {
  border-top: 0;
}

.order-item {
  background: #fff;
  border-top: .02rem solid #f1f1f1;
  border-bottom: .02rem solid #f1f1f1;
  margin: 0 0 .2rem;
}

.order-item:last-child {
  margin-bottom: 0;
}

.order-item-title {
  padding: 0 .36rem;
  font-size: .32rem;
  line-height: 1rem;
  border-bottom: .02rem solid #f1f1f1;
}

.order-item-title span {
  float: right;
  color: #d50000;
}

/* 订单商品列表 */
.shop-item {
  display: flex;
  padding: .25rem .36rem;
  border-bottom: .02rem solid #f1f1f1;
  position: relative;
}

.shop-round {
  padding-right: .2rem;
}

.shop-round .round {
  margin: 1rem 0;
}

.shop-item .shop-pic {
  width: 2.5rem;
  height: 2.5rem;
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
  font-size: .34rem;
  color: #1B1B1B;
  margin: .2rem 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.shop-item .shop-main .size {
  font-size: .3rem;
  color: #999;
}

.shop-item .shop-main .size span {
  float: right;
}

.shop-item .shop-main .price {
  font-size: .44rem;
  color: #E31537;
  margin-top: .2rem;
}

.shop-item .shop-main .price span {
  text-decoration: line-through;
  font-size: .3rem;
  color: #AEAEAE;
}

.order-item .order-item-total {
  font-size: .3rem;
  color: #1B1B1B;
  text-align: right;
  line-height: 1.1rem;
  padding: 0 .3rem;
  border-bottom: .02rem solid #f1f1f1;
}

.order-item .order-item-total span {
  font-size: .4rem;
  color: #d50000;
}

.order-item .order-item-button {
  padding: 0 .3rem;
  overflow: hidden;
}

.order-item .order-item-button button {
  font-size: .4rem;
  color: #d50000;
  width: 2.2rem;
  line-height: .9rem;
  border: .02rem solid #d50000;
  box-sizing: border-box;
  border-radius: .45rem;
  background: transparent;
  margin: .2rem 0 .2rem .3rem;
  float: right;
}

.order-item .order-item-button button a {
  color: #d50000;
}

.noneData {
  background: #fff;
}
</style>
