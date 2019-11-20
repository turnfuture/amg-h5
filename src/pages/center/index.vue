<template>
  <div class="wrapper" v-show="showPage">
    <!-- 用户信息 -->
    <div class="top">
      <div class="top-bg"></div>
      <div class="top-info">
        <div class="top-user">
          <img :src="perInfo.avator" alt="头像">
          <span>{{perInfo.name}}</span>
          <span>{{perInfo.level==0?'游客':perInfo.level==1?'客官':perInfo.level==2?'掌柜':'股东'}}</span>
        </div>
        <div class="setUp">
          <router-link to="/setUp">
            <img src="../../assets/img/center/setUp.png" alt="设置">
            <span>设置</span>
          </router-link>
        </div>
        <div class="user-info">
          <div class="user-info-item">
            <router-link to="/today">
              <div>{{perInfo.todayPrice}}</div>
              <div>今日收益<i class="iconfont icon-youjiantou"></i></div>
            </router-link>
          </div>
          <div class="user-info-item">
            <router-link to="/wallet">
              <div>{{perInfo.allPrice}}</div>
              <div>账户余额<i class="iconfont icon-youjiantou"></i></div>
            </router-link>
          </div>
          <div class="user-info-item">
            <router-link to="/coupon">
              <div>{{perInfo.couponNum}}</div>
              <div>优惠券<i class="iconfont icon-youjiantou"></i></div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的订单 start -->
    <div class="order">
      <div class="title">我的订单</div>
      <div class="order-list">
        <div class="order-list-item">
          <router-link :to="{ path: '/order', query: {type: 1}}">
            <img src="../../assets/img/center/fukuan.png" alt="图标">
            <span>待付款</span>
            <i v-if="perInfo.payNum > 0">{{perInfo.payNum>99?'99+':perInfo.payNum}}</i>
          </router-link>
        </div>
        <div class="order-list-item">
          <router-link :to="{ path: '/order', query: {type: 2}}">
            <img src="../../assets/img/center/fahuo.png" alt="图标">
            <span>待发货</span>
            <i v-if="perInfo.faNum > 0">{{perInfo.faNum>99?'99+':perInfo.faNum}}</i>
          </router-link>
        </div>
        <div class="order-list-item">
          <router-link :to="{ path: '/order', query: {type: 3}}">
            <img src="../../assets/img/center/shouhuo.png" alt="图标">
            <span>待收货</span>
            <i v-if="perInfo.shouNum > 0">{{perInfo.shouNum>99?'99+':perInfo.shouNum}}</i>
          </router-link>
        </div>
        <div class="order-list-item">
          <router-link to="/orderRefund">
            <img src="../../assets/img/center/shouhou.png" alt="图标">
            <span>退款/售后</span>
          </router-link>
        </div>
      </div>
    </div>
    <!-- 我的订单 end -->

    <!-- 我的粉丝 start -->
    <div class="my-user" v-if="perInfo.level == 3">
      <div class="title">我的团队</div>
      <router-link to="myTeam">
        <div class="my-user-data">
          <div class="num">{{perInfo.allNum}}</div>
          <div class="add">
            <span>{{perInfo.todayNum}}</span>
            <span>今日新增</span>
          </div>
          <div class="add">
            <span>{{perInfo.yesterdayNum}}</span>
            <span>昨日新增</span>
          </div>
        </div>
      </router-link>
    </div>
    <div class="my-user" v-else>
      <div class="title">我的粉丝</div>
      <router-link to="myFans">
        <div class="my-user-data">
          <div class="num">{{perInfo.allNum}}</div>
          <div class="add">
            <span>{{perInfo.todayNum}}</span>
            <span>今日新增</span>
          </div>
          <div class="add">
            <span>{{perInfo.yesterdayNum}}</span>
            <span>昨日新增</span>
          </div>
        </div>
      </router-link>
    </div>
    <!-- 我的粉丝 end -->

    <!-- 其他 start -->
    <div class="my-list">
      <div class="my-list-item">
        <router-link to="collEction">
          <img src="../../assets/img/index/xinghone.png" alt="icon图标">
          我的收藏
          <i class="iconfont icon-youjiantou"></i>
        </router-link>
      </div>
      <div class="my-list-item">
        <router-link to="mineMsg">
          <img src="../../assets/img/index/xiaoxi.png" alt="icon图标">
          消息
          <i class="iconfont icon-youjiantou"></i>
        </router-link>
      </div>
      <div class="my-list-item">
        <router-link to="address">
          <img src="../../assets/img/index/dizhi.png" alt="icon图标">
          地址管理
          <i class="iconfont icon-youjiantou"></i>
        </router-link>
      </div>
      <div class="my-list-item">
        <router-link to="mineManage">
          <img src="../../assets/img/index/mine_manager.png" alt="icon图标">
          掌柜权益
          <i class="iconfont icon-youjiantou"></i>
        </router-link>
      </div>
    </div>
    <!-- 其他 end -->
    <Nav :innerActive="innerActive"></Nav>
  </div>
