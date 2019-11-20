<template>
  <div class="wrapper">
    <template v-if="incomeList.length > 0">
      <div class="list">
        <template v-for="(item, index) in incomeList">
          <div class="item" :key="item.id" @click="selctAdress(index)">
            <div class="userMsg">
              <span>{{item.fullName}}</span>
              <span>{{item.phone}}</span>
            </div>
            <div class="addressMsg">{{item.province}}{{item.city}}{{item.county}}{{item.address}}</div>

            <div class="siteSet">
              <div @click.stop="getDefault(item.id, index)" class="siteLeft">
                <template v-if="item.defaultValue == 0">
                  <div class="rouActive">
                    <div class="round active">
                      <i class="iconfont icon-duigou"></i>
                    </div>
                  </div>
                  <span class='default'>默认地址</span>
                </template>
                <template v-else>
                  <div class="rouActive">
                    <div class="round"></div>
                  </div>
                  <span class='default1'>设置为默认地址</span>
                </template>
              </div>
              <div class="siteRight">
                <div @click.stop="editAddress(item.id)" class="siteEdit">
                  <i class="iconfont icon-bianji"></i>
                  <span>编辑</span>
                </div>
                <div @click.stop="delAddress(item.id)" class="siteDel">
                  <i class="iconfont icon-shanchu"></i>
                  <span>删除</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="noneData">暂无收货地址</div>
    </template>
    <div class="team_bottom">
      <router-link :to="{path: 'lookAddress', query: {addressId: 0}}">
        新增收货地址
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Address',
  data () {
    return {
      incomeList: [],
      beforeRoute: ''
    }
  },
  methods: {
    init () {
      let _this = this
      if (this.page === 1) {
        _this.incomeList = []
      }
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      _this.$dataPost('/api/member/address/list', {
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
        _this.incomeList = res.data
      })
    },
    getDefault (addressId, index) {
      // 设置默认地址
      let _this = this
      if (_this.incomeList[index].defaultValue === 0) {
        return
      }
      _this.$dataPost('/api/member/address/default', {
        userId: window.localStorage.getItem('userId'),
        addressId: addressId
      }, (res) => {
        _this.$toast({
          message: res.msg
        })
        for (var i = 0; i < _this.incomeList.length; i++) {
          _this.incomeList[i].defaultValue = 1
        }
        if (_this.incomeList[index].defaultValue === 0) {
          _this.incomeList[index].defaultValue = 1
        } else {
          _this.incomeList[index].defaultValue = 0
        }
      })
    },
    editAddress (addressId) {
      // 编辑地址
      this.$router.push({path: 'lookAddress', query: {addressId: addressId}})
    },
    delAddress (addressId) {
      // 删除地址
      let _this = this
      _this.$messagebox.confirm('是否删除该收货地址？').then(action => {
        _this.$dataPost('/api/member/address/remove', {
          userId: window.localStorage.getItem('userId'),
          addressId: addressId
        }, (res) => {
          _this.init()
        })
      }).catch(action => {})
    },
    selctAdress (index) {
      // 判断是否从订单页面进来
      if (this.beforeRoute === '/conOrder') {
        let address = this.incomeList[index]
        localStorage.setItem('address', JSON.stringify(address))
        this.$router.go(-1)
      }
    }
  },
  created () {
    this.init()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      //  这里的vm指的就是vue实例，可以用来当做this使用
      console.log(to)
      vm.beforeRoute = from.path
    })
  }
}
</script>

<style scoped>
.wrapper {
  padding-bottom: 2rem;
}

.list {
  background: #f5f5f5;
  padding-bottom: .25rem;
}

/* 列表 */
.item {
  padding: .25rem .3rem .05rem;
  background: #fff;
  border-bottom: .02rem solid #eee;
  margin-bottom: .25rem;
}

.item:last-child {
  margin-bottom: 0;
}

.userMsg{
  font-size: .36rem;
  height: 2em;
  line-height: 2em;
  display: flex;
  justify-content: space-between;
}

.addressMsg{
  font-size: .32rem;
  line-height: 2em;
  color: #666;
}

.siteSet{
  border-top: .02rem solid #eee;
  height: 1.3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.addressList .siteSet .siteLeft{
  display: flex;
  align-items: center;
  font-size: .32rem;
}
.siteSet .siteLeft .default{
  color: #970407;
  float: right;
  margin-left: .15rem;
  line-height: 1.32rem;
}
.siteSet .siteLeft .default1{
  color: #666;
  float: right;
  margin-left: .15rem;
  line-height: 1.32rem
}
.siteSet .siteLeft i{
  margin-right: .1rem;
}
.siteSet .siteRight{
  display: flex;
  align-items: center;
  width: 3rem;
}
.siteSet .siteRight .siteEdit{
  margin-right: .3rem;
  font-size: .3rem;
  color: #666;
  overflow: hidden;
}
.siteRight .siteEdit span{
  line-height: 1.3rem;
  float: left;
}
.siteSet .siteRight .siteDel{
  font-size: .3rem;
  color: #666;
}
.siteRight .siteDel span{
  line-height: 1.3rem;
  display: inline-block;
}
.siteSet .siteRight .iconfont{
  font-size: .5rem;
  line-height: 1.3rem;
  margin-right: .1rem;
  color: #999;
  float: left;
}
.rouActive {
  width: .54rem;
  display: inline-block;
}
.round {
  width: .54rem;
  height: .54rem;
  display: inline-block;
  border: .02rem solid #ccc;
  border-radius: .27rem;
  margin: .38rem 0;
  box-sizing: border-box;
}

.round.active {
  background: #E31537;
  text-align: center;
  border: 0;
}

.round.active i {
  color: #fff;
  position: relative;
  left: .05rem;
}

.team_bottom {
  line-height: 1.5rem;
  background: #970407;
  color: #fff;
  font-size: .4rem;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.team_bottom a {
  color: #fff;
}
</style>
