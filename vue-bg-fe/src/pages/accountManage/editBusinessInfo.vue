<template>
  <div>
    <div class="title">
      <span>完善基本信息</span>
    </div>
    <div class="section" v-if="baseInfoReady">
      <div class="section-item">
        <div class="section-title">
          <span>结算账户信息（所有信息必填）</span>
        </div>

        <div class="block-item" v-for="item in configBaseInfo.sellerMain">
          <span class="section-item-sign">{{item.label}}：</span>
          <div class="inline-item">
            <el-input v-model="editBaseInfo.sellerMain[item.key]" :placeholder="item.placeholder" class="input-item-large" size="small"></el-input>
          </div>
        </div>

      </div>
      <div class="section-item">
        <div class="section-title">
          <span>对接人信息（标*为必填信息）</span>
        </div>
        <div class="result-view mg-t">
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
        <v-qual :qualificationList="qualificationList"></v-qual>
      </div>
      <section class="menu-center" >
        <el-button size="small" @click="submitInfo" type="primary">确认无误并提交</el-button>

      </section>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import vQual from '@/components/accountManage/qualification'

  export default {
    name:'editBusinessInfo',
    computed:{
      ...mapState(['sellerBaseInfo','sellerQualification'])
    },
    created(){
      this.initView()
    },
    data:() => ({
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
            placeholder:'字数限制50字'
          },
          {
            key:'receiveBank',
            label:'开户行',
            placeholder:'字数限制50字'
          },
          {
            key:'receiveName',
            label:'收款方名称',
            placeholder:'字数限制50字'
          },
          {
            key:'swiftCode',
            label:'银行国际代码',
            placeholder:'字数限制50字'
          },
          {
            key:'bankAddress',
            label:'银行地址',
            placeholder:'字数限制50字'
          }
        ],
        sellerContacts:[
          {
            label:'对接人类型',
            key:'type',
            type:'span',
            width:''
          },
          {
            label:'*姓名',
            key:'contactName',
            type:'input',
            width:'170'
          },
          {
            label:'*手机号',
            key:'contactPhone',
            type:'input',
            width:'170'
          },
          {
            label:'*QQ',
            key:'qq',
            type:'input',
            width:'170'
          },
          {
            label:'*邮箱',
            key:'email',
            type:'input',
            width:'170'
          },
          {
            label:'微信',
            key:'weixin',
            type:'input',
            width:'170'
          }
        ],
      },
      qualificationList:{},
    }),
    methods:{
      ...mapActions(['getSellerBaseInfo','saveSellerBaseInfo','callSetNotice','setEditWithMsg']),
      initView(){
        this.getSellerBaseInfo()
          .then((rs)=>{
            this.editBaseInfo = JSON.parse(JSON.stringify(rs))
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
                key:'foodCirculationImgs',
                list:this.editBaseInfo.foodCirculationImgs,
                limit:1,
                label:'食品流通许可证（副本）',
                success:'handleFoodCirculationSuccess',
                before:'beforeFoodCirculationUpload'
              },
              {
                key:'companyRegistrationImgs',
                list:this.editBaseInfo.companyRegistrationImgs,
                limit:5,
                label:'公司注册证明书',
                success:'handleCompanyRegistrationSuccess',
                before:'beforeCompanyRegistrationUpload'
              }
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
          if(!this.editBaseInfo.sellerMain[_Opt.key]){
            this.getNotice('请填写'+_Opt.label)
            return false
          }
          if(this.editBaseInfo.sellerMain[_Opt.key].length > 50){
            this.getNotice(_Opt.label+'字数小于50字')
            return false
          }
        }
        for(let i in this.editBaseInfo.sellerContacts){
          const _Opts = this.editBaseInfo.sellerContacts[i]
          delete _Opts.createTime
          delete _Opts.updateTime
          delete _Opts.remark
          if(!_Opts.contactName || !_Opts.contactPhone || !_Opts.qq || !_Opts.email || !_Opts.weixin){
              this.getNotice('请完善'+this.mapSellerContactType[_Opts.type]+'必填信息')
            return false
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
        this.saveSellerBaseInfo(this.editBaseInfo)
          .then(()=>{
            //提交成功后
          this.setEditWithMsg(true)
          this.$router.push({
            path: '/operate/condition',
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
</style>
