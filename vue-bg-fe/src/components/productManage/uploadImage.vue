<template>
  <div class="item-box">
    <template v-if="uploadConfig.imageConfig.isShow">
      <div class="sub-title-box mg-b">
        <span>商品主图</span>
        <slot name="sync-edit"></slot>
      </div>
      <div class="block-box c-dis c-tip">商品主图：必填，1-5张商品主图，分辨率640x640，文件小于400KB！</div>
      <div class="item-box">
        <template v-if="uploadConfig.imageConfig.editType == 1">
          <div class="avatar-wrap" v-for="(item,idx) in productUpload.images">
            <img :src="item.url" class="avatar">
            <div class="avatar-menu">
              <i class="el-icon-search" @click="showProductImage(item.url)"></i>
            </div>
          </div>
        </template>
        <v-drag v-if="uploadConfig.imageConfig.editType == 2" :list="productUpload.images" class="inline-box">
          <div class="avatar-wrap" v-for="(item,idx) in productUpload.images">
            <img :src="item.url" class="avatar">
            <div class="avatar-menu">
              <i class="el-icon-search" @click="showProductImage(item.url)"></i>
              <i class="el-icon-delete" @click="delProductImage(idx)"></i>
            </div>
          </div>
        </v-drag>
        <template v-if="uploadConfig.imageConfig.editType == 2 && productUpload.images.length < 5">
          <el-upload class="avatar-wrap avatar-uploader"  action="/sellerAdmin/pic/upload" :data="picUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </template>
      </div>
    </template>
    <template v-if="uploadConfig.detailConfig.isShow">
      <div class="sub-title-box mg-b">
        <span>商品详情</span>
        <slot name="sync-edit-detail"></slot>
      </div>
      <div class="block-box c-dis c-tip">商品详情：必填，图片宽度最小限制尺寸620！</div>
      <div class="detail-wrap" v-html="productUpload.detail" v-if="uploadConfig.detailConfig.editType == 1"></div>
      <quillEditor v-else  v-model="productUpload.detail" ref="myQuillEditor" :options="editorOption">
        <div id="toolbar" slot="toolbar">
          <!--<span class="ql-formats"><button type="button" class="ql-bold"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-italic"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-underline"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-strike"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-code-block"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-header" value="1"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-header" value="2"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-script" value="sub"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-script" value="super"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-indent" value="-1"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-indent" value="+1"></button></span>-->
          <!--<span class="ql-formats"> <button type="button" class="ql-direction" value="rtl"></button></span>-->
          <!--<span class="ql-formats">-->
            <!--<select class="ql-size">-->
              <!--<option value="small"></option>-->
              <!--<option selected=""></option>-->
              <!--<option value="large"></option>-->
              <!--<option value="huge"></option>-->
            <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats">-->
            <!--<select class="ql-header">-->
              <!--<option value="1"></option>-->
              <!--<option value="2"></option>-->
              <!--<option value="3"></option>-->
              <!--<option value="4"></option>-->
              <!--<option value="5"></option>-->
              <!--<option value="6"></option>-->
              <!--<option selected="selected"></option>-->
            <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats">-->
            <!--<select class="ql-color">-->
              <!--<option selected="selected"></option>-->
              <!--<option value="#e60000"></option>-->
              <!--<option value="#ff9900"></option>-->
              <!--<option value="#ffff00"></option>-->
              <!--<option value="#008a00"></option>-->
              <!--<option value="#0066cc"></option>-->
              <!--<option value="#9933ff"></option>-->
              <!--<option value="#ffffff"></option>-->
              <!--<option value="#facccc"></option>-->
              <!--<option value="#ffebcc"></option>-->
              <!--<option value="#ffffcc"></option>-->
              <!--<option value="#cce8cc"></option>-->
              <!--<option value="#cce0f5"></option>-->
              <!--<option value="#ebd6ff"></option>-->
              <!--<option value="#bbbbbb"></option>-->
              <!--<option value="#f06666"></option>-->
              <!--<option value="#ffc266"></option>-->
              <!--<option value="#ffff66"></option>-->
              <!--<option value="#66b966"></option>-->
              <!--<option value="#66a3e0"></option>-->
              <!--<option value="#c285ff"></option>-->
              <!--<option value="#888888"></option>-->
              <!--<option value="#a10000"></option>-->
              <!--<option value="#b26b00"></option>-->
              <!--<option value="#b2b200"></option>-->
              <!--<option value="#006100"></option>-->
              <!--<option value="#0047b2"></option>-->
              <!--<option value="#6b24b2"></option>-->
              <!--<option value="#444444"></option>-->
              <!--<option value="#5c0000"></option>-->
              <!--<option value="#663d00"></option>-->
              <!--<option value="#666600"></option>-->
              <!--<option value="#003700"></option>-->
              <!--<option value="#002966"></option>-->
              <!--<option value="#3d1466"></option>-->
            <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats">-->
            <!--<select class="ql-background">-->
              <!--<option value="#000000"></option>-->
              <!--<option value="#e60000"></option>-->
              <!--<option value="#ff9900"></option>-->
              <!--<option value="#ffff00"></option>-->
              <!--<option value="#008a00"></option>-->
              <!--<option value="#0066cc"></option>-->
              <!--<option value="#9933ff"></option>-->
              <!--<option selected="selected"></option>-->
              <!--<option value="#facccc"></option>-->
              <!--<option value="#ffebcc"></option>-->
              <!--<option value="#ffffcc"></option>-->
              <!--<option value="#cce8cc"></option>-->
              <!--<option value="#cce0f5"></option>-->
              <!--<option value="#ebd6ff"></option>-->
              <!--<option value="#bbbbbb"></option>-->
              <!--<option value="#f06666"></option>-->
              <!--<option value="#ffc266"></option>-->
              <!--<option value="#ffff66"></option>-->
              <!--<option value="#66b966"></option>-->
              <!--<option value="#66a3e0"></option>-->
              <!--<option value="#c285ff"></option>-->
              <!--<option value="#888888"></option>-->
              <!--<option value="#a10000"></option>-->
              <!--<option value="#b26b00"></option>-->
              <!--<option value="#b2b200"></option>-->
              <!--<option value="#006100"></option>-->
              <!--<option value="#0047b2"></option>-->
              <!--<option value="#6b24b2"></option>-->
              <!--<option value="#444444"></option>-->
              <!--<option value="#5c0000"></option>-->
              <!--<option value="#663d00"></option>-->
              <!--<option value="#666600"></option>-->
              <!--<option value="#003700"></option>-->
              <!--<option value="#002966"></option>-->
              <!--<option value="#3d1466"></option>-->
            <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats">-->
            <!--<select class="ql-font">-->
              <!--<option selected="selected"></option>-->
              <!--<option value="serif"></option>-->
              <!--<option value="monospace"></option>-->
            <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats">-->
            <!--<select class="ql-align">-->
              <!--<option selected="selected"></option>-->
              <!--<option value="center"></option>-->
              <!--<option value="right"></option>-->
              <!--<option value="justify"></option>-->
            <!--</select>-->
          <!--</span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-clean"></button></span>-->
          <!--<span class="ql-formats"><button type="button" class="ql-link"></button></span>-->
          <span class="ql-formats">
            <el-upload action="/sellerAdmin/pic/upload" :data="picUpload" :show-file-list="false" :on-success="handleDetailSuccess" :before-upload="beforeAvatarUploadDetail">
            <button type="button">
              <svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>
            </button>
          </el-upload>
          </span>

          <!--<span class="ql-formats"><button type="button" class="ql-video"></button></span>-->
        </div>
      </quillEditor>
    </template>
  </div>
