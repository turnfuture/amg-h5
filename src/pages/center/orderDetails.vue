<template>
  <div class="wrapper">
    <div class='address'>
      <img class="left" src='../../assets/img/center/address.png' alt="地址图标">
      <div class="address_msg">
        <div class="top">
          <span class="name">收货人：{{orderDetails.receiver_name}}</span>
          <span class="phone">{{orderDetails.receiver_phone}}</span>
        </div>
        <div class="msg">{{orderDetails.receiver_province}}{{orderDetails.receiver_city}}{{orderDetails.receiver_county}}{{orderDetails.receiver_address}}</div>
      </div>
    </div>
    <img src='../../assets/img/center/line.png' class='line' alt="线">

    <!-- 订单物品 -->
    <div class='content' v-for="item in orderDetails.goodsList" :key="item.id">
      <img :src='item.imgurl' alt="商品图片">
      <div>
        <span class='goodSname'>{{item.goodsName}}</span>
        <div class='price'>
          <span v-if='item.spec'>规格：{{item.spec}}</span>
          <div class="goShop">
            x{{item.total}}
          </div>
        </div>
        <div class="bottom">
          <div class='stock'>￥
            <span class='stock1'>
              {{item.goodsPrice}}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- 订单总价 -->
    <div class='shopTotal'>
      <span class='shopNum'>总共{{orderDetails.allNumber}}件商品：</span> ￥
      <span class='shopPrice'>{{orderDetails.goodsAllPrice}}</span>
    </div>
    <div class='shopTotal'>
      <span class='shopNum'>快递费：￥{{orderDetails.post_fee}}</span>
    </div>
    <div class='shopTotal'>
      <span class='shopNum'>优惠金额：￥{{orderDetails.couponPrice}}</span>
    </div>
    <div class='shopTotal'>
      <span class='shopNum'>实际支付：</span> ￥
      <span class='shopPrice'>{{orderDetails.payment}}</span>
    </div>

    <!-- 订单状态 -->
    <div class="state" v-if="orderDetails.status === 0">订单状态：砍价中</div>
    <div class="state" v-else-if="orderDetails.status === 1">订单状态：待支付</div>
    <div class="state" v-else-if="orderDetails.status === 2">订单状态：拼团中</div>
    <div class="state" v-else-if="orderDetails.status === 3">订单状态：待发货</div>
    <div class="state" v-else-if="orderDetails.status === 4">订单状态：待收货</div>
    <div class="state" v-else-if="orderDetails.status === 5">订单状态：退货中</div>
    <div class="state" v-else-if="orderDetails.status === 6">订单状态：退货成功</div>
    <div class="state" v-else-if="orderDetails.status === 7">订单状态：订单完成</div>
    <div class="state" v-else>订单状态：订单取消</div>
    <div class="orderNum">订单编号：{{orderDetails.order_sn}}</div>
    <div class="orderNum">留言信息：{{orderDetails.buyer_msg?orderDetails.buyer_msg:'无'}}</div>
    <div class="orderNum">创建时间：{{orderDetails.create_at}}</div>
    <div class="orderNum" v-if="orderDetails.pay_at">付款时间：{{orderDetails.pay_at}}</div>
    <div class="orderNum" v-if="orderDetails.consign_at">发货时间：{{orderDetails.consign_at}}</div>
  </div>
</template>

<script>
export default {
  name: 'SetUp',
  data () {
    return {
      orderDetails: {}
    }
  },
  methods: {
    init () {
      let _this = this
      _this.$dataPost('/api/order/getOrderById', {
        userId: window.localStorage.getItem('userId'),
        orderId: _this.$route.query.id ? _this.$route.query.id : 0
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: '没有数据'
          })
          return false
        }
        _this.orderDetails = res.data
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.wrapper {
  padding-bottom: .5rem;
}

.address {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: .15rem 0 0;
  overflow: hidden;
  padding: .25rem .4rem;
}

.address .left {
  width: .5rem;
  flex-shrink: 0;
}

.address .address_msg {
  flex-grow: 1;
  margin: 0 .3rem;
}

.address .address_msg .top {
  overflow: hidden;
  display: flex;
}

.address .address_msg .msg, .address .address_msg .top span {
  color: #333;
  font-size: .36rem;
}

.address .address_msg .top span.name {
  flex-grow: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.address .address_msg .top span.phone {
  flex-shrink: 0;
}

.address .address_msg .msg {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: .15rem;
}

.line {
  width: 100%;
}

/* 订单商品 */
.content {
  display: flex;
  padding: .25rem;
  border-bottom: .02rem solid #eee;
  overflow: hidden;
  font-size: .36rem;
  align-items: center;
  justify-content: space-between;
}

.content img {
  margin-right: .3rem;
  width: 2.7rem;
  height: 2.7rem;
  flex-shrink: 0;
}

.content > div {
  flex-grow: 1;
  overflow: hidden;
}

.content span {
  display: inline-block;
}

.goodSname {
  color: #1b1b1b;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.content .price {
  font-size: .32rem;
  color: #434343;
  position: relative;
}

.bottom{
  margin-top: .3rem;
}

.stock {
  font-size: .3rem;
  color: #e31537;
}

.stock1 {
  font-size: .4rem;
  color: #e31537;
  font-weight: bold;
}

.goShop {
  position: absolute;
  right: .3rem;
  top: 0rpx;
  color: #434343;
  font-size: .3rem;
  border-radius: .15rem;
}

.content > div {
  position: relative;
}

.name {
  height: .9rem;
}

.num01, .num02 {
  font-weight: bold;
}

.num01 {
  font-size: .32rem;
}

.shopTotal {
  font-size: .36rem;
  color: #e31537;
  text-align: right;
  height: 1.1rem;
  line-height: 1.1rem;
  border-bottom: .02rem solid #eee;
  padding-right: .5rem;
}

.shopPrice {
  font-size: .44rem;
}

.shopNum {
  color: #313131;
}

.state, .orderNum {
  width: 94%;
  margin: .15rem auto 0;
  font-size: .36rem;
}

.state {
  color: #d50000;
  margin-top: .3rem;
}

.orderNum {
  color: #434343;
  margin-top: .25rem;
}

.bottom_div{
  text-align: center;
  margin: .8rem 0;
}

.service{
  color: #d50000;
  display: inline-block;
  border: .02rem solid #d50000;
  border-radius: .5rem;
  font-size: .36rem;
  line-height: 1rem;
  width: 5.6rem;
  text-align: center;
  background: #fff;
}
</style>
