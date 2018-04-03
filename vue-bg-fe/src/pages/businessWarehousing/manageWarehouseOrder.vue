<template>
  <div>
    <div class="title">
      <span>入仓订单管理</span>
    </div>
    <div class="section search-ware-box">
      <v-search-item />
      <v-search-menu />
      <v-search-result />
    </div>
  </div>
</template>
<script>
  import vSearchItem from '@/components/warehouseManage/searchItem'
  import vSearchMenu from '@/components/warehouseManage/searchMenu'
  import vSearchResult from '@/components/warehouseManage/orderResult'
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
      searchPage:{
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
              type: 'input',
              label: '订单编号',
              placeholder:'请输入内容',
              key: 'orderNumber'
            },
            {
              type: 'select',
              label: '订单状态',
              placeholder:'请选择',
              key: 'orderStatus',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  value: '2',
                  label: '待发货'
                },
                {
                  value: '3',
                  label: '已发货'
                },
                {
                  value: '4',
                  label: '交易成功'
                },
                {
                  value: '5',
                  label: '用户取消'
                },
                {
                  value: '6',
                  label: '超时取消'
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
            {
              type: 'input',
              label: '基础商品码',
              placeholder:'请输入内容',
              key: 'baseGoodsCode'
            },
            {
              type: 'input',
              label: '发货编码',
              placeholder:'请输入内容',
              key: 'deliveryCode'
            },
            {
              type: 'input',
              label: '商品名称',
              placeholder:'请输入内容',
              key: 'productName'
            },
            {
              type: 'date-picker',
              label: '付款时间',
              placeholder:'请选择',
              key: 'payTimeStart',
              checkNextDate:'payTimeEnd',
              split:true
            },
            {
              type: 'date-picker',
              label: '',
              placeholder:'请选择',
              key: 'payTimeEnd',
              checkPreDate:'payTimeStart'
            },
            {
              type: 'date-picker',
              label: '发货时间',
              placeholder:'请选择',
              key: 'sendTimeStart',
              checkNextDate:'sendTimeEnd',
              split:true
            },
            {
              type: 'date-picker',
              label: '',
              placeholder:'请选择',
              key: 'sendTimeEnd',
              checkPreDate:'sendTimeStart'
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
          private:[
            {
              type:'export',
              label:'导出'
            }
          ]
        },
        resultItem:{
          option:[
            {
              label: '订单编号',
              key: 'orderNumber',
//                width:'120'
            },{
              label: '订单状态',
              key: 'status',
//                width:'120',
              type: 'type',
              map:{
                1:'提交订单',
                2:'待发货',
                3:'已发货',
                4:'交易成功',
                5:'用户取消',
                6:'超时取消'
              }
            },{
              label: '销售渠道',
              key: 'type',
//                width:'100'
            },{
              label: '付款时间',
              key: 'payTime',
//                width:'100'
            },{
              label: '发货时间',
              key: 'sendTime',
//                width:'120'
            },
            {
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
        this.setSearch(this.searchPage)
      }
    },
    components: {
      vSearchItem,
      vSearchMenu,
      vSearchResult
    }
  }
</script>
