<template>
  <div class="wrapper">
    <div class="my-list">
      <input type="text" v-focus="true" placeholder="请输入物流名称" v-model="alipay" maxlength="30">
      <input type="text" placeholder="请输入物流单号" v-model="number">
      <div class="alipay">
        <textarea type="text" placeholder="请输入退货原因（最多100字）" v-model="context" maxlength="100"></textarea>
      </div>
      <button @click="returnGoods">退货</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RetuGoods',
  data () {
    return {
      alipay: '',
      number: '',
      context: ''
    }
  },
  methods: {
    returnGoods () {
      let _this = this
      if (_this.alipay === '' || !_this.alipay) {
        _this.$messagebox({
          title: '提示',
          message: '请输入物流名称'
        })
        return
      }
      if (!_this.number) {
        _this.$messagebox({
          title: '提示',
          message: '请输入物流单号'
        })
        return
      }
      if (!_this.context) {
        _this.$messagebox({
          title: '提示',
          message: '请输入退货原因'
        })
        return
      }
      _this.$dataPost('/api/order/backGood', {
        userId: window.localStorage.getItem('userId'),
        expressName: _this.alipay,
        expressCode: _this.number,
        reason: _this.context,
        id: _this.$route.query.id ? _this.$route.query.id : 0
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.$toast({
          message: '提交退货订单成功'
        })
        setTimeout(function () {
          _this.$router.go(-1)
        }, 1500)
      })
    }
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
  padding: .4rem 0;
  position: relative;
}

.alipay textarea {
  width: 86% !important;
  height: 3rem !important;
  resize: none;
  background: #f4f4f4;
  padding: .25rem 2%;
  font-size: .36rem;
  box-sizing: content-box;
  border: 0;
  margin: 0 5%;
  line-height: 1.5em;
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
