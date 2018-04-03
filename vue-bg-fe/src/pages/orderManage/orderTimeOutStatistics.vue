<!--售后订单统计-->
<template>
  <div>
    <div class="title">
      <span>超时订单统计</span>
    </div>
    <div class="section">
      <div class="section-item">
        <div class="block-item">
          <span>时间筛选：</span>
          <el-date-picker @change="selectTime()" v-model="payTime" type="datetimerange" :picker-options="pickerOptions" placeholder="选择时间范围" ></el-date-picker>
        </div>
      </div>
      <v-statistics :statisticsList="statisticsList" />
      <section class="echarts">
        <IEcharts :option="orderTrend"></IEcharts>
      </section>
    </div>
  </div>
</template>
<script>
  import IEcharts from 'vue-echarts-v3';
  import vStatistics from '@/components/tools/Statistics';
//  import Util from '../../assets/js/common/utils'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'orderMarketStatistics',
    computed: {
      ...mapState(['afterSaleStatistics'])
    },
    created (){
      this.initView()
    },
    data: () => ({
      payTime:'',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setHours(23)
              end.setMinutes(59)
              end.setSeconds(59)
              start.setHours(0)
              start.setMinutes(0)
              start.setSeconds(0)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近半个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setHours(23)
              end.setMinutes(59)
              end.setSeconds(59)
              start.setHours(0)
              start.setMinutes(0)
              start.setSeconds(0)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setHours(23)
              end.setMinutes(59)
              end.setSeconds(59)
              start.setHours(0)
              start.setMinutes(0)
              start.setSeconds(0)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      marketSearch: {
        label:'7',
        options:[
          {
            value:'7',
            label:'最近一周'
          },
          {
            value:'15',
            label:'最近15日'
          },
          {
            value:'30',
            label:'最近一个月'
          }
        ]
      },
      searchOptions: {
        payTimeStart:'',
        payTimeEnd:'',
      },
      statisticsList:{
        configs: {
          itemNum:'',
          width: ''
        },
        items:[]
      },
      orderTrend : {
        title: {
          text: ''
        },
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data:[]
        },
//        toolbox: {
//          feature: {
//            saveAsImage: {}
//          }
//        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
//            boundaryGap : false,
            data : [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis : [
          {
            type : 'value',
            name: '订单量',
            min: 0,
          }
        ],
        series : [
          {
            name:'全部订单',
            type:'line',
//            stack: '总量',
//            areaStyle: {normal: {}},
            data:[]
          },
          {
            name:'超时发货',
            type:'bar',
//            stack: '总量',
//            areaStyle: {normal: {}},
            data:[]
          },
          {
            name:'待发货',
            type:'bar',
//            stack: '总量',
//            areaStyle: {normal: {}},
            data:[]
          },
        ]
      },
      maxValue:0,
    }),
    methods: {
      ...mapActions(['getDeliveryStatistic']),
      searchSubmit() {
        this.initView();
      },
      initView() {
        const start = this.payTime ? (this.payTime[0] ? this.payTime[0] : '') : ''
        const end = this.payTime ? (this.payTime[1] ? this.payTime[1] : '') : ''
        if(start && end){
          this.searchOptions.payTimeStart = Util.formatDate('yyyy-mm-dd hh:mm:ss',start)
          this.searchOptions.payTimeEnd = Util.formatDate('yyyy-mm-dd hh:mm:ss',end)
        } else {
          const endInit = new Date();
          const startInit = new Date();
          const day = Number(this.marketSearch.label-1);
          endInit.setHours(23)
          endInit.setMinutes(59)
          endInit.setSeconds(59)
          startInit.setHours(0)
          startInit.setMinutes(0)
          startInit.setSeconds(0)
          startInit.setTime(startInit.getTime() - 3600 * 1000 * 24 * day);
          this.payTime = [startInit,endInit]
          this.searchOptions.payTimeStart = Util.formatDate('yyyy-mm-dd hh:mm:ss',startInit)
          this.searchOptions.payTimeEnd = Util.formatDate('yyyy-mm-dd hh:mm:ss',endInit)
        }
        let _nextOpts = Object.assign({},this.searchOptions)
        let _checkEndTime = new Date(_nextOpts.payTimeEnd),
            _checkNowTime = new Date()
        if(_checkEndTime.getTime() > _checkNowTime.getTime()){
           _checkEndTime.setTime(_checkNowTime.getTime() - 3600 * 1000 / 2)
        }
        _nextOpts.payTimeEnd = Util.formatDate('yyyy-mm-dd hh:mm:ss',_checkEndTime)
        this.getDeliveryStatistic(_nextOpts)
          .then(() => {
            this.setViewData()
          })
      },
      selectTime() {
        this.initView()
      },
      getOrderTrendData(list,key){
        let newList = [];
        if(key == 'day'){
          for(let i in list){
            newList.push(list[i][key])
          }
        }
        else{
          for(let i in list){
            let val = 0
            if(list[i]){
              val = list[i][key] ? list[i][key] : 0
            } else{
              val = 0
            }
            if(this.maxValue < val){
              this.maxValue = val
            }
            newList.push(val)
          }
        }
        return newList
      },
      setViewData() {
        const afterSale = {
          configs:{
            itemNum: 4,
            width: '250px',
            sort: 'end'
          },
          items:[
            {
              label: '订单总数',
              val: this.afterSaleStatistics.totalCount+0
            },
            {
              label: '准时发货',
              val: this.afterSaleStatistics.noExpireCount+0,
            },
            {
              label: '超时发货',
              val: this.afterSaleStatistics.expireAndSendCount+0,
              router:'/order/timeOut',
              query:{
                page:1,
                rows:20,
                orderNumber:'',
                sellerId:'all',
                isAllowComplain:'1',
                penaltyAmountStart:'',
                penaltyAmountEnd:'',
                status:'all'
              }
            },
//            {
//              label: '超时未发货',
//              val: this.afterSaleStatistics.expireAndNoSendCount+0,
//              router:'/orderSearch',
//              query:{
//                page:1,
//                rows:20,
//                orderNumber:'',
//                orderStatus:'2',
//                orderType:'',
//                freezeStatus:'',
//                logisticsNumber:'',
//                productCode:'',
//                productName:'',
//                payTimeStart:this.searchOptions.payTimeStart,
//                payTimeEnd:this.searchOptions.payTimeEnd
//              }
//            },
            {
              label: '待发货',
              val: this.afterSaleStatistics.waitSendCount+0,
              router:'/order/search',
              query:{
                page:1,
                rows:20,
                orderNumber:'',
                orderStatus:'2',
                orderType:'',
                freezeStatus:'',
                logisticsNumber:'',
                productCode:'',
                productName:'',
                payTimeStart:this.searchOptions.payTimeStart,
                payTimeEnd:this.searchOptions.payTimeEnd
              }
            },
          ]
        }
        this.statisticsList = afterSale
        this.maxValue = 0
        this.orderTrend.legend.data = ['全部订单','超时发货','待发货']
        this.orderTrend.xAxis[0].data = this.getOrderTrendData(this.afterSaleStatistics.orderDayStatistics,'day')
        this.orderTrend.series[0].data = this.getOrderTrendData(this.afterSaleStatistics.orderDayStatistics,'total')
        this.orderTrend.series[1].data = this.getOrderTrendData(this.afterSaleStatistics.expireDayStatistics,'total')
        this.orderTrend.series[2].data = this.getOrderTrendData(this.afterSaleStatistics.waitSendDayStatistics,'total')
        this.orderTrend.yAxis[0].max = this.maxValue + 20
      },
    },
    components: {
      vStatistics,
      IEcharts
    }
  }
</script>
<style scoped lang='less' rel="stylesheet/less">
  .echarts {
    width: auto;
    height: 400px;
    margin: 0 auto;
  }
</style>
