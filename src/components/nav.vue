<template>
  <div class="common-nav">
    <div class="common-nav-page" :class="innerActive == 2 ? 'page-cart' : ''">
      <template v-for="(item, index) in navList">
        <div class="page-li" :key="index" :class="[innerActive === index ? 'active' : '', index == 2 ? 'page-li-cart' : '']">
          <template v-if="innerActive === index">
            <template v-if="innerActive != 2">
              <div>
                <i class='iconfont' :class="item.icon"></i>
                <p>{{item.text}}</p>
              </div>
            </template>
            <template v-else>
              <div class="cart">
                <i class='iconfont' :class="item.icon"></i>
                ￥{{totalPrice}}
                <button v-if="show_edit" @click="sub">下单</button>
                <button v-else @click="deletes">删除</button>
              </div>
            </template>
          </template>
          <template v-else>
            <router-link :to="item.url">
              <div>
                <i class='iconfont' :class="item.icon"></i>
                <p>{{item.text}}</p>
              </div>
            </router-link>
          </template>
        </div>
      </template>
    </div>
    <div class="common-nav-share" v-if="innerActive != 2">
      <router-link to="share">
        <div>
          <i class='iconfont icon-fenxiang'></i>
          <p>分享</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Nav',
  data () {
    return {
      navList: [{
        url: '/',
        icon: 'icon-shouye',
        text: '首页'
      }, {
        url: 'goods',
        icon: 'icon-fenlei',
        text: '分类'
      }, {
        url: 'cart',
        icon: 'icon-gouwuche',
        text: '购物车'
      }, {
        url: 'center',
        icon: 'icon-my_icon',
        text: '我的'
      }]
    }
  },
  methods: {
    sub () {
      this.$emit('sub')
    },
    deletes () {
      this.$emit('deletes')
    }
  },
  props: {
    innerActive: Number,
    totalPrice: [Number, String],
    show_edit: Boolean
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.common-nav {
  position: fixed;
  bottom: 0;
  padding: 0 0.3rem .4rem;
  width: 100%;
  box-sizing: border-box;
  max-width: 640px;
  margin:0 auto;
  background: -webkit-linear-gradient(rgba(255, 255, 255, .1), rgba(255, 255, 255, .9));
  background: -o-linear-gradient(rgba(255, 255, 255, .1), rgba(255, 255, 255, .9));
  background: -moz-linear-gradient(rgba(255, 255, 255, .1), rgba(255, 255, 255, .9));
  background: linear-gradient(rgba(255, 255, 255, .1), rgba(255, 255, 255, .9));
}

/* 左侧导航 */
.common-nav-page {
  display: flex;
  width: 7.8rem;
  height: 1.25rem;
  border-radius: 0.6rem;
  background: #970407;
  float: left;
}

.common-nav-page .page-li {
  flex: 1;
  text-align: center;
  position: relative;
}

.common-nav-page .page-li a {
  color: #CD6E70;
  width: 100%;
  height: 100%;
  display: block;
}

.common-nav-page .page-li div {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
}

.common-nav-page .page-li.active {
  color: #fff
}

.common-nav-page .page-li i {
  font-size: .5rem;
}

.common-nav-page .page-li p {
  display: block;
  font-size: .24rem;
}

/* 右侧分享 */
.common-nav-share {
  margin-left: auto;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: #970407;
  color: #fff;
  text-align: center;
  position: relative;
}

.common-nav-share a {
  color: #fff;
}

.common-nav-share div {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
}

.common-nav-share i {
  font-size: .5rem;
}

.common-nav-share p {
  display: block;
  font-size: .24rem;
}

/* 购物车页面添加样式 */
.page-cart {
  width: 100%;
}

.page-cart .page-li-cart {
  flex: 3;
  background: #b5b3b3;
  border-radius: 0.6rem;
}

.page-cart .page-li-cart .cart {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  font-size: .4rem;
  width: 92%;
  height: 100%;
}

.page-cart .page-li-cart .cart i {
  margin-right: .1rem;
}

.page-cart .page-li-cart .cart button {
  margin-left: auto;
  width: 1rem;
  height: 100%;
  background: transparent;
  border: 0;
  font-size: .4rem;
  color: #fff;
}
</style>
