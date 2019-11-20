<template>
  <div class="wrapper">
    <div class="evaluate_list">
      <!-- 商品评价 -->
      <template v-for="(item, index) in goodsList">
        <div class="evaluate_item" :key="item.id">
          <div class="good_div">
            <img class="img" alt="商品图片" :src="item.imgurl">
            <div class="good_right">
              <div class="name">{{item.goodsName}}</div>
              <div class="score_div">
                <span class="txt">描述相符:</span>
                <div class="start">
                  <i class="iconfont icon-wujiaoxing-" :class="evaluateList[index].start>0?'sel':''" @click="changeScore(index,1)"></i>
                  <i class="iconfont icon-wujiaoxing-" :class="evaluateList[index].start>1?'sel':''" @click="changeScore(index,2)"></i>
                  <i class="iconfont icon-wujiaoxing-" :class="evaluateList[index].start>2?'sel':''" @click="changeScore(index,3)"></i>
                  <i class="iconfont icon-wujiaoxing-" :class="evaluateList[index].start>3?'sel':''" @click="changeScore(index,4)"></i>
                  <i class="iconfont icon-wujiaoxing-" :class="evaluateList[index].start>4?'sel':''" @click="changeScore(index,5)"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="alipay">
            <textarea type="text" placeholder="请输入您的评价内容" v-model="evaluateList[index].content" maxlength="100"></textarea>
          </div>
          <ul class="img-group">
            <li class="img-item pic-img" v-for="(imgs, idx) in evaluateList[index].imgurl" :key="idx">
              <img :src="imgs" alt="本地上传的图片">
              <div class="iconfont icon-shanchu delete_pic" @click="deletePic(index)"></div>
            </li>
            <li class="add-pic img-item" @change="addPic(index)" v-if="evaluateList[index].imgurl.length<6">
              <i class="iconfont icon-ai-up-img"></i>
              <input name="files" ref="inputer" class="uploaderInput" type="file" accept="image/*" multiple/>
            </li>
          </ul>
        </div>
      </template>

      <button @click="submit">提交</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EvaluationGood',
  data () {
    return {
      goodsList: [],
      evaluateList: []
    }
  },
  methods: {
    init () {
      // 初始化数据
      let _this = this
      _this.$dataPost('/api/order/getOrderById', {
        userId: window.localStorage.getItem('userId'),
        orderId: _this.$route.query.id ? _this.$route.query.id : 0
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: '没有数据'
          })
          return false
        }
        let goodsList = res.data.goodsList
        let evaluateList = []
        _this.goodsList = goodsList

        for (var i = 0; i < goodsList.length; i++) {
          var evaluate = {}
          evaluate.start = 5
          evaluate.content = ''
          evaluate.imgurl = []
          evaluate.detailId = goodsList[i].detailId
          evaluateList.push(evaluate)
        }
        _this.evaluateList = evaluateList
      })
    },
    changeScore (index, num) {
      // 商品进行评价
      this.evaluateList[index].start = num
    },
    addPic (index) {
      // 上传图片
      var _this = this
      let inputDOM = _this.$refs.inputer
      if (inputDOM[0].files.length > 6) {
        _this.$toast({
          message: '上传图片不能超过'
        })
        return false
      }
      for (var i = 0; i < inputDOM[0].files.length; i++) {
        var reader = new FileReader()
        reader.readAsDataURL(inputDOM[0].files[i])
        reader.onload = function (e) {
          // 读取到的图片base64 数据编码 将此编码字符串传给后台即可
          var imgcode = e.target.result
          _this.$dataPost('/api/common/upload', {
            flle: imgcode
          }, (res) => {
            const data = JSON.parse(res.data)
            const img = data.data
            _this.evaluateList[index].imgurl.push(img)
          })
        }
      }
    },
    deletePic (index) {
      // 删除将要上传的图片
      this.evaluateList[index].imgurl.splice(index, 1)
    },
    submit () {
      // 提交
      let _this = this
      var evaluateList = _this.evaluateList
      for (var i = 0; i < evaluateList.length; i++) {
        if (evaluateList[i].content === '') {
          _this.$toast({
            message: '请输入评价内容'
          })
          return
        }
      }
      for (var ib = 0; ib < evaluateList.length; ib++) {
        if (evaluateList[ib].imgurl.length > 0) {
          var imgs = ''
          for (var j = 0; j < evaluateList[ib].imgurl.length; j++) {
            imgs += evaluateList[ib].imgurl[j] + ','
          }
          evaluateList[ib].imgurls = imgs.substring(0, imgs.length)
        } else {
          evaluateList[ib].imgurls = ''
        }
      }
      _this.$dataPost('/api/order/setComent', {
        userId: window.localStorage.getItem('userId'),
        orderId: _this.$route.query.id ? _this.$route.query.id : 0,
        comentList: evaluateList
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.$toast({
          message: '评价提交成功'
        })
        setTimeout(function () {
          _this.$router.go(-1)
        }, 1500)
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
/* 商品评级 */
.evaluate_list .evaluate_item{
  background: #fff;
  padding: .3rem;
}

.evaluate_item .good_div{
  display: flex;
  overflow: hidden;
  padding-bottom: .3rem;
  align-items: center;
  justify-content: space-between;
}

.evaluate_item .good_div .img{
  flex-shrink: 0;
  width: 2.2rem;
  height: 2.2rem;
  margin-right: .25rem;
}

.evaluate_item .good_div .good_right{
  flex-grow: 1;
  overflow: hidden;
}
.evaluate_item .good_div .good_right .name{
  font-size: .4rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.evaluate_item .good_div .good_right .score_div{
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  margin-top: .15rem;
}

.evaluate_item .good_div .good_right .score_div .txt{
  font-size: .4rem;
  color: #333;
  flex-shrink: 0;
  margin-right: .1rem;
}

.evaluate_item .good_div .good_right .score_div .start{
  flex-grow: 1;
  overflow: hidden;
}

.start i{
  margin-left: .1rem;
  font-size: .5rem;
  color: #DCDCDC;
}

.start i.sel{
  color: #E53935;
}

.alipay {
  padding: .2rem 0;
  position: relative;
}

.alipay textarea {
  width: 96% !important;
  height: 3rem !important;
  resize: none;
  background: #f4f4f4;
  padding: .25rem 2%;
  font-size: .36rem;
  box-sizing: content-box;
  border: 0;
  margin: 0;
  line-height: 1.5em;
}

/* 上传图片 */
.img-group{
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.img-item{
  width: 31%;
  height: 3rem;
  float: left;
  list-style: none;
  margin: 0 3.5% 10px 0;
  position: relative;
  border: 0.01rem solid #f5f5f5;
  overflow: hidden;
  text-align: center;
  box-sizing: border-box;
}

.img-item:nth-child(3n){
  margin-right: 0;
}

.img-item img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete_pic{
  position: absolute;
  right: .2rem;
  top: .2rem;
  font-size: 0.5rem;
}

.add-pic{
  background: #ececec;
  color: #979797;
  text-align: center;
  position: relative;
  margin: 0 0 10px;
}

.add-pic i{
  line-height: 3rem;
  font-size: 1rem;
}

.add-pic input{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  opacity: 0;
}

.evaluate_list button {
  background: #E64340;
  font-size: .4rem;
  color: #fff;
  line-height: 1.2rem;
  border: 0;
  width: 90%;
  margin: 1rem 5%;
  border-radius: .1rem;
}
</style>
