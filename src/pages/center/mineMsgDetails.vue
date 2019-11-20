<template>
  <div class="wrapper">
    <template v-if="msg">
      <div class="title">{{msg.title}}</div>
      <div class="time">{{msg.createAt}}</div>
      <div class="content" v-html="msg.content"></div>
    </template>
    <template v-else>
      <div class="noneData">没有数据</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MineMsgDetails',
  data () {
    return {
      msg: {}
    }
  },
  methods: {
    attrIncomeList () {
      // 获取列表
      let _this = this
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      _this.$dataPost('/api/cms/noticeSys/info', {
        noticeSysId: _this.$route.query.id ? _this.$route.query.id : 0
      }, (res) => {
        _this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.msg = res.data
      })
    }
  },
  created () {
    this.attrIncomeList()
  }
}
</script>

<style scoped>
.wrapper{
  padding: .4rem;
}
.title{
  text-align: center;
  font-weight: bold;
  font-size: .48rem;
  color: #333;
}
.time{
  text-align: right;
  font-size: .36rem;
  color: #585858;
  margin: .3rem 0;
}
.content{
  font-size: .32rem;
}
.wrapper img{
  max-width: 100%!important;
}
</style>
