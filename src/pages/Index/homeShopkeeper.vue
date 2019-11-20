<template>
  <div class="wrapper">
    <img class="bg" src="../../assets/img/index/bg_shop.png" alt="背景图片">
    <div class="bottom_div">
      <div class="bottom">
        <div class="title">
          <span>邀请好友</span>
        </div>
        <div class="content_div">
          <div class="user_list">
            <template v-for="item in userList">
              <div class="item" :key="item.id">
                <div class="user_bg">
                  <img :src="item.avator">
                </div>
              </div>
            </template>
          </div>
          <span class="btn">距离成为掌柜还差 {{surplus}} 个粉丝</span>
          <div class="tip_div">
            <img src="../../assets/img/index/shop_tip.png" alt="成为掌柜">
            <span>成为掌柜  享受特权</span>
            <img src="../../assets/img/index/shop_tip.png" alt="享受特权">
          </div>
          <div class="sale_div">
            <div class="item">
              <img src="../../assets/img/index/shop_privilege1.png" alt="购买商品享受优惠">
              <span>购买商品享受优惠</span>
            </div>
            <div class="item">
              <img src="../../assets/img/index/shop_privilege2.png" alt="佣金可提现">
              <span>佣金可提现</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'homeShopkeeper',
  data () {
    return {
      surplus: 0,
      userList: []
    }
  },
  methods: {
    init () {
      let _this = this
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      _this.$dataPost('/api/member/upLevelZ', {
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
        let list = res.data.userList
        for (var i = 0; i < res.data.needNumber; i++) {
          list.push({})
        }
        _this.surplus = res.data.needNumber
        _this.userList = list
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.bg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.bottom_div {
  width: 100%;
  position: relative;
  z-index: 2;
}

.bottom {
  margin-top: 7rem;
}

.title {
  width: 4rem;
  text-align: center;
  margin: 0 auto;
  background: url(../../assets/img/index/title_shop.png) no-repeat left top;
  background-size: 100% 100%;
  position: relative;
  z-index: 3;
}

.title span{
  width: 100%;
  line-height: 1rem;
  text-align: center;
  font-size: .4rem;
  color: #fff;
  position: relative;
  top: -.1rem;
}

.content_div {
  background: #fff;
  padding: .3rem;
  border-radius: .2rem;
  text-align: center;
  width: 80%;
  margin: -.5rem auto 0;
}

.content_div .user_list {
  overflow: hidden;
  margin: .6rem 0;
}

.content_div .item {
  width: 20%;
  text-align: center;
  float: left;
}

.content_div .user_bg {
  width: 1.3rem;
  height: 1.3rem;
  margin-bottom: .2rem;
  background: #eaeff8;
  border: .02rem solid #4a9bf7;
  border-radius: 50%;
  position: relative;
  display: inline-block;
}

.content_div .user_bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
}

.content_div .btn {
  background: #f9ac00;
  line-height: 2em;
  text-align: center;
  color: #fff;
  font-size: .36rem;
  padding: .2rem .4rem;
  border-radius: .4rem;
}

.content_div .tip_div {
  display: inline-block;
  overflow: hidden;
  margin: .4rem 0 .2rem 0;
}

.content_div .tip_div img {
  width: .7rem;
  float: left;
}

.content_div .tip_div span {
  color: #7e889d;
  font-size: .32rem;
  margin: 0 .18rem;
  float: left;
  line-height: 2em;
}
.content_div .sale_div{
  display: flex;
  overflow: hidden;
  margin: 0 .9rem;
}
.content_div .sale_div .item{
  flex: 1;
  text-align: center;
}
.content_div .sale_div .item img{
  width: 1.2rem;
  height: 1.2rem;
}
.content_div .sale_div .item span{
  font-size: .3rem;
  color: #9BA9C5;
  display: block;
  text-align: center;
}

</style>
