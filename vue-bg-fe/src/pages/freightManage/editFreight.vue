<!--编辑运费模板-->
<template>
  <div>
    <div class="title">
      <span>编辑运费模板</span>
    </div>
    <div class="section" v-if="detailReady">
      <div class="section-item">
        <div class="block-item">
          <span class="section-item-sign">
              发货地：
          </span>
          <div class="inline-item">
            <span>{{saveTemp.sendAddress}}</span>
          </div>
        </div>
        <div class="block-item">
          <span class="section-item-sign">
              运费计算方式：
          </span>
          <div class="block-item">
            <el-radio class="radio" v-model="saveTemp.freightSubmitType" :label="1">每订单运费 </el-radio>
            <el-input v-if="saveTemp.freightSubmitType == 1" v-model="saveTemp.freight" class="input-item-middle" placeholder="请输入每订单运费" size="small"></el-input> <br />
          </div>
          <div class="block-item">
            <el-radio class="radio" @click="canUseTemplate()" v-model="saveTemp.freightSubmitType" :label="2">按重量、配送区域计价</el-radio>
            <template v-if="saveTemp.freightSubmitType == 2">
              <el-button size="small" @click="callAddExpress" type="primary">添加物流方式</el-button>
              <el-button size="small" @click="callSetDefaultExpress" type="primary">设置默认物流</el-button>
              <div class="mg-t-h">
                <span class="section-item-sign">
                    <span  class="sign-required">*</span>模板名称：
                </span>
                <div class="inline-item">
                  <!--@change="checkName"-->
                  <el-input class="input-item" @blur="checkNameBlur" @focus="initCheckName" v-model="saveTemp.name" size="small"></el-input>
                  <span class="primary-color" v-if="!checkFreightStatus">运费模板名称重复</span>
                </div>
              </div>
            </template>
          </div>

        </div>
        <div class="result-view mg-b" v-if="saveTemp.freightSubmitType == 2">
          <el-table border :data="saveTemp.expressList" style="width: 100%;">
            <template v-for="(item,index) in resultItem.option">
              <el-table-column v-if="item.type == 'single'" :fixed="item.fixed" v-bind:prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
                <template slot-scope="scope">
                 {{mapExpressId[scope.row[item.key]]}} <span v-if="scope.row.defaultTag">(默认)</span>
                  <div>
                    <el-button size="small" @click="addProvince(scope.$index)" type="primary">添加地区设置</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column v-else :fixed="item.fixed" :prop="item.key" v-bind:label="item.label" :width="item.width" align="center">
                <template slot-scope="scope">
                  <div class="line-wrap">
                    <template v-for="(subItem,idx) in scope.row.areaPriceList">
                      <div class="line-item o-h" v-if="item.type == 'province'">
                        <div class="map-province fl-l pd-l pd-r" style="width: 300px;min-height: 20px;text-align: left">
                          <el-tooltip class="item" effect="dark" :content="subItem[item.key].split(',').map((item)=>mapProvince[item]).join(',')" placement="top">
                            <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                            <span v-for="mapItem in subItem[item.key].split(',')">
                              {{mapProvince[mapItem]}}
                            </span>
                            </p>
                          </el-tooltip>

                        </div>
                        <el-button class="fl-l" size="small" @click="callChooseArea(scope.$index,idx)" type="primary">编辑</el-button>
                      </div>
                      <div class="line-item" v-else-if="item.type == 'opera'">
                        <el-button size="small" @click="delProvince(scope.$index,idx)" type="primary">删除</el-button>
                      </div>
                      <div class="line-item" v-else>
                        <el-input class="input-item" v-model="subItem[item.key]" size="small"></el-input>
                      </div>
                    </template>
                  </div>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <div class="block-item">
          <div class="section-item-sign-wrap">
            <span class="section-item-sign">
              <span  class="sign-required">*</span>调整原因：
            </span>
          </div>
          <div class="inline-item">
            <el-input :rows="6" v-model="saveTemp.reason" resize="none" placeholder="50个字以内" type="textarea"  class="area-item-large" size="small"></el-input>
          </div>
        </div>
      </div>
      <div class="section-item">
        <div class="menu pd-r" style="text-align: right">
          <el-button size="small" @click="callSaveTemp" type="primary">保存并提交审核</el-button>
        </div>
      </div>

      <div class="modal">
        <el-dialog class="area-item" :visible.sync="modalArea.isShow" size="small" @close="cancelArea">
          <div class="section">
            <div class="area-title">
              <span>请选择区域</span>
            </div>
            <div class="area-view">
              <div v-for="(item,idx) in modalArea.cityArr" :key="idx">
                <template>
                  <el-checkbox :disabled="item.disableAll" :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange(idx,$event)">{{item.name}}</el-checkbox>
                  <el-checkbox-group style="display: inline;margin-left: 20px" v-model="item.checkedCities" @change="handleCheckedCitiesChange(idx)">
                    <el-checkbox v-for="city in item.cities" :label="city.id" :disabled="disableConfig[city.id]" :key="city.id">{{city.name}}</el-checkbox>
                  </el-checkbox-group>
                </template>
              </div>
            </div>
            <div class="menu" style="text-align: right">
              <el-button size="small" @click="saveArea" type="primary">保存</el-button>
              <el-button size="small" @click="cancelArea" >取消</el-button>
            </div>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="modalExpress.isShow" size="small" @close="cancelExpress">
          <div class="section">
            <div class="area-title">
              <span>添加物流方式</span>
            </div>
            <div class="section-item">
              <span>添加物流：</span>
              <el-select class="input-item-middle-express" size="small" multiple filterable v-model="modalExpress.expressCode" placeholder="请选择物流">
                <template v-for="item in filterFreightTempExpress">
                  <el-option  :label="item.desc" :value="item.code"></el-option>
                </template>
              </el-select>
            </div>
            <div class="menu" style="text-align: right">
              <el-button size="small" @click="saveExpress" type="primary">保存</el-button>
              <el-button size="small" @click="cancelExpress" >取消</el-button>
            </div>
          </div>
          <div class="section-item o-h">
            <p class="fl-r primary-color">仅能从该发货地已有的发货物流中选择，<br>
              若要新增物流方式，烦请前往商家中心添加；</p>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="modalDefaultExpress.isShow" size="tiny" @close="cancelDefaultExpress">
          <div class="section">
            <div class="area-title">
              <span>设置默认物流方式</span>
            </div>
            <div class="section-item">
              <div v-for="item in saveTemp.expressList">
                <el-radio class="radio" v-model="modalDefaultExpress.defaultExpressCode" :label="item.expressId">{{mapExpressId[item.expressId]}}</el-radio>
              </div>
            </div>
            <div class="menu" style="text-align: right">
              <el-button size="small" @click="saveDefaultExpress" type="primary">保存</el-button>
              <el-button size="small" @click="cancelDefaultExpress" >取消</el-button>
            </div>
          </div>
        </el-dialog>
        <el-dialog :visible.sync="modalTips.isShow" size="small">
          <div class="section">
            <div class="area-title">
              <span>提示</span>
            </div>
            <div class="section-item">
              <p style="text-indent: 2rem">
                您若想使用按重量计价方式结算运费成本，请先通过“批量设置商品毛重”入口设置商品毛重，待审核通过后，所有商品均具备毛重信息后，方能使用按重量计价的运费模版！
              </p>
              <p style="text-indent: 2rem">
                请注意：商品毛重信息将直接用于计算运费结算，请尽量保证准确；
              </p>
            </div>
            <div class="menu" style="text-align: right">
              <router-link v-if="newGoods" tag="span" to="/product/weight/sale">
                <el-button type="primary">设置商品毛重</el-button>
              </router-link>
              <router-link v-else tag="span" to="/product/weight">
                <el-button type="primary">设置商品毛重</el-button>
              </router-link>
              <el-button size="small" @click="modalTips.isShow = false" >取消</el-button>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>

  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    name:'editFreight',
    computed:{
      ...mapState(['logisticsChannel','allCity','newGoods'])
    },
    created (){
      this.initView()
    },
    data:()=>({
      resultItem: {
        option:[
          {
            type: 'single',
            label: '物流方式',
            key:'expressId',
            width:'150',
//            fixed:'left'
          },
          {
            label: '省份地区',
            key:'provinceCodes',
            width:'400',
            type:'province',
          },
          {
            label: '首重(克)',
            key:'firstWeight',
            width:'90',
          },
          {
            label: '首重金额(元)',
            key:'firstWeightPrice',
            width:'100',
          },
          {
            label: '续重(克)',
            key:'continueWeight',
            width:'90',
          },
          {
            label: '续重金额(元)',
            key:'continueWeightPrice',
            width:'100',
          },
          {
            label: '操作',
            key:'',
            type:'opera',
            width:'',
//            fixed:'right'
          },
        ]
      },
      saveTemp:{},
      detailReady:false,
      freightSubmitType:'',
      mapExpressId:{},
      mapProvince:{},
      modalArea:{
        isShow:false,
        cityArr: [
          {
            name: '华东',
            cities: [
              {name:'上海',id:'310000'},
              {name:'江苏',id:'320000'},
              {name:'浙江',id:'330000'},
              {name:'安徽',id:'340000'},
              {name:'山东',id:'370000'},
              {name:'福建',id:'350000'},
              {name:'江西',id:'360000'}
            ],
            checkAll: false,
            checkedCities: [],
            isIndeterminate: false,
            disableAll:false
          },
          {
            name: '华北',
            cities: [
              {name:'北京',id:'110000'},
              {name:'天津',id:'120000'},
              {name:'河北',id:'130000'},
              {name:'山西',id:'140000'},
              {name:'内蒙古',id:'150000'},
            ],
            checkAll: false,
            checkedCities: [],
            isIndeterminate: false,
            disableAll:false
          },
          {
            name: '华中',
            cities: [
              {name:'湖北',id:'420000'},
              {name:'湖南',id:'430000'},
              {name:'河南',id:'410000'},
            ],
            checkAll: false,
            checkedCities: [],
            isIndeterminate: false,
            disableAll:false
          },
          {
            name: '华南',
            cities: [
              {name:'广东',id:'440000'},
              {name:'广西',id:'450000'},
              {name:'海南',id:'460000'},
            ],
            checkAll: false,
            checkedCities: [],
            isIndeterminate: false,
            disableAll:false
          },
          {
            name: '东北',
            cities: [
              {name:'辽宁',id:'210000'},
              {name:'吉林',id:'220000'},
              {name:'黑龙江',id:'230000'},
            ],
            checkAll: false,
            checkedCities: [],
            isIndeterminate: false,
            disableAll:false
          },
          {
            name: '西北',
            cities: [
              {name:'宁夏',id:'640000'},
              {name:'新疆',id:'650000'},
              {name:'青海',id:'630000'},
              {name:'陕西',id:'610000'},
              {name:'甘肃',id:'620000'},
            ],
            checkAll: false,
            checkedCities: [],
            isIndeterminate: false,
            disableAll:false
          },
          {
            name: '西南',
            cities: [
              {name:'四川',id:'510000'},
              {name:'云南',id:'530000'},
              {name:'贵州',id:'520000'},
              {name:'西藏',id:'540000'},
              {name:'重庆',id:'500000'},
            ],
            checkAll: false,
            checkedCities: [],
            isIndeterminate: false,
            disableAll:false
          }
        ],
        line:'',
        idx:''
      },
      disableConfig:{

      },
      modalExpress:{
        isShow:false,
        expressCode:''
      },
      modalDefaultExpress:{
        isShow:false,
        defaultExpressCode:''
      },
      modalTips:{
        isShow:false
      },
      shipAddressId:'',
      filterFreightTempExpress:[],
      isChangeName:true,
      checkFreightStatus:true,
      freightTempExpress:[]
    }),
    methods: {
      ...mapActions(['getFreightTempDetail','getAllCity','saveFreightTemp','callSetNotice','getFreightTemplateExpressList','checkFreightName']),
      initView(){
        const query = this.$route.query
        this.shipAddressId = query.shipAddress
        this.getFreightTemplateExpressList({shippingAddressId:this.shipAddressId})
          .then((rs)=>{
            this.freightTempExpress = rs
            this.setMapExpressId()
          })
//        if(!this.freightTempExpress.length){
//          this.getFreightTemplateExpressList({shippingAddressId:this.shipAddressId})
//            .then((rs)=>{
//              this.freightTempExpress = rs
//              this.setMapExpressId()
//            })
//        } else {
//          this.setMapExpressId()
//        }
        if (!localStorage.getItem('allCityStorage') || localStorage.getItem('allCityStorage').length < 10000) {
          this.getAllCity()
            .then(() =>{
              localStorage.setItem('allCityStorage',JSON.stringify(this.allCity.data))
              this.setMapProvince()
            })
        } else {
          this.setMapProvince()
        }
        this.getFreightTempDetail(query)
          .then((rs)=>{
            this.saveTemp = rs
            this.saveTemp.reason = ''
            if(this.saveTemp.freightSubmitType == 2){
              this.setDefaultInit()
            }
            this.detailReady = true
          })
      },
      setDefaultInit(){
        if(this.saveTemp.expressList && this.saveTemp.expressList.length){
//          let check = true
          let i = 0
          while(this.saveTemp.expressList[i].defaultTag != 1){
              i++
            if(i == this.saveTemp.expressList.length){
              this.saveTemp.expressList[0].defaultTag = 1
                  break;
            }
          }
//          this.saveTemp.expressList.map((item)=>{
//            if(item.defaultTag == 1){
//                check = false
//            }
//          })
//          if(check){
//            this.saveTemp.expressList[0].defaultTag = 1
//          }
        }
      },
      setMapExpressId(){
        const _this = this;
//        this.logisticsChannel.forEach((item,idx)=>{
//          _this.mapExpressId[item.code] = item.desc
//        })
        this.freightTempExpress.forEach((item,idx)=>{
          _this.mapExpressId[item.code] = item.desc
        })
        this.mapExpressReady = true
      },
      setMapProvince(){
        const provinceList =  JSON.parse(localStorage.getItem('allCityStorage')).provinceList
        const _this = this;
        provinceList.forEach((item,idx)=>{
          _this.disableConfig[item.provinceId] = false
          _this.mapProvince[item.provinceId] = item.name
        })
        this.mapProvinceReady = true
//        console.log(this.disableConfig)
      },
      addProvince(idx){
        const opt = {
          id:'',
          templateExpressId:this.saveTemp.expressList[idx].templateExpressId || '',
          firstWeight:'',
          firstWeightPrice:'',
          continueWeight:'',
          continueWeightPrice:'',
          provinceCodes:''
        }
        this.saveTemp.expressList[idx].areaPriceList.push(opt)
      },
      delProvince(line,idx){
        if(this.saveTemp.expressList[line].areaPriceList.length > 1){
          this.saveTemp.expressList[line].areaPriceList.splice(idx,1)
        }
        else {
          if(this.saveTemp.expressList.length > 1){
            this.saveTemp.expressList.splice(line,1)
            this.setDefaultInit()
          }
          else {
            this.getNotice('最后一条别删了')
            return false
          }
        }

      },
      callChooseArea(line,idx){
        this.saveTemp.expressList[line].areaPriceList.map((item)=>{
          item.provinceCodes.split(',').map((code)=>{
            this.disableConfig[code] = true
          })
        })
        let provinceCodes = this.saveTemp.expressList[line].areaPriceList[idx].provinceCodes.split(',')
        this.modalArea.line = line
        this.modalArea.idx = idx
        this.modalArea.cityArr.map((item)=>{
          item.cities.map((city)=>{
            provinceCodes.map((code)=>{
              this.disableConfig[code] = false
              if(code == city.id){
                item.checkedCities.push(code)
              }
            })
            if(this.disableConfig[city.id]){
              item.disableAll = true
            }
          })
          item.isIndeterminate = item.checkedCities.length > 0 && item.checkedCities.length < item.cities.length
          item.checkAll = item.checkedCities.length === item.cities.length
        })

        this.modalArea.isShow = true
      },
      handleCheckAllChange(idx,event) {
        let _cityArr =  this.modalArea.cityArr[idx]
        _cityArr.checkedCities = event.target.checked ?  _cityArr.cities.map((item)=> { return item.id }) : [];
        _cityArr.isIndeterminate = false;
      },
      handleCheckedCitiesChange(idx) {
        let _cityArr =  this.modalArea.cityArr[idx]
        let checkedCount = _cityArr.checkedCities.length;
        _cityArr.checkAll = checkedCount === _cityArr.cities.length;
        _cityArr.isIndeterminate = checkedCount > 0 && checkedCount < _cityArr.cities.length;
      },
      saveArea(){
        let saveAreaList = []
        this.modalArea.cityArr.forEach((item,idx)=>{
          if(item.checkedCities.length){
            item.checkedCities.forEach((subItem,idx)=>{
              saveAreaList.push(subItem)
            })
          }
        })
        if(!saveAreaList.length){
            this.getNotice('请选择区域')
          return false
        }
        let checkCodes = {}
        this.saveTemp.expressList[this.modalArea.line].areaPriceList.map((item,idx)=>{
          if(idx != this.modalArea.idx && item.provinceCodes){
            item.provinceCodes.split(',').map((code)=>{
              checkCodes[code] = code
            })
          }
        })
        let checkStatus = true
        let checkMsg = ''
        for(let i in saveAreaList){
          if(checkCodes[saveAreaList[i]]){
            checkStatus = false
            checkMsg += this.mapProvince[saveAreaList[i]]+' '
          }
        }
        if(!checkStatus){
          this.getNotice('该物流下已存在'+checkMsg)
          return false
        }
        this.saveTemp.expressList[this.modalArea.line].areaPriceList[this.modalArea.idx].provinceCodes = saveAreaList.join(',')
        this.cancelArea()
      },
      cancelArea(){
        this.modalArea.cityArr.map((item,idx)=>{
          item.checkedCities = []
          item.isIndeterminate = false
          item.checkAll = false
          item.disableAll = false
        })
        this.modalArea.line = ''
        this.modalArea.idx = ''
        for(let i in this.disableConfig){
          this.disableConfig[i] = false
        }
        this.modalArea.isShow = false
      },
      callAddExpress(){
        if(this.saveTemp.expressList && this.saveTemp.expressList.length > 2){
//          this.getNotice('可别加了')
//          return false
        }
        if(!this.freightTempExpress.length){
            this.getFreightTemplateExpressList({shippingAddressId:this.shipAddressId})
              .then(()=>{
                this.filterExpress()
              })
        } else {
          this.filterExpress()
        }

      },
      filterExpress(){
        this.filterFreightTempExpress = JSON.parse(JSON.stringify(this.freightTempExpress))

        if(this.saveTemp.expressList && this.saveTemp.expressList.length){
          let list = []
          this.saveTemp.expressList.map((item)=>{
            list.push(item.expressId)
          })
          this.filterFreightTempExpress = this.filterFreightTempExpress.filter((item)=>{
            let check = true
            for(let i in list){
              if(list[i] == item.code){
                check = false
                return false
              }
            }
            return check
          })
        }
        this.modalExpress.isShow = true
      },
      saveExpress(){
        this.saveTemp.expressList = this.saveTemp.expressList || []
        if(!this.modalExpress.expressCode.length){
          this.getNotice('请选择要新增的物流')
          return false
        }
        if(this.saveTemp.expressList.length + this.modalExpress.expressCode.length > 3){
//          this.getNotice('可别加了')
//          return false
        }
//        for(let i in this.saveTemp.expressList){
//          const item = this.saveTemp.expressList[i]
//          for(let j in this.modalExpress.expressCode){
//            const codeItem = this.modalExpress.expressCode[j]
//            if(codeItem[j] == item.expressId){
//              this.getNotice('该物流方式已存在')
//              return false
//            }
//          }
//          if(this.modalExpress.expressCode == item.expressId){
//            this.getNotice('该物流方式已存在')
//            return false
//          }
//        }
        for(let i in this.modalExpress.expressCode){
          let opt = {
            id:'',
            templateId:'',
            expressId:this.modalExpress.expressCode[i],
            defaultTag:this.saveTemp.expressList.length ? 0 : 1,
            areaPriceList:[]
          }
          this.saveTemp.expressList.push(opt)
          this.addProvince(this.saveTemp.expressList.length-1)
        }
//        const opt = {
//          id:'',
//          templateId:'',
//          expressId:this.modalExpress.expressCode,
//          defaultTag:this.saveTemp.expressList.length ? 0 : 1,
//          areaPriceList:[]
//        }
//        this.saveTemp.expressList.push(opt)
//        this.addProvince(this.saveTemp.expressList.length-1)
        this.cancelExpress()
      },
      cancelExpress(){
        this.modalExpress.isShow = false
        this.modalExpress.expressCode = []
      },
      callSetDefaultExpress(){
//        this.saveTemp.expressList
        if(!this.saveTemp.expressList || !this.saveTemp.expressList.length){
          this.getNotice('暂无物流方式')
          return false
        }
        this.saveTemp.expressList.forEach((item)=>{
          if(item.defaultTag == 1){
            this.modalDefaultExpress.defaultExpressCode = item.expressId
          }
        })
//        console.log(this.modalDefaultExpress.defaultExpressCode)
        this.modalDefaultExpress.isShow = true
      },
      saveDefaultExpress(){
        this.saveTemp.expressList.forEach((item)=>{
           item.defaultTag = item.expressId == this.modalDefaultExpress.defaultExpressCode ? 1 : 0
        })
        this.cancelDefaultExpress()
//        console.log(this.modalDefaultExpress.defaultExpressCode)
      },
      cancelDefaultExpress(){
        this.modalDefaultExpress.isShow = false
        this.modalDefaultExpress.defaultExpressCode = ''
      },
      callSaveTemp(){
//        console.log(this.saveTemp)
        const res = /^[1-9]{1}[0-9]*$/g;
        const resFloat = /^[1-9]{1}[0-9]*(\.[0-9]{1,2})?$/g;
        if(this.saveTemp.freightSubmitType == 2 && !this.saveTemp.name){
          this.getNotice('请输入运费模板名称')
          return false
        }
        if(this.saveTemp.freightSubmitType == 2 && this.saveTemp.name.length > 10){
          this.getNotice('运费模板名称长度小于10')
          return false
        }
        if(this.saveTemp.freightSubmitType == 2 && !this.checkFreightStatus){
          this.getNotice('运费模板名称重复')
          return false
        }
        if(this.saveTemp.freightSubmitType == 1 && !this.saveTemp.freight){
          this.getNotice('请输入每订单运费')
          return false
        }
        if(this.saveTemp.freightSubmitType == 1 && this.saveTemp.freight != 0 && !(this.saveTemp.freight+'').match(resFloat)){
          this.getNotice('每订单运费支持两位小数')
          return false
        }
        if(this.saveTemp.freightSubmitType == 2 && !this.saveTemp.expressList){
          this.getNotice('请添加发货物流')
          return false
        }
        if(this.saveTemp.freightSubmitType == 2){
          for(let i in this.saveTemp.expressList){
            const _Opt = this.saveTemp.expressList[i]
            const expressName = this.mapExpressId[_Opt.expressId]
//            console.log(this.mapExpressId[_Opt.expressId])
            let _length = 0
            for(let j in _Opt.areaPriceList){
              const _Item = _Opt.areaPriceList[j]
              if(!_Item.provinceCodes){
                this.getNotice('请选择'+expressName+'物流的第'+(Number(j)+1)+'条的省份地区')
                return false
              }
              _length += _Item.provinceCodes.split(',').length
              if(!_Item.continueWeight || !_Item.continueWeightPrice || !_Item.firstWeight || !_Item.firstWeightPrice){
                this.getNotice('请选择'+expressName+'物流的第'+(Number(j)+1)+'条的重量金额信息')
                return false
              }
              if(!(_Item.continueWeight+'').match(res)  || !(_Item.firstWeight+'').match(res) ){
                this.getNotice(expressName+'物流的第'+(Number(j)+1)+'条的重量格式不正确')
                return false
              }
              if(!(_Item.continueWeightPrice+'').match(resFloat)  || !(_Item.firstWeightPrice+'').match(resFloat) ){
                this.getNotice(expressName+'物流的第'+(Number(j)+1)+'条的金额格式不正确')
                return false
              }
            }
            if(_length < 31){
              this.getNotice('请选择'+expressName+'物流的全部省份')
              return false
            }
          }
        }
        if(!this.saveTemp.reason){
          this.getNotice('请输入原因')
          return false
        }
        if(this.saveTemp.reason.length > 50){
          this.getNotice('原因字数大于50字')
          return false
        }
        let opt = JSON.parse(JSON.stringify(this.saveTemp))
        delete opt.updateTime
        delete opt.auditStatus
        delete opt.canUseTemplate
        delete opt.createTime
        delete opt.isAvailable
        delete opt.sendAddress
        this.saveFreightTemp(opt)
          .then(()=>{
            this.$router.push({
              path: '/freight/temp',
            })
          })
      },
      canUseTemplate(){
        this.saveTemp.freightSubmitType = 1
        this.modalTips.isShow = true
      },
      getNotice(msg){
        const notice = {
          isShow:true,
          msg:msg,
        }
        this.callSetNotice(notice)
      },
//      throttling(fn, t) {
//        var tid;
//        return function() {
//          var that = this,
//          args = arguments;
//          clearTimeout(tid);
//          tid = setTimeout(function() {
//            fn.apply(that, args);
//          }, t);
//        }
//      },
      checkName(){
        var tid;
        return (function() {
          clearTimeout(tid);
          tid = setTimeout(function() {
            this.checkNameBlur()
          }, 500);
        })()

      },
      initCheckName(){
        this.checkFreightStatus = true
      },
      checkNameBlur(){
        if(this.saveTemp.name){
          this.checkFreightName({name:this.saveTemp.name,shipAddress:this.shipAddressId})
            .then((rs)=>{
              if(rs){
                this.checkFreightStatus = false
              }
            })
        }
      },
    },
    watch: {
      'saveTemp.freightSubmitType':function(newVal,oldVal){
        if(newVal == 2 && !this.saveTemp.canUseTemplate){
          this.canUseTemplate()
        }
      }
    },
  }
</script>
<style lang='less' rel="stylesheet/less" scoped>
  .section-item-sign-wrap{
    margin-top: 8px;
  }
  .section-item-sign{
    text-align: left;
  }
  .inline-item{
    padding-left: 20px;
    width: 600px;
    .input-item-middle{
      width: 180px;
    }

  }
  .input-item-middle-express{
    width: 300px;
  }
  .block-item{
    padding-bottom: 0;
    .inline-item{
      padding: 0;
    }
  }
  .result-view{
    .line-wrap{
      .line-item{
        padding: 5px 0;
        border-top:1px solid #eee;
        &:nth-child(1){
          border: none;
        }
      }
      .input-item{
        width: 60px;
      }
    }

  }
  .section{
    .modal{
      .area-title{
        font-size: 20px;
      }
    }
  }
</style>
