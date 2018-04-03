<!--售后订单统计-->
<template>
  <div>
    <div class="title">
      <span>售后订单统计</span>
    </div>
    <div class="section">
      <div class="section-item">
        <div class="block-item">
          <span>时间筛选：</span>

          <!--<el-select  @change="selectTime()"  class="input-item" size="small"  v-model="marketSearch.label" placeholder="选择查询周期">-->
            <!--<template v-for="subItem in marketSearch.options">-->
              <!--<el-option  :label="subItem.label" :value="subItem.value"></el-option>-->
            <!--</template>-->
          <!--</el-select>-->
          <!--<el-date-picker  type="date"  class="input-item-middle" size="small"  v-model="searchOptions.payTimeStart" placeholder="起始查询时间"></el-date-picker>-->
          <!--<el-date-picker  type="date"  class="input-item-middle" size="small"  v-model="searchOptions.payTimeEnd" placeholder="结束查询时间"></el-date-picker>-->
         <!---->
          <el-date-picker @change="selectTime()" v-model="payTime" type="datetimerange" :picker-options="pickerOptions" placeholder="选择时间范围" >
          </el-date-picker>
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
        workOrderCreateTimeStart:'',
        workOrderCreateTimeEnd:'',
      },
      statisticsList:{
        configs: {
          itemNum:'',
          width: ''
        },
        items:[]
      },
      orderTrend : {
//        color:["#fb4b4d","#fb6b6d","#fb8b8d"],
//        color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
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
        toolbox: {
          feature: {
            saveAsImage: {}
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
            boundaryGap : false,
            data : []
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:'仅退款',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[]
          },
          {
            name:'退货退款',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[]
          },
          {
            name:'赔付',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[]
          },
          {
            name:'咨询',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[]
          },
          {
            name:'投诉',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[]
          },
          {
            name:'正常订单',
            type:'line',
            stack: '总量',
//            label: {
//              normal: {
//                show: true,
//                position: 'top'
//              }
//            },
            areaStyle: {normal: {}},
            data:[]
          }
        ]
      },
      afterSaleStatistics:{}
    }),
    methods: {
      ...mapActions(['getAfterSaleStatistics']),
      searchSubmit() {
         this.initView();
      },
      initView() {
          const start = this.payTime ? (this.payTime[0] ? this.payTime[0] : '') : ''
          const end = this.payTime ? (this.payTime[1] ? this.payTime[1] : '') : ''
          if(start && end){
            this.searchOptions.workOrderCreateTimeStart = Util.formatDate('yyyy-mm-dd hh:mm:ss',start)
            this.searchOptions.workOrderCreateTimeEnd = Util.formatDate('yyyy-mm-dd hh:mm:ss',end)
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
            this.searchOptions.workOrderCreateTimeStart = Util.formatDate('yyyy-mm-dd hh:mm:ss',startInit)
            this.searchOptions.workOrderCreateTimeEnd = Util.formatDate('yyyy-mm-dd hh:mm:ss',endInit)

          }
          this.getAfterSaleStatistics(this.searchOptions)
            .then((rs) => {
              this.afterSaleStatistics = rs
              this.setViewData()
          })
//        if(this.marketSearch.label){
//          const end = new Date();
//          const start = new Date();
//          const day = Number(this.marketSearch.label);
//          start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
//          this.searchOptions.payTimeStart = Util.formatDate('yyyy-mm-dd hh:mm:ss',start,'day')
//          this.searchOptions.payTimeEnd = Util.formatDate('yyyy-mm-dd hh:mm:ss',end,'day')
//        }
//        this.getAfterSaleStatistics(this.searchOptions)
//          .then(() => {
//            this.setViewData()
//          })
      },
      selectTime() {
        this.initView()
      },
      getOrderTrendData(list,key,dayList){
          let newList = [];
          if(!list || !list.length){
              return newList
          }
          switch (key){
            case 'day':
              list.map((item)=>{
                newList.push(item[key])
              })
              break
            case 'total':
              let _listObj = {}
              list.map((subItem)=>{
                _listObj[subItem.day] = subItem.total
              })
              dayList.map((item)=>{
                let val = _listObj[item] ? _listObj[item] : 0
                newList.push(val)
              })
//              list.map((item)=>{
//                let val = item[key] ? item[key] : 0
//                newList.push(val)
//              })
              break
          }
          return newList
      },
      setViewData() {
        const afterSale = {
          configs:{
            itemNum: 7,
            width: '142px',
            sort: 'start'
          },
          items:[
            {
              label: '仅退款',
              val: this.afterSaleStatistics.onlyRefundTotal+0,
              router:'/order/market',
              query:{
                page:1,
                rows:20,
                orderNumber:'',
                orderStatus:'',
                salesChannel:'',
                workOrderType:'1',
//                payTimeStart:this.searchOptions.payTimeStart,
//                payTimeEnd:this.searchOptions.payTimeEnd,
                createTimeStart:this.searchOptions.workOrderCreateTimeStart,
                createTimeEnd:this.searchOptions.workOrderCreateTimeEnd,
              }
             },
            {
              label: '退货退款',
              val: this.afterSaleStatistics.returnTotal+0,
              router:'/order/market',
              query:{
                page:1,
                rows:20,
                orderNumber:'',
                orderStatus:'',
                salesChannel:'',
                workOrderType:'2',
                //                payTimeStart:this.searchOptions.payTimeStart,
//                payTimeEnd:this.searchOptions.payTimeEnd,
                createTimeStart:this.searchOptions.workOrderCreateTimeStart,
                createTimeEnd:this.searchOptions.workOrderCreateTimeEnd,
              }
            },
            {
              label: '赔付',
              val: this.afterSaleStatistics.reparationTotal+0,
              router:'/order/market',
              query:{
                page:1,
                rows:20,
                orderNumber:'',
                orderStatus:'',
                salesChannel:'',
                workOrderType:'5',
                //                payTimeStart:this.searchOptions.payTimeStart,
//                payTimeEnd:this.searchOptions.payTimeEnd,
                createTimeStart:this.searchOptions.workOrderCreateTimeStart,
                createTimeEnd:this.searchOptions.workOrderCreateTimeEnd,
              }
            },
            {
              label: '咨询',
              val: this.afterSaleStatistics.consultTotal+0,
              router:'/order/market',
              query:{
                page:1,
                rows:20,
                orderNumber:'',
                orderStatus:'',
                salesChannel:'',
                workOrderType:'3',
                //                payTimeStart:this.searchOptions.payTimeStart,
//                payTimeEnd:this.searchOptions.payTimeEnd,
                createTimeStart:this.searchOptions.workOrderCreateTimeStart,
                createTimeEnd:this.searchOptions.workOrderCreateTimeEnd,
              }
            },
            {
              label: '投诉',
              val: this.afterSaleStatistics.complaintTotal+0,
              router:'/order/market',
              query:{
                page:1,
                rows:20,
                orderNumber:'',
                orderStatus:'',
                salesChannel:'',
                workOrderType:'4',
                //                payTimeStart:this.searchOptions.payTimeStart,
//                payTimeEnd:this.searchOptions.payTimeEnd,
                createTimeStart:this.searchOptions.workOrderCreateTimeStart,
                createTimeEnd:this.searchOptions.workOrderCreateTimeEnd,
              }
            },

            {
              label: '合计',
              val: this.afterSaleStatistics.onlyRefundTotal+this.afterSaleStatistics.returnTotal+this.afterSaleStatistics.reparationTotal+this.afterSaleStatistics.consultTotal+this.afterSaleStatistics.complaintTotal,
              router:'/order/market',
              query:{
                page:1,
                rows:20,
                orderNumber:'',
                orderStatus:'',
                salesChannel:'',
                workOrderType:'',
//                payTimeStart:this.searchOptions.payTimeStart,
//                payTimeEnd:this.searchOptions.payTimeEnd
                createTimeStart:this.searchOptions.workOrderCreateTimeStart,
                createTimeEnd:this.searchOptions.workOrderCreateTimeEnd,
              }
            },
            {
              label: '综合售后率',
              val: Number(this.afterSaleStatistics.afterSaleRatio)+'%',
            },
          ]
        }
        this.statisticsList = afterSale
//        this.orderTrend.legend.data = ['仅退款','退货退款','赔付','正常订单']
        this.orderTrend.legend.data = ['仅退款','退货退款','赔付','咨询','投诉']

        let _list = ['onlyRefundStatisticsList','returnStatisticsList','reparationStatisticsList','consultStatisticsList','complaintStatisticsList']
        let _days = []
        _list.map((item)=>{
          let _day = this.getOrderTrendData(this.afterSaleStatistics[item],'day')
          Array.prototype.push.apply(_days,_day)
        })
        let _dayList = Array.from(new Set(_days))
        _dayList.sort()
//        console.log(_dayList)
//        this.orderTrend.xAxis[0].data = this.getOrderTrendData(this.afterSaleStatistics.onlyRefundStatisticsList,'day')
        this.orderTrend.xAxis[0].data = _dayList
        this.orderTrend.series[0].data = this.getOrderTrendData(this.afterSaleStatistics.onlyRefundStatisticsList,'total',_dayList)
        this.orderTrend.series[1].data = this.getOrderTrendData(this.afterSaleStatistics.returnStatisticsList,'total',_dayList)
        this.orderTrend.series[2].data = this.getOrderTrendData(this.afterSaleStatistics.reparationStatisticsList,'total',_dayList)
        this.orderTrend.series[3].data = this.getOrderTrendData(this.afterSaleStatistics.consultStatisticsList,'total',_dayList)
        this.orderTrend.series[4].data = this.getOrderTrendData(this.afterSaleStatistics.complaintStatisticsList,'total',_dayList)
//        this.orderTrend.series[3].data = this.getOrderTrendData(this.afterSaleStatistics.normalOrderList,this.afterSaleStatistics.normalOrderList,'total')
        // onlyRefundStatisticsList		仅退款每天工单量，列表对象格式同最下方
        // returnStatisticsList		退款退货每天工单量，列表对象格式同最下方
        // reparationStatisticsList		赔付每天工单量，列表对象格式同最下方
        // normalOrderList		正常订单，列表对象格式同最下方
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
