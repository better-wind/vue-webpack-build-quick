<template>
  <div>
    <div class="title">
      <span>经营概况</span>
    </div>
    <div class="section">
      <div class="section-item o-h" >
        <div class="bulletin-view mg-r mg-t">
          <div class="section-title">
            <span>消息公告</span>
          </div>
          <div class="bulletin-item mg-t-h pd-r-h pd-l-h primary-bg">
            <template v-for="item in msgList">
              <div class="sub-item bd-t cur-pt o-h" @click="viewMsg(item.id)">
                <span v-if="item.readState" class="msg-read-state">已读</span>
                <span v-else class="msg-read-state read">未读</span>
                {{item.theme}}
                <span class="fl-r">{{item.pushTime}}</span>
              </div>
            </template>
          </div>
        </div>
        <div class="bulletin-view mg-r mg-t fl-r">
          <div class="section-title">
            <span>规则公告</span>
          </div>
          <div class="bulletin-item mg-t-h pd-r-h pd-l-h primary-bg">
            <template v-for="item in ruleList">
              <div class="sub-item bd-t cur-pt" @click="viewRule(item.ruleFirstId,item.id)">{{item.ruleName}}</div>
            </template>
          </div>
        </div>
      </div>
      <div class="section-item">
        <div class="section-title">
          <span>订单概况</span>
        </div>
      </div>
      <v-statistics :statisticsList="statisticsList.order" />
      <div class="echarts">
        <IEcharts :option="orderTrend"></IEcharts>
      </div>
      <div class="section-item">
        <div class="section-title">
          <span>商品概况</span>
        </div>
      </div>
      <v-statistics :statisticsList="statisticsList.product" />
      <div class="section-item mg-t">
        <div class="section-title">
          <span>活动概况</span>
        </div>
      </div>
      <v-statistics :statisticsList="statisticsList.activity" />
    </div>
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
import IEcharts from 'vue-echarts-v3';
import vStatistics from '@/components/tools/Statistics'
export default {
	name: 'operateCondition',
  created () {
	  this.initView()
  },
  computed: {
    ...mapState(['alertMsg','newGoods'])
  },
  data: () => ({
    orderTrend: {
      color:["#fb4b4d"],
      title: {
        text: "近十五日订单趋势",
        textStyle: {
          fontSize:14
        },
        x: "center"
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
//        data:['订单趋势']
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLabel:{
          interval:0,
          rotate:45,
          margin:2,
          textStyle:{
            color:"#222"
          }
        },
        data: []
      },
      yAxis:{
        type: 'value',
        name: '订单量',
        min: 0
      },
      series: [
        {
          name:'订单趋势',
          type:'line',
          data:[],
          markPoint: {
            data: [
              {type: 'max', name: '最大值'},
              {type: 'min', name: '最小值'}
            ]
          },
          markLine: {
            data: [
              {type: 'average', name: '平均值'}
            ]
          }
        },
      ]
    },
    readyData:false,
    statisticsList:{
      product:{
        configs: {
          itemNum: 5,
          width: '190px',
          sort: 'start'
        },
        items:[
          {
            label: '',
            val: '--'
          },
          {
            label: '',
            val: '--'
          },
          {
            label: '',
            val: '--'
          },
          {
            label: '',
            val: '--'
          },
          {
            label: '',
            val: '--'
          },
        ]
      },
      order:{
        configs: {
          itemNum: 5,
          width: '190px'
        },
        items:[
          {
            label: '待发货订单',
            val: 0
          },
          {
            label: '近7日售后订单',
            val: 0
          },
          {
            label: '超时发货订单',
            val: 0
          },
          {
            label: '发货未揽件数量',
            val: 0
          },
          {
            label: '近7日订单总量',
            val: 0
          },
        ]
      },
      activity:{
        configs: {
          itemNum: 5,
          width: '190px',
          sort: 'start'
        },
        items:[
          {
            label: '',
            val: '--'
          },
          {
            label: '',
            val: '--'
          },
          {
            label: '',
            val: '--'
          },
          {
            label: '',
            val: '--'
          },
          {
            label: '',
            val: '--'
          },
        ]
      }
    },
    ruleList:[],
    msgList:[],
    maxValue:0,
    survey:{}
  }),
	methods: {
    ...mapActions(['getSurvey','getTopRule','getTopMsg','']),
    initView() {
      let _opts = {
        url:this.newGoods ? '/summary/goodsDetailData' :  '/summary/detailData'
      }
      this.getSurvey(_opts)
        .then((rs) => {
          this.survey = rs
          this.setSurvey()
        })
      this.getTopRule()
        .then((rs)=>{
          this.ruleList = rs
        })
      this.callGetTopMsg()
    },
    callGetTopMsg(){
      this.getTopMsg()
        .then((rs)=>{
          this.msgList = rs
        })
    },
    setSurvey() {
      let activityItems = {},productItems = {}
      if(this.newGoods){
        activityItems = {
          configs:{
            itemNum: 3,
            width: '333px',
            sort: 'start'
          },
          items:[
            {
              label: '进行中大促活动',
              val: this.survey.activitySummary.processingCount,
              router:'/large/report',
              query:{
                page:1,
                rows:20,
                activityState:'1',
              }
            },
            {
              label: '已提报大促活动',
              val: this.survey.activitySummary.appliedPromotionCount,
              router:'/large/report',
              query:{
                page:1,
                rows:20,
                activityApplyState:'1'
              }
            },
            {
              label: '未提报大促活动',
              val: this.survey.activitySummary.unApplyPromotionCount,
              router:'/large/report',
              query:{
                page:1,
                rows:20,
                activityApplyState:'0'
              }
            },
          ]
        }
        productItems = {
          configs:{
            itemNum: 5,
            width: '200px',
            sort: 'start'
          },
          items:[
            {
              label: '审核中商品',
              val: this.survey.baseGoodsSummary.auditingCount,
              router:'/product/audit',
              query:{
                page:1,
                rows:20,
                isAudit:true,
                isAuditAgain:true
              }
            },
            {
              label: '审核未通过商品',
              val: this.survey.baseGoodsSummary.unPassAuditCount,
              router:'/product/audit',
              query:{
                page:1,
                rows:20,
                isFail:true
              }
            },
            {
              label: '销售中商品',
              val: this.survey.baseGoodsSummary.onSellProduct,
              router:'/product/list',
              query:{
                page:1,
                rows:20,
                saleStatus:'1'
              }
            },
            {
              label: '不在售商品',
              val: this.survey.baseGoodsSummary.outSellProduct,
              router:'/product/list',
              query:{
                page:1,
                rows:20,
                saleStatus:'0'
              }
            },
            {
              label: '可售商品总量',
              val: this.survey.baseGoodsSummary.totalProduct,
              router:'/product/list',
              query:{
                page:1,
                rows:20
              }
            },
          ]
        }
      } else {
        activityItems = {
          configs:{
            itemNum: 5,
            width: '200px',
            sort: 'start'
          },
          items:[
            {
              label: '进行中大促活动',
              val: this.survey.activitySummary.processingCount,
              router:'/large/report',
              query:{
                page:1,
                rows:20,
                activityState:'1',
              }
            },
            {
              label: '已提报大促活动',
              val: this.survey.activitySummary.appliedPromotionCount,
              router:'/large/report',
              query:{
                page:1,
                rows:20,
                activityApplyState:'1'
              }
            },
            {
              label: '未提报大促活动',
              val: this.survey.activitySummary.unApplyPromotionCount,
              router:'/large/report',
              query:{
                page:1,
                rows:20,
                activityApplyState:'0'
              }
            },
            {
              label: '已提报日常活动',
              val: this.survey.activitySummary.appliedDailyCount,
              router:'/daily/report',
              query:{
                page:1,
                rows:20,
                activityApplyState:'1'
              }
            },
            {
              label: '未提报日常活动',
              val: this.survey.activitySummary.unApplyDailyCount,
              router:'/daily/report',
              query:{
                page:1,
                rows:20,
                activityApplyState:'0'
              }
            },
          ]
        }
        productItems = {
          configs:{
            itemNum: 5,
            width: '200px',
            sort: 'start'
          },
          items:[
            {
              label: '未审核数量',
              val: this.survey.productSummary.unAuditCount,
              router:'/product/search',
              query:{
                page:1,
                rows:20,
                status:'1',

              }
            },
            {
              label: '审核中数量',
              val: this.survey.productSummary.auditingCount,
              router:'/product/search',
              query:{
                page:1,
                rows:20,
                status:'2',

              }
            },
            {
              label: '审核不通过数量',
              val: this.survey.productSummary.unPassAuditCount,
              router:'/product/search',
              query:{
                page:1,
                rows:20,
                status:'3',

              }
            },
            {
              label: '在售商品',
              val: this.survey.productSummary.onSellProduct,
              router:'/product/search',
              query:{
                page:1,
                rows:20,
                saleStatus:'1',

              }
            },
            {
              label: '不在售商品',
              val: this.survey.productSummary.outSellProduct,
              router:'/product/search',
              query:{
                page:1,
                rows:20,
                saleStatus:'0',
              }
            },
          ]
        }
      }
      this.statisticsList.activity = activityItems
      this.statisticsList.product = productItems

//        orderSummary
//        orderSummary.reviewOrder	int	待发货订单
//        orderSummary.customerServiceOrderSeven	int	近7日售后订单
//        orderSummary.orderYestoday	int	昨日订单总量
//        orderSummary.orderSeven	int	近7日订单总量
//        orderSummary.orderFifteen	list	近十五日订单趋势
      const startY = new Date();
      const startS = new Date();
      const endY = new Date();
      const endS = new Date();

      startY.setHours(0)
      startY.setMinutes(0)
      startY.setSeconds(0)
      endY.setHours(23)
      endY.setMinutes(59)
      endY.setSeconds(59)
      startY.setTime(startY.getTime() - 3600 * 1000 * 24 * 1)
      endY.setTime(endY.getTime() - 3600 * 1000 * 24 * 1)
      startS.setHours(0)
      startS.setMinutes(0)
      startS.setSeconds(0)
      endS.setHours(23)
      endS.setMinutes(59)
      endS.setSeconds(59)
      startS.setTime(startS.getTime() - 3600 * 1000 * 24 * 6)
      const orderItems = {
            configs:{
                itemNum: 5,
                width: '200px',
                sort:'start'
            },
            items:[
                {
                  label: '待发货订单',
                  val: this.survey.orderSummary.reviewOrder,
                  router:'/order/search',
                  query:{
                    page:1,
                    rows:20,
                    orderNumber:'',
                    orderStatus:'2',
                    orderType:'',
                    freezeStatus:'0',
                    logisticsNumber:'',
                    productCode:'',
                    productName:'',
                  }
                },
                {
                  label: '近7日售后订单',
                  val: this.survey.orderSummary.customerServiceOrderSeven,
                  router:'/order/market/statistics'
                },
                {
//                  label: '近7日超时发货订单',
                  label: '超时发货订单',
                  val: this.survey.orderSummary.expireOrderSeven,
//                  router:'/orderTimeOutStatistics',
                  router:'/order/timeout',
                  query:{
                    page:1,
                    rows:20,
                    orderNumber:'',
                    sellerId:'',
//                    isAllowComplain:'1',
                    isAllowComplain:'all',
                    penaltyAmountStart:'',
                    penaltyAmountEnd:'',
                    status:'all'
                  }
                },
                {
                  label: '发货未揽件数量',
                  val: this.survey.orderSummary.unEmbraceCount,
                  type:'click-export',
//                  router:'/orderSearch',
//                  query:{
//                    page:1,
//                    rows:20,
//                    orderNumber:'',
//                    orderStatus:'',
//                    orderType:'',
//                    freezeStatus:'',
//                    logisticsNumber:'',
//                    productCode:'',
//                    productName:'',
//                    payTimeStart:Util.formatDate('yyyy-mm-dd hh:mm:ss',startY),
//                    payTimeEnd:Util.formatDate('yyyy-mm-dd hh:mm:ss',endY)
//                  }
                },
                {
                  label: '近7日订单总量',
                  val: this.survey.orderSummary.orderSeven,
                  router:'/order/search',
                  query:{
                    page:1,
                    rows:20,
                    orderNumber:'',
                    orderStatus:'',
                    orderType:'',
                    freezeStatus:'',
                    logisticsNumber:'',
                    productCode:'',
                    productName:'',
                    payTimeStart:Util.formatDate('yyyy-mm-dd hh:mm:ss',startS),
                    payTimeEnd:Util.formatDate('yyyy-mm-dd hh:mm:ss',endS)
                  }
                },
            ]
        }
      this.statisticsList.order = orderItems
      this.orderTrend.title.text = '近十五日订单趋势'
      let orderFifteen = this.survey.orderSummary.orderFifteen
      let orderTrendDate = []
      let orderTrendData = []
      this.maxValue = 0
      if(orderFifteen){
        orderFifteen.forEach((item)=>{
          orderTrendDate.push(item.day)
          orderTrendData.push(item.total)
          if(item.total > this.maxValue){
            this.maxValue = item.total
          }
        })
      }
      this.orderTrend.xAxis.data = orderTrendDate
      this.orderTrend.series[0].data = orderTrendData
      this.orderTrend.yAxis.max = this.maxValue + 5
      this.readyData = true
    },
    viewRule(ruleFirstId,id) {
      this.$router.push({
        path: '/rules/center',
        query: {
          ruleFirstId:ruleFirstId,
          id:id
        }
      })
    },
    viewMsg(id) {
      this.$router.push({
        path: '/message/detail',
        query: {
          messageId:id
        }
      })
    },
	},
  components: {
    IEcharts,
    vStatistics
  },
  watch: {
    'alertMsg':function(newVal){
      if(!newVal){
        this.callGetTopMsg()
      }
    }
  },
}
</script>
<style scoped lang='less' rel="stylesheet/less">
  .section-item{
    padding: 0;
    padding-left:20px;
    background-color: transparent;
  }
  .echarts {
    width: auto;
    height: 400px;
    margin: 20px auto;
  }
  .bulletin-view{
    display: inline-block;
    width: 500px;
    .bulletin-item{
      .sub-item{
        line-height: 40px;
        &:nth-child(1){
          border-top: none;
        }
        .msg-read-state{
          display: inline-block;
          padding: 2px 5px;
          line-height: 20px;
          border-radius: 2px;
          background-color: #fff;
          &.read{
            background-color: #fb4b4d;
            color:#fff;
          }
        }
      }
    }
  }
</style>
