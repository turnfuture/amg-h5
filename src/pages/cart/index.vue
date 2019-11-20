<template>
  <div class="wrapper">
    <template v-if="navList.length != 0">
      <div class="cart">
        <div class="cart-top">
          <div class="all" @click="onAllSelect">
            <div class="round" v-if="!allSelected"></div>
            <div v-else>
              <div class="round active">
                <i class="iconfont icon-duigou"></i>
              </div>
            </div>
            <span>全选</span>
          </div>
          <div class="edit" @click="edit" v-if="show_edit">编辑</div>
          <div class="edit" @click="cancel" v-else>取消</div>
        </div>
        <div class="cart-list">
          <template v-for="(item, index) in navList">
            <div class="cart-item" :key="item.id"  @click="bindDetails(item.goods_id)">
              <div class="cart-round" @click.stop="select(index)">
                <div v-if="!item.selected">
                  <div class="round"></div>
                </div>
                <div v-else>
                  <div class="round active">
                    <i class="iconfont icon-duigou"></i>
                  </div>
                </div>
              </div>
              <div class="cart-pic">
                <img :src="item.imgurl" alt="商品图片">
              </div>
              <div class="cart-main">
                <div class="title">{{ item.name }}</div>
                <div class="size">
                  {{ item.spec }}
                  <span>×{{ item.num }}</span>
                </div>
                <div class="price">￥{{ item.price }}</div>
              </div>
              <div class="num">
                <span class="num-com" @click.stop="onComputed('minus', index)">-</span>
                <span>{{ item.num }}</span>
                <span class="num-com" @click.stop="onComputed('add', index)">+</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="none-cart">
        <i class="iconfont icon-gouwuche1"></i>
        <span>购物车空空荡荡</span>
      </div>
    </template>
    <Nav :innerActive="innerActive" :totalPrice="totalPrice" :show_edit="show_edit" @sub="btn_submit_order"  @deletes="deleteCart"></Nav>

    <!-- 购物车信息 -->
    <!-- <div class="cart-total">
      <div class="all" @click="onAllSelect">
        <div class="round" v-if="!allSelected"></div>
        <div v-else>
          <div class="round active">
            <i class="iconfont icon-duigou"></i>
          </div>
        </div>
        <span>全选</span>
      </div>
      <button v-if="show_edit" @click="btn_submit_order">提交订单</button>
      <button class="delete" v-else @click="deleteCart">删除</button>
      <div class="total">
        共计：{{ totalPrice }}
      </div>
    </div> -->
  </div>
</template>

<script>
import Nav from '../../components/nav.vue'
export default {
  name: 'Cart',
  data () {
    return {
      innerActive: 2,
      allSelected: false,
      navList: [],
      show_edit: true
    }
  },
  methods: {
    init () {
      let _this = this
      // 初始化购物车信息
      _this.$dataPost('/api/memberCart/getList', {
        userId: window.localStorage.getItem('userId'),
        pageNum: '1',
        pageSize: '10'
      }, (res) => {
        _this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        var data = res.data
        for (let i = 0; i < data.length; i++) {
          data[i].selected = false
        }
        _this.navList = data
        if (!data.length) {
          _this.show_edit = true
        }
      })
    },
    onAllSelect () {
      // 点击全选
      var _this = this
      if (_this.allSelected) {
        for (let i = 0; i < _this.navList.length; i++) {
          _this.navList[i].selected = false
        }
      } else {
        for (let i = 0; i < _this.navList.length; i++) {
          _this.navList[i].selected = true
        }
      }
      _this.allSelected = !_this.allSelected
    },
    select (index) {
      // 点击单选
      var _this = this
      _this.navList[index].selected = !_this.navList[index].selected
      _this.selectAll()
    },
    selectAll () {
      // 单选操作全选
      var _this = this
      var count = 0
      var navList = _this.navList
      for (var i = 0; i < navList.length; i++) {
        if (navList[i].selected) {
          count++
        }
      }
      if (count === navList.length) {
        _this.allSelected = true
      } else {
        _this.allSelected = false
      }
    },
    onComputed (type, index) {
      // 计算数量
      var _this = this
      var num = Number(_this.navList[index].num)
      if (type === 'add') {
        num += 1
      } else {
        if (Number(num) === 1) return
        num -= 1
      }
      _this.navList[index].num = num
      _this.$dataPost('/api/memberCart/editCart', {
        userId: window.localStorage.getItem('userId'),
        cartId: _this.navList[index].id,
        num: num
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
      })
    },
    bindDetails (goodsId) {
      this.$router.push({path: 'goodsDetail', query: {id: goodsId}})
    },
    edit () {
      // 编辑
      this.show_edit = false
    },
    cancel () {
      // 取消
      this.show_edit = true
    },
    deleteCart () {
      // 删除购物车商品
      var _this = this
      var navList = _this.navList
      var cartList = []
      var arr = navList.some(function (x) {
        return (x.selected === true)
      })
      for (let i = 0; i < navList.length; i++) {
        // 获取选中商品的id
        if (navList[i].selected) {
          cartList.push(navList[i].id)
        }
      }
      if (!arr) {
        _this.$toast({
          message: '您还未选择商品'
        })
        return false
      }
      _this.$messagebox.confirm('您确定要删除商品么？').then(action => {
        _this.$dataPost('/api/memberCart/cartRemove', {
          userId: window.localStorage.getItem('userId'),
          cartList: cartList
        }, (res) => {
          if (res.code !== 0) {
            _this.$messagebox({
              title: '提示',
              message: res.msg
            })
            return false
          }
          _this.$toast({
            message: '删除商品成功'
          })
          setTimeout(function () {
            _this.init()
          }, 1500)
        })
      }).catch(action => {
        console.log('cancel')
      })
    },
    btn_submit_order () {
      // 提交订单
      let _this = this
      let list = _this.navList
      let cartList = []
      for (let i = 0; i < list.length; i++) {
        // 判断选中
        if (list[i].selected) {
          cartList.push(list[i].id)
        }
      }
      if (cartList.length <= 0) {
        _this.$toast({
          message: '请选择商品'
        })
      } else {
        localStorage.setItem('cartOrder', JSON.stringify(cartList))
        _this.$router.push('conOrder')
      }
    }
  },
  computed: {
    totalPrice () {
      var _this = this
      var totalPrice = 0
      var navList = _this.navList
      for (var i = 0; i < navList.length; i++) {
        if (navList[i].selected) {
          totalPrice += parseFloat(navList[i].num) * parseFloat(navList[i].price)
        }
      }
      return totalPrice.toFixed(2)
    }
  },
  beforeCreate () {
    this.$indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
    })
  },
  created () {
    this.init()
  },
  components: {
    Nav
  }
}
</script>

