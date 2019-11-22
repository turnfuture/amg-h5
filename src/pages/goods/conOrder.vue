<template>
  <div class="wrapper">
    <!-- 收货人信息 -->
    <!-- 已有地址 -->
    <div class='address' v-if="address" @click="toAddressList">
      <img class="left" src='../../assets/img/center/address.png' alt="地址">
      <div class="address_msg">
        <div class="top">
          <span class="name">收货人：{{address.fullName}}</span>
          <span class="phone">{{address.phone}}</span>
        </div>
        <div class="msg">{{address.province+address.city+address.county+address.address}}</div>
      </div>
      <i class='iconfont icon-jiantou'></i>
    </div>
    <!-- 添加地址 -->
    <div v-else @click="toAddressList" class="addSite">
      <i class="iconfont icon-tianjia"></i>
      <span>添加地址</span>
    </div>
    <img src='../../assets/img/center/line.png' class='line' alt="线">
    <!-- 订单物品 -->
    <!-- 从购物车进入 -->
    <template v-if="!type && type !== '0'">
      <div class='content' v-for="item in orderInfo" :key="item.id">
        <div class="pic">
          <img :src='item.imgurl' alt="商品图片">
        </div>
        <div class="main">
          <span class='goodSname'>{{item.name}}</span>
          <div class='price'>
            <span v-if='item.spec'>规格：{{item.spec}}</span>
            <div class="goShop">
              x{{item.num}}
            </div>
          </div>
          <div class="bottom">
            <div class='stock'>￥
              <span class='stock1'>
                {{item.price}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 直接下单 -->
      <div class='content'>
        <div class="pic">
          <img :src='goodInfo.icon' alt="商品图片">
        </div>
        <div class="main">
          <span class='goodSname'>{{goodName}}</span>
          <div class='price'>
            <span v-if='goodInfo.spec'>规格：{{goodInfo.spec}}</span>
            <div class="goShop">
              x{{buyNum}}
            </div>
          </div>
          <div class="bottom">
            <div class='stock'>{{type === 4 ? '积分价:￥' : '￥'}}
              <span class='stock1'>
                {{goodInfo.price}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!-- 订单总价 -->
    <div class='shopTotal'>
      <span class='shopNum'>总共{{type ? buyNum : allNum}}件商品：</span> ￥
      <span class='shopPrice'>{{allPrice ? allPrice*1 : allPrice}}</span>
    </div>
    <div class="shopLine">
      <div class='shopOther' v-if="type === '0'" @click="xuanCoupon">
        选择优惠券
        <i class='iconfont icon-youjiantou'></i>
      </div>
      <div class='shopOther' v-if="type === '0'">
        已优惠：
        <span class='shopNum'>￥{{totalMoney}}</span>
      </div>
      <div class='shopOther' v-if="type !== '4'">
        运费：
        <span class='shopNum'>￥{{allPostFee}}</span>
      </div>
      <div class='shopOther'>
        在线留言：
        <textarea placeholder='请输入留言信息' maxlength="100" v-model="msg"></textarea>
      </div>
    </div>

    <div class="cart-total">
      <button @click="orderBtn">提交订单</button>
      <div class="total">
        合计：￥{{ endPrice }}
      </div>
    </div>
    <!-- 产品参数 -->
    <div class="goods_mask" v-if='couponShow' @click='closeCash'></div>
    <div class="goods_info goods_info_params" v-if='couponShow'>
      <div class="goods_top">选择优惠券</div>
      <div class="goods_close" @click='closeCash'>
        <img src='../../assets/img/activity/xqguanbi.png' alt="关闭">
      </div>
      <div class="couponList">
        <template v-if="couponts.length > 0">
          <template v-for="(item, index) in couponts">
            <div class="list-item" :key="item.id" @click="selectCoupon(index)">
              <div class="sawtooth">
                ￥{{item.money}}
              </div>
              <div class="list-item-text">
                <span>满￥100可用</span>
                <span>有效至：{{item.limit_endAt}}</span>
              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <div class="noneData">暂无该类型优惠券</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConOrder',
  data () {
    return {
      address: {},
      goodInfo: null,
      type: undefined,
      totalMoney: 0.00,
      shopAll: 0.00,
      endPrice: 0.00,
      allPrice: '',
      couponShow: false,
      couponts: [],
      allNum: 0,
      allPostFee: 0,
      buyNum: 1,
      msg: '',
      productId: '',
      couponId: '',
      flagIndex: -1,
      orderInfo: [],
      doubClick: true
    }
  },
  methods: {
    getDefaultAdr () {
      // 获取默认地址
      let _this = this
      _this.$dataPost('/api/member/address/getDefault', {
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
        _this.address = res.data
        localStorage.setItem('address', res.data)
      })
    },
    toAddressList () {
      // 跳转到收货地址
      this.$router.push('address')
    },
    getCartInfo () {
      // 从购物车进入获取商品信息
      let _this = this
      let showNum = localStorage.getItem('cartOrder')
      _this.$dataPost('/api/memberCart/enter', {
        userId: window.localStorage.getItem('userId'),
        cartList: JSON.parse(showNum)
      }, (res) => {
        _this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        let allPrice = res.allPrice + res.allPostFee
        _this.allPostFee = res.allPostFee
        _this.allPrice = res.allPrice
        _this.allNum = res.allNum
        _this.orderInfo = res.data
        _this.shopAll = allPrice
        _this.endPrice = allPrice
        _this.bb = 2
      })
    },
    xuanCoupon () {
      // 优惠券
      let _this = this
      _this.$dataPost('/api/memberCoupon/getMyCanCouponList', {
        userId: window.localStorage.getItem('userId'),
        payment: _this.allPrice,
        pageNumber: 1,
        pageSize: 10
      }, (res) => {
        _this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        let list = res.data.list
        if (list.length > 0) {
          _this.couponShow = true
          _this.couponts = list
        } else {
          _this.$toast({
            message: '暂无可用优惠劵'
          })
        }
      })
    },
    selectCoupon (selectIndex) {
      this.flagIndex = selectIndex
      this.couponShow = false
      this.confirmBtn()
    },
    confirmBtn () {
      let _this = this
      let delMoney = _this.couponts[_this.flagIndex]
      let totalMoney = delMoney.money
      let endPrice = _this.shopAll - totalMoney
      // 渲染数据
      _this.coupon = delMoney.coupon_name
      _this.couponMoney = delMoney.coupon_money
      _this.totalMoney = totalMoney
      _this.couponId = delMoney.id
      _this.endPrice = endPrice
      _this.bb = '1'
    },
    closeCash () {
      // 关闭遮罩层
      this.couponShow = false
    },
    orderBtn () {
      // 提交订单
      let _this = this
      if (!_this.doubClick) {
        return false
      }
      _this.doubClick = false
      let showNum = JSON.parse(localStorage.getItem('cartOrder'))
      let tjmsg = _this.msg
      let postFee = _this.allPostFee
      let couponId = _this.couponId
      let addressId
      if (!_this.address || !_this.address.id) {
        _this.$toast({
          message: '请选择收货地址'
        })
        return false
      } else {
        addressId = _this.address.id
      }

      if (_this.type || _this.type === '0') {
        // 从商品详情进入
        if (_this.type === 3 || _this.type === '3') {
          // 砍价商品
          // _this.createBargain(tjmsg, postFee, addressId, couponId)
        } else if (_this.type === 4 || _this.type === '4') {
          // 积分商品
          // _this.createInteg(tjmsg, addressId)
        } else {
          // 普通、9.9、秒杀商品、新人专享
          _this.createOtherPro(tjmsg, postFee, addressId, couponId)
        }
      } else {
        // 从购物车进入
        _this.createOrderCart(showNum, tjmsg, postFee, addressId, couponId)
      }
    },
    createOtherPro (tjmsg, postFee, addressId, couponId) {
      // 普通、9.9、秒杀商品、新人专享，提交订单
      let _this = this
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      let params = {
        userId: window.localStorage.getItem('userId'),
        buyerMsg: tjmsg,
        postFee: postFee,
        addressId: addressId,
        type: _this.type,
        id: _this.goodId,
        productId: _this.productId,
        total: _this.buyNum,
        couponId: couponId,
        platform: 2
      }
      _this.$dataPost('/api/order/addGoodsOrder', params, (res) => {
        _this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.$toast({
          message: '生成订单成功'
        })
        setTimeout(function () {
          _this.$router.replace({path: 'order', query: {type: 1}})
        }, 1500)
      })
    },
    createOrderCart (showNum, tjmsg, postFee, addressId, couponId) {
      // 购物车商品确认订单
      let _this = this
      _this.$dataPost('/api/order/addCartOrder', {
        userId: window.localStorage.getItem('userId'),
        cartList: showNum,
        buyerMsg: tjmsg,
        postFee: postFee,
        addressId: addressId,
        couponId: couponId,
        platform: 2
      }, (res) => {
        _this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.$toast({
          message: '生成订单成功'
        })
        setTimeout(function () {
          _this.$router.replace({path: 'order', query: {type: 1}})
        }, 1500)
      })
    }
  },
  created () {
    let _this = this
    var address = localStorage.getItem('address')
    var productInfo = JSON.parse(localStorage.getItem('productInfo'))
    var query = this.$route.query
    // 地址信息
    if (address !== 'undefined') {
      _this.address = JSON.parse(address)
    } else {
      _this.getDefaultAdr()
    }
    // 0: 普通商品， 1：秒杀商品, 2:9.9专区商品，3：砍价商品 4-积分商品 5-新人专享
    if (query.type || _this.type === '0') {
      // 从商品详情进入
      var allPrice = productInfo.price * query.buyNum
      if (query.type !== 4) {
        _this.allPostFee = productInfo.postFee
        _this.shopAll = allPrice + productInfo.postFee
        _this.endPrice = allPrice + productInfo.postFee
      } else {
        _this.shopAll = allPrice + productInfo.postFee
        _this.endPrice = allPrice + productInfo.postFee
      }
      _this.type = query.type
      _this.goodId = query.goodId
      _this.goodName = query.goodName
      _this.productId = productInfo.id
      _this.buyNum = query.buyNum
      _this.goodInfo = productInfo
      _this.allPrice = allPrice
      _this.bb = 2
    } else {
      // 购物车确认订单
      _this.getCartInfo()
    }
  }
}
</script>

<style scoped>
.wrapper {
  padding-bottom: 1.6rem;
}

.address {
  width: 94%;
  margin: 0 auto;
  color: #313131;
}

.perSon {
  display: flex;
  justify-content: space-between;
  font-size: .4rem;
  margin: .25rem auto;
}

.address {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: .4rem .25rem .2rem;
  height: 1.2rem;
}

.address .left {
  width: .5rem;
  flex-shrink: 0;
}

.address .address_msg {
  flex-grow: 1;
  margin: 0 0 0 .25rem;
}

.address .address_msg .top {
  overflow: hidden;
  display: flex;
}

.address .address_msg .msg, .address .address_msg .top span {
  color: #333;
  font-size: .4rem;
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
  font-size: .36rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: .1rem;
}

.address .iconfont {
  font-size: .4rem;
  color: #333;
  flex-shrink: 0;
}

/* 添加地址 */
.addSite {
  text-align: center;
  align-items: center;
  padding-top: .3rem;
  height: 1.5rem;
}

.addSite i {
  font-size: 1rem;
  vertical-align: middle;
}

.addSite span {
  font-size: .36rem;
  display: inline-block;
  line-height: 2em;
  margin-left: .2rem;
}

.line {
  width: 100%;
  height: 5rpx;
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

.content div.pic {
  margin-right: .3rem;
  width: 2.7rem;
  height: 2.7rem;
  flex-shrink: 0;
}

.content div.pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  flex-shrink: 0;
}

.content > .main {
  flex-grow: 1;
  overflow: hidden;
  position: relative;
}

.content span {
  display: inline-block;
  font-size: .38rem;
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
  font-size: .4rem;
  color: #e31537;
}

.stock1 {
  font-size: .5rem;
  color: #e31537;
  font-weight: bold;
}

.goShop {
  position: absolute;
  right: 0;
  top: 0;
  color: #434343;
  font-size: .3rem;
  border-radius: .15rem;
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
  border-bottom: .02rem solid #f5f5f5;
  padding-right: .25rem;
}

.shopPrice {
  font-size: .44rem;
}

.shopLine {
  background: #f5f5f5;
  padding-top: .2rem;
}

.shopOther {
  font-size: .36rem;
  color: #333;
  height: 1.1rem;
  line-height: 1.1rem;
  border-bottom: .02rem solid #f5f5f5;
  padding: 0 .25rem;
  background: #fff;
}

.shopOther:last-child {
  border-bottom: 0;
}

.shopOther i {
  font-size: .34rem;
  color: #999;
  float: right;
}

.shopOther span {
  float: right;
}

.shopOther textarea {
  border: 0;
  width: 7rem;
  float: right;
  font-size: .34rem;
  line-height: 1.5em;
  height: 7em;
  resize: none;
  padding: .25rem .15rem;
}

/* 购物车信息 */
.cart-total {
  height: 1.4rem;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #fff;
  width: 100%;
  border-top: .02rem solid #eee;
  box-sizing: border-box;
  overflow: hidden;
}

.cart-total .all {
  float: left;
  width: 2rem;
  padding-left: .4rem;
}

.cart-total .all .round {
  margin: .4rem 0;
}

.cart-total .all span {
  align-content: center;
  position: absolute;
  top: 0;
  left: 1.2rem;
  font-size: .36rem;
  color: #000;
  line-height: 1.4rem;
}

.cart-total .total {
  float: right;
  font-size: .4rem;
  color: #e31537;
  line-height: 1.4rem;
  padding-right: .35rem;
}

.cart-total button {
  background: #e31537;
  font-size: .4rem;
  color: #fff;
  line-height: 1.4rem;
  float: right;
  width: 3rem;
  border-radius: 0;
  border: 0;
}

.cart-total button:active {
  border: 0;
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
  font-size: .44rem;
  font-weight: bold;
  text-align: center;
  line-height: 1.3rem;
  height: 1.3rem;
  background: #f9f9f9;
  border-bottom: .02rem solid #f5f5f5;
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

/* 优惠券列表 */
.couponList {
  min-height: 8rem;
  max-height: 12rem;
  overflow-y: scroll;
}

.list-item {
  border: .02rem solid rgb(252, 45, 45);
  margin: .2rem .3rem;
  background: transparent;
  height: 2.5rem;
  display: flex;
}

.sawtooth {
  position: relative;
  overflow: hidden;
  width: 28%;
  height: 100%;
  background: rgb(252, 45, 45);
  font-size: .66rem;
  color: #fff;
  text-align: center;
  line-height: 2.5rem;
}

.sawtooth:after {
  content: ' ';
  width: 0;
  height: 100%;
  position: absolute;
  top: 6px;
  border-left: 6px dotted #f9f9f9;
  right: -3px;
}

.list-item .list-item-text {
  flex: 1;
  padding: .5rem 0 .5rem .6rem;
}

.list-item .list-item-text span {
  font-size: .5rem;
  color: rgb(252, 45, 45);
  display: block;
}

.list-item .list-item-text span:last-child {
  font-size: .32rem;
  color: #999;
  margin-top: .36rem;
}
</style>
