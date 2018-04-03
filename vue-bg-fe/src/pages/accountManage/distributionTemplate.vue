<template>
    <div>
        <div class="title">
            <span>管理配送模板</span>
        </div>
        <p class="btn-wrap">
            <el-button type="primary" @click="showTplLayer">新增配送模板</el-button>
        </p>
        <div class="section">
            <div class="section-item" v-for="(item,index) in distributionList" :key="index">
                <div class="block-item o-h">
                  <span>模板名称：{{item.name}}</span>
                  <el-button class="fl-r" type="primary" size="small" @click="deleteTpl(index)">删除</el-button>
                  <el-button class="fl-r" style="margin-right: 10px" type="primary" size="small" @click="showTplLayer(index)">修改</el-button>

                </div>
                <div class="block-item">
                    <span v-if="item.type==1">限制类型：仅发以下地区</span>
                    <span v-else-if="item.type==2">限制类型：以下地区不发货</span>
                    <span v-else-if="item.type==3">限制类型：限制仅发货省份中的不发货区县</span>
                </div>
                <div class="block-item">
                    <span>限制地区：{{limitAreaNameList[index]}}</span>
                </div>
                <div class="block-item" v-if="item.exceptAreaList&&item.exceptAreaList.length>0">
                    <span>例外地区：{{exceptAreaNameList[index]}}</span>
                </div>
                <div class="block-item">
                    <span>模板描述：{{item.desc}}</span>
                </div>
            </div>
        </div>
        <div class="layer-bg tpl-layer" v-show="tplLayer.show">
            <div class="price-ct">
                <h1>{{ tplLayer.title }}</h1>
                <div class="input-ct">
                    <p>
                        <span>模板名称：</span>
                        <el-input v-model="tplLayer.inputName" placeholder="请输入内容"></el-input>
                    </p>
                    <p>
                        <span>限制类型：</span>
                        <el-radio-group v-model="tplLayer.radioType">
                            <el-radio :label="1">仅发以下地区</el-radio>
                            <el-radio :label="2">以下地区不发货</el-radio>
                        </el-radio-group>
                    </p>
                    <p>
                        <span>限制地区：</span>
                    </p>
                    <p v-for="(obj,i) in tplLayer.cityArr" :key="i">
                        <template>
                            <el-checkbox :indeterminate="obj.isIndeterminate" v-model="obj.checkAll" @change="handleCheckAllChange(i,$event)">{{obj.name}}</el-checkbox>
                            <el-checkbox-group v-model="obj.checkedCities" @change="handleCheckedCitiesChange(i)">
                                <el-checkbox v-for="(city,j) in obj.cities" :label="city" :key="city.id">{{city.name}}</el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </p>
                    <p>
                        <span>例外地区：</span>
                        <el-button type="primary" size="small" @click="addOneExceptArea">添加</el-button>
                    </p>
                  <!--oneExcept.localAllCity.provinceList-->
                    <p v-for="(oneExcept,i) in tplLayer.exceptList" :key="i">
                        <el-select v-model="oneExcept.selectedProvince" placeholder="省" @visible-change="visibleSelectLevel" @change="changeProvinve(i)">
                            <el-option
                              v-for="(item,index) in tplLayer.filteredProvinceList"
                              :key="index"
                              :label="item.name"
                              :value="item.provinceId">
                            </el-option>
                        </el-select>
                        <el-select v-model="oneExcept.selectedCity" placeholder="市" v-show="oneExcept.cityShow" @visible-change="visibleSelectLevel" @change="changeCity(i)">
                            <el-option
                              v-for="(item,index) in oneExcept.localAllCity.cityList"
                              :key="index"
                              :label="item.name"
                              :value="item.cityId">
                            </el-option>
                        </el-select>
                        <el-select v-model="oneExcept.selectedDistrict" placeholder="区" @visible-change="visibleSelectLevel" v-show="oneExcept.districtShow">
                            <el-option
                              v-for="(item,index) in oneExcept.localAllCity.districtList"
                              :key="index"
                              :label="item.name"
                              :value="item.districtId">
                            </el-option>
                        </el-select>
                        <el-button type="primary" size="small" @click="deleteOneExceptArea(i)">删除</el-button>
                    </p>
                    <p>
                        <span>模板描述：</span>
                        <el-input v-model="tplLayer.inputDesc" placeholder="请输入内容"></el-input>
                    </p>
                </div>
                <div class="btns-wrap">
                    <el-button type="primary" @click="saveTpl">确 定</el-button>
                    <el-button @click="cancelTpl">取 消</el-button>
                </div>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny">
            <span>确定删除【{{distributionListName}}】模板？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        name: 'distributionTemplate',
        created (){
            this.initView()
        },
        data: ()=>({
          visSelect:false,
            tplLayer: {
                show: false,
                title: '',
                inputName: '',
                inputDesc: '',
                radioType: 1,
                index: 0,
                cityArr: [
                    {
                        name: '华东',
                        cities: [
                            {name:'上海',id:"310000"},
                            {name:'江苏',id:"320000"},
                            {name:'浙江',id:"330000"},
                            {name:'安徽',id:"340000"},
                            {name:'山东',id:"370000"},
                            {name:'福建',id:"350000"},
                            {name:'江西',id:"360000"}
                        ],
                        checkAll: false,
                        checkedCities: [],
                        isIndeterminate: false
                    },
                    {
                        name: '华北',
                        cities: [
                            {name:'北京',id:"110000"},
                            {name:'天津',id:"120000"},
                            {name:'河北',id:"130000"},
                            {name:'山西',id:"140000"},
                            {name:'内蒙古',id:"150000"},
                        ],
                        checkAll: false,
                        checkedCities: [],
                        isIndeterminate: false
                    },
                    {
                        name: '华中',
                        cities: [
                            {name:'湖北',id:"420000"},
                            {name:'湖南',id:"430000"},
                            {name:'河南',id:"410000"},
                        ],
                        checkAll: false,
                        checkedCities: [],
                        isIndeterminate: false
                    },
                    {
                        name: '华南',
                        cities: [
                            {name:'广东',id:"440000"},
                            {name:'广西',id:"450000"},
                            {name:'海南',id:"460000"},
                        ],
                        checkAll: false,
                        checkedCities: [],
                        isIndeterminate: false
                    },
                    {
                        name: '东北',
                        cities: [
                            {name:'辽宁',id:"210000"},
                            {name:'吉林',id:"220000"},
                            {name:'黑龙江',id:"230000"},
                        ],
                        checkAll: false,
                        checkedCities: [],
                        isIndeterminate: false
                    },
                    {
                        name: '西北',
                        cities: [
                            {name:'宁夏',id:"640000"},
                            {name:'新疆',id:"650000"},
                            {name:'青海',id:"630000"},
                            {name:'陕西',id:"610000"},
                            {name:'甘肃',id:"620000"},
                        ],
                        checkAll: false,
                        checkedCities: [],
                        isIndeterminate: false
                    },
                    {
                        name: '西南',
                        cities: [
                            {name:'四川',id:"510000"},
                            {name:'云南',id:"530000"},
                            {name:'贵州',id:"520000"},
                            {name:'西藏',id:"540000"},
                            {name:'重庆',id:"500000"},
                        ],
                        checkAll: false,
                        checkedCities: [],
                        isIndeterminate: false
                    }
                ],
                exceptList: [
                    // {
                    //     selectedProvinceName: '',
                    //     selectedCityName: '',
                    //     selectedDistrictName: '',
                    //     selectedProvince: '',
                    //     selectedCity: '',
                    //     selectedDistrict: '',
                    //     cityShow: false,
                    //     districtShow: false,
                    //     localAllCity: {
                    //         provinceList: [],
                    //         cityList: [],
                    //         districtList: []
                    //     },
                    // }
                ],
                filteredProvinceList: []
            },
            limitAreaNameList: [],
            exceptAreaNameList: [],
            localAllCity: {
                provinceList: [],
                cityList: [],
                districtList: []
            },
            dialogVisible: false,
            index: null,
            distributionListName:'',
          distributionList:[]
        }),
        computed: {
            ...mapState(['allCity'])
        },
        methods: {
            ...mapActions(['getDistributionTemplate','deleteDeliverTpl','saveDeliverTpl','getAllCity','callSetNotice']),
          visibleSelectLevel(val){
            this.visSelect = true
          },
            showTplLayer(index){
              if(typeof(index) != 'number'){
                if(this.distributionList.length > 4){
                  this.getNotice('配送模板最多只允许存在五个')
                  return false
                }
              }
                document.body.setAttribute('style','overflow:hidden')
                this.index = typeof(index) === 'number'?index:null
                this.tplLayer.title = this.index===null?'新增配送模板':'修改配送模板'
                this.tplLayer.show = true
                if(typeof(index) === 'number'){
                    var _thisTplObj = this.distributionList[index]
                    this.tplLayer.inputName = _thisTplObj.name
                    this.tplLayer.inputDesc = _thisTplObj.desc
                    this.tplLayer.radioType = _thisTplObj.type
                    var _this = this
                    //初始化清空选中项
                    _this.tplLayer.cityArr.map(function(a,b){
                        a.checkedCities = []
                    })

                    _thisTplObj.limitAreaList.map(function(item,x){
                        _this.tplLayer.cityArr.map(function(one,y){
                            one.cities.map(function(obj,z){
                                if (obj.id == item.provinceCode) {
                                    one.checkedCities.push(obj)
                                }
                            })
                          one.checkAll = one.cities.length == one.checkedCities.length ? true : false
                        })
                    })
                    _this.tplLayer.exceptList = []
//                    _this.tplLayer.exceptList.push([])
//                    _this.tplLayer.exceptList.pop()
                    _thisTplObj.exceptAreaList.map(function(item,x){
                        _this.tplLayer.exceptList.push({
                            // selectedProvinceName: _this.codeTransName(item.provinceCode,1),
                            // selectedCityName: _this.codeTransName(item.cityCode,2),
                            // selectedDistrictName: _this.codeTransName(item.districtCode,3),
                            selectedProvince:item.provinceCode ? _this.codeTransName(item.provinceCode,1) : '',
                            selectedCity: item.cityCode ? _this.codeTransName(item.cityCode,2) : '',
                            selectedDistrict:item.districtCode ? _this.codeTransName(item.districtCode,3) : '',
                            cityShow: true,
                            districtShow: true,
                            localAllCity: {
                                provinceList: _this.tplLayer.filteredProvinceList,
                                cityList: _this.getInitSelectOpts(item.provinceCode,1),
                                districtList: _this.getInitSelectOpts(item.cityCode,2)
                            },
                        })
                    })
                    this.filteredProvince()
                }
                else{
                    this.tplLayer.inputName = ''
                    this.tplLayer.inputDesc = ''
                    this.tplLayer.radioType = 1
                    this.tplLayer.cityArr.map(function(item,index){
                        item.checkedCities = []
                    })
                    this.tplLayer.exceptList = []
                }
            },
            cancelTpl(){
//                return false
              document.body.removeAttribute('style')
              this.tplLayer.cityArr.map((item)=>{
                item.checkAll = false
                item.checkedCities = []
                item.isIndeterminate = false
              })
              this.visSelect = false
              this.tplLayer.show = false
            },
            initView() {
//              Object.prototype.toString.call(localStorage.getItem('allCityStorage')) === '[object Object]'
                if (!localStorage.getItem('allCityStorage') || localStorage.getItem('allCityStorage').length < 10000) {
                    this.getAllCity()
                        .then(() =>{
                          localStorage.setItem('allCityStorage',JSON.stringify(this.allCity.data))
                          this.changeList()
                        })
                } else {
                  this.changeList()
                }
            },
            changeList() {
                var _this = this;
                var allList = JSON.parse(localStorage.getItem('allCityStorage'))
                this.localAllCity.provinceList = allList.provinceList
                this.localAllCity.cityList = allList.cityList
                this.localAllCity.districtList = allList.districtList
                _this.limitAreaNameList = []
                _this.exceptAreaNameList = []

                this.getDistributionTemplate()
                    .then((rs) =>{
                        //遍历城市编码转换城市名称

                      _this.distributionList = rs
                      _this.distributionList.map(function(oneTpl, i) {
                            var totalProvinceName = '',
                                totalExceptName = '',
                                m = 0,
                                x = 0,
                                y = 0,
                                z = 0;
                            //遍历限制地区
                            oneTpl.limitAreaList.map(function(oneArea, j){
                                while(allList.provinceList[m].provinceId !== oneArea.provinceCode){
                                    m++
                                }
                                totalProvinceName += allList.provinceList[m].name+' '
                                m = 0
                            })
                            _this.limitAreaNameList.push(totalProvinceName)

                            //遍历例外地区
                            oneTpl.exceptAreaList.map(function(oneArea, j){
//                                console.log(oneArea)
                                if(oneArea.provinceCode){
                                  while(allList.provinceList[x].provinceId !== oneArea.provinceCode){
                                    x++
                                  }
                                  totalExceptName += allList.provinceList[x].name
                                }

                                if(oneArea.cityCode){
                                  while(allList.cityList[y].cityId !== oneArea.cityCode){
                                    y++
                                  }
                                  totalExceptName += allList.cityList[y].name
                                }
                                if(oneArea.districtCode){
//                                  console.log(allList.districtList.length)
                                  while(allList.districtList[z].districtId !== oneArea.districtCode){
                                    z++
                                    if(z == allList.districtList.length){
                                        break
                                    }
                                  }
                                  totalExceptName += z == allList.districtList.length ? '' : allList.districtList[z].name
                                }
                                totalExceptName += ' '
                                x=y=z=0

                            })
                            _this.exceptAreaNameList.push(totalExceptName)
                        });
                    })
            },
            deleteTpl(index){
                this.index = index
                this.distributionListName = this.distributionList[index].name
                this.dialogVisible = true
            },
            getInitSelectOpts(code,type){
//              console.log(code+'---'+type)
              var allList = JSON.parse(localStorage.getItem('allCityStorage'))
              let listName = type == 1 ? 'cityList' : 'districtList'
              let idName = type == 1 ? 'provinceId' : 'cityId'
              let arr = allList[listName].filter(function(v,i){
                if (v[idName] == code) {
                  return v
                }
              });
//              console.log(arr)
              return arr
            },
            changeProvinve(i){

                var allList = JSON.parse(localStorage.getItem('allCityStorage'))
                var _thisList = this.tplLayer.exceptList[i]
                _thisList.localAllCity.cityList = allList.cityList.filter(function(v,i){
                    if (v.provinceId == _thisList.selectedProvince) {
                        return v
                    }
                });
              if(this.visSelect){
                _thisList.selectedCity = ''
                _thisList.selectedDistrict = ''
              }

//              if(this.visSelect){
//                _thisList.cityShow = true
//                _thisList.selectedCity = ''
//              } else {
//                if(_thisList.selectedCity){
//                  _thisList.cityShow = true
//                }
//              }

            },
            changeCity(i){
                var allList = JSON.parse(localStorage.getItem('allCityStorage'))
                var _thisList = this.tplLayer.exceptList[i]
                _thisList.localAllCity.districtList = allList.districtList.filter(function(v,i){
                    if (v.cityId == _thisList.selectedCity) {
                        return v
                    }
                });
              if(this.visSelect){
                _thisList.selectedDistrict = ''
              }

//              if(this.visSelect){
//                _thisList.districtShow = true
//                _thisList.selectedDistrict = ''
//              } else {
//                if(_thisList.selectedDistrict){
//                  _thisList.districtShow = true
//                }
//              }

            },
            addOneExceptArea(){
                this.tplLayer.exceptList.push({
                    selectedProvince: '',
                    selectedCity: '',
                    selectedDistrict: '',
                    cityShow: true,
                    districtShow: true,
                    localAllCity: {
                        provinceList: this.tplLayer.filteredProvinceList,
                        cityList: [],
                        districtList: []
                    },
                })
            },
            deleteOneExceptArea(i){
                this.tplLayer.exceptList.splice(i,1)
            },
            saveTpl(){
                //遍历出limitAreaList
                var _thisCityArr = this.tplLayer.cityArr,
                    limitAreaList = [],
                    exceptAreaList = [],
                    _self = this;
                if(!this.tplLayer.inputName){
                    this.getNotice('请输入运费模板名称')
                  return false
                }
                if(!this.tplLayer.inputDesc){
                  this.getNotice('请输入运费模板描述')
                  return false
                }
                _thisCityArr.map(function(item,i){
                    item.checkedCities.map(function(city,j){
                        limitAreaList.push({
                            provinceCode: city.id,
                            cityCode: 1,
                            districtCode: 1,
                        })
                    })
                })

                //遍历出exceptAreaList

                this.tplLayer.exceptList.map(function(item,i){
                    let _opt = {
                      provinceCode: item.selectedProvince.match(/^\d*$/g) ? item.selectedProvince : _self.nameTransCode(item.selectedProvince,1),
                      cityCode: item.selectedCity.match(/^\d*$/g) ? item.selectedCity : _self.nameTransCode(item.selectedCity,2),
                      districtCode: item.selectedDistrict.match(/^\d*$/g) ? item.selectedDistrict : _self.nameTransCode(item.selectedDistrict,3),
                    }
                  _opt.provinceCode = _opt.provinceCode ? _opt.provinceCode : 1
                  _opt.cityCode = _opt.cityCode ? _opt.cityCode : 1
                  _opt.districtCode = _opt.districtCode ? _opt.districtCode : 1
                    exceptAreaList.push(_opt)
                })


                const opts = {
                  id: this.index === null?'':this.distributionList[this.index].id,
//                    sellerId: this.distributionList[0].sellerId,
                  name: this.tplLayer.inputName,
                  desc: this.tplLayer.inputDesc,
                  type: this.tplLayer.radioType,
                  limitAreaList: limitAreaList,
                  exceptAreaList: exceptAreaList
                }

//                console.log(opts)
//                return false
              this.saveDeliverTpl(opts).then(()=>{
                    this.changeList()
                    this.cancelTpl()
//                    this.tplLayer.show = false
                })
            },
            confirmDelete(){
                this.deleteDeliverTpl({
                    templateId: this.distributionList[this.index].id
                }).then(() =>{
                    this.changeList()
                    this.dialogVisible = false
                })
            },
            handleCheckAllChange(i,event) {
                var _thisCityObj = this.tplLayer.cityArr[i]
                _thisCityObj.checkedCities = event.target.checked ? _thisCityObj.cities : [];
                _thisCityObj.isIndeterminate = false;
                this.filteredProvince()
            },
            handleCheckedCitiesChange(i) {
                var _thisCityObj = this.tplLayer.cityArr[i]
                var checkedCount = _thisCityObj.checkedCities.length;
                _thisCityObj.checkAll = checkedCount === _thisCityObj.cities.length;
                _thisCityObj.isIndeterminate = checkedCount > 0 && checkedCount < _thisCityObj.cities.length;
                this.filteredProvince()
            },
            filteredProvince(){
                //下拉菜单只出现限制地区选中的选项
                var _thisCityArr = this.tplLayer.cityArr,
                    selectedList = [];
                _thisCityArr.map(function(item,i){
                    item.checkedCities.map(function(city,j){
                        selectedList.push(city.id)
                    })
                })
              this.tplLayer.filteredProvinceList = this.localAllCity.provinceList.filter(function(v,i){
                    for(var j=0,length=selectedList.length;j<length;j++){
                        if (selectedList[j] == v.provinceId) {
                            return v
                        }
                    }
                })
              let delList = []
              this.tplLayer.exceptList.map((item,i)=>{
                const code = item.selectedProvince.match(/^\d*$/g) ? item.selectedProvince : this.nameTransCode(item.selectedProvince,1)
                let check = false
                this.tplLayer.cityArr.map((city)=>{
                    city.checkedCities.map((cityItem)=>{
                      if(cityItem.id == code){
                        check = true
                      }
                    })
                  })
                if(!check){
                    delList.push(i)
                  }

              })
              this.tplLayer.exceptList = this.tplLayer.exceptList.filter((item,i)=>{
                let check = true
                delList.map((item) => {
                    if(i == item){
                        check = false
                    }
                })
                 return check
              })

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
                          if(i == allList.districtList.length){
                                break
                          }
                        }
                        return i == allList.districtList.length ? '' : allList.districtList[i].name
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
  .section-item{
    margin: 0px 20px 20px;
    background-color: #f5f5f5;
  }
    .btn-wrap {

        margin: 20px;
    }
    .layer-bg {
        position: fixed;
        top: 0;
        left: 0;
        right:0;
        bottom:0;
        z-index: 999;
        background-color: rgba(0,0,0,0.5);
        >div {
            width: 650px;
            min-height: 450px;
            box-sizing: border-box;
            padding: 20px;
            margin: auto;
            position: absolute;
            left: 50%;
            top: 110px;
            transform: translate(-50%,0);
            background-color: #fff;
            border-radius: 6px;
            max-height: 80%;
            overflow-y: scroll;
            >h1 {
                text-align: center;
                line-height: 20px;
                margin-bottom: 50px;
            }
            .input-ct {
                >p {
                    overflow: hidden;
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
    .el-checkbox {
        float: left;
        margin-right: 10px;
    }
</style>
