<!--售后订单列表-->
<template>
  <div>
    <div class="title">
      <span>售后订单列表</span>
    </div>
    <div class="section market-section-wrap">
      <v-search-item />
      <v-search-menu />
      <v-search-result />
    </div>
  </div>
</template>
<script>
  import vSearchItem from '@/components/orderManage/searchItem'
  import vSearchMenu from '@/components/orderManage/searchMenu'
  import vSearchResult from '@/components/orderManage/searchResult'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'orderMarket',
    created (){
      this.initSearch()
    },
    data: () => ({
      orderSearch: {
        searchList: {
          public: [
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
              placeholder:'请输入订单编号',
              key: 'orderNumber'
            },

//            {
//              type: 'select',
//              label: '订单状态',
//              placeholder:'请选择',
//              key: 'orderStatus',
//              selectType:'selectAll',
//              options:[
//                {
//                  value: 'all',
//                  label: '全部'
//                },
//                {
//                  value: '1',
//                  label: '未付款'
//                },
//                {
//                  value: '2',
//                  label: '待发货'
//                },
//                {
//                  value: '3',
//                  label: '已发货'
//                },
//                {
//                  value: '4',
//                  label: '交易成功'
//                },
//                {
//                  value: '5',
//                  label: '用户取消'
//                },
//                {
//                  value: '6',
//                  label: '超时取消'
//                },
//                {
//                  value: '7',
//                  label: '团购进行中'
//                },
//              ]
//            },

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
              type: 'select',
              label: '售后类型',
              placeholder:'请选择',
              key: 'workOrderType',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  value: '1',
                  label: '仅退款'
                },
                {
                  value: '2',
                  label: '退货退款'
                },
                {
                  value: '3',
                  label: '咨询'
                },
                {
                  value: '4',
                  label: '投诉'
                },
                {
                  value: '5',
                  label: '赔付'
                },
              ]
            },
            {
              type: 'select',
              label: '问题类型',
              placeholder:'请选择',
              key: 'workOrderProblemCode',
              options:[]
            },
            {
              type: 'select',
              label: '售后咨询',
              placeholder:'请选择',
              key: 'replyStatus',
//              intKey:'1',
              isClear:true,
              selectType:'selectAll',
              breakLine:true,
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
//                {
//                  value: '0',
//                  label: '无消息'
//                },
                {
                  value: '1',
                  label: '待回复'
                },
//                {
//                  value: '2',
//                  label: '已回复'
//                },
              ]
            },
          ],
          private: [
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
              label: '创建时间',
              placeholder:'请选择',
              key: 'createTimeStart',
              checkNextDate:'createTimeEnd',
              split:true
            },
            {
              type: 'date-picker',
              label: '',
              placeholder:'请选择',
              key: 'createTimeEnd',
              checkPreDate:'createTimeStart'
            }
          ]
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
          private: [
            {
              label: '导出',
              type: 'export',
            }
          ]
        },
        resultItem: {
          type: 'market',
          option: [
            {
              fixed: 'left',
              label: '订单编号',
              key: 'orderNumber',
              width:'150'
            },
            {
              label: '订单状态',
//              key: 'orderStatusStr',
              key: 'orderStatusDesc',
              width:'100'
            },
            {
              label: '销售渠道',
//              key: 'salesChannelStr',
              key: 'orderTypeDesc',
              width:'140'
            },
            {
              label: '售后类型',
//              key: 'workOrderTypeStr',
              key: 'workOrderTypeDesc',
              width:'120'
            },
            {
              label: '问题类型',
              key: 'workOrderProblemStr',
            },
//            {
//              label: '付款时间',
//              key: 'payTime',
//              width:'180'
//            },
//            {
//              label: '发货时间',
//              key: 'sendTime',
//              width:'180'
//            },
            {
              label: '创建时间',
              key: 'workOrderCreateTime',
              width:'180'
            },
            {
              label: '售后咨询',
              key: 'replyStr',
              width:'120'
            },
            {
              fixed:'right',
              type: 'opera',
              label: '操作',
              width:'110'
            }
          ],
          opera: {
            items: [
              {
                type: 'toDetail',
                label: '查看详情',
                key: 'workOrderNumber',
                val: 'workOrderNumber',
                source:'market'
              }
            ]
          }
        }
      },
    }),
    methods: {
      ...mapActions(['setSearch','getAllWorkOrderProblemForSelect']),
      initSearch() {
        this.getAllWorkOrderProblemForSelect()
          .then((rs)=>{
            let opts = [];
            rs.forEach((item,idx)=>{
              const opt = {
                label:item.value,
                value:item.key + ''
              }
              opts.push(opt)
            })
            this.orderSearch.searchList.public[5].options = opts
          })
        this.setSearch(this.orderSearch)
      }
    },
    components: {
      vSearchItem,
      vSearchMenu,
      vSearchResult
    }
  }
</script>
<style lang="less" rel="stylesheet/less" >
  .market-section-wrap{
    .input-item-middle{
      width: 200px!important;
    }
  }
</style>

