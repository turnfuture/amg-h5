<template>
  <div class="noneData">
    授权中...
  </div>
</template>

<script>
export default {
  name: 'Author',
  data () {
    return {
      userId: '',
      userInfo: '',
      code: ''
    }
  },
  methods: {
    getUrlParam (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2])
      return null
    }
  },
  created () {
    this.userId = window.localStorage.getItem('userId')
    if (!this.getUrlParam('code')) {
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx34fc9aef0e102ddb&redirect_uri=https%3a%2f%2famg.aitaunkj.com%2famg%2fauthor&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect'
    } else {
      this.$dataPost('/api/member/user/getUserInfoGz', {
        code: this.getUrlParam('code'),
        InvitationCode: '',
        shopId: ''
      }, (res) => {
        if (res.code !== 0) {
          this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        this.userId = res.data.id
        this.userInfo = res.data
        // 存储userId到本地
        window.localStorage.setItem('code', this.code)
        window.localStorage.setItem('userId', this.userId)
        window.localStorage.setItem('userInfo', this.userInfo)
        // 获取beforeLoginUrl，我们的前端页面
        let url = window.localStorage.getItem('beforeLoginUrl')
        // 跳转
        this.$router.replace(url)
        // 删除本地beforeLoginUrl
        window.localStorage.removeItem('beforeLoginUrl')
      })
    }
  }
}
</script>

<style scoped>
.noneData {
  font-size: .5rem;
  line-height: 4rem;
}
</style>
