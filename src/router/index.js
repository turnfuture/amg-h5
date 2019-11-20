import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/amg',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/pages/Index/Index'),
      meta: {
        title: '首页'
      }
    }, {
      path: '/author',
      name: 'Author',
      component: () => import('@/pages/Index/author')
    }, {
      path: '/seckill',
      name: 'Seckill',
      component: () => import('@/pages/Index/seckill'),
      meta: {
        title: '秒杀列表'
      }
    }, {
      path: '/nine',
      name: 'Nine',
      component: () => import('@/pages/Index/nine'),
      meta: {
        title: '9块9包邮'
      }
    }, {
      path: '/newPeople',
      name: 'NewPeople',
      component: () => import('@/pages/Index/newPeople'),
      meta: {
        title: '新人专享'
      }
    }, {
      path: '/homeShopkeeper',
      name: 'HomeShopkeeper',
      component: () => import('@/pages/Index/homeShopkeeper'),
      meta: {
        title: '邀请好友'
      }
    }, {
      path: '/share',
      name: 'Share',
      component: () => import('@/pages/Index/share'),
      meta: {
        title: '分享'
      }
    }, {
      path: '/goods',
      name: 'Goods',
      component: () => import('@/pages/goods/index'),
      meta: {
        title: '分类'
      }
    }, {
      path: '/search',
      name: 'Search',
      component: () => import('@/pages/goods/search'),
      meta: {
        title: '搜索'
      }
    }, {
      path: '/goodsDetail',
      name: 'GoodsDetail',
      component: () => import('@/pages/goods/detail'),
      meta: {
        title: '商品详情'
      }
    }, {
      path: '/conOrder',
      name: 'ConOrder',
      component: () => import('@/pages/goods/conOrder'),
      meta: {
        title: '确认订单'
      }
    }, {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/pages/cart/index'),
      meta: {
        title: '购物车'
      }
    }, {
      path: '/center',
      name: 'Center',
      component: () => import('@/pages/center/index'),
      meta: {
        title: '我的'
      }
    }, {
      path: '/setUp',
      name: 'SetUp',
      component: () => import('@/pages/center/setUp'),
      meta: {
        title: '设置'
      }
    }, {
      path: '/today',
      name: 'Today',
      component: () => import('@/pages/center/today'),
      meta: {
        title: '今日收益'
      }
    }, {
      path: '/wallet',
      name: 'Wallet',
      component: () => import('@/pages/center/Wallet'),
      meta: {
        title: '账户余额'
      }
    }, {
      path: '/walletRecord',
      name: 'WalletRecord',
      component: () => import('@/pages/center/WalletRecord'),
      meta: {
        title: '提现记录'
      }
    }, {
      path: '/goPresen',
      name: 'GoPresen',
      component: () => import('@/pages/center/goPresen'),
      meta: {
        title: '提现'
      }
    }, {
      path: '/coupon',
      name: 'Coupon',
      component: () => import('@/pages/center/coupon'),
      meta: {
        title: '优惠券'
      }
    }, {
      path: '/order',
      name: 'Order',
      component: () => import('@/pages/center/order'),
      meta: {
        title: '我的订单'
      }
    }, {
      path: '/orderDetails',
      name: 'OrderDetails',
      component: () => import('@/pages/center/orderDetails'),
      meta: {
        title: '订单详情'
      }
    }, {
      path: '/retuGoods',
      name: 'RetuGoods',
      component: () => import('@/pages/center/retuGoods'),
      meta: {
        title: '退货'
      }
    }, {
      path: '/logistics',
      name: 'Logistics',
      component: () => import('@/pages/center/logistics'),
      meta: {
        title: '物流信息'
      }
    }, {
      path: '/evaluationGood',
      name: 'EvaluationGood',
      component: () => import('@/pages/center/evaluationGood'),
      meta: {
        title: '评价'
      }
    }, {
      path: '/orderRefund',
      name: 'OrderRefund',
      component: () => import('@/pages/center/orderRefund'),
      meta: {
        title: '退款/售后'
      }
    }, {
      path: '/myFans',
      name: 'MyFans',
      component: () => import('@/pages/center/myFans'),
      meta: {
        title: '我的粉丝'
      }
    }, {
      path: '/myTeam',
      name: 'MyTeam',
      component: () => import('@/pages/center/myTeam'),
      meta: {
        title: '我的团队'
      }
    }, {
      path: '/collEction',
      name: 'CollEction',
      component: () => import('@/pages/center/collEction'),
      meta: {
        title: '我的收藏'
      }
    }, {
      path: '/mineMsg',
      name: 'MineMsg',
      component: () => import('@/pages/center/mineMsg'),
      meta: {
        title: '我的消息'
      }
    }, {
      path: '/mineMsgDetails',
      name: 'MineMsgDetails',
      component: () => import('@/pages/center/mineMsgDetails'),
      meta: {
        title: '详情'
      }
    }, {
      path: '/mineManage',
      name: 'MineManage',
      component: () => import('@/pages/center/mineManage'),
      meta: {
        title: '掌柜权益'
      }
    }, {
      path: '/address',
      name: 'Address',
      component: () => import('@/pages/center/address'),
      meta: {
        title: '管理收货地址'
      }
    }, {
      path: '/lookAddress',
      name: 'LookAddress',
      component: () => import('@/pages/center/lookAddress'),
      meta: {
        title: '管理填写地址'
      }
    }, {
      path: '*',
      name: 'NotFoundComponent',
      component: () => import('@/pages/NotFoundComponent'),
      meta: {
        title: '404'
      }
    }
  ]
})
