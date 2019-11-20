<template>
  <div class="wrapper">
    <div class="my-list">
      <div class="my-list-item">
        收 货 人：
        <input type="text" placeholder="请输入收货人" v-model="userName" maxlength="11">
        <i> </i>
      </div>
      <div class="my-list-item">
        手机号码：
        <input type="number" placeholder="请输入手机号码" v-model="phone" maxlength="11">
        <i>+86</i>
      </div>
      <div class="my-list-item" @click="mask = true">
        所在地区：
        <p v-if="region">{{region[0]}} {{region[1]}} {{region[2]}}</p>
        <i class="iconfont icon-youjiantou"></i>
      </div>
      <div class="alipay">
        <textarea type="text" placeholder="详细地址：如街道，门牌号" v-model="detail" maxlength="100"></textarea>
      </div>
      <div class="my-list-item">
        设为默认地址：
        <mt-switch v-model="defaultValue"></mt-switch>
      </div>
      <button @click="submit" v-if="addressId === 0">保存</button>
      <button @click="editAddress" v-else>保存</button>
    </div>
    <!-- 遮罩层 -->
    <div class="mask" @click="mask = false" v-show="mask">
      <mt-picker :slots="myAddressSlots" @change="onMyAddressChange"></mt-picker>
    </div>
  </div>
</template>

<script>
import '../../assets/css/address.css'
import myaddress from '../../assets/pca.json'
export default {
  name: 'LookAddress',
  data () {
    return {
      addressId: 0,
      userName: '',
      phone: '',
      detail: '',
      defaultValue: true,
      myAddressSlots: [{
        flex: 1,
        defaultIndex: 1,
        values: Object.keys(myaddress),
        className: 'slot1',
        textAlign: 'center'
      }, {
        divider: true,
        content: '-',
        className: 'slot2'
      }, {
        flex: 1,
        values: [],
        className: 'slot3',
        textAlign: 'center'
      }, {
        divider: true,
        content: '-',
        className: 'slot4'
      }, {
        flex: 1,
        values: [],
        className: 'slot5',
        textAlign: 'center'
      }],
      region: [],
      mask: false
    }
  },
  methods: {
    init () {
      // 初始化获取收益数据
      let _this = this
      _this.$dataPost('/api/member/address/getById', {
        userId: window.localStorage.getItem('userId'),
        addressId: _this.addressId
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        let addreInfo = res.data
        _this.userName = addreInfo.fullName
        _this.phone = addreInfo.phone
        _this.detail = addreInfo.address
        _this.defaultValue = Boolean(addreInfo.defaultValue === 0 ? 'true' : '')
        _this.region = [addreInfo.province, addreInfo.city, addreInfo.county]
      })
    },
    submit () {
      // 提交地址
      let _this = this
      let temp = {
        userName: '请输入收货人名称',
        phone: '请输入手机号码',
        region: '请选择所在地区',
        detail: '请输入详细地址'
      }
      let myreg = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
      for (let prop in temp) {
        if (!_this[prop]) {
          _this.$messagebox({
            title: '提示',
            message: temp[prop]
          })
          return
        }
      }
      if (!myreg.test(_this['phone'])) {
        _this.$messagebox({
          title: '提示',
          message: '请输入正确的号码'
        })
        return
      }
      _this.$dataPost('/api/member/address/add', {
        userId: window.localStorage.getItem('userId'),
        province: _this.region[0],
        city: _this.region[1],
        country: _this.region[2],
        address: _this.detail,
        fullName: _this.userName,
        phone: _this.phone,
        default: _this.defaultValue ? 0 : 1
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.$router.go(-1)
      })
    },
    editAddress () {
      // 编辑地址
      let _this = this
      let temp = {
        userName: '请输入收货人名称',
        phone: '请输入手机号码',
        region: '请选择所在地区',
        detail: '请输入详细地址'
      }
      let myreg = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/
      for (let prop in temp) {
        if (!_this[prop]) {
          _this.$messagebox({
            title: '提示',
            message: temp[prop]
          })
          return
        }
      }
      if (!myreg.test(_this['phone'])) {
        _this.$messagebox({
          title: '提示',
          message: '请输入正确的号码'
        })
        return
      }
      _this.$dataPost('/api/member/address/change', {
        userId: window.localStorage.getItem('userId'),
        province: _this.region[0],
        city: _this.region[1],
        country: _this.region[2],
        address: _this.detail,
        fullName: _this.userName,
        phone: _this.phone,
        default: _this.defaultValue ? 0 : 1,
        addressId: _this.addressId
      }, (res) => {
        if (res.code !== 0) {
          _this.$messagebox({
            title: '提示',
            message: res.msg
          })
          return false
        }
        _this.$router.go(-1)
      })
    },
    onMyAddressChange (picker, values) {
      if (myaddress[values[0]]) {
        picker.setSlotValues(1, Object.keys(myaddress[values[0]]))
        picker.setSlotValues(2, myaddress[values[0]][values[1]])
        this.region = values
      }
    }
  },
  created () {
    let addressId = this.$route.query.addressId
    this.addressId = addressId
    if (addressId !== '0') {
      this.init()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.myAddressSlots[0].defaultIndex = 0
    })
  }
}
</script>
<style scoped>
.my-list {
  margin: 0;
}

.my-list-item {
  background: #fff;
  padding: 0 .5rem;
  border-bottom: .02rem solid #eee;
  font-size: .4rem;
  line-height: 1.5rem;
  display: flex;
}

.my-list input {
  padding: 0;
  width: 70%;
  height: 1.5rem;
  font-size: .4rem;
  line-height: 1.5rem;
  margin-left: auto;
}

.alipay {
  padding: .4rem 0;
  position: relative;
}

.alipay textarea {
  width: 86% !important;
  height: 3rem !important;
  resize: none;
  background: #f4f4f4;
  padding: .25rem 2%;
  font-size: .36rem;
  box-sizing: content-box;
  border: 0;
  margin: 0 5%;
  line-height: 1.5em;
}

.my-list label {
  margin-left: auto;
}

.my-list button {
  padding: 0;
  width: 70%;
  height: 1.5rem;
  font-size: .4rem;
  line-height: 1.5rem;
  margin-left: auto;
  background: transparent;
  border: 0;
}

.my-list i {
  margin-left: auto;
  font-size: .4rem;
  color: #999;
  text-align: right;
  width: .7rem;
}

.my-list > button {
  background: #E64340;
  font-size: .4rem;
  color: #fff;
  line-height: 1.2rem;
  border: 0;
  width: 90%;
  margin: 1rem 5%;
  border-radius: .1rem;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  z-index: 11;
}

.picker {
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 12;
  background: #fff;
}

</style>
