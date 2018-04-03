<template>
  <div>
    <div class="title">
      <span>报备超时发货</span>
    </div>
    <div class="section">
      <div class="section-item">
        <div class="block-item">
          <span class="section-item-sign">
              <span  class="sign-required">*</span>报备类型：
          </span>
          <div class="inline-item">
            <el-radio class="radio" v-model="applyOpts.applyType" label="1">申请延长发货时效(未产生订单)</el-radio>
            <el-radio class="radio" v-model="applyOpts.applyType" label="2">报备已产生订单异常情况(仅能报备未发货订单)</el-radio>
          </div>
        </div>
        <template v-if="applyOpts.applyType == 1">
          <div class="block-item">
            <span class="section-item-sign">
              <span  class="sign-required">*</span>发货地：
            </span>
            <div class="inline-item">
              <el-select @change="selectLevel()" v-model="applyOpts.sellerId" placeholder="请选择" class="input-item-middle" size="small" >
                <template v-for="optionItem in deliverySelectList">
                  <el-option  :label="optionItem.label" :value="optionItem.value"></el-option>
                </template>
              </el-select>
            </div>
          </div>
          <div class="block-item">
            <span class="section-item-sign">
              <span  class="sign-required">*</span>付款开始时间：
            </span>
            <div class="inline-item">
              <!--format="yyyy-MM-dd HH:00:00"-->
              <el-date-picker :picker-options="pickerOptions" type="datetime" class="input-item-middle" size="small" v-model="applyOpts.startTime" placeholder="请选择" @change="checkDate('startTime','endTime',applyOpts.startTime,applyOpts.endTime)" ></el-date-picker>
            </div>
          </div>
          <div class="block-item">
            <span class="section-item-sign">
              <span  class="sign-required">*</span>付款结束时间：
            </span>
            <div class="inline-item">
              <el-date-picker :picker-options="pickerOptions" type="datetime" class="input-item-middle" size="small" v-model="applyOpts.endTime" placeholder="请选择" @change="checkDate('endTime','endTime',applyOpts.startTime,applyOpts.endTime)" ></el-date-picker>
            </div>
          </div>
          <div class="block-item">
            <div class="section-item-sign-wrap">
              <span class="section-item-sign">
                <span  class="sign-required l-h-30">*</span>申请类型：
              </span>
            </div>
            <div class="inline-item">
              <el-radio class="radio l-h-30" v-model="applyOpts.extendType" label="1">承诺时间点</el-radio>
              <template v-if="applyOpts.extendType == 1">
                <span>预计完成发货时间：</span>
                <el-date-picker  :picker-options="pickerOptions" type="datetime" class="input-item-middle" size="small" v-model="applyOpts.extendValue" placeholder="请选择" @change="checkDate('extendValue','extendValue',applyOpts.startTime,applyOpts.extendValue)" ></el-date-picker>
              </template>
              <br />
              <el-radio class="radio" v-model="applyOpts.extendType" label="2">延长揽件时效</el-radio>
              <template v-if="applyOpts.extendType == 2">
                <span>付款当天剩余时间+ {{extendValueShippingValid}}天揽件时效  +</span>
                <el-input class="input-item"  v-model="applyOpts.extendValue" size="small"></el-input>
                <span>天揽件时效</span>
              </template>
            </div>
          </div>
          <div class="block-item">
            <div class="section-item-sign-wrap">
              <span class="section-item-sign">
                  <span  class="sign-required">*</span>申请原因：
              </span>
            </div>
            <div class="inline-item">
              <el-input  :rows="6" resize="none"  v-model="applyOpts.reason" placeholder="请输入申请原因" type="textarea"  class="area-item-large" size="small"></el-input>
            </div>
          </div>
          <div class="block-item">
            <div class="section-item-sign-wrap">
              <span class="section-item-sign">
              附件：
            </span>
            </div>
            <div class="inline-item">
              <el-upload  ref="imgUpload" :show-file-list="false" action="/sellerAdmin/pic/upload"  :before-upload="beforeUpload">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <ul v-if="uploadFileList.isShow" class="el-upload-list el-upload-list--text">
                <li class="el-upload-list__item is-ready">
                  <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{uploadFileList.name}}</a>
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template v-else-if="applyOpts.applyType == 2">
          <!--<div class="block-item">-->
            <!--<span class="section-item-sign">-->
              <!--<span  class="sign-required">*</span>发货地：-->
            <!--</span>-->
            <!--<div class="inline-item">-->
              <!--<el-select @change="selectLevel()" v-model="applyOpts.sellerId" placeholder="请选择" class="input-item-middle" size="small" >-->
                <!--<template v-for="optionItem in deliverySelectList">-->
                  <!--<el-option  :label="optionItem.label" :value="optionItem.value"></el-option>-->
                <!--</template>-->
              <!--</el-select>-->
            <!--</div>-->
          <!--</div>-->
          <div class="block-item">
            <div class="section-item-sign-wrap">
              <span class="section-item-sign">
                <span  class="sign-required l-h-30">*</span>申请类型：
              </span>
            </div>
            <div class="inline-item">
              <el-radio class="radio l-h-30" v-model="applyOpts.extendType" label="1">承诺时间点</el-radio>
              <template v-if="applyOpts.extendType == 1">
                <span>预计发货完成时间：</span>
                <el-date-picker  :picker-options="pickerOptions" type="datetime" class="input-item-middle" size="small" v-model="applyOpts.extendValue" placeholder="请选择" @change="checkDate('extendValue','','','')" ></el-date-picker>
              </template>
              <br />
              <el-radio class="radio" v-model="applyOpts.extendType" label="2">+</el-radio>
              <el-input class="input-item" v-if="applyOpts.extendType == 2" v-model="applyOpts.extendValue" size="small"></el-input>
              <el-input class="input-item" v-else disabled size="small"></el-input>

              <span>天揽件时效</span>
              <!--<template v-if="applyOpts.extendType == 2">-->
                <!--<span>付款当天剩余时间+ {{extendValueShippingValid}}天揽件时效  +</span>-->
                <!--<el-input class="input-item"  v-model="applyOpts.extendValue" size="small"></el-input>-->
                <!--<span>天揽件时效</span>-->
              <!--</template>-->
              <br />
              <el-radio class="radio" v-model="applyOpts.extendType" label="3">无法发货</el-radio>
            </div>
          </div>
          <div class="block-item">
            <span class="section-item-sign">
              <span  class="sign-required">*</span>申请原因：
            </span>
            <div class="inline-item">
              <el-radio class="radio" v-model="radioReason" label="1">缺货</el-radio>
              <!--<el-radio class="radio" v-model="radioReason" label="2">清关异常</el-radio>-->
              <el-radio class="radio" v-model="radioReason" label="3">其他</el-radio>
              <el-input v-if="radioReason == 3" class="input-item-middle"  v-model="applyOpts.reason" size="small"></el-input>

            </div>
          </div>
          <div class="block-item">
            <div class="section-item-sign-wrap">
              <span class="section-item-sign">
                <span  class="sign-required">*</span>附件：
              </span>
            </div>
            <div class="inline-item" style="position: relative">
              <el-button class="down-btn" size="small" type="primary" @click="callDownApplyTemplate()">下载模板</el-button>
              <el-upload ref="xmlUpload" :show-file-list="false" style="display: inline-block;width: 500px;" action="/sellerAdmin/pic/upload"  :before-upload="beforeDownUpload">
                <el-button size="small" type="primary">上传</el-button>
              </el-upload>
              <ul v-if="uploadFileList.isShow" class="el-upload-list el-upload-list--text">
                <li class="el-upload-list__item is-ready">
                  <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{uploadFileList.name}}</a>
                </li>
              </ul>
            </div>
          </div>
        </template>

      </div>
      <div class="menu" style="text-align: center">
        <el-button type="primary" @click="submitApply()">提交</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
