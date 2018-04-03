<template>
  <div>
    <div class="title">
      <span>商家信息</span>
    </div>
    <div class="section">
      <div class="section-item padding">
        <div class="section-title">
          <span>基本信息</span>
        </div>
        <div class="block-item primary-color">
          <span>基本信息非常重要，涉及商家打款事宜，如填错未告知修改，后期产生的损失由商家承担</span>
        </div>
        <div class="block-item">
          <span>商家名称：{{sellerInfo.realSellerName}}</span>
        </div>
        <div class="block-item">
          <span>商家ID：{{sellerInfo.id}}</span>
        </div>
        <div class="block-item">
          <span>公司名称：{{sellerInfo.companyName}}</span>
        </div>
        <div class="block-item">
          <span>店铺网址：{{sellerInfo.netAddress}}</span>
        </div>
        <div class="block-item" style="padding-bottom: 0;position: relative;overflow: hidden">
          <div class="section-item-sign-wrap" style="width: auto">
            <span>商家品牌：</span>
          </div>

          <div style="display: inline-block;width: 800px;">
            <template v-for="item in brandList">
              <span class="brand-item">{{item.name}}</span>
            </template>
          </div>


        </div>

        <div class="block-item">
          <span>应缴纳保证金金额：{{sellerInfo.depositPayable}}</span>
        </div>
        <div class="block-item">
          <span>保证金缴纳状态：
            <span v-if="sellerInfo.depositStatus == 0">未签协议</span>
            <span v-else-if="sellerInfo.depositStatus == 1">已签未缴纳</span>
            <span v-else-if="sellerInfo.depositStatus == 2">已缴纳{{sellerInfo.depositCount}}</span>
          </span>
        </div>
        <div class="block-item">
          <span>商家结算方式：{{mapProposalSubmitType[sellerInfo.proposalSubmitType]}}</span>
        </div>
        <div class="block-item">
          <span>结算周期：</span>
          <!--<span v-if="sellerInfo.settleType == 1">每月{{sellerInfo.settleDate}}号</span>-->
          <!--<span v-else-if="sellerInfo.settleType == 2">每月最后一天</span>-->
          <!--<span v-else-if="sellerInfo.settleType == 3">每月{{sellerInfo.settleDate}}号</span>-->
          <span v-if="sellerInfo.settleType == 0"></span>
          <span v-else>每月<span v-if="sellerInfo.settleDate"></span>{{sellerInfo.settleDate}}号</span>

        </div>
        <!--<div class="block-item">-->
          <!--<span>发货地管理：</span>-->
          <!--<el-button type="primary" @click="toDeliveryArea()" size="small">管理发货地</el-button>-->
        <!--</div>-->
        <!--<div class="block-item">-->
          <!--<span>发货地区限制：</span>-->
          <!--<el-button type="primary" @click="toDistributionTemplate()" size="small">管理配送模板</el-button>-->
        <!--</div>-->
        <div class="block-item">
          <span>收款账号：{{sellerInfo.receiveBankAccount}}</span>
        </div>
        <div class="block-item">
          <span>开户行：{{sellerInfo.receiveBank}}</span>
        </div>
        <div class="block-item">
          <span>收款方名称：{{sellerInfo.receiveName}}</span>
        </div>
        <div class="block-item">
          <span>银行国际代码：{{sellerInfo.swiftCode}}</span>
        </div>
        <div class="block-item">
          <span>银行地址：{{sellerInfo.bankAddress}}</span>
        </div>
        <div class="block-item">
          <span>公司地址：{{sellerInfo.companyAddress}}</span>
        </div>
        <div class="block-item">
          <span>发货类型：<span v-if="sellerInfo.sendTypeList && sellerInfo.sendTypeList.length">
            <template v-for="(item,key) in sellerInfo.sendTypeList">
              {{mapSendTypeList[item]}}<span v-if="key < sellerInfo.sendTypeList.length-1">,</span>
            </template>
          </span>
          </span>
        </div>
        <div class="block-item">
          <span>公司注册地：{{mapRegisterType[CRPlace]}}</span>
        </div>
        <div class="block-item">
          <span>{{CRPlace > 0 ? '公司注册证号：' :'营业执照编号：'}}{{sellerInfo.businessLicenseCode}}</span>
        </div>
      </div>
      <div class="section-item">
        <div class="section-title">
          <span>联系人信息</span>
        </div>
        <div class="result-view">
          <el-table v-if="sellerContactReady" :data="mapSellerContact" style="width: 100%;">
            <el-table-column prop="type"  label="联系人类型" width="120" align="center">
              <template slot-scope="scope">
                <!--<el-select v-if="contactChangeId == scope.row.changeId" v-model="configSaveContact.type" size="small" placeholder="选择联系人类型">-->
                  <!--<template v-for="subItem in contactTypeOptions">-->
                    <!--<el-option  :label="subItem.label" :value="subItem.value"></el-option>-->
                  <!--</template>-->
                <!--</el-select>-->
                <span>{{contactType[scope.row.type]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="contactName" label="*联系人" width="120" align="center">
              <template slot-scope="scope">
                <el-input v-if="contactChangeId == scope.row.changeId" v-model="configSaveContact.contactName" size="small" placeholder="填写联系人"></el-input>
                <span v-else>{{scope.row.contactName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="contactPhone" label="*联系人手机号" width="140" align="center">
              <template slot-scope="scope">
                <el-input v-if="contactChangeId == scope.row.changeId" v-model="configSaveContact.contactPhone" size="small" placeholder="填写手机号"></el-input>
                <span v-else>{{scope.row.contactPhone}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="qq" label="*联系人QQ" width="120" align="center">
              <template slot-scope="scope">
                <el-input v-if="contactChangeId == scope.row.changeId" v-model="configSaveContact.qq" size="small" placeholder="填写qq"></el-input>
                <span v-else>{{scope.row.qq}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="*联系人邮箱"width="180" align="center">
              <template slot-scope="scope">
                <el-input v-if="contactChangeId == scope.row.changeId" v-model="configSaveContact.email" size="small" placeholder="填写邮箱"></el-input>
                <span v-else>{{scope.row.email}}</span>
              </template>
            </el-table-column>
            <!--<el-table-column prop="aliwang" label="联系人旺旺号" width="120" align="center">-->
              <!--<template slot-scope="scope">-->
                <!--<el-input v-if="contactChangeId == scope.row.changeId" v-model="configSaveContact.aliwang" size="small" placeholder="填写旺旺"></el-input>-->
                <!--<span v-else>{{scope.row.aliwang}}</span>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column prop="remark" label="联系人微信" width="140" align="center">
              <template slot-scope="scope">
                <el-input v-if="contactChangeId == scope.row.changeId" v-model="configSaveContact.weixin" size="small" placeholder="填写微信"></el-input>
                <span v-else>{{scope.row.weixin}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作"  align="center">
              <template slot-scope="scope">
                <el-button v-if="contactChangeId == scope.row.changeId" type="primary" size="small" @click="saveContact()">保存</el-button>
                <el-button v-if="contactChangeId == scope.row.changeId" type="primary" size="small" @click="cancelChange()">取消</el-button>
                <el-button v-else type="primary" size="small" @click="changeContact(scope.row.changeId)">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="section-item">
        <div class="section-title o-h">
          <span>资质信息</span>
          <el-button class="fl-r" size="small" @click="callChangeList" type="primary">变更资质信息</el-button>
        </div>
        <div class="block-item" v-for="configItem in qualificationListShow">
          <template v-if="configItem.list && configItem.list.length">
            <template v-if="(configItem.key == 'businessImgs' && CRPlace < 1) || configItem.key == 'foodCirculationImgs' || (configItem.key == 'companyRegistrationImgs' && CRPlace >= 1)">
              <div class="section-item-sign-wrap">
                <span class="section-item-sign">{{configItem.label}}：</span>
              </div>
              <div  class="avatar-wrap" v-for="(item,idx) in configItem.list">
                <img :src="item.url" class="avatar">
                <div class="avatar-menu">
                  <i class="el-icon-search" @click="showImage(item.url)"></i>
                </div>
              </div>
            </template>

          </template>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="changeList.isShow" @close="cancelQualification" size="large">
      <div class="section">
        <div class="section-item">
          <v-qual :CRPlace="CRPlace" :qualificationList="qualificationList"></v-qual>
        </div>
        <div class="section-item" style="color: #fb4b4d">
          <!--<p>注：1、公司注册证明书为海外商家必填</p>-->
          <!--<p style="text-indent: 2rem">2、图片宽度620px，高度不限，jpg格式</p>-->
          <!--<p style="text-indent: 2rem">3、复印件加盖公司公章或扫描件即可，图片中公章不可为灰色</p>-->
          <!--<p style="text-indent: 2rem">4、重新上传图片后点击确定将重新提交审核</p>-->

          <p>注：1、图片宽度620px，高度不限，jpg格式</p>
          <p style="text-indent: 2rem">2、复印件加盖公司公章或扫描件即可，图片中公章不可为灰色</p>
          <p style="text-indent: 2rem">3、重新上传图片后点击确定将重新提交审核</p>
        </div>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button @click="cancelQualification">取 消</el-button>
        <el-button  type="primary" @click="submitQualification">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import vQual from '@/components/accountManage/qualification'
  import configReg from '../../assets/js/common/regExp-type'
  export default {
    name: 'businessInfo',
    created (){
      this.initView()
    },
    computed: {
      ...mapState(['sellerInfo','sellerContact','brandList','sellerQualification'])
    },
    data: () => ({
      mapRegisterType:{
        0:'大陆地区',
        1:'港澳台',
        2:'海外'
      },
      mapSendTypeList:{
        0:'一般贸易',
        1:'跨境直邮',
        2:'保税'
      },
      mapProposalSubmitType:{
        1:'正常结算',
        2:'扣点结算',
        3:'商品供货价+每单运费'
      },
      contactType:{
        1:'发货联系人',
        2:'售后联系人',
        3:'运营联系人',
        4:'结算联系人',
        5:'业务联系人'
      },
      sellerContactReady:false,
      configSaveContact:{
        id:'',
        type:'',
        contactName	:'',
        contactPhone:'',
        qq:'',
        email:'',
//        aliwang:'',
        weixin:''
      },
      mapSellerContact:{},
      contactChangeId:-1,
      contactTypeOptions:[
        {
          label:'发货联系人',
          value:1
        },
        {
          label:'售后联系人',
          value:2
        },
        {
          label:'运营联系人',
          value:3
        },
        {
          label:'结算联系人',
          value:4
        }
      ],
      qualificationList:[],
      qualificationListShow:[],
      changeList:{
        isShow:false
      },
      CRPlace:'',
      sellerInfoD:{
        registerType:0,
        sendTypeList:[0,1,2]
      },
      sellerImgList:{}
    }),
    methods: {
      ...mapActions(['getSellerContact','saveSellerContact','getSellerBrand','getSellerInfo','callSetNotice','getSellerImgList','saveSellerImgList','setViewImage','setSellerQualification']),
      initView() {
        if(!this.sellerInfo.sellerName){
          this.getSellerInfo()
            .then(() =>{
              this.CRPlace = this.sellerInfo.registerType
            })
        }
        if(!this.brandList.length){
          this.getSellerBrand()
        }
        this.callGetSellerContact()
        this.callGetSellerImgList()
      },
      callGetSellerImgList(){
        this.getSellerImgList()
          .then((rs)=>{
            this.sellerImgList = rs
            this.setSellerImgList()
          })
      },
      setSellerImgList(){
        this.qualificationList = [
          {
            key:'businessImgs',
            list:this.sellerImgList.businessImgs,
            limit:1,
            label:'营业执照（副本）',
            success:'handleBusinessSuccess',
            before:'beforeBusinessUpload'
          },
          {
            key:'companyRegistrationImgs',
            list:this.sellerImgList.companyRegistrationImgs,
            limit:5,
            label:'公司注册证明书',
            success:'handleCompanyRegistrationSuccess',
            before:'beforeCompanyRegistrationUpload'
          },
          {
            key:'foodCirculationImgs',
            list:this.sellerImgList.foodCirculationImgs,
            limit:1,
            label:'食品流通许可证（副本）',
            success:'handleFoodCirculationSuccess',
            before:'beforeFoodCirculationUpload'
          }
        ]
        this.qualificationListShow = JSON.parse(JSON.stringify(this.qualificationList))
      },
      callChangeList(){
        this.changeList.isShow = true
      },
      submitQualification(){
        let _mapQuali = {}
        this.qualificationListShow.map((item)=>{
          let _list = []
          if(item.list){
            item.list.map((subItem)=>{
              _list.push(subItem.url)
            })
            _mapQuali[item.key] = _list.sort()
          }
        })

        let _check = false
        for(let i in this.sellerQualification){
          let _item = []
          if(this.sellerQualification[i]){

            this.sellerQualification[i].map((subItem)=>{
              _item.push(subItem.url)
            })
            _item.sort()
            if(!_mapQuali[i]){
              _check = true
              break
            }
            if(_item.length != _mapQuali[i].length){
              _check = true
              break
            }
            if(JSON.stringify(_item) != JSON.stringify(_mapQuali[i])){
              _check = true
              break
            }
          }
        }
        if(_check){
          this.saveSellerImgList(this.sellerQualification)
            .then(()=>{
              this.cancelQualification()
              this.callGetSellerImgList()
            })
        } else {
          this.cancelQualification()
        }

      },
      cancelQualification(){
        this.changeList.isShow = false
        this.qualificationList = JSON.parse(JSON.stringify(this.qualificationListShow))
        let list = {
          businessImgs: this.qualificationList[0].list,
          foodCirculationImgs: this.qualificationList[1].list,
          companyRegistrationImgs: this.qualificationList[2].list,
        }
        this.setSellerQualification(list)
      },
      showImage(src) {
        const opts = {
          url:src,
          isShow:true
        }
        this.setViewImage(opts)
      },
      callGetSellerContact(){
        this.getSellerContact()
          .then(() =>{
            this.mapSellerContact = this.sellerContact
            for(let i in this.mapSellerContact){
              this.mapSellerContact[i].changeId = i;
            }
            this.sellerContactReady = true;
          })
      },
      changeContact(id) {
        this.configSaveContact.id=this.mapSellerContact[id].id
        this.configSaveContact.type=this.mapSellerContact[id].type
        this.configSaveContact.contactName=this.mapSellerContact[id].contactName
        this.configSaveContact.contactPhone=this.mapSellerContact[id].contactPhone
        this.configSaveContact.qq=this.mapSellerContact[id].qq
        this.configSaveContact.email=this.mapSellerContact[id].email
        this.configSaveContact.weixin=this.mapSellerContact[id].weixin
        this.contactChangeId = id
      },
      cancelChange() {
        this.contactChangeId = -1
      },
      saveContact() {
//        configSaveContact:{
//          sellerId:'',
//            contactType:'',
//            contactPerson	:'',
//            contactMobile:'',
//            qq:'',
//            email:'',
//            aliwang:'',
//            remark:''
//        },
        if(!this.configSaveContact.contactName){
          this.getNotice('请填联系人名称');
          return false
        }
        if(!this.configSaveContact.contactPhone){
          this.getNotice('请填联系人手机');
          return false
        }
        if(!this.configSaveContact.contactPhone.match(configReg.Tel)){
          this.getNotice('联系人手机格式不正确');
          return false
        }
        if(!this.configSaveContact.qq){
          this.getNotice('请填联系人QQ');
          return false
        }
        if(!this.configSaveContact.qq.match(configReg.Qq)){
          this.getNotice('联系人QQ不正确');
          return false
        }
        if(!this.configSaveContact.email){
          this.getNotice('请填联系人邮箱');
          return false
        }
        if(!this.configSaveContact.email.match(configReg.Email)){
          this.getNotice('联系人邮箱不正确');
          return false
        }
        this.saveSellerContact(this.configSaveContact)
          .then(()=>{
            this.cancelChange()
            this.callGetSellerContact()
          })
      },
      toDeliveryArea() {
        this.$router.push({
          path: '/delivery/area',
        })
      },
      toDistributionTemplate() {
        this.$router.push({
          path: '/distribution/template',
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
<style scoped lang='less' rel="stylesheet/less">
  .section-item{
    padding: 0;
    .brand-item{
      display: inline-block;
      padding: 0px 10px;
      margin-right: 10px;
      border-radius: 4px;
      /*color: #fff;*/
      /*background-color: #fb4b4d;*/
      border:1px solid #e0e0e0;
      margin-bottom: 10px;
    }
    .section-title{
      padding: 10px 20px;
    }
    &.padding{
      padding-left: 20px;
      .section-title{
        padding: 10px 0;
      }
    }
  }
  .section-item-sign-wrap{
    width: 180px;
    .section-item-sign{
      width: 180px;
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
