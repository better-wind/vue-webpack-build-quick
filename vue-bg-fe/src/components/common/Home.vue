<template>
  <div v-if="isReady" id="operateCondition" class="main-panel">
    <v-head :config="config" />
    <div class="control-panel">
        <v-left-nav />
        <div class="main-container panel-item">
          <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
      </div>
    <v-load />
    <v-notice />
    <v-toast />
    <v-alert-msg v-if="!editBussWithMsg"/>
    <v-edit-info v-if="editBussWithMsg"/>
    <v-view-image />
  </div>
</template>
<script>
  import vLeftNav from '@/components/common/LeftNav'
  import vHead from '@/components/common/Header'
  import vLoad from '@/components/tools/Loading'
  import vNotice from '@/components/tools/Notice'
  import vToast from '@/components/tools/Toast'
  import vAlertMsg from '@/components/messageCenter/alertMsg'
  import vEditInfo from '@/components/accountManage/editBusinessInfo'
  import vViewImage from '@/components/tools/ViewImage'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'HOME',
    components: {
      vLeftNav,
      vHead,
      vLoad,
      vNotice,
      vToast,
      vAlertMsg,
      vEditInfo,
      vViewImage
    },
    data:()=>({
      isReady:false,
      config:{
         type:'Home',
         menu:true
      },
    }),
    created (){
      this.initView()
    },
    computed: {
      ...mapState(['loginCheck','editBussWithMsg'])
    },
    methods: {
      ...mapActions(['getLoginCheck','setEditWithMsg']),
      initView() {
        this.getLoginCheck()
          .then(() =>{
            this.loginCheck.functionList.sort((a,b)=> a.id - b.id)
            this.isReady = true
          })
      },
    }
  }
</script>
<style lang='less' rel="stylesheet/less">
  .over-height{
    min-height: 880px;
    margin-bottom:-10000px;
    padding-bottom:10000px;
  }
  .main-panel{
    width: 1280px;
    margin:0 auto;
    .control-panel{
      position: relative;
      margin: 100px auto 0;
      overflow: hidden;
      .panel-item{
        box-sizing: border-box;
        &:extend(.over-height);
        min-height: 880px;
        background-color: #fff;
        >div{
          min-height: 880px;
        }
      }
      .left-bav{
        float: left;
        width: 180px;
        min-height: 880px;
        .el-menu-vertical{
          position: fixed;
          top:100px;
          left:50%;
          width: 180px;
          min-height: 880px;
          margin-left:-640px;
        }
        @media screen and (max-width: 1280px) {
          .el-menu-vertical{
            left:0;
            margin-left:0px;
            z-index: 10;
          }
        }
      }
      .main-container {
        float: left;
        margin-left: 10px;
        width: 1070px;
        padding: 0 0 10000px 0px;
      }
    }

  }
</style>
