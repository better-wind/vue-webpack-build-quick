<template>
    <div :class="config.type == 'Home' ? 'top-container' : ( config.type == 'Ware' ? 'top-container top-container-no-width' : 'top-container home-bg' )">
      <div class="top-inner">
          <div class="header-item logo-item">
            <!--<img v-if="config.type == 'Home'" src="../../assets/images/icon/logo.png" />-->
            <img src="../../assets/images/icon/icon_logo.png" />
          </div>
          <div class="header-item">
            <span class="header-name">商家后台</span>
          </div>
          <div v-if="isTest" class="header-item">
            <p style="margin-left:30px;font-size: 18px;">新版商家后台
              <el-switch
                v-model="useNewGoods"
                on-color="#13ce66"
                off-color="#ff4949"
              @change="changeNewGoods">
              </el-switch>
            </p>
          </div>
          <template v-if="config.menu">
            <div class="header-item fl-r">
              <el-dropdown >
                <span class="el-dropdown-link header-menu-font"><i class="header-icon user"></i>{{loginCheck.username}}<i class="el-icon-caret-bottom el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                  <template v-for="item in loginCheck.functionList">
                    <!--<el-dropdown-item v-if="item.id == 7">-->
                      <!--<router-link tag="span" to="/businessInfo">基本信息</router-link>-->
                    <!--</el-dropdown-item>-->
                    <el-dropdown-item v-if="item.functionName == '账户与权限'">
                      <router-link tag="span" to="/authority">账户与权限</router-link>
                    </el-dropdown-item>
                  </template>
                  <el-dropdown-item>
                    <div @click="callOutLogin()">
                      <span>退出</span>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="header-item fl-r">
              <router-link tag="span" to="/message/center" class="header-menu-font"><i class="header-icon msg"></i>消息中心</router-link>
            </div>
            <div class="header-item fl-r">
              <router-link tag="span" to="/rules/center" class="header-menu-font"><i class="header-icon rule"></i>规则中心</router-link>
            </div>
            <div class="header-item fl-r">
              <a href="/static/file/商家后台使用说明手册.docx" class="header-menu-font cur-pt"><i class="header-icon rule"></i>操作手册</a>
            </div>
          </template>


        </div>
    </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default{
    name: 'Header',
    props: ['config'],
    computed: {
      ...mapState(['loginCheck','newGoods'])
    },
    data:()=>({
      useNewGoods:true,
      isTest:false
    }),
    created(){
       this.useNewGoods = this.newGoods
    },
    methods: {
      ...mapActions(['outLogin','setEditWithMsg','checkVersion']),
      callOutLogin(){
          this.outLogin()
            .then(()=>{
              this.setEditWithMsg(false)
              this.$router.push({
                path: '/login',
              })
            })
      },
      changeNewGoods(tag){
          this.checkVersion(tag)
          this.$router.push({
              path:'/operateCondition'
          })
      }
    }
  }
</script>
<style lang='less' rel="stylesheet/less">
  .top-container {
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100px;
    z-index: 3002;
    border-bottom:2px solid  #fb4b4d;
    background-color: rgb(255,255,255);
    &.home-bg{
      border-bottom:none
    }
    .top-inner {
      width: 1280px;
      height: 100px;
      margin: 0 auto;
      box-sizing: border-box;
      overflow: hidden;
      .header-item{
        display: inline-block;
        line-height: 100px;
        >span{
          cursor: pointer;
        }
        &.logo-item{
          padding-left: 20px;
        }
        &.fl-r{
          margin-right: 24px;
        }
        .header-icon{
          display: inline-block;
          width: 22px;
          height: 22px;
          margin-right: 4px;
          vertical-align: middle;
          &.user{
            background:url('../../assets/images/icon/icon_header_user.png') no-repeat 100% 100%;
          }
          &.msg{
            background:url('../../assets/images/icon/icon_header_msg.png') no-repeat 100% 100%;
          }
          &.rule{
            background:url('../../assets/images/icon/icon_header_rule.png') no-repeat 100% 100%;
          }
          >span{
            cursor: pointer;
          }
        }
        >img{
          width: 80px;
          height: 60px;
          vertical-align: middle;
        }
        .header-name{
          display: inline-block;
          height: 44px;
          line-height: 44px;
          margin-left: 30px;
          padding-left: 20px;
          border-left:1px solid rgb(224,224,224);
          font-size: 30px;
          color: rgb(102,102,102);
        }
        .header-menu-font{
          color: #999999;
        }
        .el-dropdown {
          height: 44px;
          line-height: 44px;
          margin-right: 20px;
          .el-dropdown-link{
            display: inline-block;
            line-height: 44px;
            cursor: pointer;
          }
        }
      }
    }
    &.top-container-no-width{
      .top-inner{
        width: 100%;
        padding-left: 20px;
      }
    }
  }
</style>
