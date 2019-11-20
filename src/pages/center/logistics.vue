<template>
  <div class="wrapper">
    <div class='address'>
      <img class="left" src='../../assets/img/center/address.png' alt="地址图标">
      <div class="address_msg">
        <div class="top">
          <span class="name">收货人：{{orderShippingDO.receiverName}}</span>
          <span class="phone">{{orderShippingDO.receiverPhone}}</span>
        </div>
        <div class="msg">{{orderShippingDO.receiverProvince}}{{orderShippingDO.receiverCity}}{{orderShippingDO.receiverCounty}}{{orderShippingDO.receiverAddress}}</div>
      </div>
    </div>
    <img src='../../assets/img/center/line.png' class='line' alt="线">

    <!-- 物流信息 -->
    <div class="wlInfo" v-if="messageDO">
      <div class="logistic_title">{{messageDO.name}}快递：{{messageDO.expressId}}</div>
      <div class="title">物流信息</div>
      <template v-if='expressDetailsList.length>0'>
        <div v-for="(item, index) in expressDetailsList" :key="item.id">
          <div class="logistic_div" :class="index==0?'cur':''">
            <img src="../../assets/img/center/selected.png" alt="选中">
            <div>
              <div>
                {{item.message}}
              </div>
              <span>{{item.timeDate}}{{item.timeClock}}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="noneData">
          暂无物流信息
        </div>
      </template>
    </div>
    <div class="noneData" v-else>
      暂无物流信息
    </div>
  </div>
</template>

<script>
export default {
  name: 'Logistics',
  data () {
    return {
      orderShippingDO: {},
      messageDO: {},
      expressDetailsList: []
    }
  },
  methods: {
    init () {
      let _this = this
      _this.$dataPost('/api/shopExpress/express/message', {
        userId: window.localStorage.getItem('userId'),
        orderId: _this.$route.query.id ? _this.$route.query.id : 0
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.orderShippingDO = res.data.orderShippingDO
        _this.messageDO = res.data.messageDO
        if (res.data.messageDO) {
          _this.expressDetailsList = res.data.messageDO.expressDetailsList
        }
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
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

/* 物流信息 */
.wlInfo{
  width: 100%;
  margin: 0 auto;
  background: white;
  font-size: .3rem;
  padding-top: .25rem;
}

.logistic_title{
  padding: .2rem;
  color: #333;
  font-size: .3rem;
  border-top: .2rem solid #f5f5f5;
  border-bottom: .2rem solid #f5f5f5;
}

.wlInfo .title{
  font-size: .36rem;
  color: #000;
  padding: .2rem;
  margin-top: .2rem;
}

.wlInfo .logistic_div{
  display: flex;
  font-size: .3rem;
  padding: .2rem;
}

.wlInfo img{
  width: .6rem;
  height: .6rem;
  margin-right: .25rem;
}

.wlInfo .logistic_div span{
  display: inline-block;
  margin-top: .15rem;
  color: #989898;
}

</style>
