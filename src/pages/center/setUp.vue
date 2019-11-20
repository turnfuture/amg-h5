<template>
  <div class="wrapper">
    <div class="pic">
      <img :src="perInfo.avator" alt="头像">
    </div>
    <div class="my-list">
      <div class="my-list-item">
        昵称
        <span>{{ perInfo.name }}</span>
      </div>
      <div class="my-list-item">
        身份
        <span>{{perInfo.level==0?'游客':perInfo.level==1?'客官':perInfo.level==2?'掌柜':'股东'}}</span>
      </div>
      <div class="my-list-item">
        我的推荐人
        <span>{{perInfo.fatherName?perInfo.fatherName:'无'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SetUp',
  data () {
    return {
      perInfo: {
        avator: '',
        name: '暂未获取',
        level: 0,
        fatherName: 0
      }
    }
  },
  methods: {
    init () {
      let _this = this
      _this.$dataPost('/api/member/getMemberCenter', {
        userId: window.localStorage.getItem('userId')
      }, (res) => {
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
  }
}
</script>

<style scoped>
.pic {
  padding: .3rem .3rem 0;
  background: #fff;
  text-align: center;
}

.pic img {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.my-list-item {
  display: flex;
  background: #fff;
  padding: 0 .3rem;
  border-bottom: .02rem solid #f5f5f5;
  font-size: .32rem;
  line-height: 1.4rem;
}

.my-list-item span {
  margin-left: auto;
  font-size: .4rem;
  color: #999;
}
</style>
