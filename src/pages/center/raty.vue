<template>
  <div class="wrapper">
    <template v-if="incomeList.length > 0">
      <div class="list" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
        <template v-for="item in incomeList">
          <div class="raty-item" :key="item.goodsId">
            <div class="good_div" @click="goDetail(item.goodsId)">
              <img class="img" :src="item.imgurl" alt="商品图片">
              <div class="good_right">
                <div class="name">{{item.name}}</div>
                <div class="comment-star">
                  <template v-if="item.star > 0">
                    <img src="../../assets/img/activity/star-active.png" alt="评论">
                  </template>
                  <template v-else>
                    <img src="../../assets/img/activity/star.png" alt="评论">
                  </template>
                  <template v-if="item.star > 1">
                    <img src="../../assets/img/activity/star-active.png" alt="评论">
                  </template>
                  <template v-else>
                    <img src="../../assets/img/activity/star.png" alt="评论">
                  </template>
                  <template v-if="item.star > 2">
                    <img src="../../assets/img/activity/star-active.png" alt="评论">
                  </template>
                  <template v-else>
                    <img src="../../assets/img/activity/star.png" alt="评论">
                  </template>
                  <template v-if="item.star > 3">
                    <img src="../../assets/img/activity/star-active.png" alt="评论">
                  </template>
                  <template v-else>
                    <img src="../../assets/img/activity/star.png" alt="评论">
                  </template>
                  <template v-if="item.star > 4">
                    <img src="../../assets/img/activity/star-active.png" alt="评论">
                  </template>
                  <template v-else>
                    <img src="../../assets/img/activity/star.png" alt="评论">
                  </template>
                </div>
                <div class="comment-date">{{item.create_at}}</div>
              </div>
            </div>
            <div class="comment-li-text">
              {{item.content}}
            </div>
            <div class="comment-li-pic">
              <template v-for="(img, idx) in item.imgList">
                <img v-if="img" :src="img" :key="idx" alt="评价图片">
              </template>
            </div>
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div class="noneData">暂无数据</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Raty',
  data () {
    return {
      incomeList: [],
      page: 1,
      pageSize: 20,
      isLast: false
    }
  },
  methods: {
    attrIncomeList () {
      // 获取列表
      let _this = this
      if (this.page === 1) {
        _this.incomeList = []
      }
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      _this.$dataPost('/api/member/getMyComents', {
        userId: window.localStorage.getItem('userId'),
        pageSize: _this.pageSize,
        pageNumber: _this.page
      }, (res) => {
        _this.$indicator.close()
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        let list = res.data.list
        list.map(item => {
          item.imgList = item.imgurls.split(',')
        })
        _this.incomeList = _this.incomeList.concat(list)
        _this.isLast = res.data.hasNextPage
        _this.loading = false
      })
    },
    loadMore () {
      // 加载更多
      this.loading = true
      if (this.isLast) {
        this.page++
        this.attrIncomeList()
      }
    }
  },
  created () {
    this.attrIncomeList()
  }
}
</script>

<style scoped>
.raty-item {
  padding: 0 .3rem .3rem;
  background: #fff;
  border-bottom: .02rem solid #eaeaea;
}

.good_div {
  padding: .3rem 0;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
}

.good_div .img {
  width: 2.8rem;
  height: 2.8rem;
  flex-shrink: 0;
  margin-right: .3rem;
}

.good_div .good_right {
  flex-grow: 1;
  overflow: hidden;
}

.good_div .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: .4rem;
}

.good_bottom {
  overflow: hidden;
  margin-top: .3rem;
}

.good_bottom .money {
  float: left;
  font-size: .32rem;
  color: #D50000;
  line-height: 2em;
}

.good_bottom .money .price {
  margin-left: .1rem;
  font-size: .44rem;
  font-weight: bold;
}

.good_bottom .btn {
  width: 2rem;
  line-height: .9rem;
  float: right;
  font-size: .32rem;
  color: #D50000;
  border-radius: .45rem;
  border: .02rem solid #D50000;
  text-align: center;
}

/* 五角星 */
.comment-star {
  margin-top: .2rem;
}

.comment-star img {
  width: .6rem;
  height: .6rem;
}

.comment-date {
  font-size: .3rem;
  color: #7D7D7D;
  margin-top: .15rem;
}

.comment-li-text {
  font-size: .32rem;
  color: #7D7D7D;
}

.comment-li-pic {
  display: flex;
  flex-wrap: wrap;
}

.comment-li-pic img {
  width: 23%;
  height: 2.2rem;
  object-fit: cover;
  margin-right: 2.66%;
  margin-top: .2rem;
}

.comment-li-pic img:nth-child(4n) {
  margin-right: 0;
}

</style>
