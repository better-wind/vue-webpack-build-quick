<template>
  <div>
    <div class="title">
      <span>入仓商品管理</span>
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
  import vSearchResult from '@/components/warehouseManage/productResult'
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
              type: 'select',
              label: '入仓仓库',
              placeholder:'请选择',
              key: 'storageId',
              options:[
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
              label: 'SKU码',
              placeholder:'请输入内容',
              key: 'skuCode'
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
              key: 'skuName'
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
              label: '入仓仓库',
              key: 'storageName',
                width:'120'
            },
            {
              label: '基础商品码',
              key: 'baseGoodsCode',
              width:'100'
            },{
              label: 'SKU码',
              key: 'skuCode',
              width:'120'
            },{
              label: '发货编码',
              key: 'deliveryCode',
              width:'120'
            },{
              label: '商品名称-销售属性',
              key: 'skuName',
//                width:'100'
            },{
              label: '入仓合计',
              key: 'inStorageTotalCount',
                width:'100'
            },{
              label: '实际出库',
              key: 'actualOutStock',
                width:'100'
            },{
              label: '理论库存',
              key: 'theoreticalStock',
                width:'100'
            },{
              label: '实际库存',
              key: 'actualStock',
                width:'100'
            },
//            {
//              type: 'opera',
//              label: '操作',
//              width:'120'
//            }
          ]
        }
      }
    }),
    methods:{
      ...mapActions(['setSearch','getStorageList']),

      initView(){
        this.getStorageList()
          .then((rs)=>{
            let _list = [],
                _map = {}
            rs.map((item)=>{
              let _opts = {
                  label:item.name,
                  value:item.code
              }
              _map[item.code] = item.name
              _list.push(_opts)
            })
//            this.searchPage.resultItem.option[0].map = _map
            this.searchPage.searchList.public[2].options = _list
          })
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
<style lang="less" rel="stylesheet/less" >
  .search-ware-box{
    .sign-name-item{
      /*display: inline-block;*/
      width: 86px!important;
      /*padding-right: 5px;*/
      /*text-align: right;*/
    }
    .input-item-middle{
      width: 174px!important;
    }
  }

</style>
