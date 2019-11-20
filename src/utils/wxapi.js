import {dataGet, dataPost} from './axios.js'
// 微信支付方法（点击按键调用）
let wx = require('weixin-js-sdk')
/*
微信支付方法
获取微信加签信息
@param{data}:获取的微信加签
@param{cb}:成功回调
*/
let wxapi = {
  weixin (url) {
    // 获取配置所需信息
    dataPost('/api/member/config', {
      url: url
    }, (res) => {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: res.data.appId, // 必填，公众号的唯一标识
        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
        signature: res.data.sign, // 必填，签名，见附录1
        jsApiList: ['updateAppMessageShareData', 'chooseWXPay', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })
      // wx.ready(function () {
      //   if (wx.updateAppMessageShareData) {
      //     wx.updateAppMessageShareData({
      //       title: '爱美购', // 分享标题
      //       desc: '', // 分享描述
      //       link: 'https://amg.aitaunkj.com/amg/?shopId=_this.shopId&InvitationCode=_this.InvitationCode',
      //       imgUrl: 'imgUrl', // 分享图标
      //       success: function () {
      //         // 设置成功
      //         // _this.$toast({
      //         //   message: '分享成功',
      //         //   position: 'bottom'
      //         // })
      //       },
      //       fail () {}
      //     })
      //   } else {
      //     wx.onMenuShareAppMessage({
      //       title: '爱美购', // 分享标题
      //       desc: '', // 分享描述
      //       link: 'https://amg.aitaunkj.com/amg/?shopId=&InvitationCode=this.InvitationCode',
      //       imgUrl: 'imgUrl', // 分享图标
      //       type: '', // 分享类型,music、video或link，不填默认为link
      //       dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      //       success: function () {
      //         // 用户点击了分享后执行的回调函数
      //         // _this.$toast({
      //         //   message: '分享成功',
      //         //   position: 'bottom'
      //         // })
      //       }
      //     })
      //   }
      // })
      // wx.error(function (res) {
      //   alert(typeof res)
      //   // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      // })
    })
  },
  chooseWXPay (timestamp, nonceStr, packages, paySign, cb, errorCb) {
    // 获取支付所需信息
    wx.chooseWXPay({
      timestamp: timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
      nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
      package: packages, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
      signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
      paySign: paySign, // 支付签名
      success (res) {
        // 支付成功后的回调函数
        cb(res)
      },
      fail (res) {
        errorCb(res)
      }
    })
  },
  con () {
    console.log(dataGet)
  }
}

export default wxapi
