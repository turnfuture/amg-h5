<template>
  <div class="wrapper">
    <div class="my-list">
      <div class="my-list-item">
        账户余额：{{kPrice}}
      </div>
      <input type="text" v-focus="true" placeholder="请输入您的支付宝账号" v-model="alipay" maxlength="30">
      <input type="number" placeholder="请输入提现金额" v-model="number">
      <div class="alipay">
        <img class="selected" src="../../assets/img/center/selected.png" alt="选中图标">
        <img src="../../assets/img/center/alipay.png" alt="支付宝">
      </div>
      <button @click="tixian">提现</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoPresen',
  data () {
    return {
      kPrice: 0,
      alipay: '',
      number: ''
    }
  },
  methods: {
    init () {
      // 初始化获取收益数据
      let _this = this
      _this.$dataPost('/api/orderCom/getMemberCom', {
        userId: window.localStorage.getItem('userId')
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.kPrice = res.data.kPrice
      })
    },
    tixian () {
      let _this = this
      if (_this.alipay === '' || !_this.alipay) {
        _this.$messagebox({
          title: '提示',
          message: '请输入支付宝账号'
        })
        return
      }
      if (_this.number === '' || _this.number <= 0) {
        _this.$messagebox({
          title: '提示',
          message: '请输入提现金额'
        })
        return
      }
      if (parseFloat(_this.kPrice) < parseFloat(_this.number)) {
        _this.$messagebox({
          title: '提示',
          message: '余额不足，请重新输入'
        })
        return
      }
      _this.$dataPost('/api/extract/goExtract', {
        userId: window.localStorage.getItem('userId'),
        money: _this.number,
        type: '支付宝',
        code: _this.alipay
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.$router.go(-1)
      })
    }
  },
  created () {
    this.init()
  },
  directives: {
    focus: {
      inserted: function (el, {value}) {
        if (value) {
          el.focus()
        }
      }
    }
  }
}
</script>

<style scoped>
.my-list {
  margin: 0;
  position: fixed;
}

.my-list-item {
  background: #fff;
  padding: 0 .5rem;
  border-bottom: .02rem solid #eee;
  font-size: .4rem;
  line-height: 1.5rem;
}

.my-list input {
  padding: 0 .5rem;
  width: 100%;
  height: 1.5rem;
  border-bottom: .02rem solid #eee;
  font-size: .4rem;
  line-height: 1.5rem;
}

.alipay {
  padding: .4rem .5rem;
  position: relative;
}

.alipay img {
  width: 2.5rem;
  margin-left: .6rem;
}

.alipay img.selected {
  width: .6rem;
  position: absolute;
  top: 1rem;
  left: .5rem;
  margin: 0;
}

.my-list button {
  background: #E64340;
  font-size: .4rem;
  color: #fff;
  line-height: 1.2rem;
  border: 0;
  width: 90%;
  margin: 1rem 5%;
  border-radius: .1rem;
}

</style>