<style scoped>
  .wrapper {
    padding-bottom: 1.9rem;
  }
  /* 购物车 */
  .cart {
    padding-top: .2rem;
    background: #f9f9f9;
  }

  .cart-top {
    background: #fff;
    padding: 0 .4rem;
    overflow: hidden;
    border-bottom: .02rem solid #eee;
  }

  .cart-top .all {
    width: 2rem;
    float: left;
    position: relative;
    height: 1.2rem;
  }

  .round {
    width: .54rem;
    height: .54rem;
    display: inline-block;
    border: .02rem solid #ccc;
    border-radius: .27rem;
    margin: .33rem 0;
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
    top: .05rem;
    font-size: .3rem;
  }

  .cart-top span {
    display: inline-block;
    font-size: .36rem;
    color: #000;
    line-height: 1.2rem;
    position: absolute;
    top: 0;
    left: .8rem;
  }

  .cart-top .edit {
    font-size: .36rem;
    float: right;
    color: #707070;
    line-height: 1.2rem;
    width: 2.5rem;
    text-align: right;
  }

  /* 购物车列表 */
  .cart-item {
    display: flex;
    padding: .25rem .4rem;
    background: #fff;
    border-bottom: .02rem solid #eee;
    position: relative;
  }

  .cart-round {
    padding-right: .25rem;
    height: 2.6rem;
  }

  .cart-round .round {
    margin: 1rem 0;
  }

  .cart-item .cart-pic {
    width: 2.5rem;
    height: 2.5rem;
  }

  .cart-item .cart-pic img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cart-item .cart-main {
    flex: 1;
    width: 5rem;
    padding-left: .25rem;
  }

  .cart-item .cart-main .title {
    font-size: .38rem;
    color: #1B1B1B;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: .15rem 0;
  }

  .cart-item .cart-main .size {
    font-size: .32rem;
    color: #666;
  }

  .cart-item .cart-main .size span {
    float: right;
  }

  .cart-item .cart-main .price {
    font-size: .46rem;
    color: #E31537;
    margin-top: .25rem;
  }

  .cart-item .num {
    position: absolute;
    right: .4rem;
    bottom: .3rem;
    border: .02rem solid #ADADAD;
    border-radius: .05rem;
  }

  .cart-item .num span {
    font-size: .4rem;
    width: .8rem;
    height: .9rem;
    display: block;
    text-align: center;
    line-height: .9rem;
    border-left: .02rem solid #ADADAD;
    border-right: .02rem solid #ADADAD;
    float: left;
  }

  .cart-item .num .num-com {
    border: 0;
  }

  /* 购物车空 */
  .none-cart {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #666;
    text-align: center;
  }

  .none-cart i {
    font-size: 1rem;
    color: #999;
  }

  .none-cart span {
    font-size: .4rem;
    display: block;
  }

  /* 购物车信息 */
  .cart-total {
    height: 1.4rem;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #fff;
    width: 100%;
    border-top: .02rem solid #eee;
    box-sizing: border-box;
    overflow: hidden;
  }

  .cart-total .all {
    float: left;
    width: 2rem;
    padding-left: .4rem;
  }

  .cart-total .all .round {
    margin: .4rem 0;
  }

  .cart-total .all span {
    align-content: center;
    position: absolute;
    top: 0;
    left: 1.2rem;
    font-size: .36rem;
    color: #000;
    line-height: 1.4rem;
  }

  .cart-total .total {
    float: right;
    font-size: .4rem;
    color: #D50000;
    line-height: 1.4rem;
    padding-right: .35rem;
  }

  .cart-total button {
    background: #F27132;
    font-size: .4rem;
    color: #fff;
    line-height: 1.4rem;
    float: right;
    width: 3rem;
    border-radius: 0;
    border: 0;
  }

  .cart-total .delete {
    background: #dd191d;
  }

  .cart-total button:active {
    border: 0;
  }

</style>
