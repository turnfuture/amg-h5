<template>
  <div class="wrapper">
    <div class="top">
      <div class="search">
        <router-link to="search">
          <div class="search-bg">
            <i class="iconfont icon-chaxun"></i>
            <input placeholder="输入商品名称" type="text" >
          </div>
        </router-link>
      </div>
      <div class="all-nav" ref="allNav">
        <div class="nav-list" ref="navList">
          <template v-for="(item, index) in navList">
            <div class="nav-item" :class="active == index ? 'active' : ''" :key="item.id" @click="selectNav(item.id, index)">
              {{ item.name }}
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 所有商品 -->
    <div class="goods" ref="bscroll">
      <template v-if="goodsList.length > 0">
       <div class="goods-list">
        <template v-for="item in goodsList">
          <div class="goods-item" :key="item.id">
            <router-link :to="{path: 'goodsDetail', query: {id: item.id}}">
              <div class="item-pic">
                <img :src="item.imgurl" alt="商品名称">
              </div>
              <div class="item-item">{{item.name}}</div>
              <div class="item-price">￥{{item.price}}</div>
            </router-link>
          </div>
        </template>
       </div>
      </template>
      <template v-else>
        <div class="noneData">该分类下暂无商品</div>
      </template>
    </div>
    <Nav :innerActive="innerActive"></Nav>
  </div>
</template>

<script>
import Nav from '../../components/nav.vue'
import BScroll from 'better-scroll'
export default {
  name: 'Goods',
  data () {
    return {
      innerActive: 1,
      active: 0,
      navList: [],
      pageNum: 1,
      isLast: false,
      // 所有商品
      goodsList: []
    }
  },
  methods: {
    init () {
      let _this = this
      let innerWidth = window.innerWidth * 1.8 / 10
      // 初始化商品分类
      this.$dataPost('/api/goods/class/list', {}, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        let navActive = _this.$route.query.type ? (res.data.length - 1) : 0
        _this.navList = res.data
        _this.active = navActive
        _this.$refs.navList.style.width = (res.data.length * 1.8) + 'rem'
        _this.$nextTick(() => {
          _this.allNavScroll = new BScroll(_this.$refs.allNav, {
            startX: _this.$route.query.type ? -(innerWidth * res.data.length) : 0,
            click: true,
            scrollX: true,
            scrollY: false,
            eventPassthrough: 'vertical'
          })
        })
        _this.attrShop(res.data[navActive].id)
      })
    },
    selectNav (id, index) {
      // 选择一级分类
      let _this = this
      _this.active = index
      _this.pageNum = 1
      _this.attrShop(id)
    },
    attrShop (id) {
      // 通过id获取数据
      let _this = this
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      _this.$dataPost('/api/goods/goodsListByClass', {
        userId: window.localStorage.getItem('userId'),
        classId: id,
        order: '',
        method: 'desc',
        pageNumber: _this.pageNum,
        pageSize: '20'
      }, (res) => {
        _this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }

        if (_this.pageNum === 1) {
          _this.goodsList = []
        }
        _this.goodsList = _this.goodsList.concat(res.data.list)
        _this.isLast = res.data.hasNextPage
        _this.scrollFn(id)
      })
    },
    scrollFn (id) {
      var rem = window.innerHeight / (window.innerWidth / 10)
      var inneheight = rem - 4.2 + 'rem'
      this.$refs.bscroll.style.height = inneheight
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.bscroll, {
            click: true,
            scrollY: true,
            probeType: 0
          })
        } else {
          this.scroll.refresh()
        }
        this.scroll.on('scrollEnd', (pos) => {
          if (this.scroll.maxScrollY < pos.y + 20) {
            this.scroll.refresh()
            if (this.isLast) {
              this.pageNum++
              this.attrShop(id)
            }
          }
        })
      })
    }
  },
  created () {
    this.init()
  },
  beforeCreate () {
    this.$indicator.open({
      text: '加载中...',
      spinnerType: 'fading-circle'
    })
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

.search {
  padding: .25rem 1rem .15rem;
  background: #fff;
}

.search .search-bg {
  height: 1rem;
  border-radius: 1rem;
  background: #F0F0F0;
}

.search .search-bg i {
  color: #ADADAD;
  margin-left: 2rem;
  line-height: 1rem;
}

.search .search-bg input {
  background: transparent;
  height: 1rem;
  width: 62%;
  float: right;
  font-size: .35rem;
}
/* 分类 */
.all-nav {
  overflow: hidden;
  touch-action: none;
}

.nav-list {
  white-space: nowrap;
  background: #fff;
  padding: 0;
}

.nav-list .nav-item {
  font-size: .36rem;
  display: inline-block;
  background: #fff;
  padding: 0.2rem 0;
  width: 1.8rem;
  text-align: center;
  border-bottom: .02rem solid #ddd;
}

.nav-list .nav-item.active {
  color: #DD191D;
  border-bottom: .02rem solid #DD191D;
}

/* 所有商品 */
.goods {
  overflow: hidden;
}

.goods-list {
  padding: 0 .25rem;
  overflow: hidden;
}

.goods-list .goods-item {
  width: 49%;
  float: left;
  margin-right: 2%;
  background: #fff;
  margin-top: .25rem;
}

.goods-list .goods-item:nth-child(2n) {
  margin-right: 0;
}

.goods-list .goods-item .item-pic {
  height: 4.7rem;
}

.goods-list .goods-item .item-pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-list .goods-item .item-item {
  font-size: .36rem;
  color: #000;
  line-height: .5rem;
  padding: .15rem 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.goods-list .goods-item .item-price {
  font-size: .36rem;
  color: #DD191D;
  line-height: .5rem;
  padding: .15rem 0;
}

.noneData {
  line-height: 8rem;
  text-align: center;
  font-size: .4rem;
  color: #666;
}

.drop-down {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 9999;
}
</style>