</template>

<script>
import Nav from '../../components/nav.vue'
export default {
  name: 'Center',
  data () {
    return {
      showPage: false,
      innerActive: 3,
      perInfo: {}
    }
  },
  methods: {
    init () {
      let _this = this
      _this.$dataPost('/api/member/getMemberCenter', {
        userId: window.localStorage.getItem('userId')
      }, (res) => {
        _this.$indicator.close()
        _this.showPage = true
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: '没有数据'
          })
          return false
        }
        _this.perInfo = res.map
      })
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
  },
  components: {
    Nav
  }
}
</script>

<style scoped>
.wrapper {
  padding-bottom: 1.65rem;
  background: #f9f9f9;
}
/* 用户信息 */
.top-bg {
  background: #970407;
  height: 4.4rem;
}

.top-info {
  margin: 0 3%;
  box-shadow: 0px 5px 7px 0px rgba(153,153,153,0.3);
  border-radius: .02rem;
  background: #fff;
  position: absolute;
  top: 1.7rem;
  left: 0;
  width: 94%;
}

.top-user {
  text-align: center;
  margin-top: -1rem;
}

.top-user img {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.top-user span {
  font-size: .4rem;
  margin-top: .1rem;
  display: block;
  font-weight: 500;
}

.top-user span:last-child {
  font-size: .32rem;
  color: #7D7D7D;
}

.setUp {
  position: absolute;
  top: .3rem;
  right: .6rem;
  text-align: center;
}

.setUp img {
  width: .45rem;
  height: .45rem;
  margin-bottom: .1rem;
}

.setUp span {
  display: block;
  font-size: .3rem;
  color: #626262;
}

.user-info {
  margin-top: .6rem;
  overflow: hidden;
  padding-bottom: .3rem;
}

.user-info .user-info-item {
  float: left;
  width: 33.3%;
}

.user-info .user-info-item div {
  display: block;
  font-size: .6rem;
  color: #010101;
  padding-left: .9rem;
}

.user-info .user-info-item div:last-child {
  font-size: .3rem;
  color: #7D7D7D;
  margin-bottom: .2rem;
}

.user-info .user-info-item div:last-child i {
  font-size: .3rem;
  color: #999;
  margin-left: .1rem;
}

/* 我的订单 */
.order {
  padding: 2.3rem .4rem 0;
  background: #fff;
  border-bottom: .02rem solid #eee;
}

.title {
  font-size: .44rem;
  color: #000;
}

.order .order-list {
  overflow: hidden;
  margin: .1rem 0 .25rem;
}

.order .order-list .order-list-item {
  float: left;
  width: 25%;
  text-align: center;
  position: relative;
}

.order .order-list img {
  width: .6rem;
  height: .6rem;
  margin-top: .4rem;
}

.order .order-list span {
  font-size: .3rem;
  color: #000;
  margin: .2rem 0;
  display: block;
}

.order .order-list .order-list-item i {
  position: absolute;
  top: .2rem;
  right: .2rem;
  font-size: .26rem;
  color: #fff;
  background: #d50000;
  line-height: .5rem;
  padding: 0 .15rem;
  border-radius: .25rem;
}

/* 我的粉丝 */
.my-user {
  background: #fff;
  border-top: .02rem solid #eee;
  border-bottom: .02rem solid #eee;
  padding: 0 .5rem;
  margin: .2rem 0;
}

.my-user .title {
  margin: .45rem 0 .25rem;
}

.my-user-data {
  display: flex;
  padding-bottom: .4rem;
}

.my-user-data .num {
  flex: 1;
  font-size: .54rem;
  color: #000;
  padding-top: .25rem;
}

.my-user-data .add {
  width: 2.5rem;
}

.my-user-data .add span {
  font-size: .42rem;
  color: #000;
  display: block;
  text-align: center;
  margin-bottom: .15rem;
}

.my-user-data .add span:last-child {
  font-size: .3rem;
  color: #7D7D7D;
  margin-bottom: 0;
}

.my-user-data .add:last-child {
  border-left: .02rem solid #D2D2D2;
}

/* 其他功能 */
.my-list {
  border-top: .02rem solid #eee;
  margin: .25rem 0;
}

.my-list-item a {
  display: flex;
  background: #fff;
  padding: 0 .5rem;
  border-bottom: .02rem solid #eee;
  font-size: .36rem;
  line-height: 1.5rem;
}

.my-list-item:active a {
  background: #eee;
}

.my-list-item img {
  width: .5rem;
  height: .5rem;
  margin: .48rem .2rem .5rem 0;
}

.my-list-item i {
  margin-left: auto;
  font-size: .3rem;
  color: #999;
}
</style>
