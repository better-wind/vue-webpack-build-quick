<template>
  <div>
    <div class="block-item" v-for="configItem in qualificationList">
      <div class="section-item-sign-wrap">
        <span class="section-item-sign">{{configItem.label}}：</span>
      </div>

      <div class="avatar-wrap" v-for="(item,idx) in configItem.list">
        <img :src="item.url" class="avatar">
        <div class="avatar-menu">
          <i class="el-icon-search" @click="showImage(item.url)"></i>
          <i class="el-icon-delete" @click="delImage(idx,configItem.key)"></i>
        </div>
      </div>
      <template v-if="configItem.key == 'businessImgs' ">
        <el-upload v-if="!configItem.list || configItem.list.length < configItem.limit" class="avatar-uploader"  action="/sellerAdmin/pic/upload" :data="picUpload" :show-file-list="false" :on-success="handleBusinessSuccess" :before-upload="beforeUpload">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span class="mg-l disable-color">注：国内商家必填</span>
      </template>
      <template v-else-if="configItem.key == 'foodCirculationImgs'">
        <el-upload v-if="!configItem.list || configItem.list.length < configItem.limit" class="avatar-uploader"  action="/sellerAdmin/pic/upload" :data="picUpload" :show-file-list="false" :on-success="handleFoodCirculationSuccess" :before-upload="beforeUpload">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span class="mg-l disable-color">注：经营食品类商品必填，如无可上传营业执照或公司</span>
      </template>
      <template v-else-if="configItem.key == 'companyRegistrationImgs'">
        <el-upload v-if="!configItem.list || configItem.list.length < configItem.limit" class="avatar-uploader"  action="/sellerAdmin/pic/upload" :data="picUpload" :show-file-list="false" :on-success="handleCompanyRegistrationSuccess" :before-upload="beforeUpload">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </template>


    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    props:['qualificationList','radio'],
    created(){
      this.initView()
    },
    data:()=>({
      picUpload:{
        picFile:null,
        getSize:1
      },
    }),
    methods:{
      ...mapActions(['getNotice','setSellerQualification','setViewImage']),
      initView(){
        this.setList()
      },
      showImage(src) {
        const opts = {
          url:src,
          isShow:true
        }
        this.setViewImage(opts)
      },
      delImage(idx,key){
        for(let i in this.qualificationList){
          if(this.qualificationList[i].key == key){
            this.qualificationList[i].list.splice(idx,1)
            this.setList()
          }
        }
      },
      setList(){
        let list = {
          businessImgs: this.qualificationList[0].list,
          foodCirculationImgs: this.qualificationList[1].list,
          companyRegistrationImgs: this.qualificationList[2].list,
        }
        this.setSellerQualification(list)
//        console.log(list)
      },
      addImage(res,idx,type){
        if(res.status != 1){
          this.getNotice('图片上传失败');
          return false;
        }
        if(res.width != 620){
          this.getNotice('上传图片宽度620px');
          return false
        }
        let opt = {
          id:'',
          url:res.url,
          type:type,
          height:res.height,
          width:res.width
        }
        this.qualificationList[idx].list = this.qualificationList[idx].list || []
        this.qualificationList[idx].list.push(opt)
        this.setList()
      },
      beforeUpload(file) {
//        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024  <= 400;
        if (!isJPG) {
          this.getNotice('图片格式不正确');
        }
        if (!isLt2M) {
          this.getNotice('图片大小不能超过400KB!');
        }
        this.picUpload.picFile=file

        return isJPG && isLt2M;
      },
      handleBusinessSuccess(res, file) {
        this.addImage(res,0,1)
      },
      handleFoodCirculationSuccess(res, file) {
        this.addImage(res,1,2)
      },
      handleCompanyRegistrationSuccess(res, file) {
        this.addImage(res,2,3)
      },
      getNotice(msg){
        this.$alert(msg, '提示', {
          confirmButtonText: '确定',
          callback: () => {

          }
        });
//        const notice = {
//          isShow:true,
//          msg:msg,
//        }
//        this.callSetNotice(notice)
      },
    }
  }
</script>
<style lang='less' rel="stylesheet/less" scoped>
  .block-item{
    padding-bottom: 0;
    .section-item-sign-wrap{
      width: 180px;
      .section-item-sign{
        width: 180px;
      }
    }

    .inline-item{
      padding: 0;
    }
  }
  .avatar-wrap{
    display: inline-block;
    position: relative;
    width: 100px;
    height: 100px;
    margin-right: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    .avatar {
      width: 100px;
      height: 100px;
    }
    .close-img{
      position: absolute;
      top:0;
      right:0;
    }
    .avatar-menu{
      position: absolute;
      display: none;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
      top:0;
      right:0;
      background-color: rgba(0,0,0,.5);
      i{
        cursor: pointer;
        padding: 0 10px;
        font-size: 20px;
        color: #8c939d;
      }
    }
    &:hover{
      .avatar-menu{
        display: block;
      }
    }
  }
  .avatar-uploader{
    display: inline-block;
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    line-height: 100px;
    position: relative;
    overflow: hidden;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }

  }
</style>
