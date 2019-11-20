<template>
  <div id="app">
    <router-view  v-wechat-title="$route.meta.title" v-if="RouterState" />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      RouterState: true
    }
  },
  methods: {
    reload () {
      this.RouterState = false
      this.$nextTick(() => {
        this.RouterState = true
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.noneData {
  line-height: 8rem;
  text-align: center;
  font-size: .4rem;
  color: #666;
}
</style>