</template>
<script>
  import vDrag from 'vuedraggable'
  import {quillEditor} from 'vue-quill-editor'
  import {mapActions,mapState} from 'vuex'
  export default {
    props:['uploadConfig'],
    data:()=>({
      constDetail:'', // 初始富文本
      editorOption: {
        modules: {
          toolbar: '#toolbar'
        }
      },
      editDetail:{
        isShow:false,
        content:''
      }, //弹窗修改
      picUpload:{
        picFile:null,
        getSize:1,
      }, //上传格式
    }),
    created(){
      this.initView()
    },
    computed:{
      ...mapState(['productUpload']),
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    methods: {
      ...mapActions(['setProductUpload','callSetNotice','setViewImage']),
      initView(){
        this.constDetail = this.productUpload.detail
      },
      callEditDetail(type){
         switch (type){
           case 1:
             this.callMessageBox('前台商品图片默认与后台商品保持一致，若单独上传前台商品，则后续后台商品有更新将不会同步。是否确认该前台商品需要单独上传商品图片？')
               .then(()=>{
                 this.editDetail.content = this.productUpload.detail
                 this.editDetail.isShow = true
               })

             break
           case 2:
             this.callMessageBox('该前台商品已开启自定义商品图片，若关闭自定义商品图片，则商品图片会立即更新为后台商品图片。是否确认该前台商品与后台商品的图片保持一致？')
               .then(()=>{
                 this.productUpload.detail = this.constDetail
                 this.editDetail.isShow = false
               })

         }

      },
      callMessageBox(msg){
        let _this = this
        return new Promise(function(resolve){
          _this.$confirm(msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            resolve()
          }).catch(()=>{

          })

        })

      },
      operaDetail(type){
        if(type == 1){
          this.productUpload.detail = this.editDetail.content
        }
        this.editDetail.content = ''
        this.editDetail.isShow = false
      },
      handleDetailSuccess(res){
//        console.log(res)
        if(res.status != 1){
          this.getToast(res.msg)
          return false
        }
         if(res.width < 620){
           this.getToast('商品详情图片尺寸宽度必须大于620');
           return false;
         }

        this.editor.focus();
//        console.log(this.editor.getSelection())
//        this.editor.insertEmbed(this.editor.getSelection().index, 'image', res.url);

        var range = this.editor.getSelection();
        var length = range.index;
        this.editor.insertEmbed(length, 'image', res.url);
        this.editor.setSelection(length+1)
      },
      handleAvatarSuccess(res, file) {
        if(res.status != 1){
          this.getToast('上传失败')
          return file
        }
        if(res.width != 640 || res.height != 640){
          this.getToast('图片限制640*640并且大小<=400k');
          return false;
        }

        let _opt = {
          id:'',
          url:res.url,
          width:res.width,
          height:res.height,
        }
        this.productUpload.images.push(_opt);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
        const isLt2M = file.size / 1024  < 401;
        if (!isJPG) {
          this.getToast('上传图片格式不正确');
        }
        if (!isLt2M) {
          this.getToast('上传图片大小不能超过 400KB!');
        }
        this.picUpload.picFile=file
        delete this.picUpload.width
        return isJPG && isLt2M;
      },
      beforeAvatarUploadDetail(file) {
        let _len = this.productUpload.detail.match(/<img src=/g) ? this.productUpload.detail.match(/<img src=/g).length : 0
        if(_len > 22){
          this.getToast('详情图上传不超过22张')
          return false
        }
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/gif';
        const isLt2M = file.size / 1024  < 401;
        if (!isJPG) {
           this.getToast('上传图片格式不正确');
         }
        if (!isLt2M) {
          this.getToast('上传图片大小不能超过 400KB!');
        }
        this.picUpload.picFile=file
        this.picUpload.width = '620'
        return isJPG && isLt2M;
      },
      delProductImage(idx) {
        this.productUpload.images.splice(idx,1)
      },
      showProductImage(src) {
        const opts = {
          url:src,
          isShow:true
        }
        this.setViewImage(opts)
      },
      getToast(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
    },
    components: {
      vDrag,
      quillEditor
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .avatar-wrap{
    position: relative;
    display: inline-block;
    width: 100px;
    height: 100px;
    margin-right: 5px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    .avatar {
      display: block;
      width: 100px;
      height: 100px;
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
    cursor: pointer;
    text-align: center;
    line-height: 100px;
    overflow: hidden;
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
    }

  }
  .block-box{
    padding: 10px 0;
  }
  /*.detail-wrap{*/
    /*width: 620px;*/
    /*max-height: 1240px;*/
    /*overflow-x:hidden;*/
    /*overflow-y:scroll;*/
  /*}*/
</style>
