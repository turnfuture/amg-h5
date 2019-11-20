<template>
  <div class="wrapper">
    <div class="pic-img" :style="picImgHeight">
      <div class="topImg" :style="picImgHeight" ref="Top3Img">
        <swiper :options="swiperOption" ref="mySwiper" :style="picImgHeight">
          <template v-for="(item, index) in imgUrls">
            <swiper-slide :key="index" :id="['swiper' + index]">
              <img class="img" :src="item" alt="分享图片">
                <div class="content">
                  <div class="content_div">
                    <div class="content_left">
                      <img class="avator" :src="avator" alt="头像">
                      <div class="name">{{name}}</div>
                      <span class="txt">长按识别二维码</span>
                    </div>
                    <div class="content_right" :id="['qrcode' + index]"></div>
                  </div>
                </div>
            </swiper-slide>
          </template>
        </swiper>
      </div>
    </div>
    <div class="share_bottom">
      <div class="item" @click="shareWechat">
        <div class="pic">
          <img src="../../assets/img/index/wechat.png" alt="分享好友">
        </div>
        <span>分享好友</span>
      </div>
      <div class="item" @click="saveImage()">
        <div class="pic">
          <img src="../../assets/img/index/upload.png" alt="保存图片">
        </div>
        <span>保存图片</span>
      </div>
    </div>

    <!-- 遮罩层 -->
    <section>
      <div class="goods_mask" v-if='!boxhidden' @click='closegoods'>
        <div class="goods_close" @click='closegoods'>
          <img src='../../assets/img/activity/xqguanbi.png'>
        </div>
        <div class="goods_info">
          <img v-if="url" :src="url" alt="分享图片">
        </div>
        <div class="goods_text">
          长按图片保存到手机
        </div>
      </div>
    </section>

    <section class="goods_mask goods_mask_black" v-if='!wechatHidden' @click='closeWechat'>
      <img src="../../assets/img/index/share.png" alt="点击右上角分享好友">
    </section>
  </div>
</template>

