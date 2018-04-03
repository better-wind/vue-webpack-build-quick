<template>
  <div>
    <v-head :config="config"/>
    <div class="login-view">
      <div class="login-pain">
        <div class="login-img">

        </div>
        <div class="login-box">
          <div class="title">
            <span>登录</span>
          </div>
          <div class="item-wrap">
            <div class="item">
              <div class="sign">
                <i class="user"></i>
              </div><input id="username" type="text" v-model="loginRs.account" placeholder="请输入账户" @focus="clearError()">
              <i v-if="loginRs.account" class="el-icon-circle-cross login-close" @click="clearOpt('account')"></i>
            </div>
            <div class="item">
              <div class="sign">
                <i class="pwd"></i>
              </div><input id="password" type="password" v-model="loginRs.password" placeholder="请输入密码" @focus="clearError()">
              <i v-if="loginRs.password" class="el-icon-circle-cross login-close" @click="clearOpt('password')"></i>
            </div>
            <div class="item item-no-border">
              <div class="item small-item">
                <div class="sign">
                  <i class="valid"></i>
                </div><input type="text" v-model="loginRs.validateCode" placeholder="请输入验证码" @keydown="keyDown($event)" @focus="clearError()">
                <i v-if="loginRs.validateCode" class="el-icon-circle-cross login-close" @click="clearOpt('validateCode')"></i>
              </div><img :src="validateSrc" alt=""  @click="setValidateCode()">
            </div>
          </div>
          <div class="error">
            <template v-if="loginError">
              <span class="error-sign"></span>
              <span class="error-msg">{{loginError}}</span>
            </template>
            <span class="f-r cur-pt" @click="forgetPwd()">忘记密码？</span>
          </div>
          <div class="menu">
            <button class="cur-pt" @click="login">登录</button>
          </div>
        </div>
      </div>
    </div>
    <v-Foot />
    <v-toast />
  </div>

</template>
<script>
  import vHead from '@/components/common/Header'
  import vFoot from '@/components/common/Footer'
  import vToast from '@/components/tools/Toast'
  import {mapState, mapActions} from 'vuex'
  export default {
    name:'Login',
    data: () => ({
       validateSrc:'/sellerAdmin/verify/getCode',
       loginRs:{
         account: '',
         password: '',
         validateCode: '',
       },
      config:{
        type:'Login',
        menu:false
      },
    }),
    created(){
      this.setValidateCode()
    },
    computed: {
      ...mapState(['loginError'])
    },
    methods: {
      ...mapActions(['getLogin','setLoginError']),
      clearError(){
        if(this.loginError){
          this.setLoginError('')
        }
      },
      keyDown(ev){
        if(ev.keyCode==13){
          this.login()
        }
      },
      clearOpt(key){
        this.loginRs[key] = ''
      },
      login() {
        const opts = this.loginRs;
        if(!opts.account){
            this.setLoginError('请输入用户名')
            return false
        }
        if(!opts.password){
          this.setLoginError('请输入密码')
          return false
        }
        if(!opts.validateCode){
          this.setLoginError('请输入验证码')
          return false
        }

        this.getLogin(opts)
          .then(()=>{
            this.$router.push({
            path: '/',
          })
        })
      },
      forgetPwd() {
        this.$confirm('请联系商家运营人员重置密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(()=>{})
      },
      setValidateCode() {
        const t = new Date().getTime()
        this.validateSrc='/sellerAdmin/verify/getCode?t='+t
      }
    },
    components: {
      vHead,
      vToast,
      vFoot
    },
    watch: {
      'loginError':function(newVal){
          if(newVal && newVal != '请输入验证码' && newVal != '请输入用户名' && newVal != '请输入密码'){
              this.setValidateCode()
            this.loginRs.validateCode = ''
          }
      }
    }
  }
</script>
<style lang='less' rel="stylesheet/less" scoped>
  .login-view{
    position: relative;
    height: 600px;
    margin-top:100px;
    background:url('../../assets/images/login-bg.jpg') no-repeat 100% 100%;
    .login-pain{
      position: relative;
      width: 1280px;
      height: 600px;
      margin:0 auto;
    }
    .login-img{
      position: absolute;
      left:0px;
      top:0px;
      width: 700px;
      height: 600px;
      background: url('../../assets/images/login/product.png') no-repeat 100% 100%;;
    }
    .login-box{
      position: absolute;
      right:100px;
      top:108px;
      /*width: 340px;*/
      width: 272px;
      /*height: 384px;*/
      height: 312px;
      padding: 36px 34px;
      border-top:2px solid #fb4b4d;
      background-color: rgba(255,255,255,.78);
      box-shadow: 0 0 8px #cdcfdc;
      .title{
        font-size: 24px;
      }
      .item-wrap{
        .item{
          position: relative;
          width: 270px;
          height: 38px;
          margin-top: 20px;
          line-height: 38px;
          border:1px solid #cccccc;
          border-radius: 2px;
          &:hover{
            border: 1px solid #4aafe9;
            .login-close{
              display: block;
            }
          }
          .sign{
            display: inline-block;
            width: 40px;
            height: 34px;
            line-height: 34px;
            text-align: center;
            /*vertical-align: middle;*/
            border-right:1px solid #bfbfbf;
            /*background-color: rgb(0,0,0);*/
            i{
              display: inline-block;
              vertical-align: middle;
              width: 16px;
              height: 16px;
              &.user{
                background:url('../../assets/images/icon/icon_user.png') no-repeat 100% 100%;
              }
              &.pwd{
                background:url('../../assets/images/icon/icon_pwd.png') no-repeat 100% 100%;
              }
              &.valid{
                background:url('../../assets/images/icon/icon_valid.png') no-repeat 100% 100%;
              }
            }

          }
          .login-close{
            display: none;
            position: absolute;
            top:13px;
            right:8px;
            color:#ddd;
          }
          input{
            width: 220px;
            height: 34px;
            border:none;
            text-indent: 10px;
            /*background-color: rgb(98,98,98);*/
          }
          img{
            width: 80px;
            height: 30px;
            margin-left: 18px;
            vertical-align: middle;
          }
          &.item-no-border{
            border: none;
          }
        }
        .small-item{
          display: inline-block;
          width: 170px;
          margin: 0;
          input{
            width: 128px;
          }
        }
      }
      .error{
        position: relative;
        width: 270px;
        height: 54px;
        line-height: 54px;
        font-size: 12px;
        color:#fb4b4d;
        overflow: hidden;
        .error-sign{
          position: absolute;
          top:19px;
          width: 16px;
          height: 16px;
          vertical-align: middle;
          border-radius: 50%;
          background: url('../../assets/images/icon/icon_error.jpg') no-repeat 100% 100%;
        }
        .error-msg{
          padding-left: 26px;
        }
        .f-r{
          float: right;
          color: #999999;
        }
      }
      .menu{
        width: 270px;
        height: 44px;
        button{
          width: 270px;
          line-height: 44px;
          color:#ffffff;
          font-size: 22px;
          letter-spacing: 10px;
          border:none;
          border-radius: 2px;
          background-color: #fb4b4d;
        }
      }
    }
  }
</style>

