<template>
  <div class="wrapper">
    <img v-if="imgs" :src="imgs" alt="掌柜权益">
  </div>
</template>

<script>
export default {
  name: 'mineManage',
  data () {
    return {
      imgs: ''
    }
  },
  methods: {
    init () {
      let _this = this
      _this.$dataPost('/api/cms/slide/list', {
        type: 13
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: '没有数据'
          })
          return false
        }
        _this.imgs = res.data[0].imgUrl
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.wrapper img {
  width: 100%;
}
</style>
