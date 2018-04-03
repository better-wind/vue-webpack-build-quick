<template>
  <div>
    <div class="title">
      <span>商家入仓</span>
    </div>
    <div class="section">
      <div class="section-item section-item-title">
        <span>请确认商家信息真实准确</span>
      </div>
      <div class="section-item">
        <template v-for="item in configOpts">
          <div class="block-item" v-if="item.type == 'input'">
            <span class="section-item-sign">{{item.label}}：</span>
            <div class="inline-item">
              <el-input :placeholder="item.placeholder" v-model="applyOpts[item.key]" size="small" class="input-item-large"></el-input>
            </div>
          </div>
          <div class="block-item" v-if="item.type == 'brand'" style="padding-bottom: 0;position: relative;overflow: hidden">
            <div class="section-item-sign-wrap" style="width: auto">
              <span class="section-item-sign">{{item.label}}：</span>
            </div>
            <div class="inline-item" style="width: 800px">
              <template v-for="item in brandList">
                <span class="brand-item">{{item.name}}</span>
              </template>
            </div>
          </div>
          <div class="block-item" v-if="item.type == 'list-input'">
            <span class="section-item-sign">{{item.label}}：</span>
            <div class="inline-item">
              <template v-for="subItem in item.items">
                <span>{{subItem.label}}:</span> <el-input :placeholder="subItem.placeholder" v-model="applyOpts[subItem.key]" size="small" class="input-item-middle mg-r"></el-input>
              </template>
            </div>
          </div>
          <div class="block-item" v-if="item.type == 'select'">
            <span class="section-item-sign">{{item.label}}：</span>
            <div class="inline-item">
              <el-select size="small" class="input-item-large" v-model="applyOpts[item.key]">
                <el-option v-for="(optionItem,optionKey) in item.options"
                           :label="optionItem.name"
                           :key="optionKey"
                           :value="optionItem.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="block-item" v-else-if="item.type == 'companyAddress'">
            <span class="section-item-sign">公司所在地：</span>
            <div class="inline-item">
              <template v-for="(item,key) in configCity">
                <el-select size="small" class="input-item-large mg-r" v-model="selectCityModel[item.modelKey]" :placeholder="item.label" @change="changeCity('change',item.modelKey,item.nextOptionKey,$event)">
                  <el-option v-for="(optionItem,optionKey) in selectCity[item.optionList]"
                             :label="optionItem.name"
                             :key="optionKey"
                             :value="optionItem[item.optionKey]">
                  </el-option>
                </el-select>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div class="section-item">
        <div class="menu-center">
          <el-button type="primary" @click="callSubmitApply">提交入仓申请</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    computed: {
      ...mapState(['allCity','sellerInfo','brandList','sellerContact'])
    },
    created (){
      this.initView()
    },
    data:()=>({
      selectCityModel:{
        selectedProvince:'',
        selectedCity:'',
        selectedDistrict:''
      },
      selectCity:{
        provinceList:[],
        cityList:[],
        districtList:[],
      },
      configCity:[
        {
          modelKey:'selectedProvince',
          nextOptionKey:'cityList',
          optionList:'provinceList',
          optionKey:'provinceId',
          key:'province',
          label:'请选择省',

        },
        {
          modelKey:'selectedCity',
          optionList:'cityList',
          optionKey:'cityId',
          nextOptionKey:'districtList',
          key:'city',
          label:'请选择市'
        },
        {
          modelKey:'selectedDistrict',
          optionList:'districtList',
          optionKey:'districtId',
          nextOptionKey:'',
          key:'district',
          label:'请选择区'
        },
      ],
      allCityList:{},
      applyOpts:{
        sellerName:'', //商家名称
        companyName:'',//公司名称
        brand:'',//经营品牌
        companyAddress:'',//公司所在地址
        companyDetailAddress:'',//公司所在详细地址
        currency:1, //报价币种：1：人民币，2：美元，3：澳元，4：日元，5：港币，6：欧元，7：新元，8：韩元，9：英镑
        contactPerson:'', //联系人姓名
        contactPhone:'', //联系人电话
        contactQq:'', //联系人QQ
        contactEmail:'', //联系人邮箱
        receiveBankAccount:'', //收款帐号
        receiveBank:'', //收款银行
        receiveName:'', //收款名称
        swiftCode:'', //海外账号需填写银行国际代码
        bankAddress:'' //银行地址
      },
      configOpts:[
        {
          label:'商家名称',
          key:'sellerName',
          type:'input',
          placeholder:'请填写商家名称'
        },
        {
          label:'公司名称',
          key:'companyName',
          type:'input',
          placeholder:'请填写公司名称'
        },
        {
          label:'经营品牌',
          key:'brand',
          type:'brand',
          notRequired:true,
        },
        {
          label:'公司所在地',
          key:'companyAddress',
          type:'companyAddress',
        },
        {
          label:'公司详细地址',
          key:'companyDetailAddress',
          type:'input',
          placeholder:'请填写详细地址'
        },
        {
          label:'币种',
          key:'currency',
          type:'select',
          options:[
            {
              value:1,
              name:'人民币'
            }
          ],
          placeholder:'请选择币种'
        },
        {
          label:'联系人',
          type:'list-input',
          notRequired:true,
          items:[
            {
              label:'姓名',
              key:'contactPerson',
              placeholder:'请填写联系人姓名'
            },
            {
              label:'电话',
              key:'contactPhone',
              placeholder:'请填写联系人电话',
              reg:/^1(3|4|5|7|8)\d{9}$/g
            },
            {
              label:'QQ',
              key:'contactQq',
              placeholder:'请填写联系人QQ',
              reg:/^\d{6,}$/g
            },
            {
              label:'邮箱',
              key:'contactEmail',
              placeholder:'请填写联系人邮箱',
              reg:/^(\w-*\.*)+@(\w-?)+(\.\w{2,4})+$/g
            }
          ]
        },
        {
          label:'收款帐号',
          key:'receiveBankAccount',
          type:'input',
          placeholder:'字数限制50字',
          limit:true,
          limitNum:50
        },
        {
          label:'收款银行',
          key:'receiveBank',
          type:'input',
          placeholder:'字数限制50字',
          limit:true,
          limitNum:50
        },
        {
          label:'收款名称',
          key:'receiveName',
          type:'input',
          placeholder:'字数限制50字',
          limit:true,
          limitNum:50
        },
        {
          label:'Swift Code',
          key:'swiftCode',
          type:'input',
          placeholder:'字数限制50字',
          limit:true,
          limitNum:50
        },
        {
          label:'银行地址',
          key:'bankAddress',
          type:'input',
          placeholder:'字数限制50字',
          limit:true,
          limitNum:50
        },


      ]
    }),
    methods:{
      ...mapActions(['getAllCity','getSellerBrand','getSellerInfo','callSetNotice','getSellerContact','applySellerInStorage']),
      initView() {
        if(this.sellerInfo.sellerName){
          this.setSellerMsg()
        } else {
          this.getSellerInfo()
            .then(() =>{
              this.setSellerMsg()
            })
        }
        if(!this.brandList.length){
          this.getSellerBrand()
        }
        if(!this.sellerContact.length){
            this.getSellerContact()
              .then(()=>{
                this.setSellerContact()
              })
        } else {
          this.setSellerContact()
        }
        if (!localStorage.getItem('allCityStorage') || localStorage.getItem('allCityStorage').length < 10000) {
          this.getAllCity()
            .then(() =>{
              localStorage.setItem('allCityStorage',JSON.stringify(this.allCity.data))
              this.initSelectCity()
            })
        } else {
          this.initSelectCity()
        }
      },
      setSellerContact(){
        this.applyOpts.contactPerson = this.sellerContact[2].contactName
        this.applyOpts.contactPhone = this.sellerContact[2].contactPhone
        this.applyOpts.contactQq = this.sellerContact[2].qq
        this.applyOpts.contactEmail = this.sellerContact[2].email
      },
      setSellerMsg() {
        this.applyOpts.sellerName = this.sellerInfo.realSellerName
        this.applyOpts.companyName = this.sellerInfo.companyName
        this.applyOpts.bankAddress = this.sellerInfo.bankAddress
        this.applyOpts.receiveBankAccount = this.sellerInfo.receiveBankAccount
        this.applyOpts.receiveBank = this.sellerInfo.receiveBank
        this.applyOpts.receiveName = this.sellerInfo.receiveName
        this.applyOpts.swiftCode = this.sellerInfo.swiftCode
      },
      initSelectCity() {
        this.allCityList= JSON.parse(localStorage.getItem('allCityStorage'))
        this.changeCity('init')
      },
      changeCity(type,model,next,event){
        if(type == 'init'){
          this.selectCity.provinceList = this.allCityList.provinceList
          return false
        }
        const self = this
        const mapNextKey = {
          cityList:'provinceId',
          districtList:'cityId'
        }
        if(model == 'selectedProvince'){
          this.selectCityModel.selectedCity = ''
          this.selectCityModel.selectedDistrict = ''
        }
        if(model == 'selectedCity'){
          this.selectCityModel.selectedDistrict = ''
        }
        if(next){
          this.selectCity[next] = this.allCityList[next].filter(function(item,i){
            if (item[mapNextKey[next]] == self.selectCityModel[model]) {
              return item
            }
          });
        }

      },
      callSubmitApply(){
        let cityList = []
        if(!this.selectCityModel.selectedProvince || !this.selectCityModel.selectedCity || !this.selectCityModel.selectedDistrict){
          this.getNotice('请选择公司地址')
          return false
        }
        const mapList = {
          provinceList:['provinceId','selectedProvince'],
          cityList:['cityId','selectedCity'],
          districtList:['districtId','selectedDistrict'],
        }
        for(let i in this.allCityList){
          this.allCityList[i].forEach((item)=>{
            if(item[mapList[i][0]] == this.selectCityModel[mapList[i][1]]){
                cityList.push(item.name)
            }
          })
        }
        this.applyOpts.companyAddress = cityList.join(' ')
        for(let i in this.configOpts){
          const _Opt = this.configOpts[i]
          if(!this.applyOpts[_Opt.key] && !_Opt.notRequired){
            this.getNotice('请填写'+_Opt.label)
            return false
          }
          if(_Opt.items){
              for(let j in _Opt.items){
                const _Item = _Opt.items[j]
                if(!this.applyOpts[_Item.key]){
                  this.getNotice('请填写'+_Opt.label+_Item.label)
                  return false
                }
                if(_Item.reg && !this.applyOpts[_Item.key].match(_Item.reg)){
                  this.getNotice(_Opt.label+_Item.label+'格式不正确')
                  return false
                }

              }
          }
          if(_Opt.limit){
              if(this.applyOpts[_Opt.key].length > _Opt.limitNum){
                this.getNotice(_Opt.label+'字数不能大于'+_Opt.limitNum)
                return false
              }
          }
        }
//        console.log(this.applyOpts)
        this.applySellerInStorage(this.applyOpts)
          .then(()=>{
//            location.href = '/sellerAdmin/page/sellerinstorage/order.html'
              this.$router.push({
                path: '/warehouse/agreement',
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
  .brand-item{
    display: inline-block;
    padding: 0px 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    /*color: #fff;*/
    /*background-color: #fb4b4d;*/
    border:1px solid #e0e0e0;
  }
</style>