<script>
import QRCode from 'qrcodejs2'
import html2canvas from 'html2canvas'
import wx from 'weixin-js-sdk'
export default {
  name: 'Share',
  data () {
    return {
      swiperOption: {
        notNextTick: true,
        initialSlide: 0,
        slidesPerView: 'auto',
        spaceBetween: 10
      },
      imgUrls: [],
      name: '',
      avator: '',
      shopId: '',
      InvitationCode: '',
      qrUrl: '',
      curIndex: 1,
      picImgHeight: {
        height: '400px'
      },
      boxhidden: true,
      wechatHidden: true,
      url: ''
    }
  },
  methods: {
    init () {
      var _this = this
      let innerWidth = window.innerWidth / 10
      let innerHeight = window.innerHeight
      _this.picImgHeight.height = innerHeight - 2.08 * innerWidth + 'px'
      _this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      // 初始化折扣商品
      _this.$dataPost('/api/member/getExtensionGz', {
        userId: window.localStorage.getItem('userId')
      }, (res) => {
        _this.$indicator.close()
        _this.imgUrls = res.data.imgurl
        _this.name = res.data.name
        this.getUrlBase64(res.data.avator, (innerWidth * 0.8), (innerWidth * 0.8), function (base64) {
          _this.avator = base64
        })
        _this.shopId = res.data.shopId
        _this.InvitationCode = res.data.InvitationCode
        _this.qrUrl = res.data.qrUrl
        this.$nextTick(() => {
          _this.qrcode(res.data.qrUrl)
        })
        _this.initShare()
      })
    },
    qrcode (qrUrl) {
      for (let i = 0; i < this.imgUrls.length; i++) {
        let qrco = 'qrcode' + i
        let qrcode = new QRCode(qrco, {
          width: 70,
          height: 70,
          text: qrUrl,
          colorDark: '#000',
          colorLight: '#fff'
        })
        console.log(qrcode)
      }
    },
    shareWechat () {
      // 分享好友
      this.wechatHidden = false
    },
    closeWechat () {
      // 关闭
      this.wechatHidden = true
    },
    saveImage () {
      // canvas生成图片
      let swiperIndex = document.getElementById('swiper' + this.$refs.mySwiper.swiper.activeIndex)
      let table = swiperIndex
      this.boxhidden = false
      this.$indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      })
      html2canvas(table, {
        backgroundColor: null
      }).then(canvas => {
        this.$indicator.close()
        var url = canvas.toDataURL('image/jpeg')
        this.url = url
      })
    },
    closegoods () {
      // 关闭遮罩层
      this.boxhidden = true
    },
    getUrlBase64 (url, width, height, callback) {
      var canvas = document.createElement('canvas')
      var ctx = canvas.getContext('2d')
      /* eslint-disable no-new */
      var img = new Image()
      img.crossOrigin = 'Anonymous'
      img.src = url
      img.onload = function () {
        canvas.height = width
        canvas.width = height
        ctx.drawImage(img, 0, 0, width, height)
        var dataURL = canvas.toDataURL('image/jpeg')
        callback.call(this, dataURL)
        canvas = null
      }
    },
    initShare () {
      let _this = this
      this.$dataPost('/api/member/config', {
        url: location.href.split('#')[0]
      }, (res) => {
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.data.appId, // 必填，公众号的唯一标识
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.sign, // 必填，签名，见附录1
          jsApiList: ['updateAppMessageShareData', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
        let imgUrl = this.imgUrls.length ? this.imgUrls[0] : ''
        // alert(`https://amg.aitaunkj.com/amg/?shopId=${this.shopId}&InvitationCode=${this.InvitationCode}`)
        wx.ready(function () {
          if (wx.updateAppMessageShareData) {
            wx.updateAppMessageShareData({
              title: '爱美购', // 分享标题
              desc: '', // 分享描述
              link: 'https://amg.aitaunkj.com/amg/?shopId=' + _this.shopId + '&InvitationCode=' + _this.InvitationCode,
              imgUrl: imgUrl, // 分享图标
              success: function () {
                // 设置成功
                // _this.$toast({
                //   message: '分享成功',
                //   position: 'bottom'
                // })
              },
              fail () {}
            })
          } else {
            wx.onMenuShareAppMessage({
              title: '爱美购', // 分享标题
              desc: '', // 分享描述
              link: 'https://amg.aitaunkj.com/amg/?shopId=' + _this.shopId + '&InvitationCode=' + _this.InvitationCode,
              imgUrl: imgUrl, // 分享图标
              type: '', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户点击了分享后执行的回调函数
                // _this.$toast({
                //   message: '分享成功',
                //   position: 'bottom'
                // })
              }
            })
          }
        })
        wx.error(function (res) {
          alert(typeof res)
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        })
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.swiper-container {
  padding: 0 30px;
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;
  width: 100%;
  height: 100% !important;
  margin: 0 auto;
  /* Center slide text vertically */
  display: -webkit-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
  border-radius: 5px;
}
.pic-img .topImg {
  position: relative;
}
.pic-img img.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.pic-img .content{
  width: 90%;
  position: absolute;
  bottom: .1rem;
  left: 50%;
  transform: translateX(-50%);
  padding: .2rem;
  z-index: 77;
  height: auto;
}
.content div{
  width: auto;
  height: auto;
}
.content .content_div{
  padding: .3rem .2rem;
  background: #fff;
  border-radius: .1rem;
  display: flex;
  overflow: hidden;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
}
.content_div .content_left{
  flex-grow: 1;
  margin-right: .2rem;
  text-align: left;
}
.content_div .content_left img{
  width: .8rem;
  height: .8rem;
  margin-left: .1rem;
  border-radius: 50%;
}
.content_div .content_left .name{
  color: #333;
  margin: .1rem;
  font-size: .4rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.content_div .content_left .txt{
  background: #020202;
  color: #fff;
  font-size: .28rem;
  padding: .08rem .3rem;
  border-radius: .4rem;
}
.content_div .content_right{
  flex-shrink: 0;
  position: absolute;
  right: .5rem;
  transform: translateY(-50%);
  top: 50%;
}
.share_bottom{
  flex-shrink: 0;
  display: flex;
}
.share_bottom .item{
  flex: 1;
  text-align: center;
  padding: .2rem 0 .1rem;
}
.share_bottom .item .pic{
  width: 1.2rem;
  height: 1.2rem;
  margin: 0 auto .1rem;
}

.share_bottom .item img{
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.share_bottom .item span{
  width: 100%;
  display: block;
  text-align: center;
  color: #6e6e6e;
  font-size: .36rem;
}

/* 遮罩层 */
.goods_mask {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  z-index: 98;
  height: 100%;
  background: rgba(255, 255, 255, 1);
}

.goods_mask_black img {
  width: 100%;
  margin-top: -25px;
}

.goods_info {
  max-width: 80%;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 99;
  background: transparent;
  transform: translate(-50%, -50%);
  height: 10rem;
}
.goods_info img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.goods_text {
  font-size: .45rem;
  font-weight: bold;
  line-height: 2em;
  text-align: center;
  position: absolute;
  left: 0;
  bottom: .8rem;
  width: 100%;
}

.goods_close {
  position: absolute;
  top: 5%;
  right: 10%;
  border-radius: 50%;
}

.goods_close img {
  width: 1rem;
  height: 1rem;
}

</style>
