<template>
  <div>
    <div class="title">
      <span>发票管理</span>
    </div>
    <div class="section">
      <v-search-item />
      <div class="market-box">
        <div class="market-sign primary-color">
          <p>注：在15个自然日内完成开票相关工作</p>
          <p>商家不得私自联系消费者处理开票事宜，如违约按照《平台合作协议》要求每联系一个客户，应支付违约金人民币500元。</p>
          <p>开票信息异常请反馈邮箱huangqq@gegejia.com。</p>
        </div>
        <v-search-menu />
      </div>
      <v-search-result />
    </div>
  </div>
</template>
<script>
  import vSearchItem from '@/components/invoiceManage/searchItem'
  import vSearchMenu from '@/components/invoiceManage/searchMenu'
  import vSearchResult from '@/components/invoiceManage/searchResult'
  import {mapState, mapActions} from 'vuex'
  export default{
    name:'',
    created(){
        this.initView()
    },
    computed: {
      ...mapState(['currentSearch'])
    },
    data: ()=>({
        invoiceSearch:{
          searchList:{
            public:[
              {
                type:'',
                key:'page',
                intKey:1
              },
              {
                type:'',
                key:'rows',
                intKey:20
              },
              {
                type: 'date-picker',
                label: '推送时间',
                placeholder:'请选择',
                key: 'auditTimeStart',
                checkNextDate:'auditTimeEnd',
                split:true
              },
              {
                type: 'date-picker',
                label: '',
                placeholder:'请选择',
                key: 'auditTimeEnd',
                checkPreDate:'auditTimeStart'
              },
              {
                type: 'input',
                label: '订单编号',
                placeholder:'请输入内容',
                key: 'orderNumber'
              },
              {
                type: 'select',
                label: '开票进度',
                placeholder:'请选择',
                key: 'status',
                selectType:'selectAll',
                options:[
                  {
                    value: 'all',
                    label: '全部'
                  },
//                  {
//                    value: '0',
//                    label: '待审核'
//                  },
                  {
                    value: '1',
                    label: '待开票'
                  },
//                  {
//                    value: '2',
//                    label: '待修改'
//                  },
                  {
                    value: '3',
                    label: '开票完成'
                  },
                  {
                    value: '4',
                    label: '取消'
                  }
                ]
              },
              {
                type: 'date-picker',
                label: '开票时间',
                placeholder:'请选择',
                key: 'applyTimeStart',
                checkNextDate:'applyTimeEnd',
                split:true
              },
              {
                type: 'date-picker',
                label: '',
                placeholder:'请选择',
                key: 'applyTimeEnd',
                checkPreDate:'applyTimeStart'
              },
              {
                type: 'select',
                label: '发票类型',
                placeholder:'请选择',
                key: 'type',
                selectType:'selectAll',
                options:[
                  {
                    value: 'all',
                    label: '全部'
                  },
                  {
                    value: '0',
                    label: '普通发票'
                  },
                  {
                    value: '1',
                    label: '专用发票'
                  },
                ]
              },
              {
                type: 'select',
                label: '销售渠道',
                placeholder:'请选择',
                key: 'orderType',
                selectType:'selectAll',
                options:[
                  {
                    value: 'all',
                    label: '全部'
                  },
                  {
                    value: '1',
                    label: '格格家'
                  },
                  {
                    value: '4',
                    label: '环球捕手'
                  },
                  {
                    value: '6',
                    label: '格格家供应链'
                  },
                  {
                    value: '7',
                    label: '手Q'
                  },
                  {
                    value: '8',
                    label: '脉宝云店'
                  },
                  {
                    value: '10',
                    label: '美食买手'
                  },
                ]
              },
            ],
          },
          searchMenu: {
            public: [
              {
                label: '查询',
                style: 'primary',
                type: 'submit'
              },
              {
                label: '重置',
                type: 'reset',
              }
            ],
          },
          resultItem:{
            option:[
              {
                label: '申请编号',
                key: 'operateNumber',
//                width:'120'
              },{
                label: '推送时间',
                key: 'auditTime',
//                width:'120'
              },{
                label: '开票进度',
                key: 'status',
                type: 'map',
//                width:'100'
              },{
                label: '发票类型',
                key: 'type',
                type: 'map',
//                width:'100'
              },{
                label: '开票金额（元）',
                key: 'applyMoney',
//                width:'120'
              },{
                label: '销售渠道',
                key: 'orderType',
                type: 'map',
//                width:'100'
              },{
                type: 'opera',
                label: '操作',
                width:'120'
              }
            ]
          }
        }
    }),
    methods:{
      ...mapActions(['setSearch']),
      initView(){
          this.setSearch(this.invoiceSearch)
        }
    },
    components: {
      vSearchItem,
      vSearchMenu,
      vSearchResult
    }
  }
</script>
<style scoped lang='less' rel="stylesheet/less">
  .market-box{
    position: relative;
    padding: 20px 0;
    >.market-sign{
      position: absolute;
      top:20px;
      left:20px;
      font-size: 16px;
      >span{
        display: inline-block;
        width: 50px;
      }
      >p{
        /*padding-left: 50px;*/
      }
    }

  }
</style>
