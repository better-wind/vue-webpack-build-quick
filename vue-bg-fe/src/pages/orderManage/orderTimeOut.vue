<!--超时订单列表-->
<template>
  <div>
    <div class="title">
      <span>超时订单列表</span>
    </div>
    <div class="section">
      <v-search-item />
      <div class="market-box">
        <div class="market-sign primary-color">
          <span>提示：</span>
          <p>1、订单超时之日起（不含当日），请在7个工作日内完成第一次申诉</p>
          <p>2、在平台通过系统回复未通过第一次申诉之日起（不含当日），请在7个工作日完成第二次申诉</p>
          <p>3、以上如逾期未申诉的，则系统将冻结此功能，不再允许商家进行申诉</p>

        </div>
        <v-search-menu />
      </div>
      <v-search-result />
    </div>
  </div>
</template>
<script>
  import vSearchItem from '@/components/orderManage/searchItem'
  import vSearchMenu from '@/components/orderManage/searchMenu'
  import vSearchResult from '@/components/orderManage/timeOutResult'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'orderTimeOut',
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
            {
              type: 'select',
              label: '发货地',
              placeholder:'请选择',
              key: 'sellerId',
              options:[

              ]
            },
            {
              type: 'select',
              label: '状态',
              placeholder:'请选择',
              key: 'isAllowComplain',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  value: '0',
                  label: '不可申诉'
                },
                {
                  value: '1',
                  label: '可申诉'
                }
              ]
            },
            {
              type: 'select',
              label: '处理结果',
              placeholder:'请选择',
              key: 'status',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  value: '-1',
                  label: '未申诉'
                },
                {
                  value: '0',
                  label: '处理中'
                },
                {
                  value: '1',
                  label: '申诉成功'
                },
                {
                  value: '2',
                  label: '申诉失败'
                },
              ]
            },
          ],
          private: [
            {
              type: 'input',
              label: '赔偿金额',
              placeholder:'请输入赔偿金额',
              key: 'penaltyAmountStart',
              split:true
            },
            {
              type: 'input',
              label: '',
              placeholder:'请输入赔偿金额',
              key: 'penaltyAmountEnd',
            },
            {
              type: 'date-picker',
              label: '付款时间',
              placeholder:'请选择',
              key: 'orderPayTimeStart',
              checkNextDate:'orderPayTimeEnd',
              split:true
            },
            {
              type: 'date-picker',
              label: '',
              placeholder:'请选择',
              key: 'orderPayTimeEnd',
              checkPreDate:'orderPayTimeStart'
            },
            {
              type: 'date-picker',
              label: '物流揽件时间',
              placeholder:'请选择',
              key: 'collectLogisticsTimeStart',
              checkNextDate:'collectLogisticsTimeEnd',
              split:true
            },
            {
              type: 'date-picker',
              label: '',
              placeholder:'请选择',
              key: 'collectLogisticsTimeEnd',
              checkPreDate:'collectLogisticsTimeStart'
            },
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
        },
        resultItem: {
          type: 'market',
          option: [
            {
              fixed: 'left',
              label: '订单编号',
              key: 'orderNumber',
              width:'180'
            },
            {
              label: '付款时间',
              key: 'orderPayTime',
              width:'160'
            },
            {
              label: '超时时间点',
              key: 'orderExpireTime',
              width:'160'
            },
            {
              label: '物流揽件时间',
              key: 'collectLogisticsTime',
              width:'160'
            },
            {
              label: '赔偿金额（元）',
              key: 'penaltyAmount',
              width:'100'
            },
            {
              label: '处理结果',
              key: 'status',
              width:'100',
              type:'status'
            },
            {
              fixed:'right',
              type: 'opera',
              label: '操作',
              width:'120'
            }
          ],
          opera: {
            items: [
              {
                type: 'complaint',
                label: '申诉',
              },
            ]
          }
        }
      },
    }),
    methods: {
      ...mapActions(['setSearch','getDeliveryArea']),
      initSearch() {
        this.getDeliveryArea()
          .then((rs)=>{
            this.setDeliveryListOpt(rs)
        })

        this.setSearch(this.orderSearch)
      },
      setDeliveryListOpt(rs){
        let opts = [];
        rs.forEach((item,idx)=>{
          const opt = {
            label:item.sendAddress,
            value:item.id + ''
          }
          opts.push(opt)
        })
        this.orderSearch.searchList.public[3].options = opts
      },
    },
    components: {
      vSearchItem,
      vSearchMenu,
      vSearchResult
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .market-box{
    position: relative;
    padding: 20px 0;
    >.market-sign{
      position: absolute;
      top:0px;
      left:20px;
      font-size: 16px;
      >span{
        display: inline-block;
        width: 50px;
      }
      >p{
        padding-left: 50px;
      }
    }

  }
</style>

