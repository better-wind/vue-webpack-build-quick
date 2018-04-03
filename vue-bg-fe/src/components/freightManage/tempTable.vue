<template>
  <el-table v-if="mapProvinceReady && mapExpressReady" :data="expressList" border style="width: 100%">
    <template v-for="configItem in configTable">
      <el-table-column v-if="configItem.type == 'single'" :prop="configItem.key" :label="configItem.label" :width="configItem.width" align="center">
        <template slot-scope="scope" >
          {{mapExpressId[scope.row[configItem.key]]}} <span v-if="scope.row.defaultTag == 1">(默认)</span>
        </template>
      </el-table-column>
      <el-table-column v-else  :label="configItem.label" :width="configItem.width" align="center">
        <template slot-scope="scope">
          <div class="line-wrap">
            <div class="line" style="padding: 0 10px" v-for="rowItem in scope.row[areaPriceKey]">

              <template v-if="configItem.type == 'map'" >
                <el-tooltip class="item" effect="dark" :content="rowItem[configItem.key].split(',').map((item)=>mapProvince[item]).join(',')" placement="top">
                  <p style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis">
                  <span  v-for="mapItem in rowItem[configItem.key].split(',')">
                   {{mapProvince[mapItem]}}
                 </span>
                  </p>
                </el-tooltip>


              </template>
              <template v-else>
                {{rowItem[configItem.key]}}
              </template>
            </div>
          </div>
        </template>
      </el-table-column>
    </template>

  </el-table>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  export default{
    computed:{
      ...mapState(['logisticsChannel','allCity'])
    },
    props:['expressList','areaPriceKey'],
    created(){
      this.initView()
    },
    data:()=>({
      configTable:[
        {
          label:'物流方式',
          type:'single',
          key:'expressId',
          width:'180'
        },
        {
          label:'省份地区',
          type:'',
          key:'provinceCodes',
          width:'',
          type:'map',
        },
        {
          label:'首重（克）',
          type:'',
          key:'firstWeight',
          width:'120'
        },
        {
          label:'首重金额（元）',
          type:'',
          key:'firstWeightPrice',
          width:'120'
        },
        {
          label:' 续重（克）',
          type:'',
          key:'continueWeight',
          width:'120'
        },
        {
          label:' 续重金额（元）',
          type:'',
          key:'continueWeightPrice',
          width:'120'
        },
      ],
      mapExpressId:{},
      mapProvince:{},
      mapExpressReady:false,
      mapProvinceReady:false,
    }),
    methods:{
      ...mapActions(['getLogisticsChannel','getAllCity']),
      initView(){
        if(!this.logisticsChannel.length){
          this.getLogisticsChannel()
            .then(() =>{
              this.setMapExpressId()
            })
        } else {
          this.setMapExpressId()
        }
        if (!localStorage.getItem('allCityStorage') || localStorage.getItem('allCityStorage').length < 10000) {
          this.getAllCity()
            .then(() =>{
              localStorage.setItem('allCityStorage',JSON.stringify(this.allCity.data))
              this.setMapProvince()
            })
        } else {
          this.setMapProvince()
        }
      },
      setMapExpressId(){
        const _this = this;
        this.logisticsChannel.forEach((item,idx)=>{
          _this.mapExpressId[item.code] = item.desc
        })
        this.mapExpressReady = true
      },
      setMapProvince(){
        const provinceList =  JSON.parse(localStorage.getItem('allCityStorage')).provinceList
        const _this = this;
        provinceList.forEach((item,idx)=>{
          _this.mapProvince[item.provinceId] = item.name
        })
        this.mapProvinceReady = true
      },
    },
  }
</script>
<style lang='less' rel="stylesheet/less" scoped>
  .line-wrap{
    .line{
      border-top: 1px solid #eee;
      &:nth-child(1){
         border-top: none;
      }
    }
  }
</style>
