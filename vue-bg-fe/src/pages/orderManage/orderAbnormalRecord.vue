<template>
  <div>
    <div class="title">
      <span>异常订单报备记录</span>
    </div>
    <div class="section">
      <v-search-item />
      <v-search-menu />
      <v-search-result />
    </div>
  </div>
</template>
<script>
  import vSearchItem from '@/components/orderManage/searchItem'
  import vSearchMenu from '@/components/orderManage/searchMenu'
  import vSearchResult from '@/components/orderManage/recordResult'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'orderAbnormalRecord',
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
              type: 'input',
              label: '发货编码',
              placeholder:'请输入商品编码',
              key: 'productCode'
            },
            {
              type: 'select',
              label: '是否罚款',
              placeholder:'请选择',
              key: 'isHasPenalty',
              selectType:'selectAll',
              options:[
                {
                  value: 'all',
                  label: '全部'
                },
                {
                  value: '0',
                  label: '否'
                },
                {
                  value: '1',
                  label: '是'
                },
              ]
            },
//            {
//              type: 'input',
//              label: '异常原因',
//              placeholder:'请输入异常原因',
//              key: 'reason'
//            },
          ],
          private: [
            {
              type: 'date-picker',
              label: '申报时间',
              placeholder:'请选择',
              key: 'createTimeStart',
              checkNextDate:'createTimeEnd'
            },
            {
              type: 'date-picker',
              label: '',
              placeholder:'请选择',
              key: 'createTimeEnd',
              checkPreDate:'createTimeStart'
            },
            {
              type: 'date-picker',
              label: '付款时间',
              placeholder:'请选择',
              key: 'orderPayTimeStart',
              checkNextDate:'orderPayTimeEnd'
            },
            {
              type: 'date-picker',
              label: '',
              placeholder:'请选择',
              key: 'orderPayTimeEnd',
              checkPreDate:'orderPayTimeStart'
            },
            {
              type: 'input',
              label: '异常原因',
              placeholder:'请输入异常原因',
              key: 'reason'
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
          type: 'abnormal',
          option: [
            {
              fixed: 'left',
              label: '订单编号',
              key: 'orderNumber',
              width:'140',
              type:'router'
            },
            {
              label: '发货地',
              key: 'sendAddress',
              width:'100'
            },
            {
              label: '发货编码',
              key: 'productCode',
              width:'120'
            },
            {
              label: '商品名称',
              key: 'productName',
              width:'140'
            },
            {
              label: '超时时间点',
              key: 'orderExpireTime',
              width:'140'
            },
            {
              label: '罚款金额（元）',
              key: 'penaltyAmount',
              width:'140'
            },
            {
              label: '异常原因',
              key: 'reason',
              width:''
            },
            {
              label: '申报时间',
              key: 'penaltyStartTime',
              width:'140'
            },
          ],
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
      setDeliveryListOpt(rs) {
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
