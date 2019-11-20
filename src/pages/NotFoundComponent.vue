<template>
  <div class="wrapper">
    <h1>404</h1>
    <mt-button type="danger" @click.native="handleClick">
      首页
    </mt-button>
  </div>
</template>

<script>
export default {
  name: 'NotFoundComponent',
  data () {
    return {
      msg: '12'
    }
  },
  methods: {
    handleClick () {
      this.$router.replace('/')
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 100px;
  text-align: center;
  line-height: 1em;
  margin: 1em;
}
.mint-button {
  width: 80%;
  margin: 0 10%;
}
</style>
