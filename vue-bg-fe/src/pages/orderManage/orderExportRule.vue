<!--订单查询-->
<template>
  <div>
    <div class="title">
      <span>导出规则</span>
    </div>
    <div class="section">

      <v-search-item />
      <div class="market-box">
        <div class="market-sign primary-color">
          注：该规则仅在单独导出“待发货”订单时生效
        </div>
        <v-search-menu />
      </div>
      <v-search-result v-if="deliveryListReady" :deliveryList="deliveryList" />
    </div>
  </div>
</template>

<script>
  import vSearchItem from '@/components/orderManage/searchItem'
  import vSearchMenu from '@/components/orderManage/searchMenu'
  import vSearchResult from '@/components/orderManage/exportResult'
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'orderSearch',
    created (){
      this.initSearch()
    },
    computed: {
      ...mapState(['currentSearch'])
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
              type: 'select',
              label: '发货地',
              placeholder:'请选择',
              key: 'sellerId',
              options:[]
            },
            {
               type: 'input',
               label: '商品名称',
               placeholder:'请输入商品名称',
               key: 'skuName',
               width:'323.5'
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
              key: 'deliverCode'
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
          private: [

          ]
        },
        resultItem: {
          type: 'search',
          option: [
            {
              label: '发货地',
              key: 'sellerId',
              type:'mapSellerId',
              width:'150'
            },
            {
              label: '商品名称',
              key: 'skuName',

            },
            {
              label: '基础商品码',
              key: 'baseGoodsCode',

            },
            {
              label: '发货编码',
              key: 'deliverCode',

            },
            {
              label: '每包裹最大件数',
              key: 'maxNumber',

            },

            {
              type: 'opera',
              label: '操作',
              width:'200'
            }
          ],
          opera: {
            items: [
              {
                type: 'toDetail',
                label: '查看详情',
                key: 'orderNumber',
                val: 'orderNumber',
                source: 'search'
              },
              {
                type: 'sendOrder',
                label: '发货',
                key: 'status',
                val: 'orderNumber'
              },
//              {
//                type: 'reloadOrder',
//                label: '重新发货',
//                key: 'status',
//              },
            ]
          }
        }
      },
      deliveryList:[],
      deliveryListReady:false

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
        this.deliveryList = opts
        this.deliveryListReady = true
        this.orderSearch.searchList.public[2].options = opts
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
      top:36px;
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

