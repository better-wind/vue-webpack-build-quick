<template>
  <div class="main-container" v-if="alertBussMsg">
    <!--:close-on-press-escape="false"-->
    <el-dialog size="large" title="完善基本信息" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false" :visible.sync="baseInfoReady" @close="closeBaseInfo()">
      <div class="section" style="padding-bottom: 0" v-if="baseInfoReady">
        <div class="block-item mg-l primary-color"  v-if="editBaseInfo.businessImgs && editBaseInfo.businessImgs.length && editBaseInfo.businessImgs[0].auditReason">
          资质信息审核不通过原因:{{editBaseInfo.businessImgs[0].auditReason}}
        </div>
        <div class="section-item">
          <div class="section-title">
            <span>结算账户信息（所有信息必填）</span>
          </div>

          <div class="block-item" v-for="item in configBaseInfo.sellerMain">
            <span class="section-item-sign">{{item.label}}：</span>
            <div class="inline-item" >
                <el-input v-model="editBaseInfo.sellerMain[item.key]" :placeholder="item.placeholder" class="input-item-large" size="small"></el-input>
                <span class="mg-l disable-color" style="display: inline-block;width: 400px;float: right;margin-top: 5px" v-if="item.tip">{{item.tip}}</span>
              </div>
          </div>
          <div class="block-item">
            <span class="pd-l">注：开户行信息关系商家结款事宜，请务必确保信息正确，如不正确影响结款，由商家自行承担。</span>
          </div>

        </div>
        <div class="section-item">
          <div class="section-title">
            <span>联系人信息（标*为必填信息）</span>
          </div>
          <div class="result-view mg-t contact-view">
            <el-table :data="editBaseInfo.sellerContacts"  style="width: 100%">
              <template v-for="configItem in configBaseInfo.sellerContacts">
                <el-table-column :label="configItem.label" :width="configItem.width" align="center">
                  <template slot-scope="scope">
                    <div v-if="configItem.type == 'input'">
                      <el-input v-model="scope.row[configItem.key]" class="input-item-middle" size="small"></el-input>
                    </div>
                    <span v-else>
                   {{mapSellerContactType[scope.row[configItem.key]]}}
                 </span>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </div>
        </div>
        <div class="section-item">
          <div class="section-title">
            <span>资质信息（宽度620px，高度不限，jpg格式）</span>
          </div>
          <div class="block-item">
            <span class="section-item-sign" style="display: inline-block;width: 180px;text-align: right">发货类型：</span>
            <div class="inline-item" >
              <el-checkbox-group v-model="checkList">
                <el-checkbox :label=0>一般贸易</el-checkbox>
                <el-checkbox :label=1>跨境直邮</el-checkbox>
                <el-checkbox :label=2>保税</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="block-item">
            <span class="section-item-sign" style="display: inline-block;width: 180px;text-align: right">公司注册地：</span>
            <div class="inline-item" >
              <el-radio v-model="CRPlace" :label=0>大陆地区</el-radio>
              <el-radio v-model="CRPlace" :label=1>港澳台</el-radio>
              <el-radio v-model="CRPlace" :label=2>海外</el-radio>

            </div>
          </div>

          <div class="block-item">

            <span class="section-item-sign" style="display: inline-block;width: 180px;text-align: right">
              {{CRPlace > 0 ? '公司注册证号：' : '营业执照编号：'}}
            </span>
            <div class="inline-item" >
              <el-input v-model="editBaseInfo.sellerMain.businessLicenseCode" :placeholder="'请填写'+ (CRPlace > 0 ? '公司注册证号' : '营业执照编号')" class="input-item-large" size="small"></el-input>
              <!--<span class="mg-l disable-color" style="display: inline-block;width: 400px;float: right;margin-top: 5px" >注：国内公司填写营业执照统一社会信用代码或注册号，香港和海外公司填写公司注册号</span>-->
            </div>
          </div>
          <!--<div class="block-item mg-t">-->

            <!--<span class="section-item-sign" style="display: inline-block;width: 180px;text-align: right">营业执照编号：</span>-->
            <!--<div class="inline-item" >-->
              <!--<el-input v-model="editBaseInfo.sellerMain.businessLicenseCode" placeholder="请填写营业执照编号" class="input-item-large" size="small"></el-input>-->
              <!--&lt;!&ndash;<span class="mg-l disable-color" style="display: inline-block;width: 400px;float: right;margin-top: 5px" >注：国内公司填写营业执照统一社会信用代码或注册号，香港和海外公司填写公司注册号</span>&ndash;&gt;-->
            <!--</div>-->
          <!--</div>-->
          <v-qual :CRPlace="CRPlace" :qualificationList="qualificationList"></v-qual>
        </div>
        <div class="section-item" style="color: #fb4b4d">
          <!--<p>注：1、公司注册证明书为海外商家必填</p>-->
          <!--<p style="text-indent: 2rem">2、复印件加盖公司公章或扫描件即可，图片中公章不可为灰色</p> -->

          <p>注：1、复印件加盖公司公章或扫描件即可，图片中公章不可为灰色</p>
        </div>
        <section class="menu-center" >
          <el-button size="small" @click="submitInfo" type="primary">确认无误并提交</el-button>

        </section>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import vQual from '@/components/accountManage/qualification'
  import configReg from '../../assets/js/common/regExp-type'

  export default {
    name:'editBusinessInfo',
    computed:{
      ...mapState(['sellerQualification','alertBussMsg'])
    },
    created(){
      this.initView()
    },
    data:() => ({
      checkList:[],
      CRPlace:'',
      editBaseInfo:{},
      baseInfoReady:false,
      mapSellerContactType:{
        1:"发货联系人",
        2:"售后联系人",
        3:"运营联系人",
        4:"结算联系人",
        5:"业务对接人"
      },
      configBaseInfo:{
        sellerMain:[
          {
            key:'receiveBankAccount',
            label:'收款账号',
            placeholder:'字数限制50字',
            limit:50,
            req:true
          },
          {
            key:'receiveBank',
            label:'开户行',
            placeholder:'字数限制150字',
            limit:150,
            tip:'注：需写到支行',
            req:true
          },
          {
            key:'receiveName',
            label:'收款方名称',
            placeholder:'字数限制150字',
            limit:150,
            req:true
          },
          {
            key:'swiftCode',
            label:'银行国际代码',
            placeholder:'字数限制150字',
            limit:150,
            tip:'注：海外商家必需填写银行国际代码'
          },
          {
            key:'bankAddress',
            label:'银行地址',
            placeholder:'字数限制150字',
            limit:150,
            tip:'注：海外商家必需填写银行地址'
          },
          {
            key:'companyAddress',
            label:'公司地址',
            placeholder:'字数限制150字',
            limit:150,
            tip:'注：海外商家必需填写公司地址'
          },
//          {
//            key:'businessLicenseCode',
//            label:'营业执照编号',
//            placeholder:'请填写营业执照编号',
//            tip:'注：国内公司填写营业执照统一社会信用代码或注册号，香港和海外公司填写公司注册号',
//          }
        ],
        sellerContacts:[
          {
            label:'联系人类型',
            key:'type',
            type:'span',
            width:''
          },
          {
            label:'*姓名',
            key:'contactName',
            type:'input',
            width:'130'
          },
          {
            label:'*手机号',
            key:'contactPhone',
            type:'input',
            width:'130'
          },
          {
            label:'*QQ',
            key:'qq',
            type:'input',
            width:'130'
          },
          {
            label:'*邮箱',
            key:'email',
            type:'input',
            width:'130'
          },
          {
            label:'微信',
            key:'weixin',
            type:'input',
            width:'130'
          }
        ],
      },
      qualificationList:{},
      checkContact:[
        {
          key:'contactName',
          label:'姓名',
          required:true,
        },
        {
          key:'contactPhone',
          label:'手机号',
          required:true,
          reg:/^1(3|4|5|7|8)\d{9}$/g
        },
        {
          key:'qq',
          label:'QQ',
          required:true,
          reg:/^\d{6,}$/g
        },
        {
          key:'email',
          label:'邮箱',
          required:true,
          reg:/^(\w-*\.*)+@(\w-?)+(\.\w{2,4})+$/g
        },
      ],
    }),
    methods:{
      ...mapActions(['getSellerBaseInfo','saveSellerBaseInfo','callSetNotice','setEditWithMsg','setAlertBussMsg']),
      initView(){
        this.getSellerBaseInfo()
          .then((rs)=>{
//            this.$set('editBaseInfo',JSON.parse(JSON.stringify(this.sellerBaseInfo)))
            this.editBaseInfo = JSON.parse(JSON.stringify(rs))

            this.checkList = this.editBaseInfo.sellerMain.sendTypeList || []
            this.CRPlace = this.editBaseInfo.sellerMain.registerType
            this.qualificationList = [
              {
                key:'businessImgs',
                list:this.editBaseInfo.businessImgs,
                limit:1,
                label:'营业执照（副本）',
                success:'handleBusinessSuccess',
                before:'beforeBusinessUpload'

              },
              {
                key:'companyRegistrationImgs',
                list:this.editBaseInfo.companyRegistrationImgs,
                limit:5,
                label:'公司注册证明书',
                success:'handleCompanyRegistrationSuccess',
                before:'beforeCompanyRegistrationUpload'
              },
              {
                key:'foodCirculationImgs',
                list:this.editBaseInfo.foodCirculationImgs,
                limit:1,
                label:'食品流通许可证（副本）',
                success:'handleFoodCirculationSuccess',
                before:'beforeFoodCirculationUpload'
              },
            ]
            this.baseInfoReady = true;
          })
      },
      submitInfo(){
        this.editBaseInfo.businessImgs = this.sellerQualification.businessImgs
        this.editBaseInfo.foodCirculationImgs = this.sellerQualification.foodCirculationImgs
        this.editBaseInfo.companyRegistrationImgs = this.sellerQualification.companyRegistrationImgs
        for(let i in this.configBaseInfo.sellerMain){
          const _Opt = this.configBaseInfo.sellerMain[i]
          if(!this.editBaseInfo.sellerMain[_Opt.key] && _Opt.req){
            this.getNotice('请填写'+_Opt.label)
            return false
          }
          if(this.editBaseInfo.sellerMain[_Opt.key].length > _Opt.limit){
            this.getNotice(_Opt.label+'字数小于'+_Opt.limit+'字')
            return false
          }
        }
        for(let i in this.editBaseInfo.sellerContacts){
          const _Opts = this.editBaseInfo.sellerContacts[i]
          delete _Opts.createTime
          delete _Opts.updateTime
          delete _Opts.remark
          for(let j in this.checkContact){
            let item = this.checkContact[j]
            if(item.required && !_Opts[item.key]){
              this.getNotice('请完善'+this.mapSellerContactType[_Opts.type]+item.label)
              return false
            }

            if(item.reg && !_Opts[item.key].match(item.reg)){
              this.getNotice(this.mapSellerContactType[_Opts.type]+item.label+'格式错误')
              return false
            }
          }
        }
//        console.log(this.editBaseInfo)
//        this.editBaseInfo.sellerContacts = []
//        const info = {}
//        info.receiveBankAccount = this.editBaseInfo.sellerMain.receiveBankAccount
//        info.receiveBank = this.editBaseInfo.sellerMain.receiveBank
//        info.receiveName = this.editBaseInfo.sellerMain.receiveName
//        info.swiftCode = this.editBaseInfo.sellerMain.swiftCode
//        info.bankAddress = this.editBaseInfo.sellerMain.bankAddress
//        this.editBaseInfo.sellerMain = info
//        return false
        if(!this.checkList.length){
          this.getNotice('请选择发货类型')
          return false
        }
        if(Object.prototype.toString.call(this.CRPlace) == '[object Null]'){
          this.getNotice('请选择公司注册地')
          return false
        }
        if(!this.editBaseInfo.sellerMain.businessLicenseCode){
          this.getNotice('请填写'+ (this.CRPlace > 0 ? '公司注册证号' : '营业执照编号'))
          return false
        }
        this.editBaseInfo.sellerMain.sendTypeList = this.checkList
        this.editBaseInfo.sellerMain.registerType = this.CRPlace
        this.saveSellerBaseInfo(this.editBaseInfo)
          .then(()=>{
            //提交成功后
          this.closeBaseInfo()
//          this.$router.push({
//            path: '/operateCondition',
//          })
        })
      },
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
      closeBaseInfo(){
        this.setAlertBussMsg(false)
      },
    },
    components: {
      vQual
    }
  }
</script>
<style lang='less' rel="stylesheet/less" scoped>
  .block-item{
    padding-bottom: 0;
    .inline-item{
      padding: 0;
    }
  }
  .contact-view{
    .input-item-middle{
      width: 120px;
    }
  }

</style>