//  import Util from '../../assets/js/common/utils'
  export default {
    name: '',
    created (){
      this.initView()
    },
    computed: {

      ...mapState(['deliveryList'])
    },
    data: () => ({
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      applyOpts:{
        file:null,
        applyType:'1',
        sellerId:'',
        startTime:'',
        endTime:'',
        extendType:'',
        extendValue:'',
        reason:'',
      },
      picUpload:{
        picFile:null,
        getSize:1
      },
      uploadFileList:{
        isShow:false,
        name:''
      },
      deliverySelectList:[],
      disabled:true,
      radioReason:'',
      mapRadioReason:{
        "1":'缺货',
        "2":'清关异常',
        "3":''
      },
      showFileList:false,
      mapShippingValid:{},
      extendValueShippingValid:'0',
    }),
    methods: {
      ...mapActions(['getDeliveryArea','callSetNotice','downApplyTemplate','addOrderExtendApply']),
      initView(){
        this.getDeliveryArea()
            .then((rs)=>{
              this.setDeliveryListOpt(rs)
        })
      },
      setDeliveryListOpt(rs){
        let opts = [];
        let mapShippingValid = {}
        rs.forEach((item,idx)=>{
          const opt = {
            label:item.sendAddress,
            value:item.id
          }
          mapShippingValid[item.id] = item.shippingValid
          opts.push(opt)
        })
        this.deliverySelectList = opts
        this.mapShippingValid = mapShippingValid
      },
      selectLevel(){
        this.extendValueShippingValid = this.mapShippingValid[this.applyOpts.sellerId]
      },
      checkDate(key,nextkey,pre,cur){
        if(key == 'startTime' && this.applyOpts[key]){
          const startTime =  this.applyOpts[key].getTime()
          const nowTime = new Date().getTime() + 3600000
          if(startTime < nowTime){
            this.getNotice('开始时间大于当前时间1小时');
            this.applyOpts[key] = ''
            return false
          }
        }
        this.applyOpts[key] = Util.formatDate('yyyy-mm-dd hh:mm:ss',this.applyOpts[key])
        if(pre && cur){
          pre = Util.formatDate('yyyy-mm-dd hh:mm:ss',pre)
          cur = Util.formatDate('yyyy-mm-dd hh:mm:ss',cur)
          if(Util.formatDateCom(pre,cur)){
            this.applyOpts[nextkey] = ''
          }
        }
      },
      beforeDownUpload(file){
        const isXML = file.type === 'application/vnd.ms-excel';
        const sType = file.name.split('.').pop()
//        console.log(sType)
//        console.log(sType)
//        if (!isXML) {
//          this.getNotice('上传文件格式不正确');
//          this.$refs.xmlUpload.clearFiles()
//          return false
//        }
        let typeOpt = {
          xls:'xls',
          xlsx:'xlsx',
        }
        if(!typeOpt[sType]) {
          this.getNotice('上传文件格式不正确');
          return false
        }
        this.applyOpts.file = file
        this.uploadFileList.isShow = true
        this.uploadFileList.name = file.name
        return false
      },
      beforeUpload(file){
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024  < 400;
        if (!isJPG) {
          this.getNotice('上传图片格式不正确');
//          this.$refs.imgUpload.clearFiles()
          return false
        }
        if (!isLt2M) {
          this.getNotice('上传头像图片大小不能超过 400KB!');
//          this.$refs.imgUpload.clearFiles()
          return false
        }
        if(isJPG && isLt2M){
          this.applyOpts.file = file
          this.uploadFileList.isShow = true
          this.uploadFileList.name = file.name
        }
        return false
//        this.$refs.imgUpload.clearFiles()
//        this.applyOpts.file = file
//        return false;
      },
      callDownApplyTemplate(){
          this.downApplyTemplate()
      },
      submitApply(){
        const res = /^[1-9]{1}[0-9]*$/g;
            if(this.applyOpts.applyType == 1 && !this.applyOpts.sellerId){
              this.getNotice('请选择发货地')
              return false
            }
            if(!this.applyOpts.reason){
              this.getNotice('请填写原因')
              return false
            }
            if(this.applyOpts.applyType == 1 && this.applyOpts.reason.length > 100){
              this.getNotice('申诉原因长度小于100字')
              return false
            }
            if(this.applyOpts.applyType == 2 && this.applyOpts.reason.length > 20){
              this.getNotice('申诉原因长度小于20字')
              return false
            }
            if(!this.applyOpts.extendType){
              this.getNotice('请选择类型')
              return false
            }
            if(!this.applyOpts.extendValue && this.applyOpts.extendType == 1 ){
              this.getNotice('请填写承诺时间点')
              return false
            }
            if(!this.applyOpts.extendValue && this.applyOpts.extendType == 2){
              this.getNotice('请填写延长揽件时效')
              return false
            }
            if(!this.applyOpts.extendValue.match(res) && this.applyOpts.extendType == 2){
              this.getNotice('延长揽件时效请输入整数')
              return false
            }
            if(this.applyOpts.applyType == 1){
              if(!this.applyOpts.startTime){
                this.getNotice('请选择开始时间')
                return false
              }
              if(!this.applyOpts.endTime){
                this.getNotice('请选择结束时间')
                return false
          }
        }
        else if(this.applyOpts.applyType == 2){
          if(!this.applyOpts.file){
            this.getNotice('请选择附件')
            return false
          }
        }
//        if(this.applyOpts.extendType == 2){
//          this.applyOpts.extendValue = Number(this.applyOpts.extendValue) + Number(this.extendValueShippingValid)
//        }
//        for(let i in this.applyOpts){
//            console.log(i,typeof this.applyOpts[i],this.applyOpts[i])
//        }
//        return false
        this.addOrderExtendApply(this.applyOpts)
          .then(()=>{
            this.$router.push({
              path: '/order/timeout/record',
            })
        })
      },
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
    },
    watch: {
      'applyOpts.extendType': function(newVal,oldVal){
//        if(newVal == 2){
//          this.applyOpts.extendValue = this.extendValueShippingValid
//        }  else {
          this.applyOpts.extendValue = ''
//        }
      },
      'extendValueShippingValid': function(newVal,oldVal){
          if(this.applyOpts.extendType == 2){
//            this.applyOpts.extendValue = this.extendValueShippingValid
          }
      },
      'applyOpts.applyType': function(newVal,oldVal){
        this.applyOpts.extendValue = ''
        this.applyOpts.extendType = ''
        this.applyOpts.reason = ''
        this.applyOpts.sellerId = ''
        this.applyOpts.startTime = ''
        this.applyOpts.endTime = ''
        this.extendValueShippingValid = ''
        this.applyOpts.file = null
        this.uploadFileList.isShow = false
        this.uploadFileList.name = ''
      },
      'radioReason':function(newVal,oldVal){
        this.applyOpts.reason = this.mapRadioReason[newVal]
      },

    }
  }
</script>
<style lang='less' rel="stylesheet/less" scoped>
  .section-item-sign-wrap{
    margin-top: 8px;
  }
  .l-h-30{
    line-height: 30px;
  }
  .inline-item{
    padding-left: 20px;
    width: 600px;
    .input-item-middle{
      width: 180px;
    }
  }
  .section-item-sign-wrap,.section-item-sign{
    width: 120px;
  }
  /*.down-btn{*/
    /*position: absolute;*/
    /*top:10px;*/
    /*left:60px;*/
  /*}*/


</style>
