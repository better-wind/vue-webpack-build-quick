<template>
  <div>
    <div class="title">
      <span>管理发货地</span>
    </div>
    <div class="section">
      <div class="section-item" v-for="(item,index) in deliveryList">
        <div class="block-item">
          <span>发货地：{{item.sendAddress}}</span>
        </div>
        <div class="block-item">
          <span v-if="item.sendCodeType==1">发货依据：商品编码</span>
          <span v-else-if="item.sendCodeType==2">发货依据：商品条码</span>
          <span v-else-if="item.sendCodeType==3">发货依据：商品名称</span>
          <span v-else-if="item.sendCodeType==4">发货依据：其他</span>
        </div>
        <div class="block-item">
          <span>发货类型：{{sendTypeTrans(item.sellerType)}}</span>
        </div>
        <div class="block-item">
          <!--<span>默认快递：{{item.kuaidi == '其他'?item.otherKuaidi:item.kuaidi}}</span>-->
          <span>发货物流：{{item.kuaidi}}</span>
          <!--<template v-if="item.expressAuditStatus">-->
            <!--<template v-if="item.expressAuditStatus == 1">-->
              <!--<el-tooltip class="item" effect="dark" content="申请已提交，请等待审核" placement="right-start">-->
                <!--<span class="el-button is-disabled el-button&#45;&#45;small">添加发货物流</span>-->
              <!--</el-tooltip>-->
            <!--</template>-->
            <!--<template v-else>-->
              <!--<el-button type="primary" @click="showLayer(index,'express')" size="small">添加发货物流</el-button>-->
            <!--</template>-->
          <!--</template>-->
          <!--<template v-else>-->
            <!--<el-button type="primary" @click="showLayer(index,'express')" size="small">添加发货物流</el-button>-->
          <!--</template>-->
          <span class="mg-l disable-color">注：如需添加物流，请找类目运营提交申请</span>
        </div>
        <div class="block-item">
          <template v-if="item.expandInfo.freightSubmitType == 1">
            <span>运费模板：每订单运费{{item.expandInfo.freight}}元</span>
            <!--<template v-if="item.sellerFreightAuditItem">-->
              <!--&lt;!&ndash;1待审核，2审核通过，3审核不通过&ndash;&gt;-->
              <!--<template v-if="item.sellerFreightAuditItem.status == 1">-->
                <!--<el-tooltip class="item" effect="dark" content="申请已提交，请等待审核" placement="right-start">-->
                  <!--<span class="el-button is-disabled el-button&#45;&#45;small">申请调价</span>-->
                  <!--&lt;!&ndash;<el-button  type="primary" @click="showLayer(index,'price')" size="small">申请调价</el-button>&ndash;&gt;-->
                <!--</el-tooltip>-->
              <!--</template>-->
              <!--<template v-else-if="item.sellerFreightAuditItem.status == 2">-->
                <!--<el-tooltip class="item" effect="dark" :content="'上次审核于'+item.sellerFreightAuditItem.auditTime+'日审核通过，当天晚24点生效'" placement="right-start">-->
                  <!--<el-button  type="primary" @click="showLayer(index,'price')" size="small">申请调价</el-button>-->
                <!--</el-tooltip>-->
              <!--</template>-->
              <!--<template v-else-if="item.sellerFreightAuditItem.status == 3">-->
                <!--<el-tooltip class="item" effect="dark" content="审核不通过，如需调整运费，请重新提交审核" placement="right-start">-->
                  <!--<el-button  type="primary" @click="showLayer(index,'price')" size="small">申请调价</el-button>-->
                <!--</el-tooltip>-->
              <!--</template>-->
            <!--</template>-->
            <!--<el-button v-else type="primary" @click="showLayer(index,'price')" size="small">申请调价</el-button>-->
          </template>
          <template v-else-if="item.expandInfo.freightSubmitType == 2">
            <span>运费模板：【{{item.expandInfo.freightTemplateName ? item.expandInfo.freightTemplateName : item.sendAddress+'运费模板'}}】(按重量、配送区域计价)</span>
          </template>
          <template v-if="item.sellerFreightAuditItem">
            <!--1待审核，2审核通过，3审核不通过-->
            <template v-if="item.sellerFreightAuditItem.status == 1">
              <el-tooltip class="item" effect="dark" content="申请已提交，请等待审核" placement="right-start">
                <span class="el-button is-disabled el-button--small">更改运费模板</span>
              </el-tooltip>
            </template>
            <template v-else-if="item.sellerFreightAuditItem.status == 2">
              <el-tooltip class="item" effect="dark" :content="'上次审核于'+item.sellerFreightAuditItem.auditTime+'日审核通过，当天晚24点生效'" placement="right-start">
                <router-link tag="span" :to="{ path:'/edit/freight',query:{shipAddress:item.id}}">
                  <el-button type="primary" size="small">更改运费模板</el-button>
                </router-link>
              </el-tooltip>
            </template>
            <template v-else-if="item.sellerFreightAuditItem.status == 3">
              <el-tooltip class="item" effect="dark" content="审核不通过，如需调整，请重新提交审核" placement="right-start">
                <router-link tag="span" :to="{ path:'/edit/freight',query:{shipAddress:item.id}}">
                  <el-button type="primary" size="small">更改运费模板</el-button>
                </router-link>
              </el-tooltip>
            </template>
          </template>
          <router-link v-else tag="span" :to="{ path:'/edit/freight',query:{shipAddress:item.id}}">
            <el-button type="primary" size="small">更改运费模板</el-button>
          </router-link>

        </div>
        <div class="block-item">
          <span>发货时效：订单付款后当天剩余时间 + {{item.shippingValid}}天揽件时效（请注意：若该时间段内若无物流揽件消息反馈，则判定为发货超时）</span>
          <!--<span v-if="item.sendTimeType == 1">发货时效：当天15点前订单当天24点前打包并提供物流单号，24小时内有物流信息</span>-->
          <!--<span v-else-if="item.sendTimeType==2">发货时效：单笔订单24小时发货</span>-->
          <!--<span v-else-if="item.sendTimeType==3">发货时效：单笔订单48小时发货</span>-->
          <!--<span v-else-if="item.sendTimeType==4">发货时效：单笔订单72小时发货</span>-->
        </div>
        <div class="block-item">
          <span v-if="item.isSendWeekend==1">周末发货：周末不发货</span>
          <span v-else-if="item.isSendWeekend==2">周末发货：周六发货</span>
          <span v-else-if="item.isSendWeekend==3">周末发货：周日发货</span>
          <span v-else-if="item.isSendWeekend==4">周末发货：周末发货</span>
        </div>
        <div class="block-item">
              <span>超时罚款：
                <span v-if="item.overtimeFineType == 1">{{item.overtimeFineRemark}}元</span>
                <span v-else-if="item.overtimeFineType == 2">订单实付金额{{item.overtimeFineRemark}}%</span>
                *订单*24小时（不足24小时按24小时计算）</span>
          <router-link tag="span" to="/edit/timeout/record">
            <el-button type="primary" size="small">申请超时发货</el-button>
          </router-link>
        </div>
        <div class="block-item">
          <span>假期发货提示：{{item.holidayTips}}</span>
          <el-button type="primary" @click="showLayer(index,'tips')" size="small">添加假期发货提示</el-button>
        </div>
        <div class="block-item">
          <span>APP展示开始时间：{{item.holidayStartTime}}</span>
        </div>
        <div class="block-item">
          <span>APP展示结束时间：{{item.holidayEndTime}}</span>
        </div>
        <div class="block-item">
          <span>退货地址：{{codeTransName(item.expandInfo.receiveProvinceCode,1)}}{{codeTransName(item.expandInfo.receiveCityCode,2)}}{{codeTransName(item.expandInfo.receiveDistrictCode,3)}}{{item.expandInfo.receiveDetailAddress}}</span>
          <el-button type="primary" @click="showLayer(index,'address')" size="small">修改退货地址</el-button>
        </div>
        <div class="block-item">
          <span>联系人：{{item.expandInfo.receivePerson}}</span>
        </div>
        <div class="block-item">
          <span>联系电话：{{item.expandInfo.receiveTelephone}}</span>
        </div>
      </div>
    </div>

    <div class="layer-bg price-layer" v-show="priceLayer.show">
      <div class="price-ct">
        <h1>订单运费调价</h1>
        <div class="input-ct">
          <p>
            <span>订单运费：</span>
            <el-input v-model="priceLayer.input" placeholder="请输入内容"></el-input> 元/单
          </p>
          <p class="o-h">
            <span class="fl-l">调价原因：</span>
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="priceLayer.textarea"></el-input>
          </p>
        </div>
        <strong>注：审核通过当天晚24点生效</strong>
        <div class="btns-wrap">
          <el-button type="primary" @click="submitModity('price')">确定</el-button>
          <el-button @click="hideLayer('price')">取消</el-button>
        </div>
      </div>
    </div>

    <div class="layer-bg tips-layer"  v-show="tipsLayer.show">
      <div class="price-ct" style="height: 426px">
        <h1>假期发货提示</h1>
        <div class="input-ct">
          <p class="o-h">
            <span class="fl-l">假期发货提示：</span>
            <el-input type="textarea" :rows="5" placeholder="假期临近时填写。若正常发货可填：XX节期间可正常发货；若不发货可填：XX节期间不发货，X月X日发货" v-model="tipsLayer.textarea"></el-input>
          </p>
          <p>
            <span>APP展示开始：</span>
            <el-date-picker
              v-model="tipsLayer.start"
              type="datetime"
              placeholder="选择日期"
              :picker-options="pickerOptions0">
            </el-date-picker>
          </p>
          <p>
            <span>APP展示结束：</span>
            <el-date-picker
              v-model="tipsLayer.end"
              type="datetime"
              placeholder="选择日期"
              :picker-options="pickerOptions0">
            </el-date-picker>
          </p>
        </div>
        <div class="btns-wrap">
          <el-button type="primary" @click="submitModity('tips')">确定</el-button>
          <el-button @click="hideLayer('tips')">取消</el-button>
        </div>
      </div>
    </div>

    <div class="layer-bg address-layer" v-show="addressLayer.show">
      <div class="price-ct">
        <h1>修改退货地址</h1>
        <div class="input-ct">
          <p>
            所在地区：
            <el-select v-model="addressLayer.selectedProvince" placeholder="省" @change="changeProvinve">
              <el-option
                v-for="(item,index) in localAllCity.provinceList"
                :key="index"
                :label="item.name"
                :value="item.provinceId">
              </el-option>
            </el-select>
            <el-select v-model="addressLayer.selectedCity" placeholder="市" v-show="addressLayer.cityShow" @change="changeCity">
              <el-option
                v-for="(item,index) in localAllCity.cityList"
                :key="index"
                :label="item.name"
                :value="item.cityId">
              </el-option>
            </el-select>
            <el-select v-model="addressLayer.selectedDistrict" placeholder="区" v-show="addressLayer.districtShow">
              <el-option
                v-for="(item,index) in localAllCity.districtList"
                :key="index"
                :label="item.name"
                :value="item.districtId">
              </el-option>
            </el-select>
          </p>
          <p>
            <span>详细地址：</span>
            <el-input v-model="addressLayer.inputAddress" placeholder="请输入内容"></el-input>
          </p>
          <p>
            <span>联系人：</span>
            <el-input v-model="addressLayer.inputPerson" placeholder="请输入内容"></el-input>
          </p>
          <p>
            <span>联系电话：</span>
            <el-input v-model="addressLayer.inputTel" placeholder="请输入内容"></el-input>
          </p>
        </div>
        <div class="btns-wrap">
          <el-button type="primary" @click="submitModity('address')">确定</el-button>
          <el-button @click="hideLayer('address')">取消</el-button>
        </div>
      </div>
    </div>

    <div class="layer-bg express-layer" v-show="expressLayer.show">
      <div class="price-ct">
        <h1>请选择物流方式</h1>
        <div class="input-ct">
          <p>
            <span>该发货地已添加发货物流：</span> {{expressLayer.selected}}
          </p>
          <p>
            <span class="fl-l">添加发货物流：</span>
            <el-select class="input-select" size="small" multiple filterable v-model="expressLayer.selectExpress" placeholder="请选择物流">
              <template v-for="item in itemLogisticsChannel">
                <el-option  :label="item.desc" :value="item.code"></el-option>
              </template>
            </el-select>
          </p>
        </div>
        <div class="btns-wrap">
          <el-button type="primary" @click="submitModity('express')">确定</el-button>
          <el-button @click="hideLayer('express')">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'deliveryArea',
    created (){
      this.initView()
    },
    computed: {
      ...mapState(['allCity','logisticsChannel'])
    },
    data: () => ({
      expressLayer: {
        show:false,
        selectExpress:'',
        selected:''
      },
      priceLayer: {
        input: '',
        textarea: '',
        show: false
      },
      tipsLayer: {
        textarea: '',
        start: '',
        end: '',
        show: false
      },
      addressLayer: {
        show: false,
        selectedProvince: '',
        selectedCity: '',
        selectedDistrict: '',
        inputAddress: '',
        inputPerson: '',
        inputTel: '',
        cityShow: false,
        districtShow: false
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      localAllCity: {
        provinceList: [],
        cityList: [],
        districtList: []
      },
      index: 0,
      shippingAddressId: 0,
      freightAuditTypeList:[],
      itemLogisticsChannel:[],
      sendType:[],
      deliveryList:[]
    }),
    methods: {
      ...mapActions(['getDeliveryArea','modifyPrice','modifyTips','modifyAddress','getAllCity','getSendType','callSetToast','callSetNotice','getLogisticsChannel','sellerExpressAudit']),
      initView() {
        if (!localStorage.getItem('allCityStorage') || localStorage.getItem('allCityStorage').length < 10000) {
          this.getAllCity()
            .then(() =>{
              localStorage.setItem('allCityStorage',JSON.stringify(this.allCity.data))
              this.getList()
            })
        } else {
          this.getList()
        }
//        var allList = JSON.parse(localStorage.getItem('allCityStorage'))
//        this.localAllCity.provinceList = allList.provinceList
//        this.localAllCity.cityList = allList.cityList
//        this.localAllCity.districtList = allList.districtList
      },
      getList() {
        this.getDeliveryArea({isAvailable:1})
          .then((rs)=>{
            this.deliveryList = rs
            this.getSendType()
              .then((rs)=>{
                this.sendType = rs
              })
          })
      },
      showLayer(index,type){
        this.index = index
        this.shippingAddressId = this.deliveryList[index].id
        switch(type){
          case 'price':
            this.priceLayer.show = true
            break;
          case 'tips':
            var item = this.deliveryList[index]
            this.tipsLayer.show = true
            this.tipsLayer.textarea = item.holidayTips
            this.tipsLayer.start = item.holidayStartTime
            this.tipsLayer.end = item.holidayEndTime
            break;
          case 'address':
            var item = this.deliveryList[index]
            this.addressLayer.show = true
            this.addressLayer.selectedProvince = this.codeTransName(item.expandInfo.receiveProvinceCode,1)
            this.addressLayer.selectedCity = this.codeTransName(item.expandInfo.receiveCityCode,2)
            this.addressLayer.selectedDistrict = this.codeTransName(item.expandInfo.receiveDistrictCode,3)
            this.addressLayer.inputAddress = item.expandInfo.receiveDetailAddress
            this.addressLayer.inputPerson = item.expandInfo.receivePerson
            this.addressLayer.inputTel = item.expandInfo.receiveTelephone
             this.addressLayer.cityShow = true
             this.addressLayer.districtShow = true
            var allList = JSON.parse(localStorage.getItem('allCityStorage'))
            this.localAllCity.provinceList = allList.provinceList
            this.localAllCity.cityList = allList.cityList.filter((subItem)=>{
              return subItem.provinceId == item.expandInfo.receiveProvinceCode
            })

            this.localAllCity.districtList = allList.districtList.filter((subItem)=>{
              return subItem.cityId == item.expandInfo.receiveCityCode
            })
            break;
          case 'express':
            if(!this.logisticsChannel.length){
              this.getLogisticsChannel()
                .then(() =>{
                  this.setMapExpressId(index)
                })
            } else {
              this.setMapExpressId(index)
            }
        }
      },
      setMapExpressId(index){

        let item = this.deliveryList[index]
        this.itemLogisticsChannel = JSON.parse(JSON.stringify(this.logisticsChannel))
        if(item.kuaidi){
          const list = item.kuaidi.indexOf('、')>-1 ? item.kuaidi.split('、') : item.kuaidi.split('，')
//          console.log(list)
          this.itemLogisticsChannel = this.itemLogisticsChannel.filter((item)=>{
            let check = true
            for(let i in list){
//              console.log(list[i].indexOf(item.desc))
//              console.log(item.desc.indexOf(list[i]))
              if(list[i] == item.desc || list[i].indexOf(item.desc)>-1 || item.desc.indexOf(list[i])>-1){
                check = false
                return false
              }
            }
            return check
          })
        }
        this.expressLayer.show = true
        this.expressLayer.selected = item.kuaidi
      },
      hideLayer(type){
        switch(type){
          case 'price':
            this.priceLayer.show = false
            this.priceLayer.input = 0
            this.priceLayer.textarea = ''
            break;
          case 'tips':
            this.tipsLayer.show = false
            this.tipsLayer.textarea = ''
            this.tipsLayer.start = ''
            this.tipsLayer.end = ''
            break;
          case 'address':
            this.addressLayer.show = false
            this.addressLayer.selectedProvince = ''
            this.addressLayer.selectedCity = ''
            this.addressLayer.selectedDistrict = ''
            this.addressLayer.inputAddress = ''
            this.addressLayer.inputPerson = ''
            this.addressLayer.inputTel = ''
            this.addressLayer.cityShow = false
            this.addressLayer.districtShow = false
            break;
          case 'express':
            this.expressLayer.show = false
            this.expressLayer.selected = ''
            this.expressLayer.selectExpress = ''
        }
      },
      submitModity(type){
        switch(type){
          case 'price':
            if(!this.priceLayer.input){
              this.getToast('请填写订单运费')
              return false
            }
            if(!this.priceLayer.textarea){
              this.getToast('请填写调价原因')
              return false
            }
            this.modifyPrice({
              shippingAddressId: this.shippingAddressId,
              freight: this.priceLayer.input,
              reason: this.priceLayer.textarea
            }).then(() =>{
              this.deliveryList[this.index].sellerFreightAuditItem.status = 1
              this.priceLayer.show = false
            })
            break;
          case 'tips':
            this.modifyTips({
              shippingAddressId: this.shippingAddressId,
              desc: this.tipsLayer.textarea,
              showStart: Util.formatDate('yyyy-mm-dd hh:mm:ss',this.tipsLayer.start),
              showEnd: Util.formatDate('yyyy-mm-dd hh:mm:ss',this.tipsLayer.end)
            }).then(() =>{
              this.tipsLayer.show = false
              this.deliveryList[this.index].holidayTips = this.tipsLayer.textarea
              this.deliveryList[this.index].holidayStartTime = Util.formatDate('yyyy-mm-dd hh:mm:ss',this.tipsLayer.start)
              this.deliveryList[this.index].holidayEndTime = Util.formatDate('yyyy-mm-dd hh:mm:ss',this.tipsLayer.end)
            })
            break;
          case 'address':
            var _thisAddressLayer = this.addressLayer
            if(_thisAddressLayer.inputAddress.length > 100){
              this.getToast('详细地址字符过长')
              return false
            }
            if (_thisAddressLayer.selectedProvince&&_thisAddressLayer.selectedCity&&_thisAddressLayer.selectedDistrict &&_thisAddressLayer.inputAddress&&_thisAddressLayer.inputPerson&&_thisAddressLayer.inputTel) {
              this.modifyAddress({
                shippingAddressId: this.shippingAddressId,
                provinceCode: _thisAddressLayer.selectedProvince>0?_thisAddressLayer.selectedProvince:this.nameTransCode(_thisAddressLayer.selectedProvince,1),
                cityCode: _thisAddressLayer.selectedCity>0?_thisAddressLayer.selectedCity:this.nameTransCode(_thisAddressLayer.selectedCity,2),
                districtCode: _thisAddressLayer.selectedDistrict>0?_thisAddressLayer.selectedDistrict:this.nameTransCode(_thisAddressLayer.selectedDistrict,3),
                address: _thisAddressLayer.inputAddress,
                person: _thisAddressLayer.inputPerson,
                phone: _thisAddressLayer.inputTel
              }).then(() =>{
                this.addressLayer.show = false
                // var _thisExpandInfo = this.deliveryList[this.index].expandInfo
                // _thisExpandInfo.receivePerson = this.addressLayer.inputPerson
                // _thisExpandInfo.receiveDetailAddress = this.addressLayer.inputAddress
                // _thisExpandInfo.receiveTelephone = this.addressLayer.inputTel
                this.getList()
              })
            }else{
              this.getToast('请填写完整')
            }

            break;
          case 'express':
            let _expressLayer = this.expressLayer
            if(!_expressLayer.selectExpress.length){
              this.getToast('请选择物流')
              return false
            }
            this.sellerExpressAudit({
              shippingAddressId:this.shippingAddressId,
              expressIds:_expressLayer.selectExpress.join(',')
            }).then(()=>{
              this.deliveryList[this.index].expressAuditStatus = 1
//                this.deliveryList[this.index].kuaidi += '，'+_expressLayer.selectExpress.map((item)=> this.codeTransExpress(item)).join('，')
              this.hideLayer('express')
            })

            break;
        }
      },
      changeProvinve(id){
        if(!id.match(/^\d*$/)){
            return false
        }
        var allList = JSON.parse(localStorage.getItem('allCityStorage'))
        this.localAllCity.cityList = allList.cityList.filter(function(v,i){
          if (v.provinceId == id) {
            return v
          }
        });
        this.addressLayer.selectedCity = ''
        this.addressLayer.selectedDistrict = ''
      },
      changeCity(id){
        if(!id.match(/^\d*$/)){
          return false
        }
        var allList = JSON.parse(localStorage.getItem('allCityStorage'))
        this.localAllCity.districtList = allList.districtList.filter(function(v,i){
          if (v.cityId == id) {
            return v
          }
        });
        this.addressLayer.selectedDistrict = ''
      },
      dateTrans(d){
        var date = new Date(d),
          yy = date.getFullYear(),
          mm = parseInt(date.getMonth())+1,
          dd = date.getDate()
        return (yy+'-'+mm+'-'+dd)
      },
      sendTypeTrans(type){

        return this.sendType.length === 0 ? '' : this.sendType[type-1] ? this.sendType[type-1].desc : ''
      },
      getToast(msg){
        const toast = {
          isShow:true,
          msg:msg,
        }
        this.callSetToast(toast)
      },
      getNotice(msg){
        const toast = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(toast)
      },
      codeTransExpress(code){
        let i = 0
        while(code!=this.logisticsChannel[i].code){
          i++
        }
        return this.logisticsChannel[i].desc
      },
      codeTransName(code,type) {
        var allList = JSON.parse(localStorage.getItem('allCityStorage'))
        var i = 0
        switch(type){
          case 1:
            while(code != allList.provinceList[i].provinceId){
              i++
            }
            return allList.provinceList[i].name
            break;
          case 2:
            while(code != allList.cityList[i].cityId){
              i++
            }
            return allList.cityList[i].name
            break;
          case 3:
            while(code != allList.districtList[i].districtId){
              i++
            }
            return allList.districtList[i].name
            break;
        }
      },
      nameTransCode(name,type) {
        var allList = JSON.parse(localStorage.getItem('allCityStorage'))
        var i = 0
        switch(type){
          case 1:
            while(name != allList.provinceList[i].name){
              i++
            }
            return allList.provinceList[i].provinceId
            break;
          case 2:
            while(name != allList.cityList[i].name){
              i++
            }
            return allList.cityList[i].cityId
            break;
          case 3:
            while(name != allList.districtList[i].name){
              i++
            }
            return allList.districtList[i].districtId
            break;
        }
      }
    }
  }
</script>
<style lang='less' rel="stylesheet/less" scoped>
  .section-item{
    margin: 0px 20px 20px;
    background-color: #f5f5f5;
  }
  .layer-bg {
    position: fixed;
    top: 0;
    left: 0;
    right:0;
    bottom:0;
    background-color: rgba(0,0,0,0.5);
    z-index: 999;
    >div {
      width: 500px;
      box-sizing: border-box;
      padding: 20px;
      margin: auto;
      position: absolute;
      left: 50%;
      top: 110px;
      transform: translate(-50%,0);
      background-color: #fff;
      border-radius: 6px;
      >h1 {
        text-align: center;
        line-height: 20px;
        margin-bottom: 50px;
      }
      .input-ct {
        >p {
          >span {
            display: inline-block;
            min-width: 70px;
          }
          margin-bottom: 20px;
        }
      }
      >strong {

      }
      .btns-wrap {
        margin-top: 40px;
        text-align: center;
      }
    }
  }
  .el-input {
    width: 50%;
  }
  .el-textarea {
    width: 60%;
  }
  .el-select {
    width: 25%;
  }
  .input-select{
    width: 60%;
  }
</style>
